"use client";

import { useEffect, useRef, useState } from 'react';

interface ActivityItem {
    period: string;
    title: string;
}

const activities: ActivityItem[] = [
    {
        period: "2018.04",
        title: "長岡工業高等専門学校入学",
    },
    {
        period: "2021.07",
        title: "SPRIX Engineering Lab アルバイト",
    },
    {
        period: "2023.04",
        title: "長岡技術科学大学入学",
    },
    {
        period: "2023.04",
        title: "技大祭実行委員会情報局（NUTMEG）",
    },
    {
        period: "2023.09",
        title: "機械学習理論研究室配属",
    },
    {
        period: "2023.10",
        title: "第43回技大祭実行委員会情報局長（NUTMEG代表）",
    },
    {
        period: "2023.10",
        title: "株式会社プロッセル アルバイト",
    },
    {
        period: "2024.12",
        title: "株式会社清新会 アルバイト",
    },
    {
        period: "2025.3",
        title: "第87回情報処理学会",
    },
    {
        period: "2025.4",
        title: "長岡技術科学大学大学院入学",
    },
];

export const Activity = () => {
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
                w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8
                bg-white/5 backdrop-blur-md
                rounded-2xl border border-white/10
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            `}
        >
            <div className="relative">
                {/* タイムラインの縦線 */}
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

                {/* アクティビティアイテム */}
                <div className="space-y-8 sm:space-y-10 md:space-y-12">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className={`
                                relative pl-6 sm:pl-8
                                transition-all duration-700 ease-out
                                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                            `}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            {/* タイムラインのドット */}
                            <div className="absolute left-[-4px] sm:left-[-5px] top-2 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/80" />
                            
                            <div className="group hover:translate-x-2 transition-transform duration-300">
                                {/* 期間 */}
                                <div className="text-xs sm:text-sm text-white/60 mb-1">
                                    {activity.period}
                                </div>
                                
                                {/* タイトル */}
                                <h3 className="text-base sm:text-lg font-semibold text-white/90 mb-1 sm:mb-2">
                                    {activity.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};