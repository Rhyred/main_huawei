import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Fungsi untuk mengirim respons JSON
function jsonResponse(data: any, status: number) {
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

// Fungsi untuk membangun string konteks dari data frontend
function buildContextString(context: any): string {
    if (!context || Object.keys(context).length === 0) {
        return "Tidak ada data real-time yang tersedia saat ini.";
    }
    let parts: string[] = [];
    if (context.cpu) parts.push(`CPU Usage: ${context.cpu}%`);
    if (context.memory) parts.push(`Memory Usage: ${context.memory}%`);
    if (context.uptime) parts.push(`Uptime: ${context.uptime}`);
    if (context.temperature) parts.push(`Temperature: ${context.temperature}°C`);
    if (context.latency) parts.push(`Latency: ${context.latency}ms`);
    if (context.status) parts.push(`Internet Status: ${context.status}`);
    if (context.activeDevices) parts.push(`Active Devices: ${context.activeDevices.total} total (${context.activeDevices.wireless} wireless, ${context.activeDevices.wired} wired)`);
    if (context.peakBandwidthMbps) parts.push(`Peak Bandwidth: ${context.peakBandwidthMbps.toFixed(1)} Mbps`);
    if (context.totalTrafficTB) parts.push(`Total Traffic (Month): ${context.totalTrafficTB.toFixed(2)} TB`);
    if (context.deviceInfo) {
        parts.push(`Device Model: ${context.deviceInfo.model}`);
        parts.push(`Software Version: ${context.deviceInfo.softwareVersion}`);
    }
    if (context.interfaces && context.interfaces.length > 0) {
        const interfaceSummary = context.interfaces.map((iface: any) =>
            `${iface.name} (${iface.status}, ${iface.ip})`
        ).join('; ');
        parts.push(`Interfaces: [${interfaceSummary}]`);
    }
    return parts.join('. ');
}

export async function POST(req: NextRequest) {
    try {
        const { message, context } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return jsonResponse({ error: "Google AI API key is not configured on the server." }, 500);
        }
        if (!message) {
            return jsonResponse({ error: "Message is required." }, 400);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `Anda adalah HuaPau AI, asisten jaringan ahli. Tugas Anda adalah membantu pengguna memantau router Huawei mereka.
- Selalu merespon dalam bahasa Indonesia.
- Gunakan data real-time yang diberikan untuk menjawab pertanyaan.
- Jangan menjawab pertanyaan di luar konteks jaringan Huawei.
- Buat jawaban singkat, jelas, dan mudah dimengerti.`;

        const contextualData = buildContextString(context);
        const finalUserPrompt = `Konteks Data: [${contextualData}]. Pertanyaan Pengguna: "${message}"`;

        const chat = model.startChat({
            history: [{ role: "user", parts: [{ text: systemPrompt }] }],
        });

        const result = await chat.sendMessage(finalUserPrompt);
        const response = result.response;
        const reply = response.text();

        return jsonResponse({ reply }, 200);

    } catch (error: any) {
        console.error("Error calling Google AI:", error);
        return jsonResponse({ error: "Failed to connect to Google AI service." }, 500);
    }
}
