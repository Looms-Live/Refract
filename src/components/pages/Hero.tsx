import React from 'react'

function Hero() {
  return (
    <div className="min-h-screen bg-white">
      {/* Grid Background*/}
      <div className="w-full h-64 opacity-30 grid-background"></div>
      {/* Content below the grid */}
      <div className="max-w-6xl mx-auto px-6 py-26">
        <div className="text-center space-y-8">
          {/* Brand name */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-6xl font-bold text-black">From scattered docs to instant answers.</span>
          </div>

          {/* Main description */}
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            No more digging. Our AI combs through files and mail to give you direct answers, custom reports, and citations you can trust.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button className="px-10 py-4 text-lg font-semibold text-white bg-black rounded-xl transition-colors shadow-lg">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
