import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import MetaMaskButton from './MetaMaskButton'
import { useTheme } from '../contexts/ThemeContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Assets', path: '/assets', icon: '💰' },
    { name: 'News', path: '/news', icon: '📰' },
    { name: 'Alerts', path: '/alerts', icon: '🔔' },
    { name: 'Portfolio', path: '/portfolio', icon: '💼' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                aria-label="Toggle navigation"
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
              <h1 className="text-2xl font-bold text-pulse-primary">Pulse</h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Market Monitoring Engine
              </span>
            </div>
            <div className="flex items-center gap-3">

              <div className="hidden md:block"><MetaMaskButton /></div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            aria-label="Close navigation"
          />
        )}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:static inset-y-16 left-0 z-40 w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] transition-transform duration-300 md:translate-x-0 dark:bg-gray-950 dark:border-gray-800`}
        >
          <nav className="p-4 flex flex-col h-full">
            <ul className="space-y-2 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-pulse-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
