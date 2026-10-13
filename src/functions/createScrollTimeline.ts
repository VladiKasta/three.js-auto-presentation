import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function createScrollTimeline(
	model: THREE.Object3D,
	root: HTMLElement,
) {
	const initialScale = model.scale.clone();
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	const context = gsap.context(() => {
		gsap.set(model.position, { x: 1.5, y: 0.18, z: 1.05 });
		gsap.set(model.rotation, { x: -0.04, y: -1.12, z: 0.015 });
		gsap.set(model.scale, {
			x: initialScale.x * 3.55,
			y: initialScale.y * 3.55,
			z: initialScale.z * 3.55,
		});

		if (!reduceMotion) {
			const carTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: root,
					start: "top top",
					end: "bottom bottom",
					scrub: 0.9,
				},
			});

			carTimeline.addLabel("first", 0);
			carTimeline.addLabel("second", 1);
			carTimeline.addLabel("third", 2);
			carTimeline.addLabel("fourth", 3);
			carTimeline.addLabel("end", 4);

			const clock = { value: 0 };

			carTimeline.to(
				clock,
				{
					value: 1,
					duration: 4,
					ease: "none",
				},
				0,
			);

			carTimeline.to(
				model.position,
				{
					x: 1.96,
					y: 1.4,
					z: 0.05,
					duration: 1,
				},
				"first",
			);

			carTimeline.to(
				model.rotation,
				{
					y: Math.PI * 0.07,
					z: 0.015,
				},
				"<=0.1",
			);

			carTimeline.to(
				model.scale,
				{
					x: initialScale.x * 4.55,
					y: initialScale.y * 4.55,
					z: initialScale.z * 4.55,
				},
				"<=0.1",
			);

			carTimeline.to(
				model.position,
				{
					x: -3.6,
				},
				"second",
			);

			carTimeline.to(
				model.rotation,
				{
					y: Math.PI * 1.3,
				},
				"second",
			);

			carTimeline.to(
				model.scale,
				{
					x: initialScale.x * 3.55,
					y: initialScale.y * 3.55,
					z: initialScale.z * 3.55,
					duration: 1,
				},
				"second",
			);

			carTimeline.to(
				model.position,
				{
					x: 4.96,
					y: -3.18,
					z: 0.4,
					duration: 1,
				},
				"third",
			);

			carTimeline.to(
				model.rotation,
				{
					x: -Math.PI * 0.25,
					y: Math.PI * 0.5,
					z: 0.015,

					duration: 1,
				},
				"third",
			);

			carTimeline.to(
				model.scale,
				{
					x: initialScale.x * 7.55,
					y: initialScale.x * 7.55,
					z: initialScale.x * 7.55,
					duration: 1,
				},
				"third",
			);

			carTimeline.to(
				model.position,
				{
					x: 0,
					y: -5,
					z: -1.5,
					duration: 0.5,
				},
				"fourth",
			);

			/* carTimeline.to(
				model.rotation,
				{
					x: Math.PI * 0.75,
					y: 0,
					z: -1.5,
				},
				">=0.5",
			); */

			/* carTimeline.to(
				model.scale,
				{
					x: initialScale.x * 4.55,
					y: initialScale.y * 4.55,
					z: initialScale.z * 4.55,
				},
				"<=",
			); */
		}

		/* const scenes = gsap.utils.toArray<HTMLElement>(".story-scene", root);

		for (const scene of scenes) {
			const shade = scene.querySelector<HTMLElement>(".scene-shade");
			const content = scene.querySelector<HTMLElement>(".scene-content");
			if (!shade || !content) continue;

			if (reduceMotion) {
				gsap.set(shade, { opacity: 1 });
				gsap.set(content, { autoAlpha: 1 });
				continue;
			}

			gsap.set(shade, { opacity: 0 });
			gsap.set(content, {
				autoAlpha: 0,
				y: 56,
				filter: "blur(10px)",
			});

			const showScene = () => {
				gsap.to(shade, {
					opacity: 1,
					duration: 0.55,
					ease: "power1.out",
					overwrite: true,
				});
				gsap.to(content, {
					autoAlpha: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.8,
					ease: "power3.out",
					overwrite: true,
				});
			};

			const hideScene = (direction: 1 | -1) => {
				gsap.to(shade, {
					opacity: 0,
					duration: 0.45,
					ease: "power1.inOut",
					overwrite: true,
				});
				gsap.to(content, {
					autoAlpha: 0,
					y: direction === 1 ? -44 : 44,
					filter: "blur(8px)",
					duration: 0.5,
					ease: "power2.in",
					overwrite: true,
				});
			};

			ScrollTrigger.create({
				trigger: scene,
				start: "top 58%",
				end: "bottom 42%",
				onEnter: showScene,
				onEnterBack: showScene,
				onLeave: () => hideScene(1),
				onLeaveBack: () => hideScene(-1),
				onRefresh: (self) => {
					if (self.isActive) showScene();
				},
			});
		} */
	});

	ScrollTrigger.refresh();

	return () => {
		context.revert();
		model.position.set(0, 0, 0);
		model.rotation.set(0, 0, 0);
		model.scale.copy(initialScale);
	};
}
