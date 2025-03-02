"use client";

import { useEffect, useRef, useState } from 'react';
import {
    siGithub,
    siGmail,
    siInstagram,
    siX,
} from 'simple-icons';

interface ContactLink {
    icon: {
        path: string;
        title: string;
        hex: string;
        slug: string;
        svg: string;
    };
    href: string;
    label: string;
}

export const Contact = () => {
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

    const contact_links: ContactLink[] = [
        {
            icon: siGithub,
            href: "https://github.com/koki-fore",
            label: "GitHub",
        },
        {
            icon: siX,
            href: "https://twitter.com/koki_fore",
            label: "Twitter/X",
        },
        {
            icon: siInstagram,
            href: "https://www.instagram.com/koki_fore",
            label: "Instagram",
        },
        {
            icon: siGmail,
            href: "mailto:kokifore@gmail.com",
            label: "Email",
        },
    ];

    return (
        <div
            ref={ref}
            className={`
                w-full max-w-3xl mx-auto p-8
                bg-white/5 backdrop-blur-md
                rounded-2xl border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            `}
        >
            <h2 className="text-2xl font-light text-white/90 text-center mb-8">
                Let&apos;s Connect
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {contact_links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            group flex flex-col items-center justify-center p-6
                            bg-white/5 backdrop-blur-sm rounded-xl
                            border border-white/10
                            transition-all duration-300
                            hover:bg-white/10 hover:scale-105
                            hover:border-white/20
                            transition-transform duration-700
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                fill: 'rgb(229 229 203)'
                            }}
                            dangerouslySetInnerHTML={{ __html: link.icon.svg }}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="mt-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                            {link.label}
                        </span>
                    </a>
                ))}
            </div>

            <p className="text-center text-gray-400 mt-8">
                お気軽にご連絡ください
            </p>
        </div>
    );
};