import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDracoGLTF } from "../utils/ModelLoader";
import * as THREE from "three";

function Token({ step, currentProtocol = "JWT" }) {
  const { scene } = useDracoGLTF("/models/token.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const meshRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const isDenied = step === 5 || step === 6;
  const isAuthCode = currentProtocol === "OAuth2" && step <= 3;

  // Animation state
  const [currentZ, setCurrentZ] = useState(-14);
  const [targetZ, setTargetZ] = useState(-14);
  const [progress, setProgress] = useState(1);
  const [targetScale, setTargetScale] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);

  useEffect(() => {
    if (step === 2) {
      setIsVisible(true);
      setTargetZ(-14);
      setTargetScale(isAuthCode ? 0.5 : 1);
      setProgress(0);
    } else if (step === 3 || isDenied) {
      setIsVisible(true);
      setTargetZ(isAuthCode ? -10 : -19); // If auth code, it goes back to server at step 3. Else gate at -19.
      setTargetScale(isAuthCode ? 0.5 : 1);
      setProgress(0);
    } else if (step === 4 && currentProtocol === "OAuth2") {
      // Exchange completes, it flies from Auth Server to Gate!
      setIsVisible(true);
      setTargetZ(-19);
      setTargetScale(1); // It grows into the Access Token!
      setProgress(0);
    } else if (step === 4) {
      setIsVisible(true);
      setTargetZ(-19);
      setTargetScale(1);
    } else {
      setIsVisible(false);
    }
  }, [step, isDenied, currentProtocol, isAuthCode]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Floating & Rotation
    meshRef.current.position.y =
      2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    meshRef.current.rotation.y += delta * 0.5;

    // Scale interpolation for Code Exchange reveal
    if (currentScale !== targetScale) {
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      setCurrentScale(newScale);
      meshRef.current.scale.set(newScale, newScale, newScale);
    }

    // 2. Movement
    if (progress < 1) {
      setProgress((prev) => {
        const p = Math.min(prev + delta * 0.5, 1);
        meshRef.current.position.z = currentZ + (targetZ - currentZ) * p;
        if (p >= 1) setCurrentZ(targetZ);
        return p;
      });
    } else {
      meshRef.current.position.z = currentZ;
    }

    // 3. Status Effects
    const time = state.clock.getElapsedTime();
    const tokenMaterials = [];
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        tokenMaterials.push(child.material);
      }
    });

    if (step === 5) {
      // Pulse & Color shift to Orange
      const pulse = 1.5 + Math.sin(time * 6) * 1.0;
      tokenMaterials.forEach((mat) => {
        mat.emissive.set("#f59e0b");
        mat.emissiveIntensity = pulse;
      });
      meshRef.current.position.x = 0;
    } else if (step === 6) {
      // Red & Vibration
      meshRef.current.position.x = Math.sin(time * 40) * 0.2;
      tokenMaterials.forEach((mat) => {
        mat.emissive.set("#ef4444");
        mat.emissiveIntensity = 4;
      });
    } else if (isAuthCode) {
      meshRef.current.position.x = 0;
      tokenMaterials.forEach((mat) => {
        mat.emissive.set("#fbbf24"); // Yellow Auth Code
        mat.emissiveIntensity = 3;
      });
    } else {
      // Default Cyan/Hologram Look
      meshRef.current.position.x = 0;
      tokenMaterials.forEach((mat) => {
        mat.emissive.set("#00ffff");
        mat.emissiveIntensity = 2;
      });
    }
  });

  return (
    <group ref={meshRef} position={[0, 2, currentZ]} visible={isVisible}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default Token;
