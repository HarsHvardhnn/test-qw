import React from 'react';

interface GlassmorphicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

export const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
}) => {
  const baseClasses = 'px-8 py-4 rounded-lg hover-smooth transform hover:scale-[1.02] active:scale-[0.98]';
  const variantClasses = {
    primary: 'bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/20',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};