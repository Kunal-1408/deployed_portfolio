import { VideoPortfolio } from "@/components/video-portfolio"

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <div className="container mx-auto py-12 px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-600">Video Portfolio</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Showcasing our creative video editing and production work for clients across various industries.
          </p>
        </header>

        <VideoPortfolio />
      </div>
    </main>
  )
}
