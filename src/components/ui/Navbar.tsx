import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center space-x-3">
          <Image
            src="/assets/icon.svg"
            alt="Refract Logo"
            width={32}
            height={32}
            className="w-8 h-8 invert"
          />
          <span className="text-xl font-bold text-black">Refract</span>
        </div>
      </Link>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/labs" className="text-gray-600 hover:text-gray-900 font-medium">
          Blog
        </Link>
        <a href="/info/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
          Pricing
        </a>
        <a href="/info/ethos" className="text-gray-600 hover:text-gray-900 font-medium">
          Our Mission
        </a>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center space-x-4">
        <button className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95">
          Sign In
        </button>
      </div>
    </nav>
  )
}

export default Navbar
