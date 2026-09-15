import { Anton } from "next/font/google";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Photography route layout: loads Anton for the wired editorial display type.
 *
 * @param props.children - Portfolio page content.
 */
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={display.variable}>{children}</div>;
}
