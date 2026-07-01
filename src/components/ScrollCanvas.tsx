import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars } from "@react-three/drei";
import * as THREE from "three";

// Sub-Component 1: Folding Origami Box (Concept 1)
function OrigamiBox({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate fold angle (0 to 90 degrees) mapping scroll progress 0.0 -> 0.22
  const foldProgress = Math.max(0, Math.min(1, progress / 0.22));
  const angle = (1 - foldProgress) * (Math.PI / 2); // 90 deg when unfolded, 0 when folded closed

  // Slowly rotate box based on scroll
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2.5;
      meshRef.current.rotation.x = 0.2 + progress * 0.5;
    }
  });

  // Calculate box visibility fade out
  const opacity = progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) / 0.08);

  if (opacity <= 0) return null;

  return (
    <group ref={meshRef} position={[0, 0, -2]}>
      {/* Front Panel */}
      <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color="#FF3E00" roughness={0.2} metalness={0.1} transparent opacity={opacity} />
      </mesh>

      {/* Back Panel */}
      <mesh position={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color="#FF3E00" roughness={0.2} metalness={0.1} transparent opacity={opacity} />
      </mesh>

      {/* Folding Flap Left */}
      <group position={[-0.5, 0, 0]} rotation={[0, -angle, 0]}>
        <mesh position={[-0.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color="#FF3E00" roughness={0.2} metalness={0.1} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Folding Flap Right */}
      <group position={[0.5, 0, 0]} rotation={[0, angle, 0]}>
        <mesh position={[0.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color="#FF3E00" roughness={0.2} metalness={0.1} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Crease fold lines (visual vector wireframe) */}
      <Line
        points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={opacity * 0.6}
      />
    </group>
  );
}

// Sub-Component 2: Offset Press Roller & Ribbon (Concept 2)
function PressroomRollers({ progress }: { progress: number }) {
  const rollerGroupRef = useRef<THREE.Group>(null);
  
  // Calculate active range (0.22 -> 0.52)
  const rangeStart = 0.22;
  const rangeEnd = 0.52;
  const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));
  
  // Cylinder speed rotates with scroll progress
  useFrame(() => {
    if (rollerGroupRef.current && activeProgress > 0) {
      rollerGroupRef.current.rotation.z = -activeProgress * Math.PI * 4;
    }
  });

  const opacity = progress >= 0.18 && progress <= 0.62 
    ? (progress < 0.24 ? (progress - 0.18) / 0.06 : (progress > 0.56 ? (0.62 - progress) / 0.06 : 1)) 
    : 0;

  if (opacity <= 0) return null;

  return (
    <group ref={rollerGroupRef} position={[0, 0.3, -3]}>
      {/* Heavy Cylinders */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} transparent opacity={opacity} />
      </mesh>

      {/* Cyan/Magenta/Yellow Ink Roller Highlights */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
        <meshPhysicalMaterial color="#06b6d4" roughness={0.1} metalness={0.2} transparent opacity={opacity} />
      </mesh>
      
      {/* Paper ribbon weaving between rollers */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[3, 0.01, 1.8]} />
        <meshStandardMaterial color="#fcfaf2" roughness={0.9} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Sub-Component 3: Brutalist Vector Node Flight (Concept 3)
function VectorNodeFlight({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate active range (0.50 -> 0.78)
  const rangeStart = 0.50;
  const rangeEnd = 0.78;
  const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

  // Generate deterministic grid lines
  const points = [
    [-2, -2, -10], [0, 2, -6], [2, -1, -8],
    [3, 1, -12], [-1, -3, -15], [0, 0, -4],
    [-2, 2, -7], [2, 2, -5], [-3, -1, -9]
  ] as [number, number, number][];

  // Animate camera flight path or group position shift
  useFrame(() => {
    if (groupRef.current && activeProgress > 0) {
      groupRef.current.position.z = activeProgress * 12;
      groupRef.current.rotation.z = activeProgress * 0.4;
    }
  });

  const opacity = progress >= 0.46 && progress <= 0.84 
    ? (progress < 0.52 ? (progress - 0.46) / 0.06 : (progress > 0.78 ? (0.84 - progress) / 0.06 : 1)) 
    : 0;

  if (opacity <= 0) return null;

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* Grid Anchor Lines */}
      {points.map((pt, i) => {
        const nextPt = points[(i + 1) % points.length];
        return (
          <group key={i}>
            <Line
              points={[pt, nextPt]}
              color="#555555"
              lineWidth={1}
              transparent
              opacity={opacity * 0.4}
            />
            {/* Draw nodes at joint intersections */}
            <mesh position={pt}>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshBasicMaterial color="#FF3E00" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      })}
      
      {/* Faint particle stars */}
      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

// Sub-Component 4: CMYK Plate Registration (Concept 4)
function CMYKRegistrationScene({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate range (0.75 -> 1.0)
  const rangeStart = 0.75;
  const rangeEnd = 1.0;
  const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));
  
  // Chromatic aberration splits based on scroll
  const splitAmount = Math.max(0, 1 - activeProgress); // Decays to 0 (perfect alignment) at bottom

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = (1 - activeProgress) * 0.5;
    }
  });

  const opacity = progress >= 0.70 
    ? (progress < 0.76 ? (progress - 0.70) / 0.06 : 1) 
    : 0;

  if (opacity <= 0) return null;

  return (
    <group ref={meshRef} position={[0, 0, -3.5]}>
      {/* Target Registration Mark Crosshair */}
      <group scale={[0.8, 0.8, 0.8]}>
        {/* Cyan split cross */}
        <group position={[-splitAmount * 0.3, splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#06b6d4" lineWidth={2} transparent opacity={opacity * 0.75} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#06b6d4" lineWidth={2} transparent opacity={opacity * 0.75} />
          <Line points={[[0.4, 0.4, 0], [-0.4, -0.4, 0]]} color="#06b6d4" lineWidth={1} transparent opacity={opacity * 0.4} />
        </group>

        {/* Magenta split cross */}
        <group position={[splitAmount * 0.3, -splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#ec4899" lineWidth={2} transparent opacity={opacity * 0.75} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#ec4899" lineWidth={2} transparent opacity={opacity * 0.75} />
          <Line points={[[0.4, -0.4, 0], [-0.4, 0.4, 0]]} color="#ec4899" lineWidth={1} transparent opacity={opacity * 0.4} />
        </group>

        {/* Yellow split cross */}
        <group position={[-splitAmount * 0.2, -splitAmount * 0.2, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#eab308" lineWidth={2} transparent opacity={opacity * 0.75} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#eab308" lineWidth={2} transparent opacity={opacity * 0.75} />
        </group>
        
        {/* Core Aligned target ring */}
        <mesh>
          <ringGeometry args={[0.3, 0.33, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.8} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.45, 0.47, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Scene Director Canvas Camera controls
function CameraDirector({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Dynamic camera focal shifts based on progress
    if (progress < 0.25) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
    } else if (progress < 0.50) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0.5, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.2, 0.05);
    } else if (progress < 0.75) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, -0.4, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -0.3, 0.05);
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
    }
  });

  return null;
}

export default function ScrollCanvas() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / docHeight));
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial trigger
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
      >
        
        {/* Lights */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#FF3E00" />
        
        <CameraDirector progress={scrollProgress} />
        
        {/* Immersive Scroll Scenes */}
        <OrigamiBox progress={scrollProgress} />
        <PressroomRollers progress={scrollProgress} />
        <VectorNodeFlight progress={scrollProgress} />
        <CMYKRegistrationScene progress={scrollProgress} />
      </Canvas>
    </div>
  );
}
