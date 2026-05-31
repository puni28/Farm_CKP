import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/orchard', label: 'Orchard Grid' },
  { to: '/settings', label: '⚙ Settings' },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6 sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-bold text-green-700 text-lg mr-4">
        🥭 Farm CKP
      </Link>
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
            location.pathname.startsWith(link.to) && (link.to !== '/' || location.pathname === '/')
              ? 'bg-green-100 text-green-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
