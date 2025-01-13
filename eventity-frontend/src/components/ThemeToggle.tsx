'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mencegah flash selama hydration
  if (!mounted) {
    return <div className="w-14 h-7" /> // placeholder dengan ukuran yang sama
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative rounded-full w-14 h-7 bg-zinc-200 dark:bg-zinc-700 transition-colors duration-200 flex items-center"
    >
      <div className="absolute left-1 right-1 flex justify-between items-center">
        <Sun className="h-5 w-5 text-yellow-500" />
        <Moon className="h-5 w-5 text-blue-300" />
      </div>
      <div 
        className={`absolute h-5 w-5 rounded-full bg-white shadow-md transform duration-200 ease-in-out ${
          mounted ? (theme === 'dark' ? 'translate-x-8' : 'translate-x-1') : 'translate-x-1'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}