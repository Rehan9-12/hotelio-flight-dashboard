'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plane, User, Mail, Phone, Calendar, CreditCard, Lock, Check, AlertCircle, ChevronDown, ArrowLeft, Shield, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

const FlightCheckoutPage = () => {
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

  // Form state
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    countryCode: '+91'
  })

  const [passengers, setPassengers] = useState(() => {
    const passengerList = []
    for (let i = 0; i < adults; i++) {
      passengerList.push({ type: 'adult', firstName: '', lastName: '', dob: '', gender: 'male' })
    }
    for (let i = 0; i < children; i++) {
      passengerList.push({ type: 'child', firstName: '', lastName: '', dob: '', gender: 'male' })
    }
    for (let i = 0; i < infants; i++) {
      passengerList.push({ type: 'infant', firstName: '', lastName: '', dob: '', gender: 'male' })
    }
    return passengerList
  })

  const [addOns, setAddOns] = useState({
    meal: false,
    extraBaggage: false,
    insurance: false,
    seatSelection: false
  })

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Mock flight data
  const flight = {
    airline: 'IndiGo',
    flightNumber: '6E 202',
    from: origin?.toUpperCase() || 'DEL',
    to: destination?.toUpperCase() || 'BOM',
    departureTime: '10:30',
    arrivalTime: '12:45',
    duration: '2h 15m',
    price: travelClass === 'economy' ? 3500 : 
           travelClass === 'premium-economy' ? 6500 :
           travelClass === 'business' ? 12500 : 25000,
    class: travelClass
  }

  const totalPassengers = adults + children + infants
  const basePrice = flight.price * (adults + children) + (flight.price * infants * 0.1)
  const addOnsPrices = {
    meal: 500 * totalPassengers,
    extraBaggage: 1000 * totalPassengers,
    insurance: 300 * totalPassengers,
    seatSelection: 200 * totalPassengers
  }
  const addOnsTotal = Object.entries(addOns).reduce((sum, [key, value]) => 
    sum + (value ? addOnsPrices[key] : 0), 0)
  const taxes = Math.round((basePrice + addOnsTotal) * 0.12)
  const totalPrice = basePrice + addOnsTotal + taxes

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers]
    updated[index][field] = value
    setPassengers(updated)
  }

  const validateStep = (step) => {
    if (step === 1) {
      return contactInfo.email && contactInfo.phone && passengers.every(p => 
        p.firstName && p.lastName && p.dob && p.gender
      )
    }
    if (step === 2) {
      return true // Add-ons are optional
    }
    if (step === 3) {
      if (paymentMethod === 'card') {
        return cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvv && agreeTerms
      }
      return agreeTerms
    }
    return false
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        handlePayment()
      }
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handlePayment = () => {
    const paymentParams = new URLSearchParams({
      flightId: flightId || '',
      tripType: tripType || '',
      travelClass: travelClass || '',
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      departureDate: departureDate || '',
      returnDate: returnDate || '',
      from: origin || '',
      to: destination || '',
      totalPrice: totalPrice.toString(),
      basePrice: basePrice.toString(),
      addOnsTotal: addOnsTotal.toString(),
      taxes: taxes.toString(),
      email: contactInfo.email,
      phone: contactInfo.phone,
      countryCode: contactInfo.countryCode,
      passengers: JSON.stringify(passengers),
      addOns: JSON.stringify(addOns),
      paymentMethod: paymentMethod
    })
    
    router.push(`/flight/payments?${paymentParams.toString()}`)
  }
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff553d] to-red-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Details</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Complete Your Booking</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 max-w-2xl">
            {[
              { num: 1, label: 'Traveler Details' },
              { num: 2, label: 'Add-ons' },
              { num: 3, label: 'Payment' }
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    currentStep >= step.num
                      ? "bg-white text-[#ff553d]"
                      : "bg-white/30 text-white"
                  )}>
                    {currentStep > step.num ? <Check size={16} /> : step.num}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </div>
                {idx < 2 && (
                  <div className={clsx(
                    "h-0.5 flex-1 mx-2",
                    currentStep > step.num ? "bg-white" : "bg-white/30"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Traveler Details */}
            {currentStep === 1 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Mail size={24} className="text-[#ff553d]" />
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={contactInfo.countryCode}
                          onChange={(e) => setContactInfo({...contactInfo, countryCode: e.target.value})}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                          placeholder="1234567890"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Your booking confirmation will be sent to this email and phone number
                  </p>
                </div>

                {/* Passenger Details */}
                {passengers.map((passenger, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User size={24} className="text-[#ff553d]" />
                      Passenger {index + 1} ({passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                          placeholder="First Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={passenger.dob}
                          onChange={(e) => updatePassenger(index, 'dob', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d] focus:border-transparent"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Please ensure name matches with government-issued ID
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 2: Add-ons */}
            {currentStep === 2 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">Enhance Your Journey</h2>
                <div className="space-y-4">
                  {[
                    { key: 'meal', icon: '🍽️', title: 'Meal Selection', desc: 'Pre-order delicious meals', price: addOnsPrices.meal },
                    { key: 'extraBaggage', icon: '🧳', title: 'Extra Baggage', desc: 'Add 15kg extra baggage', price: addOnsPrices.extraBaggage },
                    { key: 'insurance', icon: '🛡️', title: 'Travel Insurance', desc: 'Comprehensive travel protection', price: addOnsPrices.insurance },
                    { key: 'seatSelection', icon: '💺', title: 'Seat Selection', desc: 'Choose your preferred seat', price: addOnsPrices.seatSelection }
                  ].map((addon) => (
                    <div
                      key={addon.key}
                      className={clsx(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        addOns[addon.key]
                          ? "border-[#ff553d] bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setAddOns({...addOns, [addon.key]: !addOns[addon.key]})}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{addon.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800">{addon.title}</h3>
                            <p className="text-sm text-gray-600">{addon.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#ff553d]">₹{addon.price.toLocaleString()}</p>
                          <div className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2",
                            addOns[addon.key]
                              ? "border-[#ff553d] bg-[#ff553d]"
                              : "border-gray-300"
                          )}>
                            {addOns[addon.key] && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Payment Method Selection */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard size={24} className="text-[#ff553d]" />
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                      { value: 'upi', label: 'UPI', icon: '📱' },
                      { value: 'netbanking', label: 'Net Banking', icon: '🏦' }
                    ].map((method) => (
                      <div
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={clsx(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all text-center",
                          paymentMethod === method.value
                            ? "border-[#ff553d] bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          placeholder="Name on card"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            placeholder="123"
                            maxLength="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === 'upi' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">UPI Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Bank</h3>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff553d]">
                      <option>Select Bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 mt-1 text-[#ff553d] rounded focus:ring-[#ff553d]"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-[#ff553d] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#ff553d] hover:underline">Privacy Policy</a>. I understand that my booking is subject to airline fare rules and cancellation policies.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#ff553d] to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                {currentStep === 3 ? (
                  <>
                    <Lock size={20} />
                    Pay ₹{totalPrice.toLocaleString()}
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              {/* Flight Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Plane size={20} className="text-[#ff553d]" />
                  <div>
                    <p className="font-semibold text-gray-800">{flight.airline}</p>
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{flight.from} → {flight.to}</span>
                  <span className="font-semibold text-gray-800">{flight.duration}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(departureDate)}
                  {tripType === 'round-trip' && returnDate && (
                    <> • {formatDate(returnDate)}</>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare ({totalPassengers} pax)</span>
                  <span className="font-semibold text-gray-800">₹{basePrice.toLocaleString()}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold text-gray-800">₹{addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold text-gray-800">₹{taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#ff553d]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={20} className="text-green-600" />
                  <span className="font-semibold text-green-800">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightCheckoutPage