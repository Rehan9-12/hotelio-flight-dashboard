'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plane, Clock, Calendar, Users, Luggage, Wifi, Coffee, Monitor, ChevronRight, ArrowLeft, Check, AlertCircle, MapPin, Shield } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const FlightDetailsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract search parameters
  const flightId = searchParams.get('flightId')
  const tripType = searchParams.get('tripType')
  const travelClass = searchParams.get('travelClass')
  const adults = parseInt(searchParams.get('adults') || '1')
  const children = parseInt(searchParams.get('children') || '0')
  const infants = parseInt(searchParams.get('infants') || '0')
  const departureDate = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const origin = searchParams.get('from')
  const destination = searchParams.get('to')

  const [selectedTab, setSelectedTab] = useState('details')

  // Mock flight data based on flightId
  const getFlightDetails = () => {
    const airlines = {
      'FL1000': { name: 'IndiGo', code: '6E', logo: '🔵' },
      'FL1001': { name: 'Air India', code: 'AI', logo: '🔴' },
      'FL1002': { name: 'SpiceJet', code: 'SG', logo: '🔴' },
      'FL1003': { name: 'Vistara', code: 'UK', logo: '🟣' },
      'FL1004': { name: 'AirAsia India', code: 'I5', logo: '🔴' },
      'FL1005': { name: 'Go First', code: 'G8', logo: '🟡' }
    }

    const airline = airlines[flightId] || airlines['FL1000']
    const flightNumber = parseInt(flightId.replace('FL', ''))
    
    return {
      id: flightId,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      flightNumber: `${airline.code}${200 + (flightNumber % 100)}`,
      from: origin?.toUpperCase() || 'DEL',
      to: destination?.toUpperCase() || 'BOM',
      departureTime: '10:30',
      arrivalTime: '12:45',
      duration: '2h 15m',
      stops: 0,
      price: travelClass === 'economy' ? 3500 : 
             travelClass === 'premium-economy' ? 6500 :
             travelClass === 'business' ? 12500 : 25000,
      seatsLeft: 12,
      class: travelClass,
      aircraft: 'Airbus A320',
      terminal: { departure: 'Terminal 2', arrival: 'Terminal 1' },
      baggage: {
        checkin: travelClass === 'economy' ? '15 kg' : travelClass === 'premium-economy' ? '20 kg' : '30 kg',
        cabin: '7 kg'
      },
      amenities: ['WiFi', 'In-flight Entertainment', 'Meals', 'Power Outlets'],
      cancellation: 'Free cancellation up to 24 hours before departure',
      reschedule: 'Free reschedule up to 12 hours before departure'
    }
  }

  const flight = getFlightDetails()
  const totalPassengers = adults + children + infants
  const totalPrice = flight.price * (adults + children + (infants * 0.1))

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const handleBookNow = () => {
    // Navigate to booking/payment page
    const params = new URLSearchParams({
      flightId: flight.id,
      tripType,
      travelClass,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      from: origin,
      to: destination,
      departureDate,
      returnDate: returnDate || ''
    })
    router.push(`/flight/checkout?${params.toString()}`)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-[#ff553d] to-red-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Results</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Flight Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Overview Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{flight.airlineLogo}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{flight.airline}</h2>
                    <p className="text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-4 py-2 bg-orange-50 text-[#ff553d] rounded-lg font-semibold">
                    {flight.class.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                </div>
              </div>

              {/* Flight Timeline */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-gray-800 mb-1">{flight.departureTime}</p>
                    <p className="text-lg font-semibold text-gray-700 mb-1">{flight.from}</p>
                    <p className="text-sm text-gray-500">{formatDate(departureDate)}</p>
                    <p className="text-sm text-gray-500 mt-2">{flight.terminal.departure}</p>
                  </div>

                  <div className="flex-1 px-6">
                    <div className="relative">
                      <div className="h-0.5 bg-gray-300"></div>
                      <Plane size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff553d] rotate-90 bg-gray-50 px-1" />
                    </div>
                    <div className="text-center mt-3">
                      <p className="text-sm font-semibold text-gray-700">{flight.duration}</p>
                      <p className="text-xs text-gray-500">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-3xl font-bold text-gray-800 mb-1">{flight.arrivalTime}</p>
                    <p className="text-lg font-semibold text-gray-700 mb-1">{flight.to}</p>
                    <p className="text-sm text-gray-500">{formatDate(departureDate)}</p>
                    <p className="text-sm text-gray-500 mt-2">{flight.terminal.arrival}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                  {['details', 'baggage', 'policies'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={clsx(
                        "pb-3 font-semibold capitalize transition-colors relative",
                        selectedTab === tab
                          ? "text-[#ff553d]"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab}
                      {selectedTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff553d]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {selectedTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Coffee size={20} className="text-[#ff553d]" />
                        Amenities & Services
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {flight.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Check size={16} className="text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <AlertCircle size={20} className="text-[#ff553d]" />
                        Important Information
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span>Web check-in opens 48 hours before departure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span>Arrive at least 2 hours before departure for domestic flights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span>Valid photo ID required for all passengers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span>Seat selection available during booking</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedTab === 'baggage' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Luggage size={24} className="text-[#ff553d]" />
                        <h3 className="font-semibold text-gray-800">Check-in Baggage</h3>
                      </div>
                      <p className="text-gray-600">{flight.baggage.checkin} per passenger</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Luggage size={20} className="text-[#ff553d]" />
                        <h3 className="font-semibold text-gray-800">Cabin Baggage</h3>
                      </div>
                      <p className="text-gray-600">{flight.baggage.cabin} per passenger</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Additional baggage can be purchased at the time of booking or at the airport.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTab === 'policies' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <Shield size={24} className="text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Cancellation Policy</h3>
                          <p className="text-sm text-gray-600">{flight.cancellation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Calendar size={24} className="text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Reschedule Policy</h3>
                          <p className="text-sm text-gray-600">{flight.reschedule}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Important:</strong> Fare rules and restrictions may apply. Full details will be provided during booking.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Return Flight Card (if round-trip) */}
            {tripType === 'round-trip' && returnDate && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ArrowLeft size={20} className="text-[#ff553d]" />
                  <h3 className="text-xl font-bold text-gray-800">Return Flight</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-gray-800 mb-1">14:30</p>
                      <p className="text-lg font-semibold text-gray-700">{flight.to}</p>
                      <p className="text-sm text-gray-500">{formatDate(returnDate)}</p>
                    </div>
                    <div className="flex-1 px-6">
                      <div className="relative">
                        <div className="h-0.5 bg-gray-300"></div>
                        <Plane size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff553d] -rotate-90 bg-gray-50 px-1" />
                      </div>
                      <div className="text-center mt-3">
                        <p className="text-sm font-semibold text-gray-700">{flight.duration}</p>
                        <p className="text-xs text-gray-500">Non-stop</p>
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-2xl font-bold text-gray-800 mb-1">16:45</p>
                      <p className="text-lg font-semibold text-gray-700">{flight.from}</p>
                      <p className="text-sm text-gray-500">{formatDate(returnDate)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-semibold text-gray-800">{flight.from} → {flight.to}</p>
                    {tripType === 'round-trip' && (
                      <p className="font-semibold text-gray-800">{flight.to} → {flight.from}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800 text-right text-sm">
                    {new Date(departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {tripType === 'round-trip' && returnDate && (
                      <> - {new Date(returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                    )}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Passengers</p>
                  <div className="text-right">
                    {adults > 0 && <p className="text-sm font-semibold text-gray-800">{adults} Adult{adults > 1 ? 's' : ''}</p>}
                    {children > 0 && <p className="text-sm font-semibold text-gray-800">{children} Child{children > 1 ? 'ren' : ''}</p>}
                    {infants > 0 && <p className="text-sm font-semibold text-gray-800">{infants} Infant{infants > 1 ? 's' : ''}</p>}
                  </div>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-semibold text-gray-800 text-sm capitalize">
                    {flight.class.split('-').join(' ')}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare ({adults + children} pax)</span>
                    <span className="font-semibold text-gray-800">₹{(flight.price * (adults + children)).toLocaleString()}</span>
                  </div>
                  {infants > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Infant Fare ({infants} pax)</span>
                      <span className="font-semibold text-gray-800">₹{(flight.price * infants * 0.1).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold text-gray-800">₹{Math.round(totalPrice * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#ff553d]">₹{Math.round(totalPrice * 1.12).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Book Now
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Check size={14} className="text-green-500" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightDetailsPage