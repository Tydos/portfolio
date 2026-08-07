interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

function SectionTitle({ children, className = "mb-8" }: SectionTitleProps) {
  return (
    <h2 className={`text-section font-semibold text-ink ${className}`}>
      {children}
    </h2>
  );
}

export default SectionTitle;
