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
                    description="技大祭参加団体の管理をDXするWebアプリケーション。
                    Dockerを用いて開発環境を整備し、Ruby on RailsとNext.jsを使用して開発を行いました。
                    フロントエンドからインフラまで幅広く担当し、チームでの開発経験を積むことができました。" 
                    link="https://github.com/NUTFes/group-manager-2" 
                    img_link="/gm2.png" 
                />
                <WorkCard 
                    title="NUTMEG-Seeds" 
                    description="技大祭実行委員向けのタスク管理アプリケーション。
                    Next.js, Supabase, Chakra UIを使用し、モダンな技術スタックでの開発に挑戦しました。
                    プロジェクトリーダーとして、設計から実装まで主導的な役割を担いました。" 
                    link="https://github.com/NUTFes/seeds" 
                    img_link="/seeds.png" 
                />
            </div>
        </div>
    );
};