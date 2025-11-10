'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Plane, Star, ArrowRight, Clock, Users } from 'lucide-react'

const PopularFlights = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const flights = [
    {
      id: 1,
      route: "New York to Paris",
      from: "JFK",
      to: "CDG",
      image: "https://plus.unsplash.com/premium_photo-1661914178431-fc899737a386?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "europe",
      rating: 4.8,
      reviewCount: 2847,
      startingPrice: 45999,
      duration: "7h 35m",
      airline: "Air France",
      description: "City of lights and romance awaits",
      isPopular: true,
      frequency: "14 daily flights"
    },
    {
      id: 2,
      route: "London to Tokyo",
      from: "LHR",
      to: "NRT",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      category: "asia",
      rating: 4.9,
      reviewCount: 3421,
      startingPrice: 52999,
      duration: "11h 45m",
      airline: "British Airways",
      description: "Experience the blend of tradition and modernity",
      isPopular: true,
      frequency: "8 daily flights"
    },
    {
      id: 3,
      route: "Dubai to New York",
      from: "DXB",
      to: "JFK",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      category: "america",
      rating: 4.7,
      reviewCount: 4156,
      startingPrice: 38999,
      duration: "14h 20m",
      airline: "Emirates",
      description: "From desert luxury to the Big Apple",
      isPopular: false,
      frequency: "6 daily flights"
    },
    {
      id: 4,
      route: "Singapore to Sydney",
      from: "SIN",
      to: "SYD",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      category: "oceania",
      rating: 4.6,
      reviewCount: 2654,
      startingPrice: 28999,
      duration: "8h 15m",
      airline: "Singapore Airlines",
      description: "Gateway to Australia's vibrant harbor city",
      isPopular: true,
      frequency: "12 daily flights"
    },
    {
      id: 5,
      route: "Los Angeles to Bangkok",
      from: "LAX",
      to: "BKK",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=400&fit=crop",
      category: "asia",
      rating: 4.5,
      reviewCount: 3231,
      startingPrice: 42799,
      duration: "15h 30m",
      airline: "Thai Airways",
      description: "From Hollywood to the Land of Smiles",
      isPopular: false,
      frequency: "5 daily flights"
    },
    {
      id: 6,
      route: "Frankfurt to São Paulo",
      from: "FRA",
      to: "GRU",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop",
      category: "america",
      rating: 4.8,
      reviewCount: 1987,
      startingPrice: 48599,
      duration: "11h 55m",
      airline: "Lufthansa",
      description: "Connect Europe to Brazil's megacity",
      isPopular: true,
      frequency: "7 daily flights"
    }
  ]

  const categories = [
    { id: 'all', label: 'All Routes' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia' },
    { id: 'america', label: 'Americas' },
    { id: 'oceania', label: 'Oceania' },
    { id: 'africa', label: 'Africa' }
  ]

  const filteredFlights = activeCategory === 'all' 
    ? flights 
    : flights.filter(flight => flight.category === activeCategory)

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-gray-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#ff9e9163] text-[#ff553d] px-4 py-2 rounded-full text-sm font-medium mb-4 border border-orange-200">
            <Plane size={16} />
            Explore The World
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Popular Flight Routes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book the best flights to incredible destinations worldwide with competitive prices and trusted airlines
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:text-white shadow-md hover:shadow-lg'
              }`}
              style={{
                backgroundColor: activeCategory === category.id ? '#ff553d' : undefined,
                '--hover-bg': '#ff553d'
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== category.id) {
                  e.target.style.backgroundColor = '#ff553d'
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category.id) {
                  e.target.style.backgroundColor = ''
                }
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Flights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {filteredFlights.map((flight, index) => (
            <div 
              key={flight.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={flight.image}
                  alt={flight.route}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Popular Badge */}
                {flight.isPopular && (
                  <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium" style={{backgroundColor: '#ff553d'}}>
                    Popular Route
                  </div>
                )}

                {/* Flight Route Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                  {flight.from} → {flight.to}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover Content */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-2">
                    View Flights
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:transition-colors duration-200" style={{'--hover-color': '#ff553d'}} 
                      onMouseEnter={(e) => e.target.style.color = '#ff553d'}
                      onMouseLeave={(e) => e.target.style.color = ''}>
                    {flight.route}
                  </h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-yellow-700">
                      {flight.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {flight.description}
                </p>

                {/* Flight Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{flight.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{flight.frequency}</span>
                  </div>
                </div>

                {/* Airline */}
                <div className="mb-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                    {flight.airline}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{flight.reviewCount.toLocaleString()} reviews</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Starting from</div>
                    <div className="text-xl font-bold" style={{color: '#ff553d'}}>
                      ₹{flight.startingPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <button className="w-full mt-4 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #ff553d 0%, #ff3d1a 100%)',
                          '--hover-bg': 'linear-gradient(135deg, #ff3d1a 0%, #e6341a 100%)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #ff3d1a 0%, #e6341a 100%)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #ff553d 0%, #ff3d1a 100%)'
                        }}>
                  Book Flight
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-white border-2 hover:text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{
                    color: '#ff553d',
                    borderColor: '#ff553d'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ff553d'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.color = '#ff553d'
                  }}>
            View All Flight Routes
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </section>
  )
}

export default PopularFlights