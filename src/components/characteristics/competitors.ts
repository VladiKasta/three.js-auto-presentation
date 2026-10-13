export type Car = {
	id: string;
	name: string;
	model: string;
	power: number;
	color: string;
};

export const competitors: Car[] = [
	{
		id: "porsche",
		name: "Porsche",
		model: "911 Carrera",
		power: 650,
		color: "#ff6a00",
	},
	{
		id: "bmw",
		name: "BMW",
		model: "M4 Competition",
		power: 480,
		color: "#484e59",
	},
	{
		id: "mercedes",
		name: "Mercedes-Benz",
		model: "AMG C63",
		power: 510,
		color: "#484e59",
	},
	{
		id: "audi",
		name: "Audi",
		model: "RS5",
		power: 450,
		color: "#484e59",
	},
	{
		id: "tesla",
		name: "Tesla",
		model: "Model S",
		power: 460,
		color: "#484e59",
	},
];
