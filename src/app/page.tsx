'use client';

import { useEffect, useState } from 'react';

interface HuaweiData {
    success: boolean;
    deviceName?: string;
    cpuUsage?: number;
    memoryUsage?: number;
    error?: string;
    details?: string;
}

// Komponen untuk kartu statistik
const StatCard = ({ icon, label, value, unit }: { icon: string; label: string; value: string | number; unit: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label} ({unit})</div>
    </div>
);

// Komponen untuk pesan error
const ErrorDisplay = ({ message, details }: { message: string; details?: string }) => (
    <div className="col-span-full bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
        {details && <p className="text-sm mt-2">Details: {details}</p>}
    </div>
);

export default function HuaweiMonitorPage() {
    const [data, setData] = useState<HuaweiData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Nanti kita akan membuat API route ini
            const response = await fetch('/api/snmp');
            const result: HuaweiData = await response.json();
            setData(result);
        } catch (error) {
            setData({ success: false, error: 'Failed to connect to the API service.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Refresh setiap 15 detik
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 sm:p-12 md:p-24 bg-gray-100 dark:bg-gray-900">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                    Huawei Router Monitoring
                </h1>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Refreshing...' : 'Refresh Now'}
                </button>
            </div>

            <div className="w-full max-w-5xl">
                {loading && !data && <p className="text-center text-gray-500 dark:text-gray-400">Loading initial data...</p>}

                {data && !data.success && (
                    <ErrorDisplay message={data.error || 'An unknown error occurred.'} details={data.details} />
                )}

                {data && data.success && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <StatCard icon="💻" label="Device Name" value={data.deviceName || 'N/A'} unit="Hostname" />
                        <StatCard icon="⚙️" label="CPU Usage" value={data.cpuUsage ?? 'N/A'} unit="%" />
                        <StatCard icon="🧠" label="Memory Usage" value={data.memoryUsage ?? 'N/A'} unit="%" />
                    </div>
                )}
            </div>
        </main>
    );
}
