export type SlidePosition = {
	horizontal: "left" | "center" | "right";
	vertical: "top" | "center" | "bottom";
	offsetX: number;
	offsetY: number;
};

export type Slide = {
	id: number;
	number: string;
	title: string;
	text: string;
	advantages: string[];
	position: {
		horizontal: "left" | "center" | "right";
		vertical: "top" | "center" | "bottom";
		offsetX: number;
		offsetY: number;
	};
};

export type Car = {
	id: string;
	name: string;
	model: string;
	power: number;
	color: string;
};

export type CarModelConfig = {
	url: string;
	color?: number;
};
