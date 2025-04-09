"use client";

import { useEffect, useRef, useState } from "react";
import { WorkCard } from "./WorkCard";

export const Work = () => {
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

    return (
        <div 
            ref={ref}
            className={`
                w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            `}
        >
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                <WorkCard
                    title="Group-Manager-2"
                    description="技大祭で出展する参加団体を管理"
                    role="担当：フロント・バック"
                    link="https://github.com/NUTFes/group-manager-2"
                    img_link="/gm2.png"
                />
                <WorkCard
                    title="NUTMEG-Seeds"
                    description="情報局内の学習記録を蓄積"
                    role="担当：フロント・バック"
                    link="https://github.com/NUTFes/nutmeg-seeds"
                    img_link="/seeds.png"
                />
                <WorkCard
                    title="SeeFT"
                    description="技大祭当日のシフトを管理"
                    role="担当：フロント・バック・デザイン"
                    link="https://github.com/NUTFes/seeft"
                    img_link="/seeft.png"
                />
                <WorkCard 
                    title="sporty" 
                    description="長岡高専の卒業研究で銅賞を受賞" 
                    role='個人開発'
                    link="https://github.com/kokiWakatsuki/sporty" 
                    img_link="/sporty.jpg" 
                />
            </div>
        </div>
    );
};