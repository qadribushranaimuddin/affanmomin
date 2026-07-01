import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollSpeedRef: React.MutableRefObject<number>;
  theme: "dark" | "light";
}

// Option 5: Helper function to generate a procedural brushed metal texture Normal/Bump Map
function createBrushedMetalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Fill neutral gray
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    
    // Draw horizontal micro-scratches
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

// Sub-Component 1: Folding Origami Box (Concept 1)
function OrigamiBox({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Spring dynamics refs
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

  // Speed-based split factor for 3D CMYK Plate Separation (Option 1)
  const speedSplit = Math.min(0.35, scrollSpeedRef.current * 12);

  const materialColor = "#FF3E00";
  const wireframeColor = theme === "dark" ? "#ffffff" : "#1a1a1a";
  const labelColor = theme === "dark" ? "#888888" : "#555555";
  const opacity = progress < 0.32 ? 1 : Math.max(0, 1 - (progress - 0.32) / 0.08);

  const renderBoxPanels = () => (
    <>
      <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.02]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <group position={[-0.5, 0, 0]} rotation={[0, -angle, 0]}>
        <mesh position={[-0.5, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshPhysicalMaterial color={materialColor} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      <group position={[0.5, 0, 0]} rotation={[0, angle, 0]}>
        <mesh position={[0.5, 0, 0]} castShadow receiveShadow>
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
              transparent
              opacity={opacity * 0.7}
            />
          </group>
          <group position={[speedSplit * 0.4, -speedSplit * 0.4, 0]}>
            <Line
              points={[[-0.5, -0.5, 0], [-0.5, 0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [-0.5, -0.5, 0]]}
              color="#ec4899"
              lineWidth={1.5}
              transparent
              opacity={opacity * 0.7}
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
        <group position={[0, 0, -0.515]} rotation={[0, Math.PI, 0]}>
          <Text fontSize={0.065} color="#ffffff" anchorX="center" anchorY="middle" transparent opacity={opacity * 0.95}>
            TRIM_LINE_OK
          </Text>
        </group>
      )}

      {opacity > 0 && (
        <group position={[0, -0.7, 0.5]}>
          <Line points={[[-0.5, 0, 0], [0.5, 0, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.5, 0.05, 0], [-0.5, -0.05, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[0.5, 0.05, 0], [0.5, -0.05, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Text position={[0, -0.15, 0]} fontSize={0.06} color={labelColor} anchorX="center" anchorY="middle" transparent opacity={opacity * 0.7}>
            W: 100mm
          </Text>
        </group>
      )}

      {opacity > 0 && (
        <group position={[0.7, 0, 0.5]}>
          <Line points={[[0, -0.5, 0], [0, 0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.05, -0.5, 0], [0.05, -0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Line points={[[-0.05, 0.5, 0], [0.05, 0.5, 0]]} color={wireframeColor} lineWidth={1} transparent opacity={opacity * 0.4} />
          <Text position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]} fontSize={0.06} color={labelColor} anchorX="center" anchorY="middle" transparent opacity={opacity * 0.7}>
            H: 100mm
          </Text>
        </group>
      )}
    </group>
  );
}

// Sub-Component 2: Offset Press Roller & Ribbon (Concept 2)
function PressroomRollers({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const rollerGroupRef = useRef<THREE.Group>(null);
  const sphereGroupRef = useRef<THREE.Group>(null);
  
  const smoothProgressRef = useRef(0);
  const velocityRef = useRef(0);
  
  const { viewport } = useThree();
  const scale = Math.min(1.0, viewport.width / 5.2) * 0.8;

  // Generate Canvas texture normal map once (Option 5)
  const metalBumpTexture = useMemo(() => createBrushedMetalTexture(), []);

  // Continuous Fluid Ink Particle Ribbon (Option 3)
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
      {/* Option 5: Metal Cylinders with Procedural Brushed Normal Texture */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial
          color={cylinderColor}
          roughness={0.2}
          metalness={0.95}
          bumpMap={metalBumpTexture}
          bumpScale={0.015}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
        <meshStandardMaterial
          color={cylinderColor}
          roughness={0.2}
          metalness={0.95}
          bumpMap={metalBumpTexture}
          bumpScale={0.015}
        />
      </mesh>

      {/* Cyan Ink Roller Highlight */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, -0.5]}>
        <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
        <meshPhysicalMaterial color="#06b6d4" roughness={0.1} metalness={0.2} />
      </mesh>
      
      {/* Paper ribbon weaving between rollers */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[3, 0.01, 1.8]} />
        <meshStandardMaterial color={paperColor} roughness={0.9} />
      </mesh>

      {/* Flowing liquid ink stream overlay */}
      {opacity > 0 && (
        <group ref={sphereGroupRef}>
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

      {/* Option 3: Frosted Glass Refraction Sheet overlay */}
      {opacity > 0 && (
        <mesh position={[0, 0.1, 0.75]}>
          <planeGeometry args={[3.6, 2.2]} />
          <meshPhysicalMaterial
            transmission={0.88}
            roughness={0.18}
            thickness={0.5}
            ior={1.42}
            transparent
            opacity={opacity * 0.38}
            color={theme === "dark" ? "#111111" : "#ffffff"}
          />
        </mesh>
      )}
    </group>
  );
}

// Sub-Component 3: Brutalist Vector Node Flight (Concept 3)
function VectorNodeFlight({ scrollProgressRef, scrollSpeedRef, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const magneticGridRef = useRef<THREE.Group>(null);
  
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

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    }

    // Speed-based split and disintegration factor (Option 4)
    const speedSplit = Math.min(0.4, scrollSpeedRef.current * 14);

    // Dynamic mouse attraction warping physics
    const targetPointer = new THREE.Vector3(pointer.x * 2.5, pointer.y * 2.5, -6);
    offsetsRef.current.forEach((nodePos, idx) => {
      const orig = initialPoints[idx];
      const dist = nodePos.distanceTo(targetPointer);
      
      if (dist < 2.0) {
        const pullDir = new THREE.Vector3().subVectors(targetPointer, nodePos).normalize();
        const pullStrength = (2.0 - dist) * 0.04;
        nodePos.addScaledVector(pullDir, pullStrength);
      }
      
      // Option 4: Disintegrate (explode coordinates) based on scroll speed
      if (speedSplit > 0.02) {
        const explodeDir = new THREE.Vector3(
          Math.sin(idx * 45) * speedSplit * 1.8,
          Math.cos(idx * 75) * speedSplit * 1.8,
          Math.sin(idx * 90) * speedSplit * 1.8
        );
        nodePos.add(explodeDir);
      }

      const homeDir = new THREE.Vector3(...orig).sub(nodePos);
      nodePos.addScaledVector(homeDir, 0.05); // Snap back slowly when static
    });

    // Magnetic backing needle grid rotation to face pointer coordinates
    gridPositions.current.forEach((pos, idx) => {
      const compassGroup = compassRefs.current[idx];
      if (compassGroup) {
        const pointerPos = new THREE.Vector3(pointer.x * 3, pointer.y * 3, -9);
        const dx = pointerPos.x - pos.x;
        const dy = pointerPos.y - pos.y;
        const angle = Math.atan2(dy, dx);
        
        compassGroup.rotation.z = THREE.MathUtils.lerp(compassGroup.rotation.z, angle, 0.08);
      }
    });
  });

  const speedSplit = Math.min(0.35, scrollSpeedRef.current * 12);

  const lineColor = theme === "dark" ? "#555555" : "#bbbbbb";
  const labelColor = theme === "dark" ? "#737373" : "#666666";
  const particleSaturation = theme === "dark" ? 0 : 0.5;
  const opacity = smoothProgressRef.current >= 0.46 && smoothProgressRef.current <= 0.84 ? 1 : 0;

  const renderGridLines = (colorOverride?: string) => (
    <>
      {initialPoints.map((_, i) => {
        const nextIdx = (i + 1) % initialPoints.length;
        const currentPos = offsetsRef.current[i];
        const nextPos = offsetsRef.current[nextIdx];
        
        return (
          <Line
            key={i}
            points={[[currentPos.x, currentPos.y, currentPos.z], [nextPos.x, nextPos.y, nextPos.z]]}
            color={colorOverride || lineColor}
            lineWidth={1}
            transparent
            opacity={opacity * 0.8}
          />
        );
      })}
    </>
  );

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={[scale, scale, scale]}>
      {/* Magnetic Backing Field Plus Mark Grid */}
      {opacity > 0 && (
        <group ref={magneticGridRef}>
          {gridPositions.current.map((pos, idx) => (
            <group
              key={`grid-needle-${idx}`}
              position={[pos.x, pos.y, pos.z]}
              ref={(el) => { if (el) compassRefs.current[idx] = el; }}
            >
              <Line points={[[-0.15, 0, 0], [0.15, 0, 0]]} color={lineColor} lineWidth={1.2} transparent opacity={opacity * 0.25} />
              <Line points={[[0, -0.15, 0], [0, 0.15, 0]]} color={lineColor} lineWidth={1.2} transparent opacity={opacity * 0.25} />
            </group>
          ))}
        </group>
      )}

      {/* Grid Anchor Lines with Speed-based CMYK splits (Option 1) */}
      <group ref={nodesRef}>
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

        {/* Nodes and coordinates readouts */}
        {initialPoints.map((_, i) => {
          const currentPos = offsetsRef.current[i];
          return (
            <group key={`node-${i}`}>
              <mesh position={[currentPos.x, currentPos.y, currentPos.z]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshBasicMaterial color="#FF3E00" />
              </mesh>
              
              {opacity > 0 && i % 3 === 0 && (
                <Text
                  position={[currentPos.x + 0.28, currentPos.y + 0.1, currentPos.z]}
                  fontSize={0.075}
                  color={labelColor}
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

// Scene Director Canvas Camera controls with Gyroscopic Mouse Parallax (Option 1)
function CameraDirector({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  
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

    // Base target coordinates based on scroll section
    let targetX = 0;
    let targetY = 0;

    if (progress < 0.25) {
      targetX = 0;
      targetY = 0;
    } else if (progress < 0.50) {
      targetX = 0.5;
      targetY = 0.2;
    } else if (progress < 0.75) {
      targetX = -0.4;
      targetY = -0.3;
    } else {
      targetX = 0;
      targetY = 0;
    }

    // Option 1: Combine base target coordinate with pointer-guided Gyroscopic Parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + pointer.x * 0.45, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + pointer.y * 0.35, 0.05);
    
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

export default function ScrollCanvas({ theme }: { theme: "dark" | "light" }) {
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
        <ambientLight intensity={theme === "dark" ? 0.2 : 0.6} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, -2]} intensity={1.5} color="#FF3E00" />
        
        {/* Interactive Pointer-following Studio Spotlight */}
        <DynamicStudioSpotlight />
        
        <CameraDirector scrollProgressRef={scrollProgressRef} />
        
        {/* Immersive Scroll Scenes */}
        <OrigamiBox scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        <PressroomRollers scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        <VectorNodeFlight scrollProgressRef={scrollProgressRef} scrollSpeedRef={scrollSpeedRef} theme={theme} />
        <CMYKRegistrationScene scrollProgressRef={scrollProgressRef} theme={theme} />
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

      // Calculate instantaneous scroll speed for chromatic split amplitude
      const deltaScroll = Math.abs(currentScrollY - lastScrollYRef.current);
      const instantSpeed = docHeight > 0 ? deltaScroll / docHeight : 0;
      scrollSpeedRef.current = THREE.MathUtils.lerp(scrollSpeedRef.current, instantSpeed, 0.1);
      
      lastScrollYRef.current = currentScrollY;
    }
  });
  return null;
}
