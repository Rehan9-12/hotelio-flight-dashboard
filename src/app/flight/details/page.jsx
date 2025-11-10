import { Suspense } from "react"
import FlightDetailsPage from "./BookingDetails"

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightDetailsPage />
    </Suspense>
  )
}

export default page