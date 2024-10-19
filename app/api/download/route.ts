import { NextResponse } from 'next/server';
import https from 'https';
import { IncomingMessage } from 'http';

interface ApiResponse {
    data: {
        items: Array<{
            video_versions: Array<{
                url: string;
                width: number;
                height: number;
                type: number;
            }>;
        }>;
    };
    status: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received request body:', body);

        const { code_or_id_or_url } = body;

        if (!code_or_id_or_url) {
            console.error('code_or_id_or_url is undefined or empty');
            return NextResponse.json({
                data: "",
                status: "error",
                message: "Missing code_or_id_or_url in request body"
            }, { status: 400 });
        }

        console.log('Received code_or_id_or_url:', code_or_id_or_url);

        const options: https.RequestOptions = {
            method: 'GET',
            hostname: 'instagram-scraper-api3.p.rapidapi.com',
            path: `/media_info?code_or_id_or_url=${encodeURIComponent(code_or_id_or_url)}`,
            headers: {
                'X-RapidAPI-Key': 'c11dd82643mshcef0620bd20a9f3p1f4cb0jsnce849b9cf614',
                'X-RapidAPI-Host': 'instagram-scraper-api3.p.rapidapi.com'
            }
        };

        console.log('API request options:', options);

        const apiResponse: ApiResponse = await new Promise((resolve, reject) => {
            const req = https.request(options, (res: IncomingMessage) => {
                const chunks: Buffer[] = [];

                res.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    const body = Buffer.concat(chunks).toString();
                    console.log('API response status:', res.statusCode);
                    console.log('API response body:', body);

                    if (res.statusCode !== 200) {
                        reject(new Error(`API responded with status ${res.statusCode}: ${body}`));
                    } else {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(new Error(`Failed to parse API response: ${body}`));
                        }
                    }
                });
            });

            req.on('error', (error: Error) => {
                console.error('Request error:', error);
                reject(error);
            });

            req.end();
        });

        if (apiResponse.status === 'ok' && apiResponse.data.items.length > 0) {
            const videoVersions = apiResponse.data.items[0].video_versions;
            if (videoVersions && videoVersions.length > 0) {
                const videoUrl = videoVersions[0].url;

                // Fetch the video content
                const videoBuffer = await new Promise<Buffer>((resolve, reject) => {
                    https.get(videoUrl, (res: IncomingMessage) => {
                        const chunks: Buffer[] = [];
                        res.on('data', (chunk: Buffer) => chunks.push(chunk));
                        res.on('end', () => resolve(Buffer.concat(chunks)));
                    }).on('error', reject);
                });

                // Set appropriate headers for download
                const headers = new Headers();
                headers.set('Content-Disposition', 'attachment; filename="instagram_video.mp4"');
                headers.set('Content-Type', 'video/mp4');

                return new NextResponse(videoBuffer, {
                    status: 200,
                    headers: headers,
                });
            }
        }

        return NextResponse.json({
            data: "",
            status: "error",
            message: "Failed to retrieve video URL from API response"
        }, { status: 400 });

    } catch (error) {
        console.error('Error in download API:', error);
        return NextResponse.json({
            data: "",
            status: "error",
            message: error instanceof Error ? error.message : "Internal server error"
        }, { status: 500 });
    }
}