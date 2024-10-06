import { useEffect, useState } from "react";

interface DamageTextProps {
  value: number;
  position: { x: number; y: number };
  onAnimationEnd: () => void;
}

export default function DamageText({
  value,
  position,
  onAnimationEnd,
}: DamageTextProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationEnd();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return isVisible ? (
    <div
      className="damage-text"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: "24px",
        fontWeight: "bold",
        color: "red",
        animation: "damage-float 1s ease-out forwards",
      }}
    >
      {value > 0 ? `-${value}` : 0}
    </div>
  ) : null;
}
