import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortfolioNavigationProps {
  userId: string;
  userName: string;
}

export default function PortfolioNavigation({
  userId,
  userName,
}: PortfolioNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { name: "Overview", path: `/portfolio/view/${userId}` },
    { name: "Projects", path: `/portfolio/view/${userId}/projects` },
    { name: "Skills", path: `/portfolio/view/${userId}/skills` },
    { name: "Experience", path: `/portfolio/view/${userId}/experience` },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                {userName}
              </span>
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href={`mailto:contact@example.com`}
              className="hidden sm:inline-block bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden py-2">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600 bg-white/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
