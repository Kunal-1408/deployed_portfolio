import { Suspense } from 'react'
import QueriesClient from './queries-content'

export default function QueriesPage() {
  return (
    <Suspense fallback={<div>Loading queries...</div>}>
      <QueriesClient />
    </Suspense>
  )
}

