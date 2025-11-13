"use client"

import { useState, useEffect } from 'react';

/**
 * Hook kustom untuk mendeteksi apakah media query tertentu cocok.
 * @param query - String media query yang akan diuji (misalnya, '(max-width: 768px)').
 * @returns Boolean yang menunjukkan apakah query cocok atau tidak.
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Pastikan kode ini hanya berjalan di sisi klien
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => {
            setMatches(media.matches);
        };

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
};
