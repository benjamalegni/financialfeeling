'use client'

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create a simple bull head using geometry
    const createBullHead = () => {
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
      const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
      
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
      const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      
      const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye1.position.set(0.5, 0.3, 1.2);
      group.add(eye1);

      const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye2.position.set(-0.5, 0.3, 1.2);
      group.add(eye2);

      // Bull nose
      const noseGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.set(0, -0.5, 1.5);
      group.add(nose);

      return group;
    };

    const bullHead = createBullHead();
    scene.add(bullHead);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (bullHead) {
        bullHead.rotation.y += 0.01;
        bullHead.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }

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
    <div 
      ref={mountRef} 
      className="w-full h-full absolute inset-0"
      style={{ background: 'linear-gradient(to bottom, #1a1a1a, #000000)' }}
    />
  );
} 