'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/10 backdrop-blur-md border-b border-white/20' 
                : 'bg-transparent'
        }`}>
            <div className='flex flex-row justify-between items-center w-full px-4 sm:px-6 md:px-8 py-2 sm:py-4 max-w-[2000px] mx-auto'>
                <Image
                    src="/icon.png"
                    alt="Icon"
                    width={36}
                    height={36}
                    className='rounded-full transition-transform duration-300 hover:scale-110'
                />
                
                {/* Desktop Navigation */}
                <nav className='hidden md:flex flex-row justify-between items-center gap-8 lg:gap-12'>
                    <Link href="#about" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>ABOUT</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#work" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>WORKS</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#skill" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>SKILL</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#activity" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>ACTIVITY</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="#contact" className='cursor-pointer transition-all duration-300 hover:text-white relative group text-gray-300'>
                        <span>CONTACT</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2"
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-full h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-full h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>

                {/* Mobile Navigation */}
                <nav className={`md:hidden fixed top-[56px] left-0 w-full bg-black/95 backdrop-blur-md transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                    <div className="flex flex-col items-center py-4 gap-4">
                        <Link href="#about" className='cursor-pointer transition-all duration-300 hover:text-white text-gray-300' onClick={toggleMenu}>
                            ABOUT
                        </Link>
                        <Link href="#work" className='cursor-pointer transition-all duration-300 hover:text-white text-gray-300' onClick={toggleMenu}>
                            WORKS
                        </Link>
                        <Link href="#skill" className='cursor-pointer transition-all duration-300 hover:text-white text-gray-300' onClick={toggleMenu}>
                            SKILL
                        </Link>
                        <Link href="#activity" className='cursor-pointer transition-all duration-300 hover:text-white text-gray-300' onClick={toggleMenu}>
                            ACTIVITY
                        </Link>
                        <Link href="#contact" className='cursor-pointer transition-all duration-300 hover:text-white text-gray-300' onClick={toggleMenu}>
                            CONTACT
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}