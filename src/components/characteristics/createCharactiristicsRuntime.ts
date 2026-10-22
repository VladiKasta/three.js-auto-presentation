import { type Ref } from "vue";
import createVerticalLine from "../../functions/scenes/createVerticalLine.ts";
import { disposeObject } from "../../functions/scenes/createSceneRuntime.ts";
import initScenes from "../../functions/scenes/initScenes.ts";
import { competitors } from "./competitors.ts";
import createFloor from "./createFloor.ts";
import createGeometries from "./createGeometries.ts";

export default async function createCharacteristicsRuntime(options: {
	result: ReturnType<typeof initScenes>;
	finished: Ref<boolean>;
	loadingError?: Ref<string>;
}) {
	type CreatedGeometries = Awaited<ReturnType<typeof createGeometries>>;
	const maxCharacteristic = Math.max(...competitors.map((c) => c.power));
	const step = 2;

	const resultCreated: CreatedGeometries = await createGeometries(
		maxCharacteristic,
		step,
		options.result.scene,
	);

	if (options.result.isDisposed()) {
		resultCreated.timeline.kill();
		disposeObject(resultCreated.geometryGroup);
		return;
	}

	options.result.onDispose(() => resultCreated.timeline.kill());
	const floor = createFloor(step);
	const verticalLine = createVerticalLine({
		height: 7,
		floor,
	});

	if (resultCreated.finished === true) {
		options.finished.value = true;
		resultCreated.geometryGroup!.add(floor);
		resultCreated.geometryGroup!.add(verticalLine);
		options.result.scene.add(resultCreated.geometryGroup!);
	} else {
		options.result.scene.remove(resultCreated.geometryGroup);
		disposeObject(resultCreated.geometryGroup);
		options.loadingError!.value = "error";
	}
}
