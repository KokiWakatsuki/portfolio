import { WorkCard } from "./WorkCard";

export const Work = () => {
    return (
        <div>
            <div className='flex flex-row gap-4'>
                <WorkCard title='Group-Manager-2' description='説明文が入ります説明文が入ります説明文が入ります説明文が入ります説明文が入ります' link='https://github.com/NUTFes/group-manager-2' img_link='/gm2.png' />
                <WorkCard title='NUTMEG-Seeds' description='説明文が入ります説明文が入ります説明文が入ります説明文が入ります説明文が入ります' link='https://github.com/NUTFes/seeds' img_link='/seeds.png' />
            </div>
        </div>
    );
}