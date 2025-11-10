import BookingConfirmationPage from "./BookingConfirmation"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationPage />
    </Suspense>
  )
}

export default page