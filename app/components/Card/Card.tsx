"use client"

import { CardProps } from "@/app/types";
import { FC, useEffect, useRef, useState } from "react";

export const Card: FC<CardProps> = ({children, title}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const card = ref.current;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // マウスの相対位置を計算（-1から1の範囲）
        const relativeX = (event.clientX - centerX) / (rect.width / 2);
        const relativeY = (event.clientY - centerY) / (rect.height / 2);
        
        // 回転角度を計算（最大10度）
        setRotation({
            x: relativeY * -10,
            y: relativeX * 10
        });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    const transformStyle = {
        transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
        `,
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
                flex flex-col items-center justify-center w-auto h-auto p-6
                bg-black/20 backdrop-blur-sm rounded-xl
                border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-transform transition-opacity duration-300 ease-out
                hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-50px]'}
            `}
            style={transformStyle}
        >
            <div className='text-2xl font-light mb-4 text-white/90'>{title}</div>
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    )
}