import { ComponentProps, useEffect, useState } from "react";

type InputProps = ComponentProps<"input"> & {
	changeCustom: any;
	wrapClassName?: string;
	clearIconText?: string;
};

export const Input = ({ ...props }: InputProps) => {
	const [valState, setValState] = useState(props.value ?? "");
	const { changeCustom, wrapClassName, ...otherProps } = props;

	useEffect(() => {
		if (props.changeCustom) {
			props.changeCustom(valState);
		}
	}, [valState]);

	return (
		<div className={`relative flex-1 ${wrapClassName ?? ""}`}>
			<input
				onChange={(e) => {
					setValState(e.target.value);
				}}
				{...otherProps}
				value={valState}
			/>

			{valState.toString().length === 0 ? (
				""
			) : (
				<button
					onClick={(e) => {
						setValState("");
					}}
					className="absolute -top-2 -right-2 p-1 def-border rounded-xl bg-neon input__clear-btn"
				>
					{props.clearIconText ?? "X"}
				</button>
			)}
		</div>
	);
};

type ButtonProps = ComponentProps<"button"> & {
	text?: string;
};
export const Button = ({
	children,
	text,
	className,
	...otherProps
}: ButtonProps) => {
	return (
		<button
			className={`flex justify-center items-center def-button def-border px-3 py-2 bg-neon ${className}`}
			{...otherProps}
		>
			{children}
			{text ?? "Отправить"}
		</button>
	);
};

type TicketProps = ComponentProps<"div">; /* {
	//children: string | JSX.Element | JSX.Element[];
	//className?: string;
}; */

export const Card = (props: TicketProps) => {
	const { children, className, ...otherProps } = props;

	return (
		<div
			{...otherProps}
			className={`flex flex-col
			w-full h-full
			def-border px-4 py-3
			rounded-xl shadow-lg
			${className ?? ""}`}
		>
			{children}
		</div>
	);
};
