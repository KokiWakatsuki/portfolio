"use client";

import { useEffect, useRef, useState } from 'react';
import {
    siGithub, siDocker, siNextdotjs, siReact, siVuedotjs,
    siHtml5, siCss3, siFlutter, siTypescript, siJavascript,
    siLaravel, siRubyonrails, siPython, siC, siPostgresql,
    siMysql, siGit, siPostman, siCloudflare, siProxmox,
    siSlack, siFigma
} from 'simple-icons';

type SimpleIcon = {
    path: string;
    title: string;
    hex: string;
    slug: string;
    svg: string;
};

interface SkillSectionProps {
    title: string;
    icons: SimpleIcon[];
    delay: number;
    isVisible: boolean;
}

const SkillSection = ({ title, icons, delay, isVisible }: SkillSectionProps) => (
    <div 
        className={`
            transition-transform transition-opacity duration-500 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{ transitionDelay: `${delay}ms` }}
    >
        <h3 className="text-lg sm:text-xl font-light text-white/90 mb-4 sm:mb-6 pl-2">{title}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6">
            {icons.map((icon, index) => (
                <div
                    key={index}
                    className="group relative flex items-center justify-center p-3 sm:p-4 md:p-6
                        bg-black/20 backdrop-blur-sm rounded-xl
                        border border-white/10
                        transition-transform duration-300 ease-out
                        hover:bg-white/10 hover:scale-110
                        hover:border-white/20"
                >
                    <div
                        style={{
                            fill: 'rgb(229 229 203)'
                        }}
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]
                            transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        text-sm text-white/80 whitespace-nowrap pointer-events-none
                        bg-black/50 px-2 py-1 rounded-md"
                    >
                        {icon.title}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const Skill = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
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

    const front_icons: SimpleIcon[] = [
        siNextdotjs, siReact, siVuedotjs, siHtml5,
        siCss3, siFlutter, siTypescript, siJavascript,
    ];
    const back_icons: SimpleIcon[] = [siLaravel, siRubyonrails, siPython, siC];
    const db_icons: SimpleIcon[] = [siPostgresql, siMysql];
    const other_icons: SimpleIcon[] = [
        siGithub, siDocker, siGit, siPostman,
        siCloudflare, siProxmox, siSlack, siFigma
    ];

    return (
        <div 
            ref={ref}
            className={`
                w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8
                bg-black/20 backdrop-blur-sm
                rounded-2xl border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-transform transition-opacity duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            `}
        >
            <div className="space-y-8 sm:space-y-12 md:space-y-16">
                <SkillSection title="Frontend" icons={front_icons} delay={0} isVisible={isVisible} />
                <SkillSection title="Backend" icons={back_icons} delay={200} isVisible={isVisible} />
                <SkillSection title="Database" icons={db_icons} delay={400} isVisible={isVisible} />
                <SkillSection title="Others" icons={other_icons} delay={600} isVisible={isVisible} />
            </div>
        </div>
    );
};