'use client'

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useSimpleModel, setUseSimpleModel] = useState(false);

  // Funciones para controles con botones
  const rotateLeft = () => {
    if (cameraRef.current && controlsRef.current) {
      // Rotar la cámara alrededor del modelo
      const angle = -0.1;
      const radius = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const currentAngle = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
      const newAngle = currentAngle + angle;
      
      cameraRef.current.position.x = Math.sin(newAngle) * radius;
      cameraRef.current.position.z = Math.cos(newAngle) * radius;
      cameraRef.current.lookAt(controlsRef.current.target);
      controlsRef.current.update();
    }
  };

  const rotateRight = () => {
    if (cameraRef.current && controlsRef.current) {
      // Rotar la cámara alrededor del modelo
      const angle = 0.1;
      const radius = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const currentAngle = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
      const newAngle = currentAngle + angle;
      
      cameraRef.current.position.x = Math.sin(newAngle) * radius;
      cameraRef.current.position.z = Math.cos(newAngle) * radius;
      cameraRef.current.lookAt(controlsRef.current.target);
      controlsRef.current.update();
    }
  };

  const rotateUp = () => {
    if (cameraRef.current && controlsRef.current) {
      // Rotar hacia arriba
      const angle = 0.1;
      const radius = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const currentAngle = Math.atan2(cameraRef.current.position.y, Math.sqrt(cameraRef.current.position.x ** 2 + cameraRef.current.position.z ** 2));
      const newAngle = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, currentAngle + angle));
      
      const horizontalRadius = radius * Math.cos(newAngle);
      cameraRef.current.position.y = radius * Math.sin(newAngle);
      cameraRef.current.position.x = horizontalRadius * Math.sin(Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z));
      cameraRef.current.position.z = horizontalRadius * Math.cos(Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z));
      cameraRef.current.lookAt(controlsRef.current.target);
      controlsRef.current.update();
    }
  };

  const rotateDown = () => {
    if (cameraRef.current && controlsRef.current) {
      // Rotar hacia abajo
      const angle = -0.1;
      const radius = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const currentAngle = Math.atan2(cameraRef.current.position.y, Math.sqrt(cameraRef.current.position.x ** 2 + cameraRef.current.position.z ** 2));
      const newAngle = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, currentAngle + angle));
      
      const horizontalRadius = radius * Math.cos(newAngle);
      cameraRef.current.position.y = radius * Math.sin(newAngle);
      cameraRef.current.position.x = horizontalRadius * Math.sin(Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z));
      cameraRef.current.position.z = horizontalRadius * Math.cos(Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z));
      cameraRef.current.lookAt(controlsRef.current.target);
      controlsRef.current.update();
    }
  };

  const zoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      // Acercar la cámara
      const direction = new THREE.Vector3();
      direction.subVectors(cameraRef.current.position, controlsRef.current.target).normalize();
      const distance = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const newDistance = Math.max(1.5, distance * 0.9);
      
      cameraRef.current.position.copy(controlsRef.current.target).add(direction.multiplyScalar(newDistance));
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      // Alejar la cámara
      const direction = new THREE.Vector3();
      direction.subVectors(cameraRef.current.position, controlsRef.current.target).normalize();
      const distance = cameraRef.current.position.distanceTo(controlsRef.current.target);
      const newDistance = Math.min(8, distance * 1.1);
      
      cameraRef.current.position.copy(controlsRef.current.target).add(direction.multiplyScalar(newDistance));
      controlsRef.current.update();
    }
  };

  const resetView = () => {
    if (controlsRef.current && cameraRef.current) {
      // Reset camera position
      cameraRef.current.position.set(0, 1, 3);
      cameraRef.current.lookAt(0, 0, 0);
      
      // Reset controls
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('Initializing Three.js scene...');

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Camera setup - Ajustar posición más cerca
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls setup - Ajustar límites
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI * 0.9;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.autoRotate = true; // Habilitar auto-rotación
    controls.autoRotateSpeed = 0.5;

    // Add event listeners for interaction feedback
    const handleStart = () => {
      console.log('Interaction started');
      setIsInteracting(true);
      controls.autoRotate = false; // Detener auto-rotación al interactuar
    };
    
    const handleEnd = () => {
      console.log('Interaction ended');
      setIsInteracting(false);
      // Reanudar auto-rotación después de un delay
      setTimeout(() => {
        if (!isInteracting) {
          controls.autoRotate = true;
        }
      }, 2000);
    };

    // Agregar event listeners adicionales para mejor detección
    const handleMouseDown = () => {
      console.log('Mouse down detected');
      setIsInteracting(true);
      controls.autoRotate = false;
    };

    const handleMouseUp = () => {
      console.log('Mouse up detected');
      setTimeout(() => {
        setIsInteracting(false);
        controls.autoRotate = true;
      }, 2000);
    };

    const handleTouchStart = () => {
      console.log('Touch start detected');
      setIsInteracting(true);
      controls.autoRotate = false;
    };

    const handleTouchEnd = () => {
      console.log('Touch end detected');
      setTimeout(() => {
        setIsInteracting(false);
        controls.autoRotate = true;
      }, 2000);
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    // Agregar event listeners al DOM
    if (mountRef.current) {
      mountRef.current.addEventListener('mousedown', handleMouseDown);
      mountRef.current.addEventListener('mouseup', handleMouseUp);
      mountRef.current.addEventListener('touchstart', handleTouchStart);
      mountRef.current.addEventListener('touchend', handleTouchEnd);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Add a spotlight for dramatic effect
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 15, 0);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 200;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Fallback bull creation function
    const createFallbackBull = () => {
      console.log('Creating fallback bull model...');
      const group = new THREE.Group();

      // Bull head (main body)
      const headGeometry = new THREE.CylinderGeometry(1.5, 2, 2, 8);
      const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xDAA520,
        shininess: 100,
        specular: 0x444444
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.castShadow = true;
      head.receiveShadow = true;
      group.add(head);

      // Bull horns
      const hornGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6);
      const hornMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
      
      const horn1 = new THREE.Mesh(hornGeometry, hornMaterial);
      horn1.position.set(0.8, 1, 0);
      horn1.rotation.z = Math.PI / 4;
      horn1.castShadow = true;
      group.add(horn1);

      const horn2 = new THREE.Mesh(hornGeometry, hornMaterial);
      horn2.position.set(-0.8, 1, 0);
      horn2.rotation.z = -Math.PI / 4;
      horn2.castShadow = true;
      group.add(horn2);

      // Bull eyes
      const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      
      const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye1.position.set(0.5, 0.3, 1.2);
      group.add(eye1);

      const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye2.position.set(-0.5, 0.3, 1.2);
      group.add(eye2);

      // Bull nose
      const noseGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.set(0, -0.5, 1.5);
      group.add(nose);

      bullModel = group;
      scene.add(bullModel);
      console.log('Fallback bull model created and added to scene');
    };

    // Load the real bull model
    const loader = new GLTFLoader();
    let bullModel: THREE.Group | null = null;

    console.log('Starting to load 3D model...');
    
    // Add timeout for model loading
    const loadTimeout = setTimeout(() => {
      console.error('Model loading timeout - falling back to default model');
      setLoadError('Model loading timeout - using fallback model');
      setIsLoading(false);
      createFallbackBull();
    }, 30000); // 30 second timeout
    
    // Always try to load the complex model first
    console.log('Attempting to load complex 3D model...');
    loader.load(
      '/wall-street-charging-bull/source/poly.glb',
      (gltf) => {
        clearTimeout(loadTimeout);
        console.log('3D model loaded successfully!', gltf);
        bullModel = gltf.scene;
        
        // Scale and position the model - Ajustar escala y posición
        bullModel.scale.set(0.8, 0.8, 0.8);
        bullModel.position.set(0, -0.5, 0);
        
        // Enable shadows for all meshes
        bullModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance materials if they exist
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.metalness = 0.3;
                    mat.roughness = 0.7;
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.metalness = 0.3;
                child.material.roughness = 0.7;
              }
            }
          }
        });
        
        scene.add(bullModel);
        setIsLoading(false);
        setLoadError(null);
        
        // Ajustar la cámara para enfocar el modelo
        const box = new THREE.Box3().setFromObject(bullModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('Model bounds:', { center, size });
        
        // Posicionar la cámara para ver todo el modelo
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        camera.position.set(0, center.y, cameraZ * 1.5);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
        
        console.log('Camera positioned at:', camera.position);
        console.log('Camera looking at:', center);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100);
        console.log('Loading progress:', percent + '%');
      },
      (error) => {
        clearTimeout(loadTimeout);
        console.error('Error loading complex model:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setLoadError(`Error loading 3D model: ${errorMessage}`);
        setIsLoading(false);
        console.log('Falling back to simple model...');
        createFallbackBull();
      }
    );

    // Add a ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update controls
      if (controls) {
        controls.update();
      }

      // Animate the bull model
      if (bullModel) {
        // Subtle breathing effect
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.02;
        bullModel.scale.set(scale * 0.8, scale * 0.8, scale * 0.8);
        
        // Auto-rotation when not interacting
        if (!isInteracting && controls.autoRotate) {
          bullModel.rotation.y += 0.01;
        }
      }

      // Animate lights
      pointLight.position.x = Math.sin(Date.now() * 0.001) * 5;
      pointLight.position.z = Math.cos(Date.now() * 0.001) * 5;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (controls) {
        controls.removeEventListener('start', handleStart);
        controls.removeEventListener('end', handleEnd);
      }
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('mouseup', handleMouseUp);
        mountRef.current.removeEventListener('touchstart', handleTouchStart);
        mountRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className={`w-full h-full absolute inset-0 transition-all duration-300 ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ background: 'linear-gradient(to bottom, #1a1a1a, #000000)' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p>Loading Wall Street Bull 3D model...</p>
            </div>
          </div>
        )}
        
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="text-red-400 mb-4">⚠️</div>
              <p className="text-red-400 mb-2">Error loading 3D model</p>
              <p className="text-sm text-gray-400">{loadError}</p>
              <p className="text-xs text-gray-500 mt-2">Showing fallback model instead</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2">
        {/* Rotation Controls */}
        <div className="flex space-x-2">
          <button
            onClick={rotateLeft}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Rotate Left"
          >
            ↶
          </button>
          <button
            onClick={rotateRight}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Rotate Right"
          >
            ↷
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={rotateUp}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Rotate Up"
          >
            ↶
          </button>
          <button
            onClick={rotateDown}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Rotate Down"
          >
            ↷
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex space-x-2">
          <button
            onClick={zoomIn}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetView}
          className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          title="Reset View"
        >
          ⟲
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-20 bg-black/60 text-white p-3 rounded-lg text-sm">
        <div className="font-semibold mb-2">Controls:</div>
        <div className="space-y-1 text-xs">
          <div>↶ ↷ Rotate</div>
          <div>+ − Zoom</div>
          <div>⟲ Reset</div>
        </div>
        
        {/* Model Status */}
        <div className="mt-3 text-xs">
          <div className="text-green-400">✓ Complex Model</div>
          <div className="text-gray-400">Auto-fallback if needed</div>
        </div>
      </div>
    </div>
  );
} 