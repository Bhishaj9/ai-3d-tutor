import React from 'react';
import { Html } from '@react-three/drei';

export default function PayloadInspector({ currentStep, currentProtocol = "JWT", position = [2, 0, 0] }) {
    // Dummy data based on step and protocol
    const getPayloadData = () => {
        if (currentProtocol === "OAuth2") {
            if (currentStep < 2) return { type: "None", user: "No Code", status: "None" };
            if (currentStep < 4) return { type: "Auth Code", user: "Pending Exchange", status: "Valid Code" };
            return { type: "Access Token", user: "Authorized", status: "Bearer Active" };
        } else {
            if (currentStep < 2) return { alg: "None", user: "None", verified: "No Token" };
            if (currentStep === 5) return { alg: "HS256", user: "Alice (Expired)", verified: "Expired" };
            if (currentStep === 6) return { alg: "HS256", user: "Hacker", verified: "Invalid Signature" };
            return { alg: "HS256", user: "Alice", verified: "Valid" };
        }
    };

    const data = getPayloadData();

    return (
        <Html position={position} center transform>
            <div style={{
                background: 'rgba(20, 20, 30, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(100, 200, 255, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                color: '#e0f2fe',
                fontFamily: 'monospace',
                width: '240px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                pointerEvents: 'none' // Let clicks pass through to 3D scene
            }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', marginBottom: '8px' }}>
                    <strong style={{ color: '#60a5fa' }}>
                        {currentProtocol === "OAuth2" ? "OAUTH2 STATE" : "HEADER"}
                    </strong>
                    {currentProtocol === "OAuth2" ? (
                        <>
                            <div style={{ fontSize: '12px' }}>Type: {data.type}</div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '12px' }}>Alg: {data.alg}</div>
                            <div style={{ fontSize: '12px' }}>Type: JWT</div>
                        </>
                    )}
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', marginBottom: '8px' }}>
                    <strong style={{ color: '#34d399' }}>PAYLOAD</strong>
                    <div style={{ fontSize: '12px' }}>User: {data.user}</div>
                </div>
                <div>
                    <strong style={{ color: (data.verified === 'Valid' || data.status?.includes('Active') || data.status?.includes('Valid')) ? '#34d399' : '#f87171' }}>
                        SIGNATURE / STATUS
                    </strong>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        Status: {data.verified || data.status}
                    </div>
                </div>
            </div>
        </Html>
    );
}
