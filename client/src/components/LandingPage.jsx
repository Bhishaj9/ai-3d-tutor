import React, { useState } from "react";

const LandingPage = ({ onStart, roomId }) => {
  return (
    <>
      <style>{`
        /* 🔹 Global Resets & Utilities */
        * { box-sizing: border-box; }
        
        .lp-container {
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #111111 0%, #000000 100%);
          color: #ffffff;
          font-family: 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .lp-bg-ambience {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 10%, rgba(74, 222, 128, 0.1) 0%, transparent 60%);
        }

        .lp-main {
          z-index: 1;
          max-width: 1200px;
          width: 100%;
          padding: 120px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* 🔹 Hero Section */
        .lp-hero {
          text-align: center;
          margin-bottom: 80px;
          max-width: 800px;
          width: 100%;
        }

        .lp-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 10px;
          color: #a855f7;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
          letter-spacing: 1px;
        }

        .lp-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 16px 0;
          background: linear-gradient(to right, #ffffff, #64748b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -2px;
        }
        
        .lp-title-company {
          font-size: 24px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .lp-subtitle {
          font-size: 20px;
          line-height: 1.6;
          color: #64748b;
          margin: 0 0 40px 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .lp-cta-button {
          background: #4ade80;
          color: #000000;
          border: none;
          padding: 16px 48px;
          font-size: 18px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 rgba(74, 222, 128, 0);
          transform: translateY(0);
        }

        .lp-cta-button:hover {
          background: #22c55e;
          box-shadow: 0 0 40px rgba(74, 222, 128, 0.4);
          transform: translateY(-2px);
        }

        /* 🔹 Grid Sections */
        .lp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          width: 100%;
          margin-bottom: 80px;
        }

        .lp-problem-card, .lp-solution-card {
          padding: 40px;
          background: rgba(30, 41, 59, 0.4);
          border-radius: 24px;
          backdrop-filter: blur(10px);
        }

        .lp-problem-card {
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .lp-solution-card {
          border: 1px solid rgba(74, 222, 128, 0.2);
          position: relative;
          overflow: hidden;
        }

        .lp-card-title {
          font-size: 24px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .lp-card-text {
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* 🔹 Features Grid */
        .lp-features-section {
          width: 100%;
          margin-bottom: 80px;
        }

        .lp-section-title {
          font-size: 32px;
          text-align: center;
          margin-bottom: 40px;
        }

        .lp-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .lp-feature-card {
          padding: 24px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
        }

        .lp-footer {
          width: 100%;
          padding: 24px;
          text-align: center;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          color: #64748b;
          font-size: 14px;
          background: rgba(2, 6, 23, 0.5);
        }

        /* 🔹 MOBILE RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .lp-main {
            padding-top: 80px;
            padding-bottom: 60px;
          }

          .lp-title {
            font-size: 40px; /* Smaller title */
            letter-spacing: -1px;
          }

          .lp-subtitle {
            font-size: 16px;
          }

          .lp-grid-2, .lp-grid-3 {
            grid-template-columns: 1fr; /* Stack grids */
            gap: 24px;
          }

          .lp-cta-button {
            width: 100%; /* Full width button */
            padding: 16px;
          }
          
          .lp-problem-card, .lp-solution-card {
             padding: 24px;
          }
        }
      `}</style>

      <div className="lp-container">
        {/* Background Ambience */}
        <div className="lp-bg-ambience" />

        {/* Main Container */}
        <main className="lp-main">
          {/* Hero Section */}
          <div className="lp-hero">
            <div className="lp-title-company">Bhishaj Technologies</div>
            <h1 className="lp-title">
              AI 3D Protocol Tutor
            </h1>

            <p className="lp-subtitle">
              Master JWT and OAuth2 through a cinematic, multi-user 3D journey guided by the Stoic Technician.
            </p>

            <div className="lp-badge">ROOM: {roomId}</div>

            <br />

            <button
              onClick={onStart}
              className="lp-cta-button"
            >
              Connect to Sandbox
            </button>
          </div>

          {/* Problem / Solution Grid */}
          <div className="lp-grid-2">
            {/* The Problem */}
            <div className="lp-problem-card">
              <h3 className="lp-card-title" style={{ color: "#ef4444" }}>
                <span style={{ fontSize: "20px" }}>⚠</span> The Problem
              </h3>
              <p className="lp-card-text">
                Traditional learning relies on static diagrams and abstract
                documentation. Developers often struggle to visualize the precise
                sequence of events in authentication flows, leading to security
                vulnerabilities and implementation errors.
              </p>
            </div>

            {/* The Solution */}
            <div className="lp-solution-card">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background:
                    "radial-gradient(circle at top right, rgba(74, 222, 128, 0.2), transparent 70%)",
                }}
              />
              <h3 className="lp-card-title" style={{ color: "#4ade80" }}>
                <span style={{ fontSize: "20px" }}>✨</span> The Solution
              </h3>
              <p className="lp-card-text">
                We replace abstract concepts with a tangible, cinematic reality.
                Watch credentials physically travel, guided by real-time AI
                narration and dynamic camera work that focuses your attention
                exactly where it matters.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="lp-features-section">
            <h2 className="lp-section-title">Core Architecture</h2>
            <div className="lp-grid-3">
              {[
                {
                  title: "Interactive 3D Engine",
                  desc: "Built with React Three Fiber for high-performance graphics.",
                },
                {
                  title: "Event-Driven Orchestration",
                  desc: "Tightly coupled state management ensures synced visuals.",
                },
                {
                  title: "Real-Time Synthesis",
                  desc: "TTS integration delivers concise technical explanations.",
                },
              ].map((item, i) => (
                <div key={i} className="lp-feature-card">
                  <h4
                    style={{
                      color: "#e2e8f0",
                      fontSize: "18px",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="lp-footer">
          <p>
            Forget reading about headers. <strong>Watch them happen.</strong>
          </p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
