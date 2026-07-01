import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
}

// Sub-Component 1: Folding Origami Box (Concept 1)
function OrigamiBox({ scrollProgressRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();

  // Responsive scale factor based on viewport width
  const scale = Math.min(1.2, viewport.width / 4.8) * 0.9;

  useFrame(() => {
    // Smooth lerping of scroll coordinate
    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      scrollProgressRef.current,
      0.038
    );
    const progress = smoothProgressRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2.5;
      meshRef.current.rotation.x = 0.2 + progress * 0.5;
      
      // Calculate active visibility fade out
      const opacity = progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) / 0.08);
      
      meshRef.current.visible = opacity > 0;
      
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    }
  });

  // Calculate folding flap angle (0 to 90 degrees)
  const foldProgress = Math.max(0, Math.min(1, smoothProgressRef.current / 0.22));
  const angle = (1 - foldProgress) * (Math.PI / 2);

  // Styling properties depending on theme
  const materialColor = "#FF3E00";
  const wireframeColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  return (
    <group ref={meshRef} position={[0, 0, -2]} scale={[scale, scale, scale]}>
      {/* Front Panel */}
      <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Back Panel */}
      <mesh position={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Folding Flap Left */}
      <group position={[-0.5, 0, 0]} rotation={[0, -angle, 0]}>
        <mesh position={[-0.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Folding Flap Right */}
      <group position={[0.5, 0, 0]} rotation={[0, angle, 0]}>
        <mesh position={[0.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Crease fold lines (visual vector wireframe) */}
      <Line
        points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
        color={wireframeColor}
        lineWidth={1.5}
      />
    </group>
  );
}

// Sub-Component 2: Offset Press Roller & Ribbon (Concept 2)
function PressroomRollers({ scrollProgressRef, theme }: SceneProps) {
  const rollerGroupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();

  const scale = Math.min(1.0, viewport.width / 5.2) * 0.8;

  useFrame(() => {
    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      scrollProgressRef.current,
      0.038
    );
    const progress = smoothProgressRef.current;

    const rangeStart = 0.22;
    const rangeEnd = 0.52;
    const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

    if (rollerGroupRef.current) {
      rollerGroupRef.current.rotation.z = -activeProgress * Math.PI * 4;
      
      const opacity = progress >= 0.18 && progress <= 0.62 
        ? (progress < 0.24 ? (progress - 0.18) / 0.06 : (progress > 0.56 ? (0.62 - progress) / 0.06 : 1)) 
        : 0;

      rollerGroupRef.current.visible = opacity > 0;

      rollerGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    }
  });

  const cylinderColor = theme === "dark" ? "#222222" : "#dddddd";
  const paperColor = theme === "dark" ? "#fcfaf2" : "#111111";

  return (
    <group ref={rollerGroupRef} position={[0, 0.2, -3]} scale={[scale, scale, scale]}>
      {/* Heavy Cylinders */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color={cylinderColor} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color={cylinderColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cyan/Magenta/Yellow Ink Roller Highlights */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
        <meshPhysicalMaterial color="#06b6d4" roughness={0.1} metalness={0.2} />
      </mesh>
      
      {/* Paper ribbon weaving between rollers */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[3, 0.01, 1.8]} />
        <meshStandardMaterial color={paperColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Sub-Component 3: Brutalist Vector Node Flight (Concept 3)
function VectorNodeFlight({ scrollProgressRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();

  const scale = Math.min(1.0, viewport.width / 5.0) * 0.85;

  // Generate deterministic grid lines
  const points = [
    [-2, -2, -10], [0, 2, -6], [2, -1, -8],
    [3, 1, -12], [-1, -3, -15], [0, 0, -4],
    [-2, 2, -7], [2, 2, -5], [-3, -1, -9]
  ] as [number, number, number][];

  useFrame(() => {
    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      scrollProgressRef.current,
      0.038
    );
    const progress = smoothProgressRef.current;

    const rangeStart = 0.50;
    const rangeEnd = 0.78;
    const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

    if (groupRef.current) {
      groupRef.current.position.z = activeProgress * 12;
      groupRef.current.rotation.z = activeProgress * 0.4;
      
      const opacity = progress >= 0.46 && progress <= 0.84 
        ? (progress < 0.52 ? (progress - 0.46) / 0.06 : (progress > 0.78 ? (0.84 - progress) / 0.06 : 1)) 
        : 0;

      groupRef.current.visible = opacity > 0;

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    }
  });

  const lineColor = theme === "dark" ? "#555555" : "#bbbbbb";
  const particleSaturation = theme === "dark" ? 0 : 0.5;

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={[scale, scale, scale]}>
      {/* Grid Anchor Lines */}
      {points.map((pt, i) => {
        const nextPt = points[(i + 1) % points.length];
        return (
          <group key={i}>
            <Line
              points={[pt, nextPt]}
              color={lineColor}
              lineWidth={1}
            />
            {/* Draw nodes at joint intersections */}
            <mesh position={pt}>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshBasicMaterial color="#FF3E00" />
            </mesh>
          </group>
        );
      })}
      
      {/* Faint particle stars */}
      <Stars radius={100} depth={50} count={300} factor={4} saturation={particleSaturation} fade speed={1} />
    </group>
  );
}

// Sub-Component 4: CMYK Plate Registration (Concept 4)
function CMYKRegistrationScene({ scrollProgressRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();

  const scale = Math.min(1.0, viewport.width / 4.8) * 0.85;

  useFrame(() => {
    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      scrollProgressRef.current,
      0.038
    );
    const progress = smoothProgressRef.current;

    const rangeStart = 0.75;
    const rangeEnd = 1.0;
    const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

    if (meshRef.current) {
      meshRef.current.rotation.y = (1 - activeProgress) * 0.5;
      
      const opacity = progress >= 0.70 
        ? (progress < 0.76 ? (progress - 0.70) / 0.06 : 1) 
        : 0;

      meshRef.current.visible = opacity > 0;
    }
  });

  const rangeStart = 0.75;
  const rangeEnd = 1.0;
  const activeProgress = Math.max(0, Math.min(1, (smoothProgressRef.current - rangeStart) / (rangeEnd - rangeStart)));
  const splitAmount = Math.max(0, 1 - activeProgress);

  const ringColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  return (
    <group ref={meshRef} position={[0, 0, -3.5]} scale={[scale, scale, scale]}>
      {/* Target Registration Mark Crosshair */}
      <group scale={[0.8, 0.8, 0.8]}>
        {/* Cyan split cross */}
        <group position={[-splitAmount * 0.3, splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#06b6d4" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#06b6d4" lineWidth={2} />
          <Line points={[[0.4, 0.4, 0], [-0.4, -0.4, 0]]} color="#06b6d4" lineWidth={1} />
        </group>

        {/* Magenta split cross */}
        <group position={[splitAmount * 0.3, -splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#ec4899" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#ec4899" lineWidth={2} />
          <Line points={[[0.4, -0.4, 0], [-0.4, 0.4, 0]]} color="#ec4899" lineWidth={1} />
        </group>

        {/* Yellow split cross */}
        <group position={[-splitAmount * 0.2, -splitAmount * 0.2, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#eab308" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#eab308" lineWidth={2} />
        </group>
        
        {/* Core Aligned target ring */}
        <mesh>
          <ringGeometry args={[0.3, 0.33, 32]} />
          <meshBasicMaterial color={ringColor} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.45, 0.47, 32]} />
          <meshBasicMaterial color={ringColor} />
        </mesh>
      </group>
    </group>
  );
}

// Scene Director Canvas Camera controls
function CameraDirector({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const smoothProgressRef = useRef(0);

  useFrame(() => {
    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      scrollProgressRef.current,
      0.08
    );
    const progress = smoothProgressRef.current;

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

export default function ScrollCanvas({ theme }: { theme: "dark" | "light" }) {
  const scrollProgressRef = useRef<number>(0);

  // Update target scroll progress directly in the frame loop (bypasses event triggers)
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
      >
        {/* Frame update hook to keep scroll ref synchronized at maximum monitor refresh rate */}
        <FrameScrollTracker scrollProgressRef={scrollProgressRef} />

        {/* Adapt light intensity to theme */}
        <ambientLight intensity={theme === "dark" ? 0.2 : 0.6} />
        <directionalLight position={[5, 5, 5]} intensity={theme === "dark" ? 1.5 : 1.0} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#FF3E00" />
        
        <CameraDirector scrollProgressRef={scrollProgressRef} />
        
        {/* Immersive Scroll Scenes */}
        <OrigamiBox scrollProgressRef={scrollProgressRef} theme={theme} />
        <PressroomRollers scrollProgressRef={scrollProgressRef} theme={theme} />
        <VectorNodeFlight scrollProgressRef={scrollProgressRef} theme={theme} />
        <CMYKRegistrationScene scrollProgressRef={scrollProgressRef} theme={theme} />
      </Canvas>
    </div>
  );
}

// Separate helper component to perform frame-rate synced scroll reading
function FrameScrollTracker({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  useFrame(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      scrollProgressRef.current = Math.max(0, Math.min(1, window.scrollY / docHeight));
    }
  });
  return null;
}
