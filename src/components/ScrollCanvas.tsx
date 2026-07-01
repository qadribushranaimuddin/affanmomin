import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollSpeedRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
}

// Option 5: Helper function to generate a procedural brushed metal texture Bump Map
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
// 1. Origami Box Experience Components
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
            <Line
              points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
              color="#06b6d4"
              lineWidth={1.5}
            />
          </group>
          <group position={[speedSplit * 0.4, -speedSplit * 0.4, 0]}>
            <Line
              points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
              color="#ec4899"
              lineWidth={1.5}
            />
          </group>
          {renderBoxPanels()}
        </>
      ) : (
        <>
          {renderBoxPanels()}
          <Line
            points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
            color={wireframeColor}
            lineWidth={1.5}
          />
        </>
      )}

      {opacity > 0 && (
        <group position={[0, 0, 0.515]}>
          <Text fontSize={0.065} color="#ffffff" anchorX="center" anchorY="middle" transparent opacity={opacity * 0.95}>
            MOMIN // SPEC
          </Text>
        </group>
      )}

      {opacity > 0 && (
        <group position={[0, -0.7, 0.5]}>
          <Line points={[[-0.5, 0, 0], [0.5, 0, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Text position={[0, -0.15, 0]} fontSize={0.06} color={labelColor} anchorX="center" anchorY="middle" transparent opacity={opacity * 0.7}>
            W: 100mm
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
    x: 0,
    y: 0,
    z: 0,
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

    const pts = particlesRef.current;
    const speedMultiplier = 1.0 + scrollSpeedRef.current * 15;
    
    pts.forEach((p, idx) => {
      p.t += p.speed * speedMultiplier;
      if (p.t > Math.PI * 2) p.t = 0;
      
      p.x = -1.4 + (p.t / (Math.PI * 2)) * 2.8;
      p.y = Math.sin(p.t * 3.5) * 0.38 - 0.22;
      p.z = Math.cos(p.t * 2.2) * 0.18;

      const sphereGroup = sphereRefs.current[idx];
      if (sphereGroup) {
        sphereGroup.position.set(p.x, p.y + vibration, p.z);
      }
    });
  });

  const cylinderColor = theme === "dark" ? "#2a2a2a" : "#e0e0e0";
  const paperColor = theme === "dark" ? "#fcfaf2" : "#111111";
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
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[3, 0.01, 1.8]} />
        <meshStandardMaterial color={paperColor} roughness={0.9} />
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

      {opacity > 0 && (
        <mesh position={[0, 0.1, 0.75]}>
          <planeGeometry args={[3.6, 2.2]} />
          <meshPhysicalMaterial transmission={0.88} roughness={0.18} thickness={0.5} ior={1.42} transparent opacity={opacity * 0.38} color={theme === "dark" ? "#111111" : "#ffffff"} />
        </mesh>
      )}
    </group>
  );
}

function VectorNodeFlight({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const { viewport, pointer } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.0) * 0.85;

  const initialPoints = [
    [-2, -2, -10], [0, 2, -6], [2, -1, -8],
    [3, 1, -12], [-1, -3, -15], [0, 0, -4],
    [-2, 2, -7], [2, 2, -5], [-3, -1, -9]
  ] as [number, number, number][];

  const gridPositions = useRef(
    Array.from({ length: 25 }).map((_, i) => {
      const row = Math.floor(i / 5) - 2;
      const col = (i % 5) - 2;
      return new THREE.Vector3(col * 1.5, row * 1.5, -9);
    })
  );

  const compassRefs = useRef<THREE.Group[]>([]);
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
    }

    const speedSplit = Math.min(0.4, scrollSpeedRef.current * 14);
    const targetPointer = new THREE.Vector3(pointer.x * 2.5, pointer.y * 2.5, -6);
    
    offsetsRef.current.forEach((nodePos, idx) => {
      const orig = initialPoints[idx];
      const dist = nodePos.distanceTo(targetPointer);
      
      if (dist < 2.0) {
        const pullDir = new THREE.Vector3().subVectors(targetPointer, nodePos).normalize();
        nodePos.addScaledVector(pullDir, (2.0 - dist) * 0.04);
      }
      
      if (speedSplit > 0.02) {
        const explodeDir = new THREE.Vector3(
          Math.sin(idx * 45) * speedSplit * 1.8,
          Math.cos(idx * 75) * speedSplit * 1.8,
          Math.sin(idx * 90) * speedSplit * 1.8
        );
        nodePos.add(explodeDir);
      }

      const homeDir = new THREE.Vector3(...orig).sub(nodePos);
      nodePos.addScaledVector(homeDir, 0.05);
    });

    gridPositions.current.forEach((pos, idx) => {
      const compassGroup = compassRefs.current[idx];
      if (compassGroup) {
        const pointerPos = new THREE.Vector3(pointer.x * 3, pointer.y * 3, -9);
        const dx = pointerPos.x - pos.x;
        const dy = pointerPos.y - pos.y;
        compassGroup.rotation.z = THREE.MathUtils.lerp(compassGroup.rotation.z, Math.atan2(dy, dx), 0.08);
      }
    });
  });

  const speedSplit = Math.min(0.35, scrollSpeedRef.current * 12);
  const lineColor = theme === "dark" ? "#555555" : "#bbbbbb";
  const labelColor = theme === "dark" ? "#737373" : "#666666";
  const opacity = smoothProgressRef.current >= 0.46 && smoothProgressRef.current <= 0.84 ? 1 : 0;

  const renderGridLines = (colorOverride?: string) => (
    <>
      {initialPoints.map((_, i) => {
        const nextIdx = (i + 1) % initialPoints.length;
        const currentPos = offsetsRef.current[i];
        const nextPos = offsetsRef.current[nextIdx];
        return (
          <Line key={i} points={[[currentPos.x, currentPos.y, currentPos.z], [nextPos.x, nextPos.y, nextPos.z]]} color={colorOverride || lineColor} lineWidth={1} transparent opacity={opacity * 0.8} />
        );
      })}
    </>
  );

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={[scale, scale, scale]}>
      {opacity > 0 && (
        <group>
          {gridPositions.current.map((pos, idx) => (
            <group key={`grid-needle-${idx}`} position={[pos.x, pos.y, pos.z]} ref={(el) => { if (el) compassRefs.current[idx] = el; }}>
              <Line points={[[-0.15, 0, 0], [0.15, 0, 0]]} color={lineColor} lineWidth={1.2} transparent opacity={opacity * 0.25} />
              <Line points={[[0, -0.15, 0], [0, 0.15, 0]]} color={lineColor} lineWidth={1.2} transparent opacity={opacity * 0.25} />
            </group>
          ))}
        </group>
      )}

      <group>
        {speedSplit > 0.005 ? (
          <>
            <group position={[-speedSplit * 0.3, speedSplit * 0.3, 0]}>
              {renderGridLines("#06b6d4")}
            </group>
            <group position={[speedSplit * 0.3, -speedSplit * 0.3, 0]}>
              {renderGridLines("#ec4899")}
            </group>
            {renderGridLines()}
          </>
        ) : (
          renderGridLines()
        )}

        {initialPoints.map((_, i) => {
          const currentPos = offsetsRef.current[i];
          return (
            <group key={`node-${i}`}>
              <mesh position={[currentPos.x, currentPos.y, currentPos.z]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshBasicMaterial color="#FF3E00" />
              </mesh>
              {opacity > 0 && i % 3 === 0 && (
                <Text position={[currentPos.x + 0.28, currentPos.y + 0.1, currentPos.z]} fontSize={0.075} color={labelColor} anchorX="left" anchorY="bottom" transparent opacity={opacity * 0.6}>
                  {`P${i}:(${currentPos.x.toFixed(1)},${currentPos.y.toFixed(1)})`}
                </Text>
              )}
            </group>
          );
        })}
      </group>
      <Stars radius={100} depth={50} count={300} factor={4} saturation={theme === "dark" ? 0 : 0.5} fade speed={1} />
    </group>
  );
}

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
      const opacity = progress >= 0.70 ? (progress < 0.76 ? (progress - 0.70) / 0.06 : 1) : 0;
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
      <group scale={[0.8, 0.8, 0.8]}>
        <group position={[-splitAmount * 0.3, splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#06b6d4" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#06b6d4" lineWidth={2} />
        </group>
        <group position={[splitAmount * 0.3, -splitAmount * 0.3, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#ec4899" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#ec4899" lineWidth={2} />
        </group>
        <group position={[-splitAmount * 0.2, -splitAmount * 0.2, 0]}>
          <Line points={[[-0.6, 0, 0], [0.6, 0, 0]]} color="#eab308" lineWidth={2} />
          <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="#eab308" lineWidth={2} />
        </group>
        
        <mesh>
          <ringGeometry args={[0.3, 0.33, 32]} />
          <meshBasicMaterial color={ringColor} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.45, 0.47, 32]} />
          <meshBasicMaterial color={ringColor} />
        </mesh>

        {opacity > 0 && (
          <group position={[0.7, 0, 0]}>
            <Text position={[0, 0.15, 0]} fontSize={0.065} color="#FF3E00" anchorX="left" anchorY="middle" transparent opacity={opacity * 0.8}>
              // PLATE_ALIGN
            </Text>
            <Text position={[0, -0.05, 0]} fontSize={0.075} color={ringColor} anchorX="left" anchorY="middle" transparent opacity={opacity * 0.9}>
              {`ACCURACY: ${accuracy}%`}
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}

// ==========================================
// 2. Industrial Console Experience
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
      // Rotate panel slightly with scroll and hover jitter
      panelRef.current.rotation.x = 0.2 + progress * 0.3;
      panelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      panelRef.current.position.y = -progress * 0.5;
    }
  });

  const progress = smoothProgressRef.current;
  const strokeColor = theme === "dark" ? "#00ff66" : "#059669"; // oscilliscope green
  const labelColor = theme === "dark" ? "#888888" : "#444444";
  
  // Waveform coordinates
  const wavePoints = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const x = -2.2 + (i / 45) * 4.4;
      return new THREE.Vector3(x, 0, 0);
    });
  }, []);

  // Update waveform curve points based on scroll speed and clock oscillation
  useFrame((state) => {
    wavePoints.forEach((pt, i) => {
      const freq = 4.5 + scrollSpeedRef.current * 15;
      pt.y = Math.sin(pt.x * freq + state.clock.elapsedTime * 8) * 0.35 * (1.2 - Math.abs(pt.x) / 2.2);
    });
  });

  return (
    <group ref={panelRef} position={[0, 0, -2.5]}>
      {/* Console frame grid */}
      <Line
        points={[[-2.5, -1.8, 0], [2.5, -1.8, 0], [2.5, 1.8, 0], [-2.5, 1.8, 0], [-2.5, -1.8, 0]]}
        color={theme === "dark" ? "#333333" : "#cccccc"}
        lineWidth={2}
      />
      
      {/* Waveform line plot */}
      <Line points={wavePoints} color={strokeColor} lineWidth={2.5} />
      
      {/* Telemetry textual indicators */}
      <Text position={[-2.2, 1.4, 0]} fontSize={0.08} color={strokeColor} anchorX="left">
        {`PRESS_SYS_STATUS: RUNNING`}
      </Text>
      <Text position={[-2.2, 1.25, 0]} fontSize={0.065} color={labelColor} anchorX="left">
        {`VOLTAGE: 240.2V // FREQ: 50.04Hz`}
      </Text>
      <Text position={[2.2, 1.4, 0]} fontSize={0.08} color={strokeColor} anchorX="right">
        {`IPH: ${(progress * 15000 + 4000).toFixed(0)}`}
      </Text>

      {/* Rotating control dials */}
      <group position={[-1.5, -1.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
          <meshStandardMaterial color={theme === "dark" ? "#1a1a1a" : "#dddddd"} metalness={0.9} roughness={0.1} />
        </mesh>
        <Line points={[[0, 0.06, 0], [0, 0.06, -0.2]]} color="#FF3E00" lineWidth={3} rotation={[0, progress * Math.PI * 4, 0]} />
        <Text position={[0, -0.38, 0]} fontSize={0.05} color={labelColor}>FEED_RATE</Text>
      </group>

      <group position={[1.5, -1.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
          <meshStandardMaterial color={theme === "dark" ? "#1a1a1a" : "#dddddd"} metalness={0.9} roughness={0.1} />
        </mesh>
        <Line points={[[0, 0.06, 0], [0, 0.06, -0.2]]} color="#FF3E00" lineWidth={3} rotation={[0, -progress * Math.PI * 3.2, 0]} />
        <Text position={[0, -0.38, 0]} fontSize={0.05} color={labelColor}>TENSION</Text>
      </group>
    </group>
  );
}

// ==========================================
// 3. Infinite Spline Highway Experience
// ==========================================
function SplineHighwayScene({ scrollProgressRef, theme }: SceneProps) {
  const roadRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const { camera } = useThree();

  const splinePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 80; i++) {
      const z = -i * 1.2;
      const x = Math.sin(i * 0.12) * 2.0;
      const y = Math.cos(i * 0.08) * 0.9;
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

    // Direct camera movement down the spline track
    const speedIndex = progress * 60;
    camera.position.z = -speedIndex * 1.2 + 3.5;
    camera.position.x = Math.sin(speedIndex * 0.12) * 2.0;
    camera.position.y = Math.cos(speedIndex * 0.08) * 0.9;
    
    // Point camera slightly forward down the curves
    camera.lookAt(
      Math.sin((speedIndex + 5) * 0.12) * 2.0,
      Math.cos((speedIndex + 5) * 0.08) * 0.9,
      -(speedIndex + 5) * 1.2
    );
  });

  const lineColor = theme === "dark" ? "#00ffff" : "#0284c7";

  return (
    <group ref={roadRef}>
      {/* 3 Parallel neon lines mapping a highway */}
      <Line points={splinePoints} color={lineColor} lineWidth={3} />
      <Line points={splinePoints.map(p => new THREE.Vector3(p.x - 0.6, p.y - 0.2, p.z))} color="#FF3E00" lineWidth={1.5} />
      <Line points={splinePoints.map(p => new THREE.Vector3(p.x + 0.6, p.y - 0.2, p.z))} color="#FF3E00" lineWidth={1.5} />
      
      {/* Neon glowing square gates to fly through */}
      {Array.from({ length: 12 }).map((_, i) => {
        const step = i * 6;
        if (step >= splinePoints.length) return null;
        const pt = splinePoints[step];
        return (
          <group key={i} position={[pt.x, pt.y, pt.z]}>
            <Line
              points={[[-1.2, -0.8, 0], [1.2, -0.8, 0], [1.2, 0.8, 0], [-1.2, 0.8, 0], [-1.2, -0.8, 0]]}
              color={theme === "dark" ? "#ffffff" : "#222222"}
              lineWidth={1}
              transparent
              opacity={0.35}
            />
          </group>
        );
      })}
    </group>
  );
}

// ==========================================
// 4. CAD Blueprint Experience
// ==========================================
function BlueprintScene({ scrollProgressRef, theme }: SceneProps) {
  const modelRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const { viewport } = useThree();
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
      modelRef.current.rotation.x = 0.4 + progress * 0.3;
    }
  });

  const blueprintColor = theme === "dark" ? "#0066ff" : "#1d4ed8";
  const gridColor = theme === "dark" ? "#1a1a2e" : "#e0e7ff";

  return (
    <group ref={modelRef} scale={[scale, scale, scale]} position={[0, 0, -2.5]}>
      {/* Background blueprint grid lines */}
      <gridHelper args={[8, 16, blueprintColor, gridColor]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]} />

      {/* Wireframe blueprint CAD models (e.g. detailed technical laptop) */}
      <group position={[0, -0.4, 0]}>
        {/* Laptop Screen Lid */}
        <Line points={[[-1.2, 0, 0], [-1.2, 1.2, 0], [1.2, 1.2, 0], [1.2, 0, 0], [-1.2, 0, 0]]} color={blueprintColor} lineWidth={2} rotation={[-0.4, 0, 0]} />
        <Line points={[[-1.0, 0.1, 0.01], [-1.0, 1.1, 0.01], [1.0, 1.1, 0.01], [1.0, 0.1, 0.01], [-1.0, 0.1, 0.01]]} color={blueprintColor} lineWidth={1} rotation={[-0.4, 0, 0]} />
        
        {/* Base Body */}
        <Line points={[[-1.4, 0, 0], [-1.4, 0, 1.2], [1.4, 0, 1.2], [1.4, 0, 0], [-1.4, 0, 0]]} color={blueprintColor} lineWidth={2.5} />
        {/* Keyboard layout lines */}
        <Line points={[[-1.1, 0.01, 0.3], [1.1, 0.01, 0.3]]} color={blueprintColor} lineWidth={1.2} />
        <Line points={[[-1.1, 0.01, 0.5], [1.1, 0.01, 0.5]]} color={blueprintColor} lineWidth={1.2} />
        <Line points={[[-1.1, 0.01, 0.7], [1.1, 0.01, 0.7]]} color={blueprintColor} lineWidth={1.2} />
        <Line points={[[-1.1, 0.01, 0.9], [1.1, 0.01, 0.9]]} color={blueprintColor} lineWidth={1.2} />
        
        {/* Technical CAD labels */}
        <Text position={[1.7, 0.5, 0]} fontSize={0.06} color={blueprintColor} anchorX="left">
          {`LID_OPEN: 112.5*`}
        </Text>
        <Text position={[1.7, 0.3, 0]} fontSize={0.06} color={blueprintColor} anchorX="left">
          {`WIDTH: 320mm`}
        </Text>
      </group>
    </group>
  );
}

// ==========================================
// 5. Typography Sculpture Experience
// ==========================================
function TypographyScene({ scrollProgressRef, theme }: SceneProps) {
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

  const textColor = theme === "dark" ? "#ffffff" : "#111111";

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0.5, -3]}>
      {/* 3D Floating Word matrix layout */}
      <group position={[0, 1.2, 0]}>
        <Text fontSize={0.65} color={textColor} font="/Fonts/CourierPrime-Regular.ttf">
          MOMIN
        </Text>
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
// 6. Hologram Core Experience
// ==========================================
function HologramScene({ scrollProgressRef, theme }: SceneProps) {
  const prismRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 4.8) * 0.9;

  useFrame(() => {
    const target = scrollProgressRef.current;
    const current = smoothProgressRef.current;
    const force = (target - current) * 0.035;
    velocityRef.current += force - velocityRef.current * 0.22;
    smoothProgressRef.current += velocityRef.current;
    const progress = smoothProgressRef.current;

    if (prismRef.current) {
      prismRef.current.rotation.y = progress * Math.PI * 4;
      prismRef.current.rotation.x = progress * Math.PI * 1.5;
    }
    
    if (groupRef.current) {
      groupRef.current.position.y = -progress * 0.6;
    }
  });

  const glassColor = theme === "dark" ? "#06b6d4" : "#0891b2";
  const wireColor = theme === "dark" ? "#ffffff" : "#1a1a1a";

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, -2.5]}>
      {/* Central physical translucent transmission octahedron core */}
      <mesh ref={prismRef} castShadow receiveShadow>
        <octahedronGeometry args={[0.7]} />
        <meshPhysicalMaterial
          transmission={0.92}
          roughness={0.08}
          thickness={1.4}
          ior={1.62}
          transparent
          opacity={0.4}
          color={glassColor}
        />
      </mesh>

      {/* Floating vector wireframe rings orbiting the prism core */}
      <group rotation={[Math.PI / 4, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.2, 0.015, 8, 48]} />
          <meshBasicMaterial color={wireColor} />
        </mesh>
      </group>
      
      <group rotation={[-Math.PI / 4, -Math.PI / 5, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.015, 8, 48]} />
          <meshBasicMaterial color="#FF3E00" />
        </mesh>
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

  // Ensure camera rotations reset safely when switching styles
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

    // Calculate baseline coordinate paths based on active style
    let targetX = 0;
    let targetY = 0;
    let targetZ = 3.5;

    // Skip CameraDirector updates if inside Highway scene (as camera position is driven by spline coordinates)
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

    // Combine scroll paths with pointer Gyroscopic Parallax (Option 1)
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
        {/* Frame update hook to keep scroll ref & speed synchronized */}
        <FrameScrollTracker scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} />

        {/* Adapt ambient and fill lights to theme */}
        <ambientLight intensity={theme === "dark" ? 0.25 : 0.65} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, -2]} intensity={1.5} color="#FF3E00" />
        
        {/* Interactive Pointer-following Studio Spotlight */}
        <DynamicStudioSpotlight />
        
        <CameraDirector scrollProgressRef={scrollProgressRef} style={style} />
        
        {/* Multi-Experience Style-conditioned Mesh Rendering */}
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

// Separate helper component to perform frame-rate synced scroll and speed reading
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
