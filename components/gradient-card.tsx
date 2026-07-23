"use client";

interface GradientCardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function GradientCard({ children, onClick }: GradientCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-muted rounded-lg font-medium text-center cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-black dark:hover:ring-white hover:shadow-[0px_0px_30px_1px_rgba(0,0,0,0.3)] dark:hover:shadow-[0px_0px_30px_1px_rgba(255,255,255,0.3)]"
    >
      {children}
    </button>
  );
}
