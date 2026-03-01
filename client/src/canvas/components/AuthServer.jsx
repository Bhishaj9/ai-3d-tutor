import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import GameObject from "./GameObject";
import { Text } from "@react-three/drei";

/**
 * AuthServer Component
 * Responsibility: Represents the Authentication Server.
 * Visual: Green building positioned at Z=-10.
 * Role: Validates user credentials (Step 1) and issues the JWT token (Step 2).
 */
function AuthServer({ highlight, currentProtocol = "JWT" }) {
  const labelText = currentProtocol === "OAuth2" ? "Authorization Server" : "Auth Server";

  return (
    <GameObject
      position={[0, 2, -10]}
      modelPath="/models/auth-server.glb"
    >
      <Text
        position={[0, 4, 0]}
        fontSize={1.2}
        color={highlight ? "#4ade80" : "white"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {labelText}
      </Text>
    </GameObject>
  );
}

export default AuthServer;
