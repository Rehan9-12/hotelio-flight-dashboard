'use client'
import { Plane, Calendar, Users, Search, ChevronDown, Plus, Minus, ChevronLeft, ChevronRight, ArrowRightLeft, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'


const FlightSearchPage = () => {
  const [tripType, setTripType] = useState('round-trip') // 'one-way', 'round-trip', 'multi-city'
  const [travelClass, setTravelClass] = useState('economy') // 'economy', 'premium-economy', 'business', 'first'
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter();

  // Flight segments for multi-city
  const [flightSegments, setFlightSegments] = useState([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' }
  ])

  // Single trip data
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const passengersDropdownRef = useRef(null)

  // Hero images - flight themed
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      title: 'Explore the World'
    },
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'City Adventures'
    },
    {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2106&q=80',
      title: 'Mountain Getaways'
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Close passengers dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passengersDropdownRef.current && !passengersDropdownRef.current.contains(event.target)) {
        setShowPassengersDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [passengersDropdownRef])

  const isFormValid = () => {
    if (tripType === 'multi-city') {
      return flightSegments.every(segment => segment.from && segment.to && segment.date)
    } else {
      const basicValid = fromCity && toCity && departureDate
      return tripType === 'one-way' ? basicValid : basicValid && returnDate
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const queryParams = {
        tripType,
        travelClass,
        adults,
        children,
        infants,
      };

      if (tripType === 'multi-city') {
        // Add multi-city segments to query parameters
        flightSegments.forEach((segment, index) => {
          queryParams[`from${index}`] = segment.from;
          queryParams[`to${index}`] = segment.to;
          queryParams[`date${index}`] = segment.date;
        });
      } else {
        // Add one-way or round-trip data
        queryParams.from = fromCity;
        queryParams.to = toCity;
        queryParams.departureDate = departureDate;
        if (tripType === 'round-trip') {
          queryParams.returnDate = returnDate;
        }
      }

      // Navigate to the results page with the collected query parameters
      router.push(`/flight/results?${new URLSearchParams(queryParams).toString()}`);
      
    } else {
      alert('Please fill in all required fields to search.');
    }
  };

  const handleAdultsChange = (increment) => {
    const newAdults = Math.max(1, adults + increment)
    setAdults(newAdults)
    // Ensure infants don't exceed adults
    if (infants > newAdults) {
      setInfants(newAdults)
    }
  }

  const handleChildrenChange = (increment) => {
    setChildren(prev => Math.max(0, prev + increment))
  }

  const handleInfantsChange = (increment) => {
    const newInfants = Math.max(0, infants + increment)
    // Infants cannot exceed adults
    if (newInfants <= adults) {
      setInfants(newInfants)
    }
  }

  const swapCities = () => {
    const temp = fromCity
    setFromCity(toCity)
    setToCity(temp)
  }

  const addFlightSegment = () => {
    if (flightSegments.length < 3) {
      setFlightSegments([...flightSegments, { from: '', to: '', date: '' }])
    }
  }

  const removeFlightSegment = (index) => {
    if (flightSegments.length > 2) {
      setFlightSegments(flightSegments.filter((_, i) => i !== index))
    }
  }

  const updateFlightSegment = (index, field, value) => {
    const updated = flightSegments.map((segment, i) =>
      i === index ? { ...segment, [field]: value } : segment
    )
    setFlightSegments(updated)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { opacity: 0, scale: 0.8, y: -10 },
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={clsx(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                currentSlide === index ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
        >
          <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
        >
          <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={clsx(
                "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-6 max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff553d]/90 to-orange-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold mb-8 border border-white/20 shadow-xl"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              FLY ANYWHERE, ANYTIME
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg"
            >
              Book Your Next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 drop-shadow-none">
                Flight
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md"
            >
              Compare prices and find the best deals on flights worldwide.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Search Form Section */}
      <div className="relative -mt-16 z-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto ">
          <motion.div
            className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            {/* Trip Type and Class Selector */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Trip Type */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'one-way', label: 'One Way' },
                  { value: 'round-trip', label: 'Round Trip' },
                  { value: 'multi-city', label: 'Multi-City' }
                ].map(({ value, label }) => (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() => setTripType(value)}
                    className={clsx(
                      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      tripType === value
                        ? "bg-[#ff553d] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px bg-gray-300 self-stretch"></div>

              {/* Travel Class */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'economy', label: 'Economy' },
                  { value: 'premium-economy', label: 'Premium Economy' },
                  { value: 'business', label: 'Business' },
                  { value: 'first', label: 'First Class' }
                ].map(({ value, label }) => (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() => setTravelClass(value)}
                    className={clsx(
                      "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      travelClass === value
                        ? "bg-[#ff553d] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              
              {/* Multi-City Flight Segments */}
              {tripType === 'multi-city' && (
                <div className="space-y-4">
                  {flightSegments.map((segment, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <span className="w-6 h-6 bg-[#ff553d] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {index >= 2 && (
                          <button
                            type="button"
                            onClick={() => removeFlightSegment(index)}
                            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500 mb-2">From</label>
                          <div className="relative">
                            <Plane size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={segment.from}
                              onChange={(e) => updateFlightSegment(index, 'from', e.target.value)}
                              placeholder="Departure city"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500 mb-2">To</label>
                          <div className="relative">
                            <Plane size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                            <input
                              type="text"
                              value={segment.to}
                              onChange={(e) => updateFlightSegment(index, 'to', e.target.value)}
                              placeholder="Destination city"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500 mb-2">Date</label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                              type="date"
                              value={segment.date}
                              onChange={(e) => updateFlightSegment(index, 'date', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {flightSegments.length < 3 && (
                    <button
                      type="button"
                      onClick={addFlightSegment}
                      className="flex items-center gap-2 text-[#ff553d] hover:text-red-600 font-medium transition-colors"
                    >
                      <Plus size={16} />
                      Add Another Flight
                    </button>
                  )}
                </div>
              )}

              {/* Single/Round Trip Form */}
              {tripType !== 'multi-city' && (
                <>
                  {/* First Row: From, To, and Passengers */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* From and To Cities with Swap Button */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 relative">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-2">From</label>
                        <div className="relative">
                          <Plane size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={fromCity}
                            onChange={(e) => setFromCity(e.target.value)}
                            placeholder="Departure city"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                          />
                        </div>
                      </div>

                      {/* Swap Button */}
                      <div className="hidden sm:flex items-end pb-3">
                        <motion.button
                          type="button"
                          onClick={swapCities}
                          className="w-10 h-10 bg-gray-100 hover:bg-[#ff553d] hover:text-white rounded-full flex items-center justify-center transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowRightLeft size={16} />
                        </motion.button>
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-2">To</label>
                        <div className="relative">
                          <Plane size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
                          <input
                            type="text"
                            value={toCity}
                            onChange={(e) => setToCity(e.target.value)}
                            placeholder="Destination city"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Passengers Dropdown */}
                    <div className="relative lg:w-80" ref={passengersDropdownRef}>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Passengers</label>
                      <motion.button
                        type="button"
                        onClick={() => setShowPassengersDropdown(!showPassengersDropdown)}
                        className="w-full flex justify-between items-center pl-4 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent transition-all"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <Users size={18} className="text-gray-400" />
                          <span className="text-gray-800 font-medium text-sm">
                            {`${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}, ${infants} Infant${infants !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <ChevronDown size={16} className={clsx("text-gray-400 transition-transform duration-200", { 'rotate-180': showPassengersDropdown })} />
                      </motion.button>

                      {/* Passengers Dropdown Panel */}
                      <AnimatePresence>
                        {showPassengersDropdown && (
                          <motion.div
                            className="absolute z-30 top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-4"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <div className="space-y-3">
                              {/* Adults */}
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Adults</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAdultsChange(-1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#ff553d] hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="font-bold w-6 text-center">{adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleAdultsChange(1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#ff553d] hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                              {/* Children */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-700">Children</span>
                                  <p className="text-xs text-gray-500">Ages 2-17</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleChildrenChange(-1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#ff553d] hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="font-bold w-6 text-center">{children}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleChildrenChange(1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#ff553d] hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                              {/* Infants */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-700">Infants</span>
                                  <p className="text-xs text-gray-500">Under 2 years</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleInfantsChange(-1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#ff553d] hover:text-white transition-colors flex items-center justify-center text-gray-600 font-bold"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="font-bold w-6 text-center">{infants}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleInfantsChange(1)}
                                    disabled={infants >= adults}
                                    className={clsx(
                                      "w-7 h-7 rounded-full transition-colors flex items-center justify-center font-bold",
                                      infants >= adults
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-[#ff553d] hover:text-white text-gray-600"
                                    )}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                              {infants >= adults && (
                                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                  Number of infants cannot exceed number of adults
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Second Row: Dates and Search Button */}
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Departure and Return Dates */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Departure</label>
                        <div className="relative">
                          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                          />
                        </div>
                      </div>
                      {tripType === 'round-trip' && (
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-500 mb-2">Return</label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                              type="date"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-[#ff553d] transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Search Button */}
                    <motion.button
                      type="button"
                      onClick={handleSearch}
                      className="px-8 py-3 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap h-fit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search size={20} />
                      Search Flights
                    </motion.button>
                  </div>
                </>
              )}

              {/* Search Button for Multi-City */}
              {tripType === 'multi-city' && (
                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={handleSearch}
                    className="px-8 py-3 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Search size={20} />
                    Search Flights
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FlightSearchPage