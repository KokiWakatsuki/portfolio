import { WorkCardProps } from "@/app/types";
import { FC } from "react";
import Image from "next/image";

export const WorkCard: FC<WorkCardProps> = ({title, description, link, img_link  }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-72 p-4 m-4 bg-primary rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-base text-foreground">{description}</p>
            <a href={link} target="_blank" rel="noreferrer" className="text-base text-accent">
                <Image src={img_link} alt='img' width={500} height={500} className="w-1/2 h-1/2"  />
            </a>
        </div>
    );
}