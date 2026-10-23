import type { CSSProperties } from "vue";
import type { SlidePosition } from ".././types/types.ts";

export default function getPositionStyles(
	position: SlidePosition,
): CSSProperties {
	const { horizontal, vertical, offsetX = 0, offsetY = 0 } = position;

	const styles: CSSProperties = {
		position: "absolute",
	};

	const transforms: string[] = [];

	switch (horizontal) {
		case "left":
			styles.left = `${offsetX}%`;
			break;

		case "right":
			styles.right = `${offsetX}%`;
			break;

		case "center":
			styles.left = "50%";
			transforms.push("translateX(-50%)");
			break;
	}

	switch (vertical) {
		case "top":
			styles.top = `${offsetY}%`;
			break;

		case "bottom":
			styles.bottom = `${offsetY}%`;
			break;

		case "center":
			styles.top = "50%";
			transforms.push("translateY(-50%)");
			break;
	}

	if (transforms.length) {
		styles.transform = transforms.join(" ");
	}

	return styles;
}
