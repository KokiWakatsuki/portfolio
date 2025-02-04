import { WorkCardProps } from "@/app/types";
import { FC } from "react";
import Image from "next/image";

export const WorkCard: FC<WorkCardProps> = ({title, description, link, img_link  }) => {
    return (
        <div className="flex flex-col items-center justify-center w-400 h-auto p-4 bg-primary rounded-lg shadow-lg shadow-white/40 gap-4">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-base text-foreground">{description}</p>
            <a href={link} target="_blank" rel="noreferrer" className="text-base text-accent">
                <Image src={img_link} alt='img' width={500} height={500} />
            </a>
        </div>
    );
}