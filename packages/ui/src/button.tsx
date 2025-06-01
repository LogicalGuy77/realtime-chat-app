interface ButtonProps {
    text : string;
    onClick : (e: React.FormEvent) => void;
    children? : React.ReactNode;
    className? : string;
}

export function Button(props : ButtonProps) {
    return (
        <button onClick={props.onClick} className={`  py-2 px-4 rounded ${props.className}`}>
            {props.text}
            {props.children}
        </button>
    )
}
export default Button