'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plane, Check, Download, Mail, Phone, Calendar, Users, MapPin, Luggage, Clock, CreditCard, Share2, Home, ChevronRight, Printer } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const BookingConfirmationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Generate booking reference
  const [bookingRef] = useState(() => `BK${Date.now().toString().slice(-8)}`)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Extract search parameters (would come from checkout)
  const flightId = searchParams.get('flightId') || 'FL1000'
  const tripType = searchParams.get('tripType') || 'round-trip'
  const travelClass = searchParams.get('travelClass') || 'economy'
  const adults = parseInt(searchParams.get('adults') || '1')
  const children = parseInt(searchParams.get('children') || '0')
  const infants = parseInt(searchParams.get('infants') || '0')
  const departureDate = searchParams.get('departureDate') || new Date().toISOString().split('T')[0]
  const returnDate = searchParams.get('returnDate') || ''
  const origin = searchParams.get('from') || 'kanpur'
  const destination = searchParams.get('to') || 'lucknow'

  // Mock booking data
  const booking = {
    bookingReference: bookingRef,
    status: 'Confirmed',
    bookingDate: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    flight: {
      airline: 'IndiGo',
      airlineLogo: '🔵',
      flightNumber: '6E 202',
      aircraft: 'Airbus A320',
      from: origin.toUpperCase(),
      fromCity: origin.charAt(0).toUpperCase() + origin.slice(1),
      to: destination.toUpperCase(),
      toCity: destination.charAt(0).toUpperCase() + destination.slice(1),
      departureTime: '10:30',
      arrivalTime: '12:45',
      departureDate: departureDate,
      duration: '2h 15m',
      terminal: { departure: 'Terminal 2', arrival: 'Terminal 1' },
      class: travelClass,
      pnr: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    },
    returnFlight: tripType === 'round-trip' && returnDate ? {
      airline: 'IndiGo',
      airlineLogo: '🔵',
      flightNumber: '6E 305',
      aircraft: 'Airbus A320',
      from: destination.toUpperCase(),
      fromCity: destination.charAt(0).toUpperCase() + destination.slice(1),
      to: origin.toUpperCase(),
      toCity: origin.charAt(0).toUpperCase() + origin.slice(1),
      departureTime: '14:30',
      arrivalTime: '16:45',
      departureDate: returnDate,
      duration: '2h 15m',
      terminal: { departure: 'Terminal 1', arrival: 'Terminal 2' },
      class: travelClass,
      pnr: `${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    } : null,
    passengers: [
      { type: 'Adult', name: 'John Doe', seatNumber: '12A' },
      ...(children > 0 ? [{ type: 'Child', name: 'Jane Doe', seatNumber: '12B' }] : []),
      ...(infants > 0 ? [{ type: 'Infant', name: 'Baby Doe', seatNumber: 'Lap' }] : [])
    ],
    contact: {
      email: 'john.doe@email.com',
      phone: '+91 9876543210'
    },
    payment: {
      method: 'Credit Card',
      amount: 4500,
      transactionId: `TXN${Date.now().toString().slice(-10)}`
    },
    baggage: {
      checkin: travelClass === 'economy' ? '15 kg' : travelClass === 'premium-economy' ? '20 kg' : '30 kg',
      cabin: '7 kg'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString, time) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`
  }

  const handleDownload = () => {
    alert('Downloading ticket as PDF...')
  }

  const handleEmail = () => {
    alert(`Confirmation email sent to ${booking.contact.email}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Flight Booking Confirmation',
        text: `My flight booking is confirmed! Booking Reference: ${booking.bookingReference}`,
        url: window.location.href
      })
    } else {
      alert('Booking link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-[#ff553d] to-yellow-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -20,
                rotate: 0
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: 360,
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="mb-6"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Check size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">Booking Confirmed!</h1>
            <p className="text-lg md:text-xl text-white/90 mb-2">Your flight has been successfully booked</p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-sm font-medium">Booking Reference:</span>
              <span className="text-xl font-bold">{booking.bookingReference}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff553d] text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
          >
            <Download size={20} />
            Download Ticket
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <Mail size={20} />
            Email Ticket
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
          >
            <Printer size={20} />
            Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all shadow-md hover:shadow-lg"
          >
            <Share2 size={20} />
            Share
          </button>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-8"
        >
          <div className="flex gap-3">
            <Mail size={24} className="text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Confirmation Sent</h3>
              <p className="text-sm text-amber-800">
                A confirmation email with your e-ticket has been sent to <strong>{booking.contact.email}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Flight Details Card - Outbound */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-[#ff553d] to-red-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Outbound Flight</h2>
              <div className="px-4 py-1 bg-white/20 rounded-full text-sm font-semibold">
                PNR: {booking.flight.pnr}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Airline Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="text-5xl">{booking.flight.airlineLogo}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{booking.flight.airline}</h3>
                <p className="text-gray-600">{booking.flight.flightNumber} • {booking.flight.aircraft}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-[#ff553d] text-sm font-semibold rounded-full">
                  {booking.flight.class.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
            </div>

            {/* Flight Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Departure</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{booking.flight.departureTime}</p>
                <p className="text-lg font-semibold text-gray-700">{booking.flight.fromCity} ({booking.flight.from})</p>
                <p className="text-sm text-gray-600">{formatDate(booking.flight.departureDate)}</p>
                <p className="text-sm text-gray-500 mt-2">{booking.flight.terminal.departure}</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="relative w-full">
                  <div className="h-0.5 bg-gray-300 w-full"></div>
                  <Plane size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff553d] rotate-90 bg-white px-1" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-3">{booking.flight.duration}</p>
                <p className="text-xs text-gray-500">Non-stop</p>
              </div>

              <div className="text-right md:text-left">
                <p className="text-sm text-gray-500 mb-1">Arrival</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{booking.flight.arrivalTime}</p>
                <p className="text-lg font-semibold text-gray-700">{booking.flight.toCity} ({booking.flight.to})</p>
                <p className="text-sm text-gray-600">{formatDate(booking.flight.departureDate)}</p>
                <p className="text-sm text-gray-500 mt-2">{booking.flight.terminal.arrival}</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users size={20} className="text-[#ff553d]" />
                Passengers
              </h4>
              <div className="space-y-2">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-semibold text-gray-800">{passenger.name}</span>
                      <span className="text-gray-600 ml-2">({passenger.type})</span>
                    </div>
                    <span className="text-gray-600">Seat: {passenger.seatNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Return Flight Details Card */}
        {booking.returnFlight && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Return Flight</h2>
                <div className="px-4 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  PNR: {booking.returnFlight.pnr}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Airline Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="text-5xl">{booking.returnFlight.airlineLogo}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{booking.returnFlight.airline}</h3>
                  <p className="text-gray-600">{booking.returnFlight.flightNumber} • {booking.returnFlight.aircraft}</p>
                </div>
              </div>

              {/* Flight Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Departure</p>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{booking.returnFlight.departureTime}</p>
                  <p className="text-lg font-semibold text-gray-700">{booking.returnFlight.fromCity} ({booking.returnFlight.from})</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.returnFlight.departureDate)}</p>
                  <p className="text-sm text-gray-500 mt-2">{booking.returnFlight.terminal.departure}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full">
                    <div className="h-0.5 bg-gray-300 w-full"></div>
                    <Plane size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 rotate-90 bg-white px-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mt-3">{booking.returnFlight.duration}</p>
                  <p className="text-xs text-gray-500">Non-stop</p>
                </div>

                <div className="text-right md:text-left">
                  <p className="text-sm text-gray-500 mb-1">Arrival</p>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{booking.returnFlight.arrivalTime}</p>
                  <p className="text-lg font-semibold text-gray-700">{booking.returnFlight.toCity} ({booking.returnFlight.to})</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.returnFlight.departureDate)}</p>
                  <p className="text-sm text-gray-500 mt-2">{booking.returnFlight.terminal.arrival}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Baggage Allowance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Luggage size={24} className="text-[#ff553d]" />
              Baggage Allowance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in Baggage</span>
                <span className="font-semibold text-gray-800">{booking.baggage.checkin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cabin Baggage</span>
                <span className="font-semibold text-gray-800">{booking.baggage.cabin}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={24} className="text-[#ff553d]" />
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-800">{booking.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-semibold text-gray-800 text-sm">{booking.payment.transactionId}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-800 font-bold">Total Paid</span>
                <span className="font-bold text-[#ff553d] text-xl">₹{booking.payment.amount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Important Information */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={24} className="text-[#ff553d]" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Web check-in opens 48 hours before departure</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Please arrive at the airport at least 2 hours before departure for domestic flights</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Carry a valid government-issued photo ID for all passengers</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Keep your PNR number handy for check-in and queries</span>
            </li>
          </ul>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200"
        >
          <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
          <p className="text-gray-700 mb-4">Our customer support team is available 24/7 to assist you.</p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+911234567890" className="flex items-center gap-2 text-[#ff553d] hover:underline font-semibold">
              <Phone size={18} />
              +91 123 456 7890
            </a>
            <a href="mailto:info@hoteliorooms.com" className="flex items-center gap-2 text-[#ff553d] hover:underline font-semibold">
              <Mail size={18} />
              info@hoteliorooms.com
            </a>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home size={20} />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage