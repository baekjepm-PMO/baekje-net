import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  {
    label: '회사 소개', 
    path: '/company', 
    children: [
      { label: '회사 개요', path: '/company/overview' },
      { label: '비전', path: '/company/vision' },
      { label: '연혁', path: '/company/history' },
      { label: '그룹사 소개', path: '/company/group' },
    ],
  },
  {
    label: '물류 서비스',
    path: '/logistics',
  },
  {
    label: '준법경영',
    path: '/compliance',
    children: [
      { label: 'CEO 메시지', path: '/compliance/ceo-message' },
      { label: '준법 및 윤리경영 실천', path: '/compliance/ethics' },
      { label: '영업사원의 윤리강령', path: '/compliance/sales-code' },
      { label: '자율준수 프로그램(CP)', path: '/compliance/cp' },
    ],
  },
  {
    label: 'Contact',
    path: '/contact',
    children: [
      { label: 'Contact', path: '/contact' },
      { label: '인재상', path: '/contact/talent' },
    ],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const location = useLocation();
  const isPalettePreviewPage = location.pathname === '/' || location.pathname.startsWith('/palette/');
  const useSolidHeader = isScrolled || isPalettePreviewPage;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        useSolidHeader
          ? 'site-header-scrolled'
          : 'bg-transparent'
      }`}
    >
      <div className="px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-[50px]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-700 ${
                useSolidHeader ? 'text-blue-fusion' : 'text-cloud-dancer'
              }`}
            >
              백제약품
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.path)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  to={item.children ? '#' : item.path}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      setDropdownOpen(
                        dropdownOpen === item.path ? null : item.path
                      );
                    }
                  }}
                  className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 rounded-lg ${
                    useSolidHeader
                      ? 'text-hematite hover:text-blue-fusion'
                      : 'text-cloud-dancer/75 hover:text-cloud-dancer'
                  } ${
                    location.pathname.startsWith(item.path)
                      ? useSolidHeader
                        ? 'text-blue-fusion'
                        : 'text-cloud-dancer'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>

                <AnimatePresence>
                  {item.children && dropdownOpen === item.path && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute top-full left-0 mt-1 bg-cloud-dancer rounded-xl shadow-premium-sm border border-cloud-cover/35 py-2 min-w-[220px]"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-5 py-2.5 text-[13px] transition-colors ${
                            location.pathname === child.path
                              ? 'text-blue-fusion bg-veiled-vista/60'
                              : 'text-hematite hover:text-blue-fusion hover:bg-veiled-vista/45'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* EN button */}
            <button
              className={`ml-3 px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded-full border transition-all duration-300 ${
                useSolidHeader
                  ? 'border-cloud-cover/50 text-hematite hover:border-golden-mist hover:text-blue-fusion'
                  : 'border-cloud-dancer/25 text-cloud-dancer/60 hover:border-golden-mist hover:text-cloud-dancer'
              }`}
            >
              EN
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className={useSolidHeader ? 'text-blue-fusion' : 'text-cloud-dancer'} size={22} />
            ) : (
              <Menu className={useSolidHeader ? 'text-blue-fusion' : 'text-cloud-dancer'} size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden bg-cloud-dancer border-t border-cloud-cover/35 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.path}>
                  {item.children ? (
                    <>
                      <div className="px-4 py-3 text-[13px] font-semibold text-blue-fusion">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-8 py-2.5 text-[13px] text-hematite hover:text-blue-fusion"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="block px-4 py-3 text-[13px] font-semibold text-blue-fusion hover:text-baltic-sea"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="px-4 pt-3 border-t border-cloud-cover/35">
                <button className="px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded-full border border-cloud-cover/50 text-hematite">
                  EN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
