import React, { useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import gsap from 'gsap';
import { CheckCircle } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const { customerName, projectName } = useProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const heyTextRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const commaRef = useRef<HTMLSpanElement>(null);
  const welcomeTextRef = useRef<HTMLSpanElement>(null);
  const projectRef = useRef<HTMLSpanElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Start exit animation after a pause
        gsap.delayedCall(2, startExitAnimation);
      }
    });

    // Initial state
    gsap.set([containerRef.current, circleRef.current, checkmarkRef.current], { autoAlpha: 0 });
    gsap.set(circleRef.current, { scale: 0 });
    gsap.set([heyTextRef.current, nameRef.current, commaRef.current], { y: 50, autoAlpha: 0 });
    gsap.set([welcomeTextRef.current, projectRef.current], { y: 30, autoAlpha: 0 });
    gsap.set(checkmarkRef.current, { scale: 0, rotation: -45 });
    gsap.set(messageRef.current, { y: 20, autoAlpha: 0 });

    // Entrance animation
    tl.to(containerRef.current, { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" })
      .to(circleRef.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)" })
      .to([heyTextRef.current, nameRef.current, commaRef.current], { 
        y: 0, 
        autoAlpha: 1, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power3.out" 
      }, "-=0.4")
      .to([welcomeTextRef.current, projectRef.current], { 
        y: 0, 
        autoAlpha: 1, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power3.out" 
      }, "-=0.4")
      .to(checkmarkRef.current, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.2")
      .to(messageRef.current, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");

    const startExitAnimation = () => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      exitTl.to([heyTextRef.current, nameRef.current, commaRef.current, welcomeTextRef.current, projectRef.current, messageRef.current], { 
        y: -20, 
        autoAlpha: 0, 
        duration: 0.7, 
        stagger: 0.05,
        ease: "power3.inOut" 
      })
      .to(checkmarkRef.current, { 
        scale: 0, 
        autoAlpha: 0, 
        rotation: 45, 
        duration: 0.6, 
        ease: "back.in(1.7)" 
      }, "-=0.4")
      .to(circleRef.current, { 
        scale: 1.2, 
        autoAlpha: 0, 
        duration: 0.8, 
        ease: "power2.inOut" 
      }, "-=0.4")
      .to(containerRef.current, { 
        autoAlpha: 0, 
        duration: 1.2,
        ease: "power2.inOut"
      }, "-=0.6");
    };

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div ref={contentRef} className="relative text-center">
        <div 
          ref={circleRef}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/10 to-blue-600/20 mx-auto flex items-center justify-center shadow-lg"
          style={{ opacity: 0, transform: 'scale(0)' }}
        >
          <div 
            ref={checkmarkRef}
            className="absolute"
            style={{ opacity: 0, transform: 'scale(0)' }}
          >
            <CheckCircle className="w-20 h-20 text-blue-600" />
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">
            <span ref={heyTextRef} className="inline-block" style={{ opacity: 0, transform: 'translateY(50px)' }}>Hey</span>{' '}
            <span ref={nameRef} className="text-blue-600 inline-block" style={{ opacity: 0, transform: 'translateY(50px)' }}>{customerName}</span>
            <span ref={commaRef} className="text-blue-600 inline-block" style={{ opacity: 0, transform: 'translateY(50px)' }}>,</span>
          </h2>
          <h3 className="text-2xl text-gray-700">
            <span ref={welcomeTextRef} className="inline-block" style={{ opacity: 0, transform: 'translateY(30px)' }}>welcome to your</span>{' '}
            <span ref={projectRef} className="text-blue-600 font-semibold inline-block" style={{ opacity: 0, transform: 'translateY(30px)' }}>{projectName}</span>
          </h3>
          <div 
            ref={messageRef}
            className="text-gray-600 mt-4"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            Your personalized dashboard is ready!
          </div>
        </div>
      </div>
    </div>
  );
};