import GameObject from './GameObject';
import { Text } from "@react-three/drei";

/**
 * ProtectedArea Component
 * Responsibility: Represents the Restricted Resource / VIP Section.
 * Visual: Yellow area positioned at Z=-30.
 * Role: The destination the user wants to reach. Accessible only after Gate verification (Step 4).
 */
function ProtectedArea({ currentProtocol = "JWT" }) {
  const labelText = currentProtocol === "OAuth2" ? "Resource Server" : "Protected Area";

  return (
    <GameObject position={[0, 1, -30]} useModel={false}>
      <mesh>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <Text
        position={[0, 2.5, 0]}
        fontSize={1.2}
        color="white"
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

export default ProtectedArea;
