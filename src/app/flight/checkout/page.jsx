import FlightCheckoutPage from "./Checkout"
import { Suspense } from "react"
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightCheckoutPage />
    </Suspense>
  )
}

export default page