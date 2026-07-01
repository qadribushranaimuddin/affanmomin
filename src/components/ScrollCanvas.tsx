import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollSpeedRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
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
  const velocityRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.2, viewport.width / 4.8) * 0.9;

  useFrame(() => {
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
  const velocityRef = useRef(0);
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
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
    
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
  const velocityRef = useRef(0);
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
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
    
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

// ==========================================
// CONCEPT 1: Retro Industrial Console (CRT Screen, switches, indicator bulbs)
// ==========================================
function ConsoleScene({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const panelRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
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
  const velocityRef = useRef(0);
  const { camera } = useThree();

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
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
    const progress = smoothProgressRef.current;

    const speedIndex = progress * 70;
    camera.position.z = -speedIndex * 1.25 + 3.5;
    camera.position.x = Math.sin(speedIndex * 0.11) * 2.2;
    camera.position.y = Math.cos(speedIndex * 0.075) * 0.95;
    
    camera.lookAt(
      Math.sin((speedIndex + 4) * 0.11) * 2.2,
      Math.cos((speedIndex + 4) * 0.075) * 0.95,
      -(speedIndex + 4) * 1.25
    );
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
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const { viewport, pointer } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.0) * 0.85;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
    const progress = smoothProgressRef.current;

    if (modelRef.current) {
      modelRef.current.rotation.y = progress * Math.PI * 2.0;
      modelRef.current.rotation.x = 0.35 + progress * 0.25;
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

      <group position={[0, -0.3, 0]}>
        {/* Draw main frame lines progressively */}
        {drawLimit > 0.15 && (
          <Line points={[[-1.4, 0, 0], [-1.4, 0, 1.2], [1.4, 0, 1.2], [1.4, 0, 0], [-1.4, 0, 0]]} color={blueprintColor} lineWidth={2.5} />
        )}
        
        {/* Laptop Screen Lid open */}
        {drawLimit > 0.45 && (
          <Line points={[[-1.2, 0, 0], [-1.2, 1.2, 0], [1.2, 1.2, 0], [1.2, 0, 0], [-1.2, 0, 0]]} color={blueprintColor} lineWidth={2} rotation={[-0.45, 0, 0]} />
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
  const velocityRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.2) * 0.95;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
    const progress = smoothProgressRef.current;

    if (groupRef.current) {
      groupRef.current.position.y = -progress * 1.5;
      groupRef.current.rotation.y = progress * Math.PI * 0.8;
    }
  });

  const progress = smoothProgressRef.current;
  const textColor = theme === "dark" ? "#ffffff" : "#111111";

  // Scroll speed determines letter disintegration drift (Concept 4 Upgrade)
  const drift = scrollSpeedRef.current * 16.0;

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0.5, -3]}>
      {/* Splitting individual letters to simulate typography coordinate collapse */}
      <group position={[0, 1.2, 0]}>
        <group position={[-0.9 + drift, 0, 0]} rotation={[0, drift * 0.5, 0]}>
          <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">M</Text>
        </group>
        <group position={[-0.3, drift, 0]}>
          <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">O</Text>
        </group>
        <group position={[0.3, -drift, 0]}>
          <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">M</Text>
        </group>
        <group position={[0.9 - drift, 0, 0]} rotation={[0, -drift * 0.5, 0]}>
          <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">I</Text>
        </group>
        <group position={[1.4, 0, -drift * 0.8]}>
          <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">N</Text>
        </group>
      </group>

      <group position={[-0.8, 0, -1]}>
        <Text fontSize={0.55} color="#FF3E00" font="/Fonts/CourierPrime-Regular.ttf">
          DESIGN
        </Text>
      </group>

      <group position={[0.8, -1.2, -2]}>
        <Text fontSize={0.55} color={theme === "dark" ? "#00ffcc" : "#0d9488"} font="/Fonts/CourierPrime-Regular.ttf">
          DEVELOP
        </Text>
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
  const velocityRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.9;

  useFrame((state) => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
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

      {/* Glowing inner crystal core revealed as it opens */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#FF3E00" />
      </mesh>

      {/* Orbital project rings carrying virtual cards (Concept 5 Upgrade) */}
      <group ref={ring1Ref} rotation={[Math.PI / 4, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.3, 0.015, 8, 48]} />
          <meshBasicMaterial color={wireColor} />
        </mesh>
        
        {/* Project Card nodes attached to Ring 1 */}
        <group position={[1.3, 0, 0]}>
          <mesh><boxGeometry args={[0.2, 0.12, 0.02]} /><meshBasicMaterial color="#06b6d4" /></mesh>
          <Text position={[0, 0.15, 0]} fontSize={0.055} color={wireColor}>PREPRESS</Text>
        </group>
        <group position={[-1.3, 0, 0]}>
          <mesh><boxGeometry args={[0.2, 0.12, 0.02]} /><meshBasicMaterial color="#06b6d4" /></mesh>
          <Text position={[0, 0.15, 0]} fontSize={0.055} color={wireColor}>SANDBOX</Text>
        </group>
      </group>
      
      <group ref={ring2Ref} rotation={[-Math.PI / 4, -Math.PI / 5, 0]}>
        <mesh>
          <torusGeometry args={[1.6, 0.015, 8, 48]} />
          <meshBasicMaterial color="#FF3E00" />
        </mesh>
        
        {/* Project Card nodes attached to Ring 2 */}
        <group position={[0, 1.6, 0]}>
          <mesh><boxGeometry args={[0.2, 0.12, 0.02]} /><meshBasicMaterial color="#FF3E00" /></mesh>
          <Text position={[0, 0.15, 0]} fontSize={0.055} color={wireColor}>TACTILE</Text>
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
  const velocityRef = useRef(0);

  useEffect(() => {
    camera.rotation.set(0, 0, 0);
  }, [style]);

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const stiffness = 0.035;
    const damping = 0.22;
    
    const force = (target - current) * stiffness;
    velocityRef.current += force - velocityRef.current * damping;
    smoothProgressRef.current += velocityRef.current;
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
      targetZ = 3.2;
    } else if (style === "blueprint") {
      targetX = progress * 0.3;
      targetY = 0;
      targetZ = 3.5;
    } else if (style === "typography") {
      targetX = 0;
      targetY = -progress * 1.2;
      targetZ = 3.6;
    } else if (style === "hologram") {
      targetX = Math.sin(progress * Math.PI) * 0.4;
      targetY = 0;
      targetZ = 3.4;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + pointer.x * 0.45, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + pointer.y * 0.35, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -pointer.x * 0.08, 0.05);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, pointer.y * 0.08, 0.05);
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
