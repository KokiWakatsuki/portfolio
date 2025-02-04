import { CardProps } from "@/app/types";
import { FC } from "react";

export const Card: FC<CardProps> = ({children, title}) => {
    return (
        <div className="flex flex-col items-center justify-center w-auto h-auto p-4 bg-primary rounded-lg shadow-lg shadow-white/40 gap-4">
            <div className='text-2xl'>{title}</div>
            {children}
        </div>
    )
}