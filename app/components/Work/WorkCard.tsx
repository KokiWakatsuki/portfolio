"use client";

import { WorkCardProps } from "@/app/types";
import { FC, useState } from "react";
import Image from "next/image";

export const WorkCard: FC<WorkCardProps> = ({title, description, role, link, img_link}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`
                group
                flex flex-col items-center justify-start
                w-full max-w-md h-auto p-4 sm:p-5 md:p-6
                bg-white/5 backdrop-blur-md
                rounded-xl border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-all duration-500 ease-out
                hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                hover:-translate-y-2
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h1 className="text-xl sm:text-2xl font-light text-white/90 mb-3 sm:mb-4">{title}</h1>
            <div className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed">
                <p>{description}</p>
                {role && <p className="mt-2 text-indigo-400">{role}</p>}
            </div>
            <a 
                href={link} 
                target="_blank" 
                rel="noreferrer" 
                className="relative w-full overflow-hidden rounded-lg"
            >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image 
                        src={img_link} 
                        alt={title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className={`
                            transition-all duration-500 ease-out
                            group-hover:scale-105
                            ${isHovered ? 'brightness-110' : 'brightness-90'}
                        `}
                    />
                    <div className={`
                        absolute inset-0 
                        bg-gradient-to-t from-black/50 to-transparent
                        transition-opacity duration-500
                        ${isHovered ? 'opacity-0' : 'opacity-100'}
                    `} />
                </div>
            </a>
        </div>
    );
};