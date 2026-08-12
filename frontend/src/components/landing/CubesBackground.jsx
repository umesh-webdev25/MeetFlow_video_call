import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion, useInView } from 'framer-motion';

// Helper to detect touch devices
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const Shape = ({ position, rotation, scale, spinRate, floatSpeed, floatOffset, geometryIndex, colorIndex, baseOpacity }) => {
  const meshRef = useRef(null);

  // Use brand colors: Primary Blue, Emerald, Amber, and Slate
  const palette = ['#2563eb', '#10b981', '#f59e0b', '#94a3b8'];
  const color = palette[colorIndex];

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Rotate
    meshRef.current.rotation.x += spinRate.x;
    meshRef.current.rotation.y += spinRate.y;
    meshRef.current.rotation.z += spinRate.z;

    // Organic continuous floating
    meshRef.current.position.y = position[1] + Math.sin(time * floatSpeed + floatOffset) * 2.5;
    meshRef.current.position.x = position[0] + Math.cos(time * floatSpeed + floatOffset) * 1.5;
    
    // Subtle breathing/pulsing scale effect
    const scaleMultiplier = 1 + Math.sin(time * floatSpeed * 1.5 + floatOffset) * 0.15;
    meshRef.current.scale.set(scale * scaleMultiplier, scale * scaleMultiplier, scale * scaleMultiplier);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {geometryIndex === 0 && <boxGeometry args={[1, 1, 1]} />}
      {geometryIndex === 1 && <icosahedronGeometry args={[0.8, 0]} />}
      {geometryIndex === 2 && <octahedronGeometry args={[0.8, 0]} />}
      
      <meshBasicMaterial 
        color={color} 
        wireframe={true} 
        transparent={true} 
        opacity={baseOpacity} 
      />
    </mesh>
  );
};

const Scene = ({ count }) => {
  const groupRef = useRef(null);
  
  const shapes = useMemo(() => {
    // Increase count for a richer scene
    const totalShapes = count + 16; 
    return Array.from({ length: totalShapes }).map(() => ({
      position: [
        (Math.random() - 0.5) * 45, // Spread across X
        (Math.random() - 0.5) * 35, // Spread across Y
        (Math.random() - 0.5) * 20 - 10 // Spread across Z
      ],
      rotation: [
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      ],
      scale: Math.random() * 1.5 + 0.5,
      spinRate: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      floatSpeed: Math.random() * 0.4 + 0.1,
      floatOffset: Math.random() * Math.PI * 2,
      geometryIndex: Math.floor(Math.random() * 3), // 0: box, 1: icosahedron, 2: octahedron
      colorIndex: Math.floor(Math.random() * 4), // 0: blue, 1: emerald, 2: amber, 3: slate
      baseOpacity: Math.random() * 0.15 + 0.1 // Random opacity between 0.1 and 0.25
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Interactive Parallax effect
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    // Smoothly tilt and rotate the entire group of cubes based on mouse
    const targetRotationX = mouseY * 0.25;
    const targetRotationY = mouseX * 0.25;
    
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
    
    // Gentle global scene breathing
    groupRef.current.position.y = Math.sin(time * 0.2) * 1.5;
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Shape 
          key={i} 
          {...shape} 
        />
      ))}
    </group>
  );
};

const CubesBackground = ({ color = '#8b8b95', count = 24, opacity = 0.22 }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef(null);
  // Only render canvas when it is visible in the viewport
  const isInView = useInView(containerRef, { once: false, amount: 0 });

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  // Disable completely for users who prefer reduced motion or on touch devices (mobile/tablet)
  if (prefersReducedMotion || isTouch) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <Scene count={count} color={color} opacity={opacity} />
        </Canvas>
      )}
    </div>
  );
};

export default CubesBackground;
