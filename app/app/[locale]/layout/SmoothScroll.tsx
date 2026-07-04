'use client';

import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export function SmoothScroll({
    children,
}: {
    children: React.ReactNode
}) {
    const scrollRef = useRef<LocomotiveScroll | null>(null)

    useEffect(() => {
        scrollRef.current = new LocomotiveScroll({
            lenisOptions: {
                duration: 1.6,
                lerp: 0.07,
                wheelMultiplier: 0.9,
                touchMultiplier: 1,
                smoothWheel: true,
                syncTouch: true,
            }
        })
        return () => {
            scrollRef.current?.destroy()
        }
    }, [])

    return <>{children}</>    
}