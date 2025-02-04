import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
    return (
        <div className = 'flex flex-row justify-between items-center w-full p-6'>
            <Image 
                src="/icon.png" 
                alt="Icon"
                width={48}
                height={48}
                className='rounded-full'
            />
            <div className='flex flex-row justify-between items-center gap-4'>
                <Link href="#about">
                    <h1 className='cursor-pointer'>ABOUT</h1>
                </Link>
                <Link href="#skill">
                    <h1 className='cursor-pointer'>SKILL</h1>
                </Link>
                <Link href="#work">
                    <h1 className='cursor-pointer'>WORKS</h1>
                </Link>
                <Link href="#contact">
                    <h1 className='cursor-pointer'>CONTACT</h1>
                </Link>
                <Link href="#activity">
                    <h1 className='cursor-pointer'>ACTIVITY</h1>
                </Link>
            </div>
        </div>
    )
}