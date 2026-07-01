import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
}

// Sub-Component 1: Folding Origami Box (Concept 1)
function OrigamiBox({ scrollProgressRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Spring dynamics refs
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  const { viewport } = useThree();
  const scale = Math.min(1.2, viewport.width / 4.8) * 0.9;

  useFrame(() => {
    // Spring physics integration
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
    const progress = smoothProgressRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2.5;
      meshRef.current.rotation.x = 0.2 + progress * 0.5;
      
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

  const progress = smoothProgressRef.current;
  const foldProgress = Math.max(0, Math.min(1, progress / 0.22));
  const angle = (1 - foldProgress) * (Math.PI / 2);

  const materialColor = "#FF3E00";
  const wireframeColor = theme === "dark" ? "#ffffff" : "#1a1a1a";
  const labelColor = theme === "dark" ? "#888888" : "#555555";
  const opacity = progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) / 0.08);

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

      {/* Technical Blueprint Dimension Annotations */}
      {opacity > 0 && (
        <group position={[0, -0.7, 0.5]}>
          <Line points={[[-0.5, 0, 0], [0.5, 0, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.5, 0.05, 0], [-0.5, -0.05, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[0.5, 0.05, 0], [0.5, -0.05, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Text
            position={[0, -0.15, 0]}
            fontSize={0.06}
            color={labelColor}
            font="/Fonts/CourierPrime-Regular.ttf"
            anchorX="center"
            anchorY="middle"
            transparent
            opacity={opacity * 0.7}
          >
            W: 100mm
          </Text>
        </group>
      )}

      {opacity > 0 && (
        <group position={[0.7, 0, 0.5]}>
          <Line points={[[0, -0.5, 0], [0, 0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.05, -0.5, 0], [0.05, -0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.05, 0.5, 0], [0.05, 0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Text
            position={[0.18, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            fontSize={0.06}
            color={labelColor}
            font="/Fonts/CourierPrime-Regular.ttf"
            anchorX="center"
            anchorY="middle"
            transparent
            opacity={opacity * 0.7}
          >
            H: 100mm
          </Text>
        </group>
      )}
    </group>
  );
}

// Sub-Component 2: Offset Press Roller & Ribbon (Concept 2)
function PressroomRollers({ scrollProgressRef, theme }: SceneProps) {
  const rollerGroupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.2) * 0.8;

  // Generate ink spray particles that spin off the cylinders
  const particles = Array.from({ length: 15 }).map((_, idx) => {
    const angle = (idx / 15) * Math.PI * 2;
    const radius = 0.65 + (idx % 3) * 0.12;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: ((idx % 5) - 2.5) * 0.4,
      color: idx % 3 === 0 ? "#06b6d4" : idx % 3 === 1 ? "#ec4899" : "#eab308"
    };
  });

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
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

    // Spin ink spray particles in reverse coordinate vectors
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.z = activeProgress * Math.PI * 5.2;
    }
  });

  const cylinderColor = theme === "dark" ? "#222222" : "#dddddd";
  const paperColor = theme === "dark" ? "#fcfaf2" : "#111111";
  const opacity = smoothProgressRef.current >= 0.18 && smoothProgressRef.current <= 0.62 ? 1 : 0;

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

      {/* Ink Spray particles (glowing spheres) */}
      {opacity > 0 && (
        <group ref={particleGroupRef} position={[0, -0.8, -0.5]}>
          {particles.map((pt, idx) => (
            <mesh key={idx} position={[pt.x, pt.y, pt.z]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color={pt.color} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// Sub-Component 3: Brutalist Vector Node Flight (Concept 3)
function VectorNodeFlight({ scrollProgressRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  const { viewport, pointer } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.0) * 0.85;

  // Generate vector coordinates
  const initialPoints = [
    [-2, -2, -10], [0, 2, -6], [2, -1, -8],
    [3, 1, -12], [-1, -3, -15], [0, 0, -4],
    [-2, 2, -7], [2, 2, -5], [-3, -1, -9]
  ] as [number, number, number][];

  // Store nodes offset positions dynamically for mouse attraction warp
  const offsetsRef = useRef<THREE.Vector3[]>(initialPoints.map(p => new THREE.Vector3(...p)));

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
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

    // Dynamic mouse attraction warping physics
    const targetPointer = new THREE.Vector3(pointer.x * 2.5, pointer.y * 2.5, -6);
    offsetsRef.current.forEach((nodePos, idx) => {
      const orig = initialPoints[idx];
      const dist = nodePos.distanceTo(targetPointer);
      
      // Pull nodes toward cursor if cursor is within 2.0 units range
      if (dist < 2.0) {
        const pullDir = new THREE.Vector3().subVectors(targetPointer, nodePos).normalize();
        const pullStrength = (2.0 - dist) * 0.04;
        nodePos.addScaledVector(pullDir, pullStrength);
      }
      
      // Spring back to original positions slowly
      const homeDir = new THREE.Vector3(...orig).sub(nodePos);
      nodePos.addScaledVector(homeDir, 0.05);
    });
  });

  const lineColor = theme === "dark" ? "#555555" : "#bbbbbb";
  const labelColor = theme === "dark" ? "#737373" : "#666666";
  const particleSaturation = theme === "dark" ? 0 : 0.5;
  const opacity = smoothProgressRef.current >= 0.46 && smoothProgressRef.current <= 0.84 ? 1 : 0;

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={[scale, scale, scale]}>
      {/* Grid Anchor Lines & Labels */}
      <group ref={nodesRef}>
        {initialPoints.map((_, i) => {
          const nextIdx = (i + 1) % initialPoints.length;
          const currentPos = offsetsRef.current[i];
          const nextPos = offsetsRef.current[nextIdx];
          
          return (
            <group key={i}>
              <Line
                points={[[currentPos.x, currentPos.y, currentPos.z], [nextPos.x, nextPos.y, nextPos.z]]}
                color={lineColor}
                lineWidth={1}
              />
              {/* Draw nodes at joint intersections */}
              <mesh position={[currentPos.x, currentPos.y, currentPos.z]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshBasicMaterial color="#FF3E00" />
              </mesh>
              
              {/* Coordinate label next to every node */}
              {opacity > 0 && i % 3 === 0 && (
                <Text
                  position={[currentPos.x + 0.28, currentPos.y + 0.1, currentPos.z]}
                  fontSize={0.075}
                  color={labelColor}
                  font="/Fonts/CourierPrime-Regular.ttf"
                  anchorX="left"
                  anchorY="bottom"
                  transparent
                  opacity={opacity * 0.6}
                >
                  {`P${i}:(${currentPos.x.toFixed(1)},${currentPos.y.toFixed(1)})`}
                </Text>
              )}
            </group>
          );
        })}
      </group>
      
      {/* Faint particle stars */}
      <Stars radius={100} depth={50} count={300} factor={4} saturation={particleSaturation} fade speed={1} />
    </group>
  );
}

// Sub-Component 4: CMYK Plate Registration (Concept 4)
function CMYKRegistrationScene({ scrollProgressRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.85;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
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
  const labelColor = theme === "dark" ? "#888888" : "#444444";
  const accuracy = Math.round(activeProgress * 100);
  const opacity = smoothProgressRef.current >= 0.70 ? 1 : 0;

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

        {/* Live Alignment Telemetry readout next to target */}
        {opacity > 0 && (
          <group position={[0.7, 0, 0]}>
            <Text
              position={[0, 0.15, 0]}
              fontSize={0.065}
              color="#FF3E00"
              font="/Fonts/CourierPrime-Regular.ttf"
              anchorX="left"
              anchorY="middle"
              transparent
              opacity={opacity * 0.8}
            >
              // PLATE_ALIGN
            </Text>
            <Text
              position={[0, -0.05, 0]}
              fontSize={0.075}
              color={ringColor}
              font="/Fonts/CourierPrime-Regular.ttf"
              anchorX="left"
              anchorY="middle"
              transparent
              opacity={opacity * 0.9}
            >
              {`ACCURACY: ${accuracy}%`}
            </Text>
            <Text
              position={[0, -0.22, 0]}
              fontSize={0.055}
              color={labelColor}
              font="/Fonts/CourierPrime-Regular.ttf"
              anchorX="left"
              anchorY="middle"
              transparent
              opacity={opacity * 0.6}
            >
              {accuracy === 100 ? "STATUS: PRESS_READY" : "STATUS: CALIBRATING..."}
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}

// Scene Director Canvas Camera controls
function CameraDirector({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
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
