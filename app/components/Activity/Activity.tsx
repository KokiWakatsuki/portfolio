"use client";

import { useEffect, useRef, useState } from 'react';

interface ActivityItem {
    period: string;
    title: string;
    description: string;
}

const activities: ActivityItem[] = [
    {
        period: "2018.04 - 2023.03",
        title: "長岡工業高等専門学校",
        description: "電子制御工学科で組込みシステムやプログラミングを学び、ロボット制御や電子回路の設計などの実践的なスキルを習得。また、プログラミング部に所属し、技術力の向上に励みました。",
    },
    {
        period: "2023.04 - 現在",
        title: "長岡技術科学大学",
        description: "情報・経営システム工学専攻で、より高度な情報技術と経営の知識を学習。機械学習理論研究室に所属し、最新のAI技術について研究しています。",
    },
    {
        period: "2023.10 - 2024.09",
        title: "第43回技大祭実行委員会",
        description: "情報局長として、学園祭の運営に必要なシステムの開発・保守を担当。チームマネジメントやプロジェクト管理のスキルを実践的に習得しています。",
    },
    {
        period: "2023.04 - 現在",
        title: "NUTMEG",
        description: "技大祭実行委員会の情報局から派生した学生団体で、大学のDX推進に貢献。実践的な開発経験を積みながら、新しい技術にも積極的に挑戦しています。",
    }
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
                w-full max-w-7xl mx-auto p-8
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
                <div className="space-y-12">
                    {activities.map((activity, index) => (
                        <div 
                            key={index}
                            className={`
                                relative pl-8
                                transition-all duration-700 ease-out
                                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                            `}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            {/* タイムラインのドット */}
                            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-white/80" />
                            
                            <div className="group hover:translate-x-2 transition-transform duration-300">
                                {/* 期間 */}
                                <div className="text-sm text-white/60 mb-1">
                                    {activity.period}
                                </div>
                                
                                {/* タイトル */}
                                <h3 className="text-lg font-semibold text-white/90 mb-2">
                                    {activity.title}
                                </h3>
                                
                                {/* 説明文 */}
                                <p className="text-gray-300 leading-relaxed">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};