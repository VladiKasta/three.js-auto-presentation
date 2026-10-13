import { MeshoptDecoder } from 'meshoptimizer'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import carModel from '../assets/2014_porsche_911_turbo_991.glb?url'

export type ModelLoadProgress = (progress: number | null) => void

export default async function modelLoader(onProgress?: ModelLoadProgress) {
	const loader = new GLTFLoader()
	loader.setMeshoptDecoder(MeshoptDecoder)

	const gltf = await loader.loadAsync(carModel, event => {
		onProgress?.(event.total > 0 ? event.loaded / event.total : null)
	})

	const model = gltf.scene

	const box = new THREE.Box3().setFromObject(model)
	const size = box.getSize(new THREE.Vector3())
	const center = box.getCenter(new THREE.Vector3())

	model.position.sub(center)

	const maxSize = Math.max(size.x, size.y, size.z)
	const scale = 2 / maxSize

	model.scale.setScalar(scale)

	return model
}
