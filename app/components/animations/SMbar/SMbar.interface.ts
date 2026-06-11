export interface SMListObj {
    title: string;
    link: string;
    img: string;
};

export interface SMBarProps {
    SMList: SMListObj[];
    className?: string;
};