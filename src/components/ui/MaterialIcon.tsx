interface MaterialIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialIcon({ icon, className = '', style }: MaterialIconProps) {
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      style={{ fontWeight: 100, ...style }}
    >
      {icon}
    </span>
  );
}


