interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`text-section font-bold text-ink mb-8 ${className}`}>
      {children}
    </h2>
  );
}

export default SectionTitle;
