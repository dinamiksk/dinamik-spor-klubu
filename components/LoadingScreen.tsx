'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Smooth cursor following with lerp
  useEffect(() => {
    const animateCursor = () => {
      setCursorPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.12,
        y: prev.y + (mousePos.y - prev.y) * 0.12,
      }));
      animationRef.current = requestAnimationFrame(animateCursor);
    };
    animationRef.current = requestAnimationFrame(animateCursor);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos.x, mousePos.y]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Loading progress
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsReady(true);

      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.floor(Math.random() * 5) + 1;
          const next = Math.min(prev + increment, 100);

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 400);
          }

          return next;
        });
      }, 80);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(startTimeout);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080c0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(26,95,168,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26,95,168,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Corner L-shaped Decorations */}
      {[
        { top: 0, left: 0, borderColor: '#f07d00' },
        { top: 0, right: 0, borderColor: '#f07d00', transform: 'scaleX(-1)' },
        { bottom: 0, left: 0, borderColor: '#1a5fa8', transform: 'scaleY(-1)' },
        { bottom: 0, right: 0, borderColor: '#1a5fa8', transform: 'scale(-1)' },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 36,
            height: 36,
            border: '2px solid',
            borderColor: style.borderColor,
            ...style,
          }}
        />
      ))}

      {/* Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(26,95,168,0.15) 0%, rgba(240,125,0,0.08) 50%, transparent 70%)`,
          transition: 'background 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          left: `${cursorPos.x}%`,
          top: `${cursorPos.y}%`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        {/* Inner dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#f07d00',
            mixBlendMode: 'screen',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Outer ring */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1.5px solid rgba(240,125,0,0.45)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          className="loading-logo"
          style={{
            width: 150,
            height: 170,
            marginBottom: 32,
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20px)',
            transition: 'opacity 1s cubic-bezier(0.23,1,0.32,1), transform 1s cubic-bezier(0.23,1,0.32,1)',
            filter: 'drop-shadow(0 0 18px rgba(26,95,168,0.55)) drop-shadow(0 0 36px rgba(240,125,0,0.25))',
          }}
        >
          <img
            src="/assets/images/dinamik-logo.svg"
            alt="Dinamik Spor Kulübü"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Club Name */}
        <div
          className="loading-text"
          style={{
            textAlign: 'center',
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s, transform 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s',
          }}
        >
          <div
            style={{
              fontFamily: 'Anton, sans-serif',
              color: '#1a5fa8',
              fontSize: '1.9rem',
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}
          >
            AKDENİZ
          </div>
          <div
            style={{
              fontFamily: 'Anton, sans-serif',
              color: '#ffffff',
              fontSize: '2.5rem',
              letterSpacing: '0.08em',
              lineHeight: 1.2,
            }}
          >
            DİNAMİK
          </div>
          <div
            style={{
              fontFamily: 'Anton, sans-serif',
              color: '#f07d00',
              fontSize: '1.5rem',
              letterSpacing: '0.18em',
              lineHeight: 1.2,
            }}
          >
            SPOR KULÜBÜ
          </div>
        </div>

        {/* Loading Bar */}
        <div
          style={{
            marginTop: 48,
            width: 220,
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.5s ease 0.5s',
          }}
        >
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.35)',
              textAlign: 'center',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>YÜKLENİYOR</span>
            <span>{progress}%</span>
          </div>

          <div
            style={{
              height: 2,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Progress Fill */}
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #1a5fa8, #f07d00)',
                transition: 'width 0.05s linear',
                position: 'relative',
              }}
            >
              {/* Shine Effect */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shine 1.5s infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
