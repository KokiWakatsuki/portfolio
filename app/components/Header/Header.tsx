import Image from 'next/image';

export const Header = () => {
    return (
        <div className = 'flex flex-row justify-between items-center w-full p-6'>
            <Image 
                src="/icon.png" 
                alt="Icon"
                width={48}
                height={48}
            />
            <div className='flex flex-row justify-between items-center'>
                <h1 className=''>ABOUT</h1>
                <h1 className=''>SKILL</h1>
                <h1 className=''>WORKS</h1>
                <h1 className=''>CONTACT</h1>
                <h1 className=''>ACTIVITY</h1>
            </div>
        </div>
    )
}