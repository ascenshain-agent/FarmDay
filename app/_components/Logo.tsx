export default function Logo() {
  return (
    <a
      href="/"
      className="farmday-logo"
      style={{ textDecoration: 'none' }}
      aria-label="Farm Day – home"
    >
      <span className="logo-icon" style={{ lineHeight: 1 }}>🌻</span>
      <span style={{ lineHeight: 1 }}>Farm Day</span>
    </a>
  )
}
