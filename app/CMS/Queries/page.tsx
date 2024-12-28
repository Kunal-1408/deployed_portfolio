import { Suspense } from 'react'
import QueriesContent from './queries-content'

export default function QueriesPage() {
  return (
    <div className="h-screen">
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <QueriesContent />
      </Suspense>
    </div>
  )
}

