import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, context } = body;

        // TODO: Ganti dengan kunci API Mistral Anda dari variabel lingkungan
        const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'RYh8Tc6b81WZ9yUdmtuw0FIGlGNy1iCY';
        const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

        const response = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistral-tiny', // atau model lain yang Anda inginkan
                messages: messages.map((msg: any) => ({
                    role: msg.sender,
                    content: msg.content,
                })),
            }),
        });

        if (!response.ok) {
            throw new Error(`Mistral API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const reply = result.choices[0]?.message?.content || 'Maaf, saya tidak bisa mendapatkan respons.';

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Error processing Mistral API request:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
