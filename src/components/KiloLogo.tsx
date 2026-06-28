// Znak marki KILO — abstrakcyjny podwójny szewron „w górę” (progres / interlocking).
// Używa currentColor, więc dziedziczy kolor (biały na czerni, błękit jako akcent).

interface KiloLogoProps {
  size?: number;
  className?: string;
}

const KiloLogo = ({ size = 48, className = '' }: KiloLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={className}
    role="img"
    aria-label="KILO"
  >
    <path
      d="M22 62 L50 36 L78 62"
      stroke="currentColor"
      strokeWidth="13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 80 L50 54 L78 80"
      stroke="currentColor"
      strokeWidth="13"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.45"
    />
  </svg>
);

export default KiloLogo;
