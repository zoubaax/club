import { Outlet, Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
// Import your logo from assets
import logo from '../assets/white.png' // Adjust extension (.png, .jpg, .svg)

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-950">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b-2 border-blue-200 dark:border-blue-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                {/* Use the imported logo */}
                <div className="flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img 
                    src={logo} // Use the imported logo variable
                    alt="Logo"
                    className="h-16 w-auto" // Adjust size as needed
                  />
                </div>
              </Link>
              
              <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800"
                >
                  Home
                </Link>
                <Link
                  to="/teams"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  Teams
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}