import { WorkCard } from "./WorkCard";

export const Work = () => {
    return (
        <div>
            <h1>Work</h1>
            <div className='flex flex-row'>
                <WorkCard title='gm2' description='gm2です' link='https://github.com/NUTFes/group-manager-2' img_link='/gm2.png' />
                <WorkCard title='seeds' description='seedsです' link='https://github.com/NUTFes/seeds' img_link='/seeds.png' />
            </div>
        </div>
    );
}