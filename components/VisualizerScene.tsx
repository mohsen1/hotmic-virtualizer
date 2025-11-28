import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerConfig } from '../types';

interface SceneProps {
  config: VisualizerConfig;
  frequencyHistoryRef: React.MutableRefObject<Uint8Array[]>;
}

const NUM_POINTS = 128; 
const ANGLE_STEP = (Math.PI * 2) / NUM_POINTS;

// Vertex Shader: Standard position, passes UV
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader: Soft radial gradient
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  
  void main() {
    // Distance from center (0.5, 0.5)
    float d = distance(vUv, vec2(0.5));
    
    // Radial fade: 1.0 at center, 0.0 at edge (0.5)
    // Smoothstep creates a nice soft falloff
    float alpha = smoothstep(0.5, 0.0, d);
    
    // Optional: Power function to make the core hotter and edges softer
    alpha = pow(alpha, 1.5);
    
    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;

interface RingProps {
  index: number;
  config: VisualizerConfig;
  historyRef: React.MutableRefObject<Uint8Array[]>;
}

const Ring: React.FC<RingProps> = ({ 
  index, 
  config, 
  historyRef 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create geometries once. 
  const meshGeo = useMemo(() => {
    // --- Mesh Geometry (Fan) ---
    const geo = new THREE.BufferGeometry();
    // (NUM_POINTS + 1) vertices: Index 0 is center, 1..NUM_POINTS are perimeter
    const pos = new Float32Array((NUM_POINTS + 1) * 3);
    const uvs = new Float32Array((NUM_POINTS + 1) * 2);
    
    // Center Vertex (Index 0)
    pos[0] = 0; pos[1] = 0; pos[2] = 0;
    uvs[0] = 0.5; uvs[1] = 0.5;

    // Perimeter Vertices (Index 1..NUM_POINTS)
    // We init them in a circle for UV calculation, though position changes every frame
    for (let i = 0; i < NUM_POINTS; i++) {
        const theta = i * ANGLE_STEP;
        // UVs map the circle to [0..1] range
        uvs[(i + 1) * 2] = 0.5 + 0.5 * Math.cos(theta);
        uvs[(i + 1) * 2 + 1] = 0.5 + 0.5 * Math.sin(theta);
    }
    
    // Indices for triangle fan: [0, 1, 2], [0, 2, 3], ... [0, NUM_POINTS, 1]
    const indices = [];
    for (let i = 1; i <= NUM_POINTS; i++) {
        const next = i === NUM_POINTS ? 1 : i + 1;
        indices.push(0, i, next);
    }
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geo;
  }, []);

  // Calculate specific color for this ring
  const ringColor = useMemo(() => {
    const c = new THREE.Color(config.baseColor);
    // Subtle lightness shift for outer rings (less vibrant)
    // But primary "fading" will happen via Opacity now
    c.offsetHSL(0, 0, -0.01 * index); 
    return c;
  }, [config.baseColor, index]);

  // Material Uniforms
  const uniforms = useMemo(() => ({
      uColor: { value: ringColor },
      uOpacity: { value: 0.5 }
  }), [ringColor]);

  // Update uniform color if config changes
  useEffect(() => {
      if (meshRef.current) {
          const mat = meshRef.current.material as THREE.ShaderMaterial;
          mat.uniforms.uColor.value.copy(ringColor);
      }
  }, [ringColor]);

  useFrame(() => {
    if (!historyRef.current[index]) return;

    // We need to update geometry
    const positions = meshRef.current?.geometry.attributes.position.array as Float32Array;
    if (!positions) return;

    const freqData = historyRef.current[index]; 
    const dataLen = freqData.length;
    const effectiveSlice = Math.floor(dataLen * 0.25); // 0-5kHz focus
    
    const radius = config.baseRadius + (index * config.ringSpacing);
    
    // Decay Factor: 1.0 (inner) -> 0.0 (outer)
    // We div by (count - 1) to ensure the VERY LAST ring is exactly 0
    const maxIndex = Math.max(1, config.ringCount - 1);
    const decay = 1 - (index / maxIndex); 
    const currentSensitivity = config.sensitivity * decay;

    // Update Center Point of Mesh (Index 0)
    // Keep at center, Z-index moves back
    const zPos = index * -0.05; 
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = zPos;

    // Loop through perimeter points
    for (let i = 0; i < NUM_POINTS; i++) {
      const normalizedAngle = i / NUM_POINTS; 
      const mirror = 1 - Math.abs((normalizedAngle * 2) - 1);
      const dataIndex = Math.floor(mirror * effectiveSlice);
      
      let rawVal = freqData[Math.min(dataIndex, dataLen - 1)] || 0;
      
      // --- NOISE GATE ---
      const noiseThreshold = 30;
      let val = Math.max(0, rawVal - noiseThreshold);

      const idleBreathing = Math.sin((Date.now() / 1500) + i * 0.1) * (0.005 * config.baseRadius);
      const displacement = (val / 255) * config.waveAmplitude * currentSensitivity;
      const r = radius + displacement + idleBreathing;

      const theta = i * ANGLE_STEP;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;

      // Update Perimeter vertices (index i + 1)
      positions[(i + 1) * 3] = x;
      positions[(i + 1) * 3 + 1] = y;
      positions[(i + 1) * 3 + 2] = zPos;
    }

    if (meshRef.current) meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Dynamic Opacity
    const bassEnergy = Math.max(0, freqData[0] - 30) / 225;
    
    // Opacity Curve: 
    // Start high, stay high for a bit, then drop to zero.
    // pow(decay, 1.2) gives a slightly convex curve (lasts longer then drops)
    const opacityBase = Math.pow(decay, 1.2); 
    
    if (meshRef.current) {
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        // Inner rings: Base 0.5 + Energy boost up to 1.0
        // Outer rings: Multiplied by near-zero decay
        mat.uniforms.uOpacity.value = (0.5 + (bassEnergy * 0.5)) * opacityBase;
    }
  });

  return (
    <mesh ref={meshRef} geometry={meshGeo}>
        <shaderMaterial 
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent={true}
            depthTest={false} // Important for smooth layering
            side={THREE.DoubleSide}
        />
    </mesh>
  );
};

export const VisualizerScene: React.FC<SceneProps> = ({ config, frequencyHistoryRef }) => {
  return (
    <>
      {Array.from({ length: config.ringCount }).map((_, i) => (
        <Ring 
          key={i} 
          index={i} 
          config={config} 
          historyRef={frequencyHistoryRef} 
        />
      ))}
    </>
  );
};