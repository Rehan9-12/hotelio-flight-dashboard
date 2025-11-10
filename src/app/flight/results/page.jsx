import FlightResultsPage from "../../../../components/FlightResults"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlightResultsPage />
    </Suspense>
  )
}
