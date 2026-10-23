import { type Ref } from "vue";
import type { Slide } from "../../types/types.ts";

export default async function loadSlides(
	mode = "published" as string,
	slides: Ref<Slide[]>,
) {
	const response = await fetch(
		`http://localhost:1337/api/scene?status=${mode}&populate[slides][populate]=*`,
	);

	if (!response.ok) {
		throw new Error(`Strapi error: ${response.status}`);
	}

	const { data } = await response.json();
	slides.value = data.slides ?? [];
}
