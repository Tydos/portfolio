interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent section heading used across home page sections.
 *
 * @param props.children - Heading text.
 * @param props.className - Optional extra classes (default bottom margin).
 */
function SectionTitle({ children, className = "mb-8" }: SectionTitleProps) {
  return (
    <h2 className={`text-section font-semibold text-ink ${className}`}>
      {children}
    </h2>
  );
}

export default SectionTitle;
