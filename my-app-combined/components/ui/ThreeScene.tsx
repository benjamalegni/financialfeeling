'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  const bullGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const initializedRef = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    if (initializedRef.current) return; // Prevent double init in React StrictMode (dev)
    initializedRef.current = true;

    // Ensure container is empty (avoid duplicate canvas)
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('data-three', 'primary');
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xffd700, 0.8, 500);
    goldLight.position.set(-3, 2, 3);
    scene.add(goldLight);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.8;
    ground.receiveShadow = true;
    scene.add(ground);

    // OrbitControls: only allow wheel zoom, disable rotate/pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controlsRef.current = controls;

    // Group to rotate bull around its own axis
    const bullGroup = new THREE.Group();
    bullGroupRef.current = bullGroup;
    scene.add(bullGroup);

    // Load GLB
    const loader = new GLTFLoader();
    loader.load(
      '/wall-street-charging-bull/source/poly.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if ((mesh.material as THREE.MeshStandardMaterial)) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.metalness = 0.3;
              mat.roughness = 0.7;
            }
          }
        });

        // Center & scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredSize = 5;
        const scale = desiredSize / maxDim;
        model.scale.setScalar(scale);

        bullGroup.add(model);

        // Frame camera
        const fov = camera.fov * (Math.PI / 180);
        const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.2;
        camera.position.set(0, maxDim * 0.18, distance);
        controls.target.set(0, 0, 0);
        controls.update();

        setIsLoading(false);
        setLoadError(null);
      },
      undefined,
      (err) => {
        console.error('Error loading bull model:', err);
        setLoadError('No se pudo cargar el toro 3D');
        setIsLoading(false);
      }
    );

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (bullGroupRef.current) bullGroupRef.current.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      initializedRef.current = false;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: 'black' }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 pointer-events-none">
          <div className="text-white text-sm">Cargando toro 3D...</div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-red-600/80 text-white px-3 py-2 rounded text-xs shadow">
            {loadError}
          </div>
        </div>
      )}
    </div>
  );
} 