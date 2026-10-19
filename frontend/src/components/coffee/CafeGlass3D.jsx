import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CoffeeCupScene from './CoffeeCupScene';

function CanvasFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="w-28 h-36 rounded-2xl border border-dashed border-[#D47A22]/30 bg-black/20 backdrop-blur-md flex flex-col items-center justify-center animate-pulse">
        <span className="text-xl mb-1">🍃</span>
        <span className="text-[11px] font-medium text-cream-200/60">
          Steeping 3D Tea...
        </span>
      </div>
    </div>
  );
}

export default function CafeGlass3D({ beverageType = 'tea', className = '' }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <CanvasFallback />;
  }

  return (
    <div className={`relative w-full h-[290px] sm:h-[330px] select-none ${className}`}>
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, 0.35, 3.4], fov: 38 }}
          dpr={[1, 2]} // Cap DPR at 2 for optimal performance
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* Studio Lighting tailored for golden amber tea & transparent glass */}
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[4, 7, 4]}
            intensity={2.0}
            color="#FFF4E6"
          />
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.7}
            color="#E8F2FA"
          />
          <pointLight position={[0, 2.5, 2.2]} intensity={0.7} color="#FFE6CC" />
          <pointLight position={[-1.5, -0.8, -1.8]} intensity={0.4} color="#DE8224" />

          {/* 3D Model Scene */}
          <CoffeeCupScene beverageType={beverageType} />

          {/* OrbitControls: smooth drag-to-rotate with continuous auto-rotation */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={1.0}
            minPolarAngle={Math.PI / 2.3}
            maxPolarAngle={Math.PI / 1.75}
            dampingFactor={0.06}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
