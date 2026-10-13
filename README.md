# Porsche 911 Turbo — 3D-презентация

Интерактивная презентация автомобиля на Vue 3, TypeScript, Three.js, GSAP и Tailwind CSS. Колесо мыши или вертикальный свайп перемещают камеру между тремя точками обзора.

## Запуск

Требуется Node.js 22+ и npm.

```bash
npm install
npm run dev
```

## Проверка и сборка

```bash
npm run lint
npm run typecheck
npm run build
npm run check
npm run preview
```

## Структура

- `src/components/CarModel.vue` — WebGL lifecycle и ввод пользователя.
- `src/functions/InitScene.ts` — сцена, свет, renderer и освобождение WebGL-ресурсов.
- `src/functions/modelLoader.ts` — загрузка, центрирование и масштабирование GLB.
- `src/animations/cameraOrbit.ts` — точки и GSAP-анимация камеры.
- `src/components/CarHint.vue` — информационные карточки.

Оси координат, сетка и `lil-gui` включаются только в dev-режиме.
# three.js-auto-presentation
