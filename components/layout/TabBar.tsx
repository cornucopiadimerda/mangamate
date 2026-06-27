'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Camera, BookOpen, Heart, User } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/scan', icon: Camera, label: 'Scan', isCenter: true },
  { href: '/collection', icon: BookOpen, label: 'Collezione' },
  { href: '/profile', icon: User, label: 'Profilo' },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid #2C2C2E',
      }}
    >
      <div
        className="flex items-center justify-around"
        style={{ height: 60, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {tabs.map(({ href, icon: Icon, label, isCenter }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (isCenter) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center justify-center flex-1 h-full tap-scale">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 52,
                    height: 36,
                    background: isActive ? '#FF3B30' : '#2C2C2E',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <Icon size={22} color={isActive ? '#FFFFFF' : '#8E8E93'} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full tap-scale"
            >
              <Icon
                size={22}
                color={isActive ? '#FF3B30' : '#8E8E93'}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{ transition: 'color 0.2s ease' }}
              />
              <span
                className="text-[9px] font-medium"
                style={{ color: isActive ? '#FF3B30' : '#8E8E93', transition: 'color 0.2s ease' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
