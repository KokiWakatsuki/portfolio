"use client"

import { CardProps } from "@/app/types";
import { FC, useEffect, useRef, useState } from "react";

export const Card: FC<CardProps> = ({children, title}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.5
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

    return (
        <div
            ref={ref}
            className={`
                flex flex-col items-center justify-center w-auto h-auto p-4
                bg-primary rounded-lg shadow-lg shadow-white/40 gap-4
                transform transition-all duration-700 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-50px]'}
            `}
        >
            <div className='text-2xl'>{title}</div>
            {children}
        </div>
    )
}