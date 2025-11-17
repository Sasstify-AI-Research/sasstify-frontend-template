import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';


const PageNotFound = () => {
  return (
    <Layout fixedHeader={true}>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Full Page Animation Section */}
        <section className="relative min-h-screen flex flex-col">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white via-cyan-50 to-purple-50 animate-gradient-shift">
            {/* Advanced Material Design Shapes */}
            <div className="material-shapes">
              {/* Primary Circles with Enhanced Effects */}
              <div className="material-circle primary enhanced" style={{ left: '8%', top: '15%', animationDelay: '0s' }}>
                <div className="circle-glow"></div>
              </div>
              <div className="material-circle primary enhanced" style={{ right: '12%', top: '25%', animationDelay: '2s' }}>
                <div className="circle-glow"></div>
              </div>
              <div className="material-circle primary enhanced" style={{ left: '15%', bottom: '30%', animationDelay: '4s' }}>
                <div className="circle-glow"></div>
              </div>

              {/* Secondary Circles with Morphing Effects */}
              <div className="material-circle secondary morphing" style={{ right: '20%', top: '40%', animationDelay: '1s' }}>
                <div className="circle-pulse"></div>
              </div>
              <div className="material-circle secondary morphing" style={{ left: '25%', bottom: '20%', animationDelay: '3s' }}>
                <div className="circle-pulse"></div>
              </div>
              <div className="material-circle secondary morphing" style={{ right: '8%', bottom: '40%', animationDelay: '5s' }}>
                <div className="circle-pulse"></div>
              </div>

              {/* Accent Circles with Dynamic Effects */}
              <div className="material-circle accent dynamic" style={{ left: '60%', top: '20%', animationDelay: '0.5s' }}>
                <div className="circle-orbit"></div>
              </div>
              <div className="material-circle accent dynamic" style={{ right: '25%', bottom: '15%', animationDelay: '2.5s' }}>
                <div className="circle-orbit"></div>
              </div>
              <div className="material-circle accent dynamic" style={{ left: '70%', bottom: '35%', animationDelay: '4.5s' }}>
                <div className="circle-orbit"></div>
              </div>

              {/* Special Hexagon Shapes */}
              <div className="material-hexagon" style={{ left: '35%', top: '10%', animationDelay: '1.5s' }}>
                <div className="hexagon-inner"></div>
              </div>
              <div className="material-hexagon" style={{ right: '35%', bottom: '25%', animationDelay: '3.5s' }}>
                <div className="hexagon-inner"></div>
              </div>
            </div>

            {/* Enhanced Wave System */}
            <div className="material-waves">
              <div className="wave wave-1 enhanced" style={{ animationDelay: '0s' }}>
                <div className="wave-trail"></div>
              </div>
              <div className="wave wave-2 enhanced" style={{ animationDelay: '1.5s' }}>
                <div className="wave-trail"></div>
              </div>
              <div className="wave wave-3 enhanced" style={{ animationDelay: '3s' }}>
                <div className="wave-trail"></div>
              </div>
              <div className="wave wave-4 enhanced" style={{ animationDelay: '4.5s' }}>
                <div className="wave-trail"></div>
              </div>
            </div>

            {/* Advanced Particle System */}
            <div className="material-particles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`material-particle particle-${i % 4}`}
                  style={{
                    left: `${5 + (i * 4.5)}%`,
                    top: `${10 + (i * 3.5)}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${3 + (i % 3) * 1.5}s`
                  }}
                >
                  <div className="particle-core"></div>
                  <div className="particle-trail"></div>
                </div>
              ))}
            </div>

            {/* Floating Geometric Patterns */}
            <div className="geometric-patterns">
              <div className="pattern pattern-1" style={{ left: '20%', top: '30%', animationDelay: '0s' }}></div>
              <div className="pattern pattern-2" style={{ right: '15%', top: '50%', animationDelay: '2s' }}></div>
              <div className="pattern pattern-3" style={{ left: '45%', bottom: '40%', animationDelay: '1s' }}></div>
              <div className="pattern pattern-4" style={{ right: '30%', bottom: '20%', animationDelay: '3s' }}></div>
            </div>

            {/* Dynamic Light Rays */}
            <div className="light-rays">
              <div className="light-ray ray-1" style={{ left: '10%', animationDelay: '0s' }}></div>
              <div className="light-ray ray-2" style={{ right: '15%', animationDelay: '2s' }}></div>
              <div className="light-ray ray-3" style={{ left: '70%', animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex items-center justify-center px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              {/* Dark 404 Number */}
              <div className="relative mb-8">
                <div className="text-8xl md:text-[10rem] font-light text-gray-900">
                  <span className="inline-block animate-text-float" style={{ animationDelay: '0s' }}>4</span>
                  <span className="inline-block animate-text-float" style={{ animationDelay: '0.2s' }}>0</span>
                  <span className="inline-block animate-text-float" style={{ animationDelay: '0.4s' }}>4</span>
                </div>
                {/* Text Shadow Effect */}
                <div className="absolute inset-0 text-8xl md:text-[10rem] font-light text-gray-700 opacity-30 animate-text-shadow" style={{ transform: 'translate(4px, 4px)', animationDelay: '0.5s' }}>
                  404
                </div>
                {/* Additional Shaded Layer */}
                <div className="absolute inset-0 text-8xl md:text-[10rem] font-light text-gray-600 opacity-20" style={{ transform: 'translate(2px, 2px)', animationDelay: '1s' }}>
                  404
                </div>
                {/* Deep Shadow Layer */}
                <div className="absolute inset-0 text-8xl md:text-[10rem] font-light text-gray-800 opacity-15" style={{ transform: 'translate(6px, 6px)', animationDelay: '1.5s' }}>
                  404
                </div>
              </div>

              {/* Enhanced Subtitle */}
              <div className="relative mb-6">
                <div className="text-xl md:text-2xl font-medium text-gray-700 animate-material-fade-in animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  Page Not Found
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-underline-expand" style={{ animationDelay: '0.8s' }}></div>
              </div>

              {/* Enhanced Description */}
              <div className="text-base md:text-lg text-gray-600 mb-20 animate-material-fade-in animate-slide-up" style={{ animationDelay: '1s' }}>
                <span className="animate-typing">The page you're looking for doesn't exist or has been moved.</span>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Action Buttons */}
          <div className="relative z-10 pb-8 px-4">
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="enhanced-material-button primary animate-material-fade-in animate-slide-up" style={{ animationDelay: '1.5s' }}>
                <div className="button-ripple"></div>
                <div className="button-content">
                  <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Go Home</span>
                </div>
                <div className="button-glow"></div>
              </a>
              <button onClick={() => window.history.back()} className="enhanced-material-button secondary animate-material-fade-in animate-slide-up" style={{ animationDelay: '1.7s' }}>
                <div className="button-ripple"></div>
                <div className="button-content">
                  <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Go Back</span>
                </div>
                <div className="button-glow"></div>
              </button>
            </div>
          </div>

          {/* Enhanced Material Design CSS */}
          <style dangerouslySetInnerHTML={{
          __html: `
            /* Background Gradient Animation */
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }

            .animate-gradient-shift {
              background-size: 400% 400%;
              animation: gradient-shift 15s ease infinite;
            }

            /* Enhanced Material Design Shapes */
            .material-shapes {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }

            .material-circle {
              position: absolute;
              border-radius: 50%;
              animation: material-float 6s ease-in-out infinite;
            }

            .material-circle.primary.enhanced {
              width: 140px;
              height: 140px;
              background: linear-gradient(135deg, #1976D2, #42A5F5, #2196F3);
              box-shadow: 0 10px 40px rgba(25, 118, 210, 0.2), 0 4px 12px rgba(25, 118, 210, 0.15);
              opacity: 0.08;
            }

            .circle-glow {
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%);
              animation: circle-glow 4s ease-in-out infinite alternate;
            }

            .material-circle.secondary.morphing {
              width: 100px;
              height: 100px;
              background: linear-gradient(135deg, #7B1FA2, #BA68C8, #9C27B0);
              box-shadow: 0 8px 32px rgba(123, 31, 162, 0.2), 0 3px 10px rgba(123, 31, 162, 0.15);
              opacity: 0.07;
            }

            .circle-pulse {
              position: absolute;
              top: -8px;
              left: -8px;
              right: -8px;
              bottom: -8px;
              border: 2px solid rgba(123, 31, 162, 0.3);
              border-radius: 50%;
              animation: circle-pulse 3s ease-in-out infinite;
            }

            .material-circle.accent.dynamic {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #FF6F00, #FFB74D, #FF9800);
              box-shadow: 0 6px 24px rgba(255, 111, 0, 0.2), 0 2px 8px rgba(255, 111, 0, 0.15);
              opacity: 0.09;
            }

            .circle-orbit {
              position: absolute;
              top: -12px;
              left: -12px;
              right: -12px;
              bottom: -12px;
              border: 1px solid rgba(255, 111, 0, 0.4);
              border-radius: 50%;
              animation: circle-orbit 6s linear infinite;
            }

            .material-hexagon {
              position: absolute;
              width: 60px;
              height: 52px;
              background: linear-gradient(135deg, #4CAF50, #81C784);
              clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
              box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
              opacity: 0.08;
              animation: hexagon-rotate 8s ease-in-out infinite;
            }

            .hexagon-inner {
              position: absolute;
              top: 4px;
              left: 4px;
              right: 4px;
              bottom: 4px;
              background: rgba(255, 255, 255, 0.3);
              clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            }

            @keyframes circle-glow {
              0% { opacity: 0.3; transform: scale(0.9); }
              100% { opacity: 0.8; transform: scale(1.1); }
            }

            @keyframes circle-pulse {
              0%, 100% { transform: scale(0.8); opacity: 0.6; }
              50% { transform: scale(1.2); opacity: 1; }
            }

            @keyframes circle-orbit {
              0% { transform: rotate(0deg) scale(0.9); }
              100% { transform: rotate(360deg) scale(1.1); }
            }

            @keyframes hexagon-rotate {
              0%, 100% { transform: rotate(0deg) scale(1); }
              50% { transform: rotate(180deg) scale(1.1); }
            }

            @keyframes material-float {
              0%, 100% {
                transform: translateY(0px) scale(1) rotate(0deg);
                opacity: 0.06;
              }
              25% {
                transform: translateY(-25px) scale(1.1) rotate(90deg);
                opacity: 0.15;
              }
              50% {
                transform: translateY(-50px) scale(0.95) rotate(180deg);
                opacity: 0.12;
              }
              75% {
                transform: translateY(-25px) scale(1.05) rotate(270deg);
                opacity: 0.18;
              }
            }

            /* Enhanced Wave System */
            .material-waves {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              overflow: hidden;
            }

            .wave.enhanced {
              position: absolute;
              height: 4px;
              background: linear-gradient(90deg, transparent, #1976D2, #42A5F5, #2196F3, transparent);
              border-radius: 4px;
              animation: enhanced-wave-flow 10s ease-in-out infinite;
            }

            .wave-trail {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(66, 165, 245, 0.3), transparent);
              border-radius: 4px;
              animation: wave-trail 8s ease-in-out infinite;
            }

            .wave-1 {
              width: 280px;
              top: 25%;
              left: -18%;
              animation-duration: 12s;
            }

            .wave-2 {
              width: 400px;
              top: 50%;
              right: -18%;
              animation-duration: 15s;
              animation-direction: reverse;
            }

            .wave-3 {
              width: 240px;
              top: 75%;
              left: -18%;
              animation-duration: 11s;
            }

            .wave-4 {
              width: 320px;
              top: 35%;
              left: -18%;
              animation-duration: 13s;
              animation-delay: 2s;
            }

            @keyframes enhanced-wave-flow {
              0% {
                opacity: 0;
                transform: translateX(0) scaleX(0.6) scaleY(0.8);
              }
              15% {
                opacity: 0.6;
                transform: translateX(80px) scaleX(1.4) scaleY(1.2);
              }
              85% {
                opacity: 0.6;
                transform: translateX(240px) scaleX(1.4) scaleY(1.2);
              }
              100% {
                opacity: 0;
                transform: translateX(320px) scaleX(0.6) scaleY(0.8);
              }
            }

            @keyframes wave-trail {
              0%, 100% { opacity: 0; }
              50% { opacity: 0.8; }
            }

            /* Advanced Particle System */
            .material-particles {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }

            .material-particle {
              position: absolute;
              animation: advanced-particle-float linear infinite;
            }

            .particle-0 {
              width: 8px;
              height: 8px;
              background: linear-gradient(45deg, #1976D2, #42A5F5);
              border-radius: 50%;
              box-shadow: 0 0 16px rgba(25, 118, 210, 0.4);
            }

            .particle-1 {
              width: 6px;
              height: 12px;
              background: linear-gradient(45deg, #7B1FA2, #BA68C8);
              border-radius: 3px;
              box-shadow: 0 0 12px rgba(123, 31, 162, 0.4);
            }

            .particle-2 {
              width: 10px;
              height: 6px;
              background: linear-gradient(45deg, #FF6F00, #FFB74D);
              border-radius: 3px;
              box-shadow: 0 0 14px rgba(255, 111, 0, 0.4);
            }

            .particle-3 {
              width: 5px;
              height: 5px;
              background: linear-gradient(45deg, #4CAF50, #81C784);
              clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
              box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
            }

            .particle-core {
              position: absolute;
              top: 2px;
              left: 2px;
              right: 2px;
              bottom: 2px;
              background: rgba(255, 255, 255, 0.8);
              border-radius: 50%;
              animation: particle-core-glow 2s ease-in-out infinite alternate;
            }

            .particle-trail {
              position: absolute;
              top: -4px;
              left: -4px;
              right: -4px;
              bottom: -4px;
              border: 1px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              animation: particle-trail-expand 3s ease-out infinite;
            }

            @keyframes advanced-particle-float {
              0% {
                transform: translateY(0px) rotate(0deg) scale(0.8);
                opacity: 0.2;
              }
              20% {
                transform: translateY(-40px) rotate(72deg) scale(1.1);
                opacity: 0.8;
              }
              40% {
                transform: translateY(-80px) rotate(144deg) scale(0.9);
                opacity: 0.6;
              }
              60% {
                transform: translateY(-120px) rotate(216deg) scale(1.2);
                opacity: 0.9;
              }
              80% {
                transform: translateY(-160px) rotate(288deg) scale(0.95);
                opacity: 0.5;
              }
              100% {
                transform: translateY(-200px) rotate(360deg) scale(0.8);
                opacity: 0.2;
              }
            }

            @keyframes particle-core-glow {
              0% { opacity: 0.6; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1.2); }
            }

            @keyframes particle-trail-expand {
              0% { transform: scale(0.5); opacity: 0.8; }
              100% { transform: scale(1.5); opacity: 0; }
            }

            /* Geometric Patterns */
            .geometric-patterns {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }

            .pattern {
              position: absolute;
              opacity: 0.05;
              animation: pattern-morph 10s ease-in-out infinite;
            }

            .pattern-1 {
              width: 80px;
              height: 80px;
              background: conic-gradient(from 0deg, #1976D2, #42A5F5, #7B1FA2, #1976D2);
              clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            }

            .pattern-2 {
              width: 60px;
              height: 60px;
              background: radial-gradient(circle, #FF6F00, #FFB74D);
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            }

            .pattern-3 {
              width: 70px;
              height: 70px;
              background: linear-gradient(45deg, #4CAF50, #81C784);
              clip-path: polygon(50% 0%, 83.3% 25%, 83.3% 75%, 50% 100%, 16.7% 75%, 16.7% 25%);
            }

            .pattern-4 {
              width: 50px;
              height: 50px;
              background: conic-gradient(from 45deg, #9C27B0, #BA68C8, #FF6F00);
              clip-path: polygon(50% 0%, 100% 38.2%, 81.8% 100%, 18.2% 100%, 0% 38.2%);
            }

            @keyframes pattern-morph {
              0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.05; }
              25% { transform: rotate(90deg) scale(1.2); opacity: 0.08; }
              50% { transform: rotate(180deg) scale(0.9); opacity: 0.06; }
              75% { transform: rotate(270deg) scale(1.1); opacity: 0.09; }
            }

            /* Light Rays */
            .light-rays {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              overflow: hidden;
            }

            .light-ray {
              position: absolute;
              width: 2px;
              height: 100%;
              background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05), transparent);
              animation: light-ray-shine 8s ease-in-out infinite;
            }

            .ray-1 {
              left: 20%;
              transform: rotate(15deg);
            }

            .ray-2 {
              right: 25%;
              transform: rotate(-10deg);
            }

            .ray-3 {
              left: 75%;
              transform: rotate(5deg);
            }

            @keyframes light-ray-shine {
              0%, 100% { opacity: 0; transform: scaleY(0.5) rotate(15deg); }
              50% { opacity: 0.3; transform: scaleY(1.2) rotate(15deg); }
            }

            /* Enhanced Typography */
            @keyframes morphing-text {
              0%, 100% {
                background-position: 0% 50%;
                filter: hue-rotate(0deg);
              }
              25% {
                background-position: 100% 50%;
                filter: hue-rotate(90deg);
              }
              50% {
                background-position: 200% 50%;
                filter: hue-rotate(180deg);
              }
              75% {
                background-position: 100% 50%;
                filter: hue-rotate(270deg);
              }
            }

            .animate-morphing-text {
              background-size: 300% 300%;
              animation: morphing-text 12s ease-in-out infinite;
            }

            @keyframes text-float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-10px) scale(1.05); }
            }

            .animate-text-float {
              animation: text-float 4s ease-in-out infinite;
            }

            @keyframes text-shadow {
              0%, 100% { opacity: 0.2; transform: translate(4px, 4px); }
              50% { opacity: 0.4; transform: translate(6px, 6px); }
            }

            .animate-text-shadow {
              animation: text-shadow 8s ease-in-out infinite;
            }

            @keyframes glow-pulse {
              0%, 100% { opacity: 0.1; filter: blur(2px); }
              50% { opacity: 0.3; filter: blur(4px); }
            }

            .animate-glow-pulse {
              animation: glow-pulse 6s ease-in-out infinite;
            }


            @keyframes slide-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-slide-up {
              animation: slide-up 1s ease-out forwards;
              opacity: 0;
            }

            @keyframes underline-expand {
              0% { width: 0; opacity: 0; }
              100% { width: 96px; opacity: 1; }
            }

            .animate-underline-expand {
              animation: underline-expand 1.5s ease-out forwards;
              width: 0;
              opacity: 0;
            }

            @keyframes typing {
              0% { width: 0; }
              100% { width: 100%; }
            }

            .animate-typing {
              overflow: hidden;
              white-space: nowrap;
              animation: typing 3s steps(40, end) forwards;
              width: 0;
            }

            /* Enhanced Material Design Buttons */
            .enhanced-material-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 16px 32px;
              border-radius: 12px;
              font-weight: 500;
              font-size: 16px;
              text-transform: none;
              letter-spacing: 0.5px;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              border: none;
              cursor: pointer;
              min-height: 56px;
              position: relative;
              overflow: hidden;
              text-decoration: none;
            }

            .enhanced-material-button.primary {
              background: linear-gradient(135deg, #1976D2, #42A5F5);
              color: white;
              box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4), 0 2px 6px rgba(25, 118, 210, 0.2);
            }

            .enhanced-material-button.primary:hover {
              box-shadow: 0 8px 24px rgba(25, 118, 210, 0.5), 0 4px 12px rgba(25, 118, 210, 0.3);
              transform: translateY(-3px) scale(1.02);
            }

            .enhanced-material-button.secondary {
              background: white;
              color: #1976D2;
              border: 1px solid rgba(25, 118, 210, 0.3);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
            }

            .enhanced-material-button.secondary:hover {
              background: linear-gradient(135deg, rgba(25, 118, 210, 0.04), rgba(66, 165, 245, 0.08));
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.12);
              transform: translateY(-2px) scale(1.01);
              border-color: rgba(25, 118, 210, 0.5);
            }

            .button-ripple {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
              border-radius: 12px;
              transform: scale(0);
              animation: button-ripple 2s ease-out infinite;
            }

            .button-content {
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
            }

            .button-glow {
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent, rgba(255, 255, 255, 0.2));
              border-radius: 14px;
              opacity: 0;
              transition: opacity 0.3s ease;
            }

            .enhanced-material-button:hover .button-glow {
              opacity: 1;
            }

            @keyframes button-ripple {
              0% { transform: scale(0); opacity: 0.6; }
              100% { transform: scale(2); opacity: 0; }
            }

            .enhanced-material-button:active {
              transform: translateY(0) scale(0.98);
            }

            /* Responsive Design */
            @media (max-width: 768px) {
              .enhanced-material-button {
                padding: 14px 28px;
                min-height: 52px;
                font-size: 15px;
              }

              .text-8xl {
                font-size: 6rem;
              }

              .text-9xl {
                font-size: 7rem;
              }

              .text-[10rem] {
                font-size: 8rem;
              }
            }

            @media (max-width: 480px) {
              .enhanced-material-button {
                padding: 12px 24px;
                min-height: 48px;
                font-size: 14px;
              }

              .text-8xl {
                font-size: 5rem;
              }

              .text-9xl {
                font-size: 6rem;
              }

              .text-[10rem] {
                font-size: 7rem;
              }
            }
          `
        }} />
        </section>
      </div>
    </Layout>
  );
};

export default PageNotFound;
