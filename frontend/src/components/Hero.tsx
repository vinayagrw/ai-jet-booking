import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-jet.jpg"
          alt="Luxury Private Jet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Experience Luxury in the Sky
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Book your private jet with ease. From business travel to leisure, we make luxury air travel accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/jets">
              <button className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-md hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl">
                Browse Jets
              </button>
            </Link>
            <Link href="/membership">
              <button className="px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-md hover:bg-white/10 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <div className="text-gray-200">Private Jets</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-200">Support</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-200">Destinations</div>
          </div>
        </div>
      </div>
    </div>
  );
} 