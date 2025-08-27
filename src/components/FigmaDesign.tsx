'use client'

import { useState, useEffect } from 'react'

interface FigmaDesignProps {
  fileKey?: string
  nodeIds?: string[]
  title?: string
  description?: string
}

export default function FigmaDesign({ 
  fileKey, 
  nodeIds = [], 
  title = "DAILY DAIRY",
  description = "MY COLLECTION — A MILK CAP A DAY, EVERY DAY"
}: FigmaDesignProps) {
  const [designData, setDesignData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDesign = async () => {
    if (!fileKey) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/figma?fileKey=${fileKey}&nodeIds=${nodeIds.join(',')}`)
      if (response.ok) {
        const data = await response.json()
        setDesignData(data)
      } else {
        setError('Failed to fetch design')
      }
    } catch (err) {
      setError('Error loading design')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fileKey) {
      fetchDesign()
    }
  }, [fileKey, nodeIds.join(',')])

  return (
    <div className="bg-blue-900 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">preciselythesame.com</div>
        <nav className="space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors">ABOUT</a>
          <a href="#" className="hover:text-blue-200 transition-colors">COLLECTION</a>
          <a href="#" className="hover:text-blue-200 transition-colors">CONTACT</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="text-center px-6 py-20">
        {/* Title */}
        <h1 className="text-8xl font-bold mb-8 tracking-wider">
          {title}
        </h1>
        
        {/* Divider Line */}
        <div className="w-64 h-px bg-white mx-auto mb-8"></div>
        
        {/* Description */}
        <p className="text-xl tracking-wider mb-12">
          {description}
        </p>

        {/* Figma Design Display */}
        {fileKey && (
          <div className="max-w-4xl mx-auto">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4">Loading design from Figma...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-800 text-white p-4 rounded-lg">
                <p>{error}</p>
                <button 
                  onClick={fetchDesign}
                  className="mt-2 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
                >
                  Retry
                </button>
              </div>
            )}
            
            {designData && (
              <div className="bg-white text-gray-900 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Figma Design Loaded</h3>
                <div className="text-left">
                  <p><strong>File Name:</strong> {designData.file?.name}</p>
                  <p><strong>Last Modified:</strong> {new Date(designData.file?.lastModified).toLocaleDateString()}</p>
                  <p><strong>Version:</strong> {designData.file?.version}</p>
                </div>
                
                {/* Design Preview Placeholder */}
                <div className="mt-6 p-8 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600">Design preview would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Connected to Figma file: {fileKey}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-blue-800 p-6 rounded-lg hover:bg-blue-700 transition-colors">
              <div className="w-full h-32 bg-blue-600 rounded mb-4 flex items-center justify-center">
                <span className="text-blue-200 text-lg">Milk Cap #{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Day {i + 1}</h3>
              <p className="text-blue-200 text-sm">Collection item description</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
