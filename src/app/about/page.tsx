export default function AboutPage() {
  return (
    <div className="min-h-screen bg-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold mb-8">About Precisely The Same</h1>
        
        <div className="prose prose-invert text-xl">
          <p className="mb-6">
            Welcome to preciselythesame.com - a collection of daily dairy milk caps, 
            one for every day of the year.
          </p>
          
          <p className="mb-6">
            This project showcases the beauty of consistency and the art of collecting. 
            Each milk cap tells a story of that particular day.
          </p>
          
          <div className="bg-blue-800 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
            <ul className="space-y-2">
              <li>• Next.js 14 with TypeScript</li>
              <li>• Neon PostgreSQL Database</li>
              <li>• Supabase for Authentication</li>
              <li>• Vercel for Deployment</li>
              <li>• Figma for Design Integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
