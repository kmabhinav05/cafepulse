import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CoffeeCupScene({ beverageType = 'tea' }) {
  const groupRef = useRef();
  const innerLiquidsRef = useRef();
  const iceRef1 = useRef();
  const iceRef2 = useRef();
  const mintRef = useRef();
  const teaLeavesRef = useRef();
  const caramelRef = useRef();

  const isTea = beverageType === 'tea';

  // Morph progress: 1 for Tea, 0 for Coffee
  const morphProgress = useRef(isTea ? 1 : 0);

  // Material references for smooth transition
  const espressoMatRef = useRef();
  const milkMatRef = useRef();
  const foamMatRef = useRef();
  const teaMatRef = useRef();
  const caramelMatRef = useRef();

  // 3D Helical curve for coffee caramel swirl
  const caramelGeometry = useMemo(() => {
    const points = [];
    const turns = 1.5;
    const count = 50;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns - Math.PI * 0.4;
      const radius = 0.63 + t * 0.02;
      const y = -0.2 + t * 0.52;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 40, 0.02, 10, false);
  }, []);

  // Drifting tea leaves inside amber liquid
  const teaLeaves = useMemo(() => {
    const count = 10;
    const leaves = [];
    for (let i = 0; i < count; i++) {
      leaves.push({
        pos: [
          (Math.random() - 0.5) * 0.45,
          -0.4 + Math.random() * 0.85,
          (Math.random() - 0.5) * 0.45,
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.025 + Math.random() * 0.018,
      });
    }
    return leaves;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth transition between Coffee (0) and Tea (1)
    const target = isTea ? 1 : 0;
    morphProgress.current = THREE.MathUtils.damp(
      morphProgress.current,
      target,
      4.8,
      delta
    );
    const p = morphProgress.current;

    // Gentle floating oscillation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.04;
    }

    // Ice cubes gentle bobbing
    if (iceRef1.current) {
      iceRef1.current.position.y = 0.64 + Math.sin(t * 2.1) * 0.018;
      iceRef1.current.rotation.x = Math.sin(t * 1.2) * 0.08;
      iceRef1.current.rotation.z = 0.2 + Math.cos(t * 0.9) * 0.06;
    }
    if (iceRef2.current) {
      iceRef2.current.position.y = 0.66 + Math.cos(t * 1.8) * 0.016;
      iceRef2.current.rotation.y = -0.25 + Math.sin(t * 0.8) * 0.08;
    }

    // Mint leaf gentle breathing movement
    if (mintRef.current) {
      mintRef.current.rotation.z = 0.28 + Math.sin(t * 1.6) * 0.025;
      mintRef.current.rotation.x = 0.15 + Math.cos(t * 1.4) * 0.02;
    }

    // Material transitions
    if (caramelRef.current) {
      const scale = THREE.MathUtils.lerp(1.0, 0.001, p);
      caramelRef.current.scale.set(scale, scale, scale);
      caramelRef.current.visible = p < 0.98;
    }

    if (espressoMatRef.current && milkMatRef.current && foamMatRef.current && teaMatRef.current) {
      const coffeeOpacity = THREE.MathUtils.lerp(1.0, 0.0, p);
      const teaOpacity = THREE.MathUtils.lerp(0.0, 0.95, p);

      espressoMatRef.current.opacity = coffeeOpacity;
      espressoMatRef.current.transparent = coffeeOpacity < 0.99;

      milkMatRef.current.opacity = coffeeOpacity;
      milkMatRef.current.transparent = coffeeOpacity < 0.99;

      foamMatRef.current.opacity = THREE.MathUtils.lerp(0.98, 0.25, p);

      teaMatRef.current.opacity = teaOpacity;
      teaMatRef.current.visible = p > 0.01;
    }

    if (teaLeavesRef.current) {
      teaLeavesRef.current.rotation.y = t * 0.12;
      teaLeavesRef.current.visible = p > 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.06, 0]} scale={[0.88, 0.88, 0.88]}>
      {/* ================================================================= */}
      {/* 1. COMPACT REALISTIC GLASS TUMBLER (Target Screenshot Proportions) */}
      {/* ================================================================= */}
      {/* Outer Glass Wall */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.71, 0.59, 1.82, 64, 1, true]} />
        <meshPhysicalMaterial
          roughness={0.03}
          transmission={0.98}
          thickness={0.7}
          ior={1.5}
          color="#FAF7F2"
          transparent={true}
          opacity={0.92}
          specularIntensity={1.3}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Solid Thick Glass Puck Base */}
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.59, 0.57, 0.18, 64]} />
        <meshPhysicalMaterial
          roughness={0.04}
          transmission={0.96}
          thickness={1.4}
          ior={1.52}
          color="#F5F0E8"
          transparent={true}
          opacity={0.95}
          clearcoat={1.0}
        />
      </mesh>

      {/* Top Rounded Glass Rim */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.705, 0.014, 16, 64]} />
        <meshPhysicalMaterial
          roughness={0.03}
          transmission={0.99}
          color="#FFFFFF"
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* ================================================================= */}
      {/* 2. LIQUID LAYERS (GOLDEN AMBER TEA DEFAULT <-> COFFEE MORPH)      */}
      {/* ================================================================= */}
      <group ref={innerLiquidsRef}>
        {/* --- TEA LAYER: Golden Amber Tea Body (Target Screenshot Color) --- */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.69, 0.58, 1.42, 48]} />
          <meshPhysicalMaterial
            ref={teaMatRef}
            color="#E08924"
            transmission={0.88}
            roughness={0.12}
            thickness={1.0}
            ior={1.34}
            transparent={true}
            opacity={0.95}
            attenuationColor="#F49A24"
            attenuationDistance={0.75}
          />
        </mesh>

        {/* --- COFFEE LAYER A: Dark Espresso Bottom --- */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.62, 0.58, 0.44, 48]} />
          <meshStandardMaterial
            ref={espressoMatRef}
            color="#2B150C"
            roughness={0.25}
            transparent={true}
            opacity={0.0}
          />
        </mesh>

        {/* --- COFFEE LAYER B: Steamed Milk Body --- */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.67, 0.62, 0.58, 48]} />
          <meshStandardMaterial
            ref={milkMatRef}
            color="#E8DDD0"
            roughness={0.4}
            transparent={true}
            opacity={0.0}
          />
        </mesh>

        {/* --- COFFEE LAYER C: 3D Helical Caramel Swirl Tube --- */}
        <mesh ref={caramelRef} geometry={caramelGeometry} visible={false}>
          <meshStandardMaterial
            ref={caramelMatRef}
            color="#DE8224"
            emissive="#C76F14"
            emissiveIntensity={0.3}
            roughness={0.15}
          />
        </mesh>

        {/* --- COFFEE LAYER D: Silky Foam Head --- */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.70, 0.67, 0.42, 48]} />
          <meshStandardMaterial
            ref={foamMatRef}
            color="#FAF5ED"
            roughness={0.65}
            transparent={true}
            opacity={0.25}
          />
        </mesh>

        {/* Liquid Surface Meniscus Top */}
        <mesh position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.68, 48]} />
          <meshStandardMaterial
            color={isTea ? '#E28E28' : '#FAF5ED'}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 3. CRYSTALLINE ICE CUBES (Embedded at Upper Surface)              */}
      {/* ================================================================= */}
      <group>
        {/* Ice Cube 1 (Left tilted) */}
        <mesh ref={iceRef1} position={[-0.17, 0.65, 0.08]}>
          <boxGeometry args={[0.26, 0.24, 0.26]} />
          <meshPhysicalMaterial
            roughness={0.06}
            transmission={0.96}
            thickness={0.5}
            ior={1.31} // Real water ice index of refraction
            color="#FFFFFF"
            transparent={true}
            opacity={0.92}
            clearcoat={1.0}
          />
        </mesh>

        {/* Ice Cube 2 (Right tilted) */}
        <mesh ref={iceRef2} position={[0.18, 0.67, -0.05]}>
          <boxGeometry args={[0.24, 0.23, 0.24]} />
          <meshPhysicalMaterial
            roughness={0.06}
            transmission={0.96}
            thickness={0.5}
            ior={1.31}
            color="#FFFFFF"
            transparent={true}
            opacity={0.92}
            clearcoat={1.0}
          />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 4. TEA INGREDIENTS: FRESH MINT LEAVES & THIN LEMON WHEEL          */}
      {/* ================================================================= */}
      <group ref={teaLeavesRef} visible={isTea}>
        {/* Drifting Botanical Tea Leaves */}
        {teaLeaves.map((leaf, index) => (
          <mesh
            key={index}
            position={leaf.pos}
            rotation={leaf.rot}
            scale={[leaf.scale, leaf.scale * 1.8, leaf.scale * 0.3]}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#3A562B" roughness={0.65} />
          </mesh>
        ))}

        {/* Realistic Lemon Wheel resting on upper right rim */}
        <group position={[0.42, 0.92, 0.18]} rotation={[0.4, 0.85, -0.32]}>
          {/* Pale outer rind */}
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.024, 32]} />
            <meshStandardMaterial color="#FFFBEA" roughness={0.35} />
          </mesh>
          {/* Translucent sunny yellow pulp */}
          <mesh position={[0, 0.008, 0]}>
            <cylinderGeometry args={[0.185, 0.185, 0.02, 32]} />
            <meshStandardMaterial
              color="#FCD329"
              roughness={0.4}
              transparent={true}
              opacity={0.92}
            />
          </mesh>
          {/* Lemon center hub */}
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.022, 16]} />
            <meshStandardMaterial color="#FFFBEA" roughness={0.4} />
          </mesh>
        </group>

        {/* Fresh Mint Leaves Protruding Above the Rim */}
        <group ref={mintRef} position={[-0.14, 0.88, 0.08]} rotation={[0.12, -0.25, 0.22]}>
          {/* Main Leaf */}
          <mesh position={[0, 0.14, 0]} rotation={[0.2, 0.15, -0.1]} scale={[0.11, 0.20, 0.02]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#3B742D" roughness={0.45} />
          </mesh>
          {/* Side Leaf */}
          <mesh position={[-0.08, 0.08, 0.04]} rotation={[0.4, -0.45, 0.35]} scale={[0.08, 0.14, 0.018]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#4A8838" roughness={0.5} />
          </mesh>
          {/* Small Top Leaf */}
          <mesh position={[0.07, 0.07, -0.04]} rotation={[-0.3, 0.35, -0.28]} scale={[0.07, 0.12, 0.016]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#356A28" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 5. COFFEE BEANS AT THE BASE (Coffee Mode only)                    */}
      {/* ================================================================= */}
      <group position={[0.58, -0.78, 0.32]} visible={!isTea}>
        <group position={[0, 0, 0]} rotation={[0.4, 0.75, -0.2]} scale={[0.085, 0.055, 0.055]}>
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#2B160D" roughness={0.45} />
          </mesh>
        </group>
        <group position={[0.11, 0, -0.05]} rotation={[-0.25, 1.1, 0.3]} scale={[0.08, 0.05, 0.05]}>
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#321A10" roughness={0.45} />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 6. SOFT CONTACT GROUND SHADOW                                     */}
      {/* ================================================================= */}
      <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.9, 36]} />
        <meshBasicMaterial
          color="#120803"
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
