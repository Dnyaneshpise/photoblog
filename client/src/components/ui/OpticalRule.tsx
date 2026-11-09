/**
 * Optical rule — Photolog original section separator.
 * Hairline with a centered notch (print registration feel).
 */
export function OpticalRule({ className = '' }: { className?: string }) {
  return (
    <div className={`pl-optical-rule ${className}`.trim()} role="presentation">
      <span className="pl-optical-rule__line" />
      <span className="pl-optical-rule__notch" />
    </div>
  )
}
