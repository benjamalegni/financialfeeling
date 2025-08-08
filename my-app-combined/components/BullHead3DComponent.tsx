'use client'

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, Loader } from "@react-three/drei";
import { motion } from "framer-motion";

/**
 * Bull Model Component - Creates a simple bull head
 */
function BullModel(props: any) {
  const group = useRef<any>(null);

  // Gentle idle rotation
  useFrame((_: any, delta: number) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} {...props}>
      {/* Simple bull head geometry */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
        <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Bull horns */}
      <mesh position={[0.2, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.7} />
      </mesh>
      
      <mesh position={[-0.2, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.7} />
      </mesh>
      
      {/* Bull eyes */}
      <mesh position={[0.15, 0.1, 0.25]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[-0.15, 0.1, 0.25]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function Loading() {
  return (
    <Html center>
      <div className="rounded-2xl px-4 py-2 shadow-lg bg-black/70 text-white text-sm">
        Cargando modelo 3D…
      </div>
    </Html>
  );
}

export default function BullHead3DComponent() {
  return (
    <div className="w-full h-[80vh] bg-gradient-to-b from-neutral-900 to-black rounded-2xl relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute z-10 left-4 top-4 text-white"
      >
        <h1 className="text-xl font-semibold">Financial Feeling — Toro 3D</h1>
        <p className="text-xs opacity-80">Arrastrá para rotar • Scroll para zoom • Doble clic para centrar</p>
      </motion.div>

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0.6, 0.4, 1.2], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.3} />
        {/* Key light */}
        <directionalLight castShadow position={[3, 3, 2]} intensity={1} />
        {/* Fill light */}
        <directionalLight position={[-2, 1, -2]} intensity={0.3} />

        <Suspense fallback={<Loading />}>          
          <BullModel position={[0, -0.1, 0]} />

          {/* Subtle ground contact */}
          <ContactShadows
            opacity={0.6}
            scale={4}
            blur={2.5}
            far={2}
            resolution={1024}
          />

          {/* Studio-like reflections */}
          <Environment preset="studio" />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={0.6}
          maxDistance={2.2}
          maxPolarAngle={Math.PI * 0.9}
          makeDefault
        />
      </Canvas>

      {/* Drei global loader (progress bar) */}
      <Loader />

      {/* Optional CTA overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <motion.a
          whileTap={{ scale: 0.98 }}
          href="#"
          className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2 text-white text-sm shadow"
        >
          Probar demo
        </motion.a>
      </div>
    </div>
  );
} 