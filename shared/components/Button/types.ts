export type TButton = {
    onClick: (e?: any) => void;
    children: React.ReactNode;
    isDisabled?: boolean;
};

export type TToggle = {
    onClick: (e?: any) => void;
};

export type TCheckBox = {
    onClick: (e?: any) => void;
    children: React.ReactNode;
};

export type TRadio = {
    onClick: (e?: any) => void;
    children: React.ReactNode;
    option: string;
    name: string;
};