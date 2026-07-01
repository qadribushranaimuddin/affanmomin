import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollSpeedRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
}

// ==========================================
// Upgraded 3D Visual Effects Helpers
// ==========================================
function Gear({ position, size, speed, color }: { position: [number, number, number]; size: number; speed: number; color: string }) {
  const gearRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (gearRef.current) {
      gearRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });
  return (
    <group ref={gearRef} position={position}>
      <mesh>
        <ringGeometry args={[size * 0.4, size, 8]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
          <boxGeometry args={[size * 2.2, size * 0.25, 0.015]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function CRTTextStream({ position, color }: { position: [number, number, number]; color: string }) {
  const textRef = useRef<THREE.Group>(null);
  const [content, setContent] = React.useState("01101\n10110\n00101");
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] - (state.clock.elapsedTime * 0.25) % 0.8;
    }
    if (Math.random() < 0.15) {
      const chars = "01$[]#@%&*";
      let nextText = "";
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          nextText += chars[Math.floor(Math.random() * chars.length)];
        }
        nextText += "\n";
      }
      setContent(nextText);
    }
  });

  return (
    <group ref={textRef} position={position}>
      <Text fontSize={0.055} color={color} anchorX="left" anchorY="top" transparent opacity={0.15}>
        {content}
      </Text>
    </group>
  );
}

function LightStreaks({ theme }: { theme: "dark" | "light" }) {
  const count = 35;
  const streaksRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: -Math.random() * 80,
      speed: 0.8 + Math.random() * 1.2
    }));
  }, []);

  useFrame(() => {
    if (streaksRef.current) {
      streaksRef.current.children.forEach((child, i) => {
        const p = particles[i];
        p.z += p.speed;
        if (p.z > 10) {
          p.z = -80;
          p.x = (Math.random() - 0.5) * 6;
          p.y = (Math.random() - 0.5) * 4;
        }
        child.position.set(p.x, p.y, p.z);
      });
    }
  });

  const color = theme === "dark" ? "#00ffff" : "#FF3E00";

  return (
    <group ref={streaksRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.015, 0.015, 0.8]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function HologramBeamParticles({ count, theme }: { count: number; theme: "dark" | "light" }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 1.2,
      y: -1.8 + Math.random() * 2.5,
      z: (Math.random() - 0.5) * 1.2,
      speed: 0.015 + Math.random() * 0.025
    }));
  }, [count]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        p.y += p.speed;
        if (p.y > 1.2) {
          p.y = -1.8;
          p.x = (Math.random() - 0.5) * 1.2;
          p.z = (Math.random() - 0.5) * 1.2;
        }
        child.position.set(p.x, p.y, p.z);
      });
    }
  });

  const color = theme === "dark" ? "#00ffcc" : "#FF3E00";

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.018, 4, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Helper to generate a procedural brushed metal texture Bump Map
function createBrushedMetalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#8a8a8a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 256;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// ==========================================
// 1. Origami Box & Pressroom Timeline
// ==========================================
function OrigamiBox({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.2, viewport.width / 4.8) * 0.9;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
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
  const speedSplit = Math.min(0.35, scrollSpeedRef.current * 12);

  const materialColor = "#FF3E00";
  const wireframeColor = theme === "dark" ? "#ffffff" : "#1a1a1a";
  const labelColor = theme === "dark" ? "#888888" : "#555555";
  const opacity = progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) / 0.08);

  const renderBoxPanels = () => (
    <>
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <group position={[-0.5, 0, 0]} rotation={[0, -angle, 0]}>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      <group position={[0.5, 0, 0]} rotation={[0, angle, 0]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
    </>
  );

  return (
    <group ref={meshRef} position={[0, 0, -2]} scale={[scale, scale, scale]}>
      {speedSplit > 0.005 ? (
        <>
          <group position={[-speedSplit * 0.4, speedSplit * 0.4, 0]}>
            <Line points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]} color="#06b6d4" lineWidth={1.5} />
          </group>
          <group position={[speedSplit * 0.4, -speedSplit * 0.4, 0]}>
            <Line points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]} color="#ec4899" lineWidth={1.5} />
          </group>
          {renderBoxPanels()}
        </>
      ) : (
        <>
          {renderBoxPanels()}
          <Line points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]} color={wireframeColor} lineWidth={1.5} />
        </>
      )}

      {opacity > 0 && (
        <group position={[0, 0, 0.515]}>
          <Text fontSize={0.065} color="#ffffff" anchorX="center" anchorY="middle" transparent opacity={opacity * 0.95}>
            MOMIN // SPEC
          </Text>
        </group>
      )}
    </group>
  );
}

function PressroomRollers({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const rollerGroupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.2) * 0.8;
  const metalBumpTexture = useMemo(() => createBrushedMetalTexture(), []);

  const particleCount = 36;
  const particlesRef = useRef(Array.from({ length: particleCount }).map((_, i) => ({
    x: 0, y: 0, z: 0,
    t: (i / particleCount) * Math.PI * 2,
    speed: 0.012 + Math.random() * 0.008,
    color: i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#ec4899" : "#eab308"
  })));

  const sphereRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;
    const rangeStart = 0.22;
    const rangeEnd = 0.52;
    const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));
    const vibration = Math.sin(state.clock.elapsedTime * 80) * scrollSpeedRef.current * 0.07;

    if (rollerGroupRef.current) {
      rollerGroupRef.current.rotation.z = -activeProgress * Math.PI * 4;
      rollerGroupRef.current.position.y = 0.2 + vibration;
      const opacity = progress >= 0.18 && progress <= 0.62 ? 1 : 0;
      rollerGroupRef.current.visible = opacity > 0;
    }

    const pts = particlesRef.current;
    const speedMultiplier = 1.0 + scrollSpeedRef.current * 15;
    pts.forEach((p, idx) => {
      p.t += p.speed * speedMultiplier;
      if (p.t > Math.PI * 2) p.t = 0;
      p.x = -1.4 + (p.t / (Math.PI * 2)) * 2.8;
      p.y = Math.sin(p.t * 3.5) * 0.38 - 0.22;
      p.z = Math.cos(p.t * 2.2) * 0.18;
      const sphereGroup = sphereRefs.current[idx];
      if (sphereGroup) sphereGroup.position.set(p.x, p.y + vibration, p.z);
    });
  });

  const cylinderColor = theme === "dark" ? "#2a2a2a" : "#e0e0e0";
  const opacity = smoothProgressRef.current >= 0.18 && smoothProgressRef.current <= 0.62 ? 1 : 0;

  return (
    <group ref={rollerGroupRef} position={[0, 0.2, -3]} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color={cylinderColor} roughness={0.2} metalness={0.95} bumpMap={metalBumpTexture} bumpScale={0.015} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial color={cylinderColor} roughness={0.2} metalness={0.95} bumpMap={metalBumpTexture} bumpScale={0.015} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
        <meshPhysicalMaterial color="#06b6d4" roughness={0.1} metalness={0.2} />
      </mesh>

      {opacity > 0 && (
        <group>
          {particlesRef.current.map((pt, idx) => (
            <group key={idx} ref={(el) => { if (el) sphereRefs.current[idx] = el; }}>
              <mesh>
                <sphereGeometry args={[0.038, 8, 8]} />
                <meshBasicMaterial color={pt.color} transparent opacity={opacity * 0.75} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}

function VectorNodeFlight({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { pointer } = useThree();

  const initialPoints = [
    [-2, -2, -10], [0, 2, -6], [2, -1, -8],
    [3, 1, -12], [-1, -3, -15], [0, 0, -4],
    [-2, 2, -7], [2, 2, -5], [-3, -1, -9]
  ] as [number, number, number][];

  const offsetsRef = useRef<THREE.Vector3[]>(initialPoints.map(p => new THREE.Vector3(...p)));

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;
    const rangeStart = 0.50;
    const rangeEnd = 0.78;
    const activeProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

    if (groupRef.current) {
      groupRef.current.position.z = activeProgress * 12;
      groupRef.current.rotation.z = activeProgress * 0.4;
      const opacity = progress >= 0.46 && progress <= 0.84 ? 1 : 0;
      groupRef.current.visible = opacity > 0;
    }

    const speedSplit = Math.min(0.4, scrollSpeedRef.current * 14);
    const targetPointer = new THREE.Vector3(pointer.x * 2.5, pointer.y * 2.5, -6);
    
    offsetsRef.current.forEach((nodePos, idx) => {
      const orig = initialPoints[idx];
      const dist = nodePos.distanceTo(targetPointer);
      if (dist < 2.0) nodePos.addScaledVector(new THREE.Vector3().subVectors(targetPointer, nodePos).normalize(), (2.0 - dist) * 0.04);
      if (speedSplit > 0.02) nodePos.add(new THREE.Vector3(Math.sin(idx * 45) * speedSplit * 1.8, Math.cos(idx * 75) * speedSplit * 1.8, Math.sin(idx * 90) * speedSplit * 1.8));
      nodePos.addScaledVector(new THREE.Vector3(...orig).sub(nodePos), 0.05);
    });
  });

  const opacity = smoothProgressRef.current >= 0.46 && smoothProgressRef.current <= 0.84 ? 1 : 0;

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {opacity > 0 && (
        <group>
          {initialPoints.map((_, i) => {
            const nextIdx = (i + 1) % initialPoints.length;
            const currentPos = offsetsRef.current[i];
            const nextPos = offsetsRef.current[nextIdx];
            return (
              <group key={i}>
                <Line points={[[currentPos.x, currentPos.y, currentPos.z], [nextPos.x, nextPos.y, nextPos.z]]} color={theme === "dark" ? "#555555" : "#bbbbbb"} lineWidth={1} />
                <mesh position={[currentPos.x, currentPos.y, currentPos.z]}>
                  <boxGeometry args={[0.15, 0.15, 0.15]} />
                  <meshBasicMaterial color="#FF3E00" />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

function CMYKRegistrationScene({ scrollProgressRef, theme }: { scrollProgressRef: React.MutableRefObject<number>; theme: "dark" | "light" }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.85;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
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

// ==========================================
// CONCEPT 1: Retro Industrial Console (CRT Screen, switches, indicator bulbs)
// ==========================================
function ConsoleScene({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const panelRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  
  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;

    if (panelRef.current) {
      panelRef.current.rotation.x = 0.25 + progress * 0.25;
      panelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.06;
      panelRef.current.position.y = -progress * 0.4;
    }
  });

  const progress = smoothProgressRef.current;
  const strokeColor = theme === "dark" ? "#00ff66" : "#059669";
  const labelColor = theme === "dark" ? "#888888" : "#444444";
  
  // CRT Screen flickering value (Advanced Concept 1)
  const flicker = useMemo(() => Math.sin(Math.random() * Math.PI) * 0.03 + 0.97, []);
  
  // Indicator light states mapped to scroll sectors
  const activeSector = Math.floor(progress * 3);

  const wavePoints = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const x = -2.2 + (i / 45) * 4.4;
      return new THREE.Vector3(x, 0, 0);
    });
  }, []);

  useFrame((state) => {
    wavePoints.forEach((pt, i) => {
      const freq = 4.5 + scrollSpeedRef.current * 18;
      pt.y = Math.sin(pt.x * freq + state.clock.elapsedTime * 9) * 0.32 * (1.2 - Math.abs(pt.x) / 2.2);
    });
  });

  return (
    <group ref={panelRef} position={[0, 0, -2.5]}>
      {/* Console frame grid backing */}
      <Line points={[[-2.5, -1.8, 0], [2.5, -1.8, 0], [2.5, 1.8, 0], [-2.5, 1.8, 0], [-2.5, -1.8, 0]]} color={theme === "dark" ? "#333" : "#ccc"} lineWidth={2} />
      
      {/* Curved CRT Display boundary line */}
      <Line points={[[-2.1, -0.9, -0.1], [2.1, -0.9, -0.1], [2.3, 0.9, -0.1], [-2.3, 0.9, -0.1], [-2.1, -0.9, -0.1]]} color={theme === "dark" ? "#222" : "#ddd"} lineWidth={1.5} />
      
      {/* Motherboard circuit pathway traces & glowing microchip */}
      <group position={[0, 0, -0.15]}>
        <Line points={[[-2.2, -1.3, 0], [-1.0, -1.3, 0], [-0.5, -0.8, 0], [0.5, -0.8, 0], [1.0, -1.3, 0], [2.2, -1.3, 0]]} color={theme === "dark" ? "#113322" : "#ccffdd"} lineWidth={1} transparent opacity={0.6} />
        <Line points={[[-1.5, 0.8, 0], [-0.8, 0.2, 0], [0.8, 0.2, 0], [1.5, 0.8, 0]]} color={theme === "dark" ? "#113322" : "#ccffdd"} lineWidth={1} transparent opacity={0.6} />
        <mesh position={[0, -0.8, 0.01]}>
          <boxGeometry args={[0.3, 0.18, 0.05]} />
          <meshBasicMaterial color="#FF3E00" />
        </mesh>
      </group>

      {/* Falling binary matrix background streams */}
      <CRTTextStream position={[-1.8, 0.7, -0.12]} color={strokeColor} />
      <CRTTextStream position={[-1.0, 0.5, -0.12]} color={strokeColor} />
      <CRTTextStream position={[0.6, 0.8, -0.12]} color={strokeColor} />
      <CRTTextStream position={[1.4, 0.6, -0.12]} color={strokeColor} />

      {/* Rotating industrial system gears */}
      <Gear position={[-2.3, 1.4, -0.05]} size={0.15} speed={1.2} color={strokeColor} />
      <Gear position={[2.3, 1.4, -0.05]} size={0.15} speed={-1.2} color={strokeColor} />

      {/* Oscilloscope Waveform */}
      <Line points={wavePoints} color={strokeColor} lineWidth={2.5} transparent opacity={flicker} />
      
      {/* Dynamic Telemetry CRT Printout */}
      <Text position={[-2.2, 1.4, 0]} fontSize={0.08} color={strokeColor} anchorX="left" transparent opacity={flicker}>
        {`STATUS: ONLINE // LOADING TIMELINE...`}
      </Text>
      <Text position={[-2.2, 1.25, 0]} fontSize={0.065} color={labelColor} anchorX="left">
        {`CRT SCAN RATE: 60Hz // IPH: ${(progress * 15000 + 4000).toFixed(0)}`}
      </Text>

      {/* Advanced Concept 1: Indicator Bulbs that light up based on progress */}
      <group position={[0.2, 1.35, 0]}>
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={activeSector === 0 ? "#ff9900" : "#332200"} />
        </mesh>
        <Text position={[-0.4, -0.18, 0]} fontSize={0.045} color={labelColor}>HERO</Text>
        
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={activeSector === 1 ? "#00ff66" : "#003311"} />
        </mesh>
        <Text position={[0, -0.18, 0]} fontSize={0.045} color={labelColor}>ABOUT</Text>
        
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={activeSector >= 2 ? "#ff3e00" : "#441100"} />
        </mesh>
        <Text position={[0.4, -0.18, 0]} fontSize={0.045} color={labelColor}>WORK</Text>
      </group>

      {/* Concept 1: Mechanical Toggle Switches that flip on scroll */}
      <group position={[-1.6, -1.3, 0]}>
        {/* Toggle switch 1 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[activeSector > 0 ? 0.5 : -0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#ff3e00" metalness={0.9} />
        </mesh>
        <Text position={[0, -0.25, 0]} fontSize={0.05} color={labelColor}>SYS_A</Text>
      </group>

      <group position={[-1.1, -1.3, 0]}>
        {/* Toggle switch 2 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[activeSector > 1 ? 0.5 : -0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#ff3e00" metalness={0.9} />
        </mesh>
        <Text position={[0, -0.25, 0]} fontSize={0.05} color={labelColor}>SYS_B</Text>
      </group>

      {/* Rotating control dials */}
      <group position={[1.4, -1.3, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color={theme === "dark" ? "#1a1a1a" : "#dddddd"} metalness={0.9} roughness={0.1} />
        </mesh>
        <Line points={[[0, 0.06, 0], [0, 0.06, -0.18]]} color="#FF3E00" lineWidth={3} rotation={[0, progress * Math.PI * 4, 0]} />
        <Text position={[0, -0.32, 0]} fontSize={0.05} color={labelColor}>FEED_RATE</Text>
      </group>
    </group>
  );
}

// ==========================================
// CONCEPT 2: Spline Path (Void Highway with Project Boards)
// ==========================================
function SplineHighwayScene({ scrollProgressRef, theme }: SceneProps) {
  const roadRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { camera } = useThree();
  const lookTargetRef = useRef<THREE.Vector3 | null>(null);

  const splinePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 90; i++) {
      const z = -i * 1.25;
      const x = Math.sin(i * 0.11) * 2.2;
      const y = Math.cos(i * 0.075) * 0.95;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.025);
    const progress = smoothProgressRef.current;

    const speedIndex = progress * 70;
    const targetZ = -speedIndex * 1.25 + 3.5;
    const targetX = Math.sin(speedIndex * 0.11) * 2.2;
    const targetY = Math.cos(speedIndex * 0.075) * 0.95;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);

    const lookTargetX = Math.sin((speedIndex + 4) * 0.11) * 2.2;
    const lookTargetY = Math.cos((speedIndex + 4) * 0.075) * 0.95;
    const lookTargetZ = -(speedIndex + 4) * 1.25;

    if (!lookTargetRef.current) {
      lookTargetRef.current = new THREE.Vector3(lookTargetX, lookTargetY, lookTargetZ);
    } else {
      lookTargetRef.current.x = THREE.MathUtils.lerp(lookTargetRef.current.x, lookTargetX, 0.03);
      lookTargetRef.current.y = THREE.MathUtils.lerp(lookTargetRef.current.y, lookTargetY, 0.03);
      lookTargetRef.current.z = THREE.MathUtils.lerp(lookTargetRef.current.z, lookTargetZ, 0.03);
    }
    camera.lookAt(lookTargetRef.current);
  });

  const lineColor = theme === "dark" ? "#00ffff" : "#0284c7";
  const billboardColor = theme === "dark" ? "#111111" : "#ffffff";
  const boardBorderColor = theme === "dark" ? "#333333" : "#cccccc";

  // Project Boards (Concept 2 Billboards) mapped at intervals along Z spline
  const projectBillboards = [
    { z: -18, title: "01 // PREPRESS SANDBOX", desc: "Interactive canvas packaging layout studio" },
    { z: -38, title: "02 // TACTILE POSTPRESS", desc: "Heavy mechanical offset simulation panel" },
    { z: -58, title: "03 // VECTOR NODE GRID", desc: "Pointer coordinate magnetic wireframe grid" }
  ];

  return (
    <group ref={roadRef}>
      {/* Light speed warp streaks */}
      <LightStreaks theme={theme} />

      {/* Cyberpunk wireframe city buildings flanking road */}
      {Array.from({ length: 12 }).map((_, i) => {
        const sideZ = -5 - i * 8;
        const pathPt = splinePoints.find(p => p.z <= sideZ) || splinePoints[0];
        const height = 1.8 + Math.sin(i * 1.7) * 1.4;
        const leftX = pathPt.x - 3.4;
        const rightX = pathPt.x + 3.4;
        return (
          <group key={i}>
            {/* Left Skyscraper */}
            <mesh position={[leftX, pathPt.y - 0.7 + height / 2, sideZ]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshBasicMaterial color={theme === "dark" ? "#1e1b4b" : "#cbd5e1"} wireframe />
            </mesh>
            {/* Right Skyscraper */}
            <mesh position={[rightX, pathPt.y - 0.7 + height / 2, sideZ]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshBasicMaterial color={theme === "dark" ? "#1e1b4b" : "#cbd5e1"} wireframe />
            </mesh>
          </group>
        );
      })}

      {/* 3 Neon Spline lanes */}
      <Line points={splinePoints} color={lineColor} lineWidth={3} />
      <Line points={splinePoints.map(p => new THREE.Vector3(p.x - 0.75, p.y - 0.25, p.z))} color="#FF3E00" lineWidth={1.5} />
      <Line points={splinePoints.map(p => new THREE.Vector3(p.x + 0.75, p.y - 0.25, p.z))} color="#FF3E00" lineWidth={1.5} />
      
      {/* Neon Vector square gates */}
      {Array.from({ length: 15 }).map((_, i) => {
        const step = i * 6;
        if (step >= splinePoints.length) return null;
        const pt = splinePoints[step];
        return (
          <group key={i} position={[pt.x, pt.y, pt.z]}>
            <Line
              points={[[-1.4, -0.9, 0], [1.4, -0.9, 0], [1.4, 0.9, 0], [-1.4, 0.9, 0], [-1.4, -0.9, 0]]}
              color={theme === "dark" ? "#444" : "#bbb"}
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          </group>
        );
      })}

      {/* Floating neon project billboards (Concept 2 Upgrade) */}
      {projectBillboards.map((board, idx) => {
        // Interpolate the exact X/Y path coordinates at the billboard Z position
        const targetZ = board.z;
        const closestPoint = splinePoints.find(p => p.z <= targetZ) || splinePoints[0];
        
        return (
          <group key={idx} position={[closestPoint.x - 2.5, closestPoint.y + 0.8, targetZ]}>
            {/* Billboard panel */}
            <mesh>
              <planeGeometry args={[2.2, 1.1]} />
              <meshBasicMaterial color={billboardColor} transparent opacity={0.65} />
            </mesh>
            {/* Panel border wireframe outline */}
            <Line points={[[-1.1, -0.55, 0.01], [1.1, -0.55, 0.01], [1.1, 0.55, 0.01], [-1.1, 0.55, 0.01], [-1.1, -0.55, 0.01]]} color={boardBorderColor} lineWidth={1.5} />
            
            {/* Glowing neon bracket highlights */}
            <Line points={[[-1.15, 0.6, 0.02], [-1.0, 0.6, 0.02]]} color="#FF3E00" lineWidth={2} />
            <Line points={[[1.15, 0.6, 0.02], [1.0, 0.6, 0.02]]} color="#FF3E00" lineWidth={2} />
            
            <Text position={[-0.95, 0.25, 0.05]} fontSize={0.075} color="#FF3E00" anchorX="left" anchorY="middle">
              {board.title}
            </Text>
            <Text position={[-0.95, -0.15, 0.05]} fontSize={0.055} color={theme === "dark" ? "#888" : "#444"} anchorX="left" anchorY="middle" maxWidth={1.8}>
              {board.desc}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// ==========================================
// CONCEPT 3: CAD Blueprint Table (Auto-drawing schematics & coordinate caliper)
// ==========================================
function BlueprintScene({ scrollProgressRef, theme }: SceneProps) {
  const modelRef = useRef<THREE.Group>(null);
  const compassRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport, pointer } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.0) * 0.85;

  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;

    if (modelRef.current) {
      modelRef.current.rotation.y = progress * Math.PI * 2.0;
      modelRef.current.rotation.x = 0.35 + progress * 0.25;
    }
    if (compassRef.current) {
      compassRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  const progress = smoothProgressRef.current;
  const blueprintColor = theme === "dark" ? "#0066ff" : "#1d4ed8";
  const gridColor = theme === "dark" ? "#1a1a2e" : "#e0e7ff";

  // Auto-drawing lines animation factor based on scroll progress (Concept 3 Upgrade)
  const drawLimit = Math.max(0.01, progress * 1.5);

  return (
    <group ref={modelRef} scale={[scale, scale, scale]} position={[0, 0, -2.5]}>
      <gridHelper args={[8, 16, blueprintColor, gridColor]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]} />

      {/* Rotating mechanical compass caliper tool on the side */}
      <group ref={compassRef} position={[-2.3, 1.2, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshBasicMaterial color={blueprintColor} wireframe />
        </mesh>
        <mesh position={[-0.15, -0.3, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />
          <meshBasicMaterial color={blueprintColor} wireframe />
        </mesh>
        <mesh position={[0.15, -0.3, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />
          <meshBasicMaterial color={blueprintColor} wireframe />
        </mesh>
        <Text position={[0, 0.5, 0]} fontSize={0.065} color={blueprintColor}>
          CAD_TOOL: COMPASS
        </Text>
      </group>

      <group position={[0, -0.3, 0]}>
        {/* Exploded parts assembly animation */}
        {(() => {
          const explode = Math.max(0, (progress - 0.5) * 1.8);
          return (
            <>
              {/* Motherboard/Chassis exploded guide lines */}
              {explode > 0.02 && (
                <>
                  <Line points={[[-1.2, -explode * 0.4, 0.6], [-1.2, explode * 0.5, -explode * 0.3]]} color="#FF3E00" lineWidth={1} dashed />
                  <Line points={[[1.2, -explode * 0.4, 0.6], [1.2, explode * 0.5, -explode * 0.3]]} color="#FF3E00" lineWidth={1} dashed />
                </>
              )}

              {/* Base Chassis Group */}
              <group position={[0, -explode * 0.4, 0]}>
                {drawLimit > 0.15 && (
                  <Line points={[[-1.4, 0, 0], [-1.4, 0, 1.2], [1.4, 0, 1.2], [1.4, 0, 0], [-1.4, 0, 0]]} color={blueprintColor} lineWidth={2.5} />
                )}
              </group>

              {/* Screen Bezel Group */}
              <group position={[0, explode * 0.5, -explode * 0.3]}>
                {drawLimit > 0.45 && (
                  <Line points={[[-1.2, 0, 0], [-1.2, 1.2, 0], [1.2, 1.2, 0], [1.2, 0, 0], [-1.2, 0, 0]]} color={blueprintColor} lineWidth={2} rotation={[-0.45, 0, 0]} />
                )}
              </group>
            </>
          );
        })()}

        {/* Blueprint Drafting Dimensions W: 340mm */}
        {drawLimit > 0.3 && (
          <group position={[0, -0.15, 1.25]}>
            <Line points={[[-1.4, 0, 0], [-1.4, 0.15, 0]]} color={blueprintColor} lineWidth={1} />
            <Line points={[[1.4, 0, 0], [1.4, 0.15, 0]]} color={blueprintColor} lineWidth={1} />
            <Line points={[[-1.4, 0.1, 0], [1.4, 0.1, 0]]} color={blueprintColor} lineWidth={1.5} />
            <Text position={[0, 0.22, 0]} fontSize={0.055} color={blueprintColor} anchorX="center">
              W: 340.00mm
            </Text>
          </group>
        )}

        {/* Blueprint Drafting Dimensions H: 220mm */}
        {drawLimit > 0.6 && (
          <group position={[-1.45, 0.6, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <Line points={[[-0.6, 0, 0], [-0.6, 0.15, 0]]} color={blueprintColor} lineWidth={1} />
            <Line points={[[0.6, 0, 0], [0.6, 0.15, 0]]} color={blueprintColor} lineWidth={1} />
            <Line points={[[-0.6, 0.1, 0], [0.6, 0.1, 0]]} color={blueprintColor} lineWidth={1.5} />
            <Text position={[0, 0.22, 0]} fontSize={0.055} color={blueprintColor} anchorX="center" rotation={[0, 0, -Math.PI / 2]}>
              H: 220.00mm
            </Text>
          </group>
        )}
        
        {/* Interactive Caliper lines tracking cursor coordinate (Concept 3 Upgrade) */}
        <group position={[pointer.x * 1.2, 0.05, pointer.y * 0.8]}>
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#FF3E00" />
          </mesh>
          <Line points={[[0, 0, 0], [0, 0.8, 0]]} color="#FF3E00" lineWidth={1} />
          <Text position={[0.1, 0.4, 0]} fontSize={0.065} color="#FF3E00" anchorX="left">
            {`CALIPER: Z[${(pointer.y * 100).toFixed(0)}mm]`}
          </Text>
        </group>

        {/* Blueprint coordinate readouts */}
        <Text position={[1.7, 0.4, 0]} fontSize={0.06} color={blueprintColor} anchorX="left">
          {`DRAW_PASS: ${Math.round(Math.min(1, drawLimit) * 100)}%`}
        </Text>
        <Text position={[1.7, 0.2, 0]} fontSize={0.06} color={blueprintColor} anchorX="left">
          {`FOCAL_Z: -2.5m`}
        </Text>
      </group>
    </group>
  );
}

// ==========================================
// CONCEPT 4: Typography Sculpture (Particle letters vortex disintegration)
// ==========================================
function TypographyScene({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.2) * 0.95;

  const particleChars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ[]{}#@$*MOMINDESIGNDEVELOP";
  const bgLetters = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.0 + Math.random() * 3.5;
      
      return {
        char: particleChars[Math.floor(Math.random() * particleChars.length)],
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        speed: 0.1 + Math.random() * 0.2
      };
    });
  }, []);

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y = progress * Math.PI * 0.8;
      groupRef.current.rotation.x = Math.sin(progress * 0.5) * 0.15;
    }
  });

  const progress = smoothProgressRef.current;
  const textColor = theme === "dark" ? "#ffffff" : "#111111";
  const drift = scrollSpeedRef.current * 16.0;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, -2.8]}>
      {/* Massive Typographical Letter Sphere */}
      {bgLetters.map((p, i) => {
        const factor = 1.0 + drift * 0.6;
        return (
          <group key={i} position={[p.x * factor, p.y * factor, p.z * factor]}>
            <Text fontSize={0.14} color={textColor} transparent opacity={0.22}>
              {p.char}
            </Text>
          </group>
        );
      })}

      {/* Main typographic structural headers */}
      <group position={[0, 0.8, 0]}>
        <Text fontSize={0.65} color={textColor}>MOMIN</Text>
      </group>
      <group position={[0, 0, 0.8]}>
        <Text fontSize={0.48} color="#FF3E00">DESIGN</Text>
      </group>
      <group position={[0, -0.8, 1.4]}>
        <Text fontSize={0.48} color={theme === "dark" ? "#00ffcc" : "#0d9488"}>DEVELOP</Text>
      </group>
    </group>
  );
}

// ==========================================
// CONCEPT 5: Holographic Core (Transformers Unfolding core & Orbital project rings)
// ==========================================
function HologramScene({ scrollProgressRef, theme }: SceneProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const meshTopRef = useRef<THREE.Mesh>(null);
  const meshBottomRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.9;

  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;

    // Transformers style unfolding offset along Y-axis (Concept 5 Upgrade)
    const splitAmount = progress * 0.65;
    if (meshTopRef.current) {
      meshTopRef.current.position.y = splitAmount;
      meshTopRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
    }
    if (meshBottomRef.current) {
      meshBottomRef.current.position.y = -splitAmount;
      meshBottomRef.current.rotation.y = -state.clock.getElapsedTime() * 1.5;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -state.clock.getElapsedTime() * 2.5;
      coreRef.current.scale.setScalar(0.25 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05);
    }

    // Spin orbital project rings (Concept 5 Upgrade)
    const spinSpeed = 1.0 + progress * 2.0;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.getElapsedTime() * 0.45 * spinSpeed;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -state.clock.getElapsedTime() * 0.35 * spinSpeed;
    }
  });

  const glassColor = theme === "dark" ? "#06b6d4" : "#0891b2";
  const wireColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  return (
    <group scale={[scale, scale, scale]} position={[0, 0, -2.5]}>
      {/* Outer shield dome wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={theme === "dark" ? "#00ffcc" : "#FF3E00"} wireframe transparent opacity={0.12} />
      </mesh>

      {/* Hologram Pedestal Base Emitter */}
      <group position={[0, -1.8, 0]}>
        <mesh>
          <cylinderGeometry args={[1.0, 1.2, 0.15, 32]} />
          <meshStandardMaterial color={theme === "dark" ? "#111111" : "#eeeeee"} roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 32]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
      </group>

      {/* Projection Beam Guide Lines */}
      <Line points={[[0, -1.8, 0], [-0.65, 0, 0]]} color="#00ffcc" lineWidth={1} transparent opacity={0.35} />
      <Line points={[[0, -1.8, 0], [0.65, 0, 0]]} color="#00ffcc" lineWidth={1} transparent opacity={0.35} />
      <Line points={[[0, -1.8, 0], [0, 1.2, 0]]} color="#00ffcc" lineWidth={0.7} transparent opacity={0.2} />

      {/* Rising beam energy particles */}
      <HologramBeamParticles count={25} theme={theme} />

      {/* Top half of unfolding prism */}
      <mesh ref={meshTopRef}>
        <octahedronGeometry args={[0.65]} />
        <meshPhysicalMaterial transmission={0.92} roughness={0.08} thickness={1.4} ior={1.62} transparent opacity={0.4} color={glassColor} />
      </mesh>

      {/* Bottom half of unfolding prism */}
      <mesh ref={meshBottomRef}>
        <octahedronGeometry args={[0.65]} />
        <meshPhysicalMaterial transmission={0.92} roughness={0.08} thickness={1.4} ior={1.62} transparent opacity={0.4} color={glassColor} />
      </mesh>

      {/* Glowing inner crystal core: Nested rotating wireframe polyhedrons */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#FF3E00" wireframe />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#00ffcc" wireframe />
        </mesh>
      </group>

      {/* Orbital project rings carrying virtual cards (Concept 5 Upgrade) */}
      <group ref={ring1Ref} rotation={[Math.PI / 4, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.3, 0.015, 8, 48]} />
          <meshBasicMaterial color={wireColor} />
        </mesh>
        
        {/* Project Card nodes attached to Ring 1 */}
        <group position={[1.3, 0, 0]}>
          <mesh><boxGeometry args={[0.22, 0.13, 0.02]} /><meshBasicMaterial color="#06b6d4" /></mesh>
          <Text position={[0, 0.16, 0]} fontSize={0.055} color={wireColor}>PREPRESS</Text>
        </group>
        <group position={[-1.3, 0, 0]}>
          <mesh><boxGeometry args={[0.22, 0.13, 0.02]} /><meshBasicMaterial color="#06b6d4" /></mesh>
          <Text position={[0, 0.16, 0]} fontSize={0.055} color={wireColor}>SANDBOX</Text>
        </group>
      </group>
      
      <group ref={ring2Ref} rotation={[-Math.PI / 4, -Math.PI / 5, 0]}>
        <mesh>
          <torusGeometry args={[1.6, 0.015, 8, 48]} />
          <meshBasicMaterial color="#FF3E00" />
        </mesh>
        
        {/* Project Card nodes attached to Ring 2 */}
        <group position={[0, 1.6, 0]}>
          <mesh><boxGeometry args={[0.22, 0.13, 0.02]} /><meshBasicMaterial color="#FF3E00" /></mesh>
          <Text position={[0, 0.16, 0]} fontSize={0.055} color={wireColor}>TACTILE</Text>
        </group>
      </group>
    </group>
  );
}

// Scene Director Canvas Camera controls with Gyroscopic Mouse Parallax
function CameraDirector({
  scrollProgressRef,
  style,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  style: string;
}) {
  const { camera, pointer } = useThree();
  const smoothProgressRef = useRef(0);

  useEffect(() => {
    camera.rotation.set(0, 0, 0);
  }, [style]);

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.025);
    const progress = smoothProgressRef.current;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 3.5;

    if (style === "highway") return;

    if (style === "origami") {
      if (progress < 0.25) {
        targetX = 0; targetY = 0;
      } else if (progress < 0.50) {
        targetX = 0.5; targetY = 0.2;
      } else if (progress < 0.75) {
        targetX = -0.4; targetY = -0.3;
      } else {
        targetX = 0; targetY = 0;
      }
    } else if (style === "console") {
      targetX = 0;
      targetY = -progress * 0.4;
      targetZ = 3.2 - progress * 1.4;
    } else if (style === "blueprint") {
      targetX = progress * 0.3;
      targetY = 0;
      targetZ = 3.5 - progress * 0.8;
    } else if (style === "typography") {
      targetX = 0;
      targetY = 0;
      targetZ = 3.6 - progress * 2.2;
    } else if (style === "hologram") {
      targetX = Math.sin(progress * Math.PI) * 0.4;
      targetY = 0;
      targetZ = 3.4 - progress * 1.4;
    } else if (style === "galaxy") {
      targetX = 0;
      targetY = 0;
      targetZ = 3.5 - progress * 2.8;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + pointer.x * 0.45, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + pointer.y * 0.35, 0.025);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.025);
    
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -pointer.x * 0.08, 0.025);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, pointer.y * 0.08, 0.025);
  });

  return null;
}

// Dynamic Spotlight with mouse following shadow sweeps
function DynamicStudioSpotlight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, pointer.x * 4.5, 0.08);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, pointer.y * 4.5, 0.08);
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 4, 3]}
      angle={0.6}
      penumbra={0.8}
      intensity={3.0}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
}

function GalaxyScene({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const { viewport, pointer } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.95;

  const starCount = 500;
  const stars = useMemo(() => {
    const particleColors = theme === "dark" 
      ? ["#00ffcc", "#06b6d4", "#9333ea", "#3b82f6"] 
      : ["#FF3E00", "#d97706", "#db2777", "#4f46e5"];
      
    return Array.from({ length: starCount }).map((_, i) => {
      const arm = i % 2 === 0 ? 0 : Math.PI;
      const distance = 0.3 + Math.random() * 3.8;
      const angle = distance * 2.2 + arm;
      const spreadX = (Math.random() - 0.5) * 0.25 * distance;
      const spreadY = (Math.random() - 0.5) * 0.25 * distance;
      const spreadZ = (Math.random() - 0.5) * 0.25 * distance;
      
      const speed = 0.15 + Math.random() * 0.25;
      const color = particleColors[i % particleColors.length];

      return {
        x: Math.cos(angle) * distance + spreadX,
        y: Math.sin(angle) * distance + spreadY,
        z: spreadZ,
        distance,
        angle,
        speed,
        color
      };
    });
  }, [starCount, theme]);

  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    smoothProgressRef.current = THREE.MathUtils.lerp(current, target, 0.035);
    const progress = smoothProgressRef.current;

    if (groupRef.current) {
      const scrollSpin = progress * Math.PI * 1.5;
      const timeSpin = state.clock.getElapsedTime() * 0.12;
      groupRef.current.rotation.z = timeSpin + scrollSpin;
      
      // Dynamic camera parallax tilt
      groupRef.current.rotation.x = 0.55 + pointer.y * 0.18;
      groupRef.current.rotation.y = pointer.x * 0.18;
    }
  });

  const progress = smoothProgressRef.current;
  const coreColor = theme === "dark" ? "#00ffcc" : "#FF3E00";

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, -3.2]}>
      {/* Central Supermassive Star Core */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={coreColor} />
      </mesh>
      {/* Outer core glow ring */}
      <mesh>
        <ringGeometry args={[0.25, 0.32, 32]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.4} />
      </mesh>

      {/* Galaxy Dust Belt / Orbital Rings */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.0, 2.05, 64]} />
          <meshBasicMaterial color={coreColor} transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 2.86, 64]} />
          <meshBasicMaterial color={coreColor} transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Orbiting star particles */}
      {stars.map((star, idx) => {
        return (
          <group key={idx} position={[star.x, star.y, star.z]}>
            <mesh>
              <sphereGeometry args={[0.024, 6, 6]} />
              <meshBasicMaterial color={star.color} transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ScrollCanvas({ theme, style }: { theme: "dark" | "light"; style: string }) {
  const scrollProgressRef = useRef<number>(0);
  const scrollSpeedRef = useRef<number>(0);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
      >
        <FrameScrollTracker scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} />

        <ambientLight intensity={theme === "dark" ? 0.25 : 0.65} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, -2]} intensity={1.5} color="#FF3E00" />
        
        <DynamicStudioSpotlight />
        
        <CameraDirector scrollProgressRef={scrollProgressRef} style={style} />
        
        {style === "origami" && (
          <>
            <OrigamiBox scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
            <PressroomRollers scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
            <VectorNodeFlight scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
            <CMYKRegistrationScene scrollProgressRef={scrollProgressRef} theme={theme} />
          </>
        )}
        
        {style === "console" && (
          <ConsoleScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}

        {style === "highway" && (
          <SplineHighwayScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}

        {style === "blueprint" && (
          <BlueprintScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}

        {style === "typography" && (
          <TypographyScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}

        {style === "hologram" && (
          <HologramScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}

        {style === "galaxy" && (
          <GalaxyScene scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        )}
      </Canvas>
    </div>
  );
}

function FrameScrollTracker({
  scrollProgressRef,
  scrollSpeedRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollSpeedRef: React.MutableRefObject<number>;
}) {
  const lastScrollYRef = useRef(window.scrollY);

  useFrame(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const currentScrollY = window.scrollY;
      const targetProgress = Math.max(0, Math.min(1, currentScrollY / docHeight));
      scrollProgressRef.current = targetProgress;

      const deltaScroll = Math.abs(currentScrollY - lastScrollYRef.current);
      const instantSpeed = docHeight > 0 ? deltaScroll / docHeight : 0;
      scrollSpeedRef.current = THREE.MathUtils.lerp(scrollSpeedRef.current, instantSpeed, 0.1);
      
      lastScrollYRef.current = currentScrollY;
    }
  });
  return null;
}
