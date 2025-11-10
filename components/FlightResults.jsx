'use client'
import { Plane, Clock, Calendar, Users, ArrowRight, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const FlightResultsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract search parameters
  const tripType = searchParams.get('tripType') || 'round-trip'
  const travelClass = searchParams.get('travelClass') || 'economy'
  const adults = parseInt(searchParams.get('adults') || '1')
  const children = parseInt(searchParams.get('children') || '0')
  const infants = parseInt(searchParams.get('infants') || '0')
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const departureDate = searchParams.get('departureDate') || ''
  const returnDate = searchParams.get('returnDate') || ''

  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('cheapest')
  const [selectedStops, setSelectedStops] = useState(['all'])
  const [selectedAirlines, setSelectedAirlines] = useState(['all'])
  const [priceRange, setPriceRange] = useState([0, 50000])

  // Mock flight data generator
  const generateMockFlights = () => {
    const airlines = [
      { name: 'IndiGo', code: '6E', logo: '🔵' },
      { name: 'Air India', code: 'AI', logo: '🔴' },
      { name: 'SpiceJet', code: 'SG', logo: '🔴' },
      { name: 'Vistara', code: 'UK', logo: '🟣' },
      { name: 'AirAsia India', code: 'I5', logo: '🔴' },
      { name: 'Go First', code: 'G8', logo: '🟡' }
    ]

    const stops = [0, 1, 2]
    const basePrice = travelClass === 'economy' ? 3000 : 
                     travelClass === 'premium-economy' ? 6000 :
                     travelClass === 'business' ? 12000 : 25000

    const flights = []
    
    for (let i = 0; i < 12; i++) {
      const airline = airlines[i % airlines.length]
      const stopCount = stops[Math.floor(Math.random() * stops.length)]
      const departureHour = 6 + Math.floor(Math.random() * 16)
      const duration = 1 + Math.random() * 3 + (stopCount * 1.5)
      const price = basePrice + Math.floor(Math.random() * basePrice * 0.8)
      
      const departureTime = `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      const arrivalHour = (departureHour + Math.floor(duration)) % 24
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      
      flights.push({
        id: `FL${1000 + i}`,
        airline: airline.name,
        airlineCode: airline.code,
        airlineLogo: airline.logo,
        flightNumber: `${airline.code}${200 + i}`,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        departureTime,
        arrivalTime,
        duration: `${Math.floor(duration)}h ${Math.floor((duration % 1) * 60)}m`,
        stops: stopCount,
        price: price,
        seatsLeft: Math.floor(Math.random() * 20) + 5,
        class: travelClass
      })
    }

    return flights
  }

  const [flights, setFlights] = useState([])

  useEffect(() => {
    setFlights(generateMockFlights())
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const filteredAndSortedFlights = () => {
    let result = [...flights]

    // Filter by stops
    if (!selectedStops.includes('all')) {
      result = result.filter(flight => selectedStops.includes(flight.stops.toString()))
    }

    // Filter by airlines
    if (!selectedAirlines.includes('all')) {
      result = result.filter(flight => selectedAirlines.includes(flight.airline))
    }

    // Filter by price range
    result = result.filter(flight => flight.price >= priceRange[0] && flight.price <= priceRange[1])

    // Sort
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration))
    } else if (sortBy === 'earliest') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    }

    return result
  }

  const handleFlightClick = (flight) => {
    const params = new URLSearchParams({
      flightId: flight.id,
      tripType,
      travelClass,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      from,
      to,
      departureDate,
      returnDate: returnDate || ''
    })
    router.push(`/flight/details?${params.toString()}`)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  const totalPassengers = adults + children + infants

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff553d] to-red-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Flight Results</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Plane size={18} />
              <span className="font-semibold">{from}</span>
              <ArrowRight size={16} />
              <span className="font-semibold">{to}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(departureDate)}</span>
              {tripType === 'round-trip' && returnDate && (
                <>
                  <ArrowRight size={16} />
                  <span>{formatDate(returnDate)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}</span>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {travelClass.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={() => {
                    setSelectedStops(['all'])
                    setSelectedAirlines(['all'])
                    setPriceRange([0, 50000])
                  }}
                  className="text-[#ff553d] text-sm font-medium hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Stops Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Stops</h3>
                <div className="space-y-2">
                  {['all', '0', '1', '2'].map(stop => (
                    <label key={stop} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes(stop)}
                        onChange={(e) => {
                          if (stop === 'all') {
                            setSelectedStops(['all'])
                          } else {
                            const newStops = e.target.checked
                              ? [...selectedStops.filter(s => s !== 'all'), stop]
                              : selectedStops.filter(s => s !== stop)
                            setSelectedStops(newStops.length ? newStops : ['all'])
                          }
                        }}
                        className="w-4 h-4 text-[#ff553d] rounded focus:ring-[#ff553d]"
                      />
                      <span className="text-sm text-gray-600">
                        {stop === 'all' ? 'All' : stop === '0' ? 'Non-stop' : `${stop} Stop${stop !== '1' ? 's' : ''}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Airlines</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {['all', 'IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'AirAsia India', 'Go First'].map(airline => (
                    <label key={airline} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={(e) => {
                          if (airline === 'all') {
                            setSelectedAirlines(['all'])
                          } else {
                            const newAirlines = e.target.checked
                              ? [...selectedAirlines.filter(a => a !== 'all'), airline]
                              : selectedAirlines.filter(a => a !== airline)
                            setSelectedAirlines(newAirlines.length ? newAirlines : ['all'])
                          }
                        }}
                        className="w-4 h-4 text-[#ff553d] rounded focus:ring-[#ff553d]"
                      />
                      <span className="text-sm text-gray-600">{airline === 'all' ? 'All Airlines' : airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Sort and Filter Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">{filteredAndSortedFlights().length} flights found</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span className="font-medium">Filters</span>
                </button>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] bg-white"
                >
                  <option value="cheapest">Cheapest First</option>
                  <option value="fastest">Fastest First</option>
                  <option value="earliest">Earliest First</option>
                </select>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filteredAndSortedFlights().map((flight, index) => (
                <motion.div
                  key={flight.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleFlightClick(flight)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Airline Info */}
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{flight.airlineLogo}</div>
                        <div>
                          <h3 className="font-bold text-gray-800">{flight.airline}</h3>
                          <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                        </div>
                      </div>

                      {/* Flight Times */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{flight.departureTime}</p>
                          <p className="text-sm text-gray-500">{flight.from}</p>
                        </div>

                        <div className="flex-1 px-4">
                          <div className="relative">
                            <div className="h-0.5 bg-gray-300"></div>
                            <Plane size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff553d] rotate-90" />
                          </div>
                          <div className="text-center mt-2">
                            <p className="text-sm text-gray-600">{flight.duration}</p>
                            <p className="text-xs text-gray-500">
                              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{flight.arrivalTime}</p>
                          <p className="text-sm text-gray-500">{flight.to}</p>
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-[#ff553d]">₹{flight.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{flight.seatsLeft} seats left</p>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Bar */}
                  <div className="bg-gray-50 px-6 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      ✓ Free Cancellation
                    </span>
                    <span className="flex items-center gap-1">
                      ✓ Seat Selection
                    </span>
                    <span className="flex items-center gap-1">
                      ✓ Web Check-in
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredAndSortedFlights().length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Plane size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No flights found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Stops Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Stops</h3>
                  <div className="space-y-2">
                    {['all', '0', '1', '2'].map(stop => (
                      <label key={stop} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStops.includes(stop)}
                          onChange={(e) => {
                            if (stop === 'all') {
                              setSelectedStops(['all'])
                            } else {
                              const newStops = e.target.checked
                                ? [...selectedStops.filter(s => s !== 'all'), stop]
                                : selectedStops.filter(s => s !== stop)
                              setSelectedStops(newStops.length ? newStops : ['all'])
                            }
                          }}
                          className="w-4 h-4 text-[#ff553d] rounded focus:ring-[#ff553d]"
                        />
                        <span className="text-sm text-gray-600">
                          {stop === 'all' ? 'All' : stop === '0' ? 'Non-stop' : `${stop} Stop${stop !== '1' ? 's' : ''}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Airlines Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Airlines</h3>
                  <div className="space-y-2">
                    {['all', 'IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'AirAsia India', 'Go First'].map(airline => (
                      <label key={airline} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline)}
                          onChange={(e) => {
                            if (airline === 'all') {
                              setSelectedAirlines(['all'])
                            } else {
                              const newAirlines = e.target.checked
                                ? [...selectedAirlines.filter(a => a !== 'all'), airline]
                                : selectedAirlines.filter(a => a !== airline)
                              setSelectedAirlines(newAirlines.length ? newAirlines : ['all'])
                            }
                          }}
                          className="w-4 h-4 text-[#ff553d] rounded focus:ring-[#ff553d]"
                        />
                        <span className="text-sm text-gray-600">{airline === 'all' ? 'All Airlines' : airline}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FlightResultsPage