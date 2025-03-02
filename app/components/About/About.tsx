"use client";

import { useEffect, useRef, useState } from "react";

export const About = () => {
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
                max-w-4xl mx-auto p-8 
                bg-white/5 backdrop-blur-md 
                rounded-2xl border border-white/10 
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            `}
        >
            {/* Academic Background */}
            <div className="mb-8 transition-all duration-500 hover:translate-x-2">
                <h3 className="text-lg font-semibold mb-2 text-white/90">
                    学歴
                </h3>
                <p className="text-gray-300 leading-relaxed">
                    長岡工業高等専門学校 電子制御工学科 卒<br />
                    長岡技術科学大学 工学部 情報・経営システム工学専攻 1年<br />
                    機械学習理論研究室所属
                </p>
            </div>

            {/* Activities */}
            <div className="mb-8 transition-all duration-500 hover:translate-x-2">
                <h3 className="text-lg font-semibold mb-2 text-white/90">
                    活動
                </h3>
                <p className="text-gray-300 leading-relaxed">
                    技大祭実行委員会所属<br />
                    第43回技大祭実行委員会情報局長<br />
                    NUTMEG元代表
                </p>
            </div>

            {/* Description */}
            <div className="transition-all duration-500 hover:translate-x-2">
                <h3 className="text-lg font-semibold mb-2 text-white/90">
                    情報局について
                </h3>
                <p className="text-gray-300 leading-relaxed">
                    技大祭実行委員会の情報局に所属しています。<br />
                    情報局は「技大祭を円滑に」というMissionのもと、学祭をDXしている学生団体です。<br />
                    この情報局で培った開発スキル・マネジメントスキルを活かして、様々なことに挑戦しています。
                </p>
            </div>
        </div>
    );
};