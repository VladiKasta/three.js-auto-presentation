export default function getSceneMode(): "draft" | "published" {
	const params = new URLSearchParams(window.location.search);

	return params.get("preview") === "true" ? "draft" : "published";
}
