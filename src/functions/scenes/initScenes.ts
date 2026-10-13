import initCharacteristicsScene from "../initCharacteristicsScene";
import initHomeScene, { type InitHomeSceneOptions } from "./initHomeScene";

export type ScenePath = "/" | "/characteristics";

function initScenes(
	path: "/",
	canvas: HTMLCanvasElement,
	options?: InitHomeSceneOptions,
): ReturnType<typeof initHomeScene>;
function initScenes(
	path: "/characteristics",
	canvas: HTMLCanvasElement,
): ReturnType<typeof initCharacteristicsScene>;
function initScenes(
	path: ScenePath,
	canvas: HTMLCanvasElement,
	options?: InitHomeSceneOptions,
):
	| ReturnType<typeof initHomeScene>
	| ReturnType<typeof initCharacteristicsScene>;
function initScenes(
	path: ScenePath,
	canvas: HTMLCanvasElement,
	options: InitHomeSceneOptions = {},
) {
	switch (path) {
		case "/":
			return initHomeScene(canvas, options);
		case "/characteristics":
			return initCharacteristicsScene(canvas);
	}
}

export default initScenes;
