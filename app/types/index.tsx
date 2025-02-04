import { ReactNode } from "react";

export interface WorkCardProps {
    title: string;
    description: string;
    link: string;
    img_link: string;
}

export interface CardProps {
    title: string;
    children: ReactNode;
}