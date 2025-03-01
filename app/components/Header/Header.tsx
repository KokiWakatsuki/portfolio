'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/10 backdrop-blur-md border-b border-white/20' 
                : 'bg-transparent'
        }`}>
            <div className='flex flex-row justify-between items-center w-full px-8 py-4 max-w-[2000px] mx-auto'>
                <Image 
                    src="/icon.png" 
                    alt="Icon"
                    width={48}
                    height={48}
                    className='rounded-full transition-transform duration-300 hover:scale-110'
                />
                <nav className='flex flex-row justify-between items-center gap-12'>
                    <Link href="#about" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>ABOUT</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#skill" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>SKILL</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#work" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>WORKS</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#contact" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>CONTACT</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#activity" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>ACTIVITY</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>
            </div>
        </div>
    )
}