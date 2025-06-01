"use client";
interface InputProps {
    placeholder: string;
    width: string;
    height: string;
    backgroundColor?: string | "white";
    color?: string | "black";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textSize?: string;
    type?: string | "text";
    icon?: string;
    value?: string;
}

export function Input(props: InputProps) {
    return (
        <>
        <div className="flex items-center">
            {props.icon && <img src={props.icon} alt="icon" className="mr-2" />}
            <input
                className="rounded-md font-semibold px-5"
                style={{
                    width: props.width,
                    height: props.height,
                    backgroundColor: props.backgroundColor,
                    color: props.color,
                    fontSize: props.textSize,
                }}
                type={props.type}
                placeholder={props.placeholder}
                onChange={(e) => props.onChange && props.onChange(e)}
            />
        </div>
        </>
    );
}