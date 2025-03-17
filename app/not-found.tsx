import Link from "next/link"
import { Settings } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center items-center gap-4 mb-8">
            <Settings className="w-20 h-20 text-gray-400 animate-spin-slow" />
            <Settings className="w-16 h-16 text-gray-600 animate-reverse-spin" />
          </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-500 mb-8">
          Oops! It seems our gears got stuck. The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

