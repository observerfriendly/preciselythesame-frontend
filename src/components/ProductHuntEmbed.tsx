'use client'

import { useState, useEffect } from 'react'

interface ProductHuntProduct {
  id: string
  name: string
  tagline: string
  thumbnail: { url: string }
  url: string
  votesCount: number
  commentsCount: number
  createdAt: string
  topics: { edges: Array<{ node: { name: string } }> }
}

interface ProductHuntEmbedProps {
  query?: string
  limit?: number
  showVotes?: boolean
  showComments?: boolean
  theme?: 'light' | 'dark'
  className?: string
}

export default function ProductHuntEmbed({
  query = 'ai',
  limit = 6,
  showVotes = true,
  showComments = true,
  theme = 'light',
  className = ''
}: ProductHuntEmbedProps) {
  const [products, setProducts] = useState<ProductHuntProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [query])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/producthunt?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.edges) {
        setProducts(data.edges.slice(0, limit).map((edge: any) => edge.node))
      } else {
        setProducts(data.products || [])
      }
    } catch (err) {
      setError('Failed to load ProductHunt products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Trending on ProductHunt
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Powered by</span>
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1&theme=light&vite_logo=false" 
            alt="ProductHunt" 
            className="h-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
              theme === 'dark' ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={product.thumbnail?.url || 'https://via.placeholder.com/400x225'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.tagline}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  {showVotes && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {product.votesCount}
                    </span>
                  )}
                  
                  {showComments && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {product.commentsCount}
                    </span>
                  )}
                </div>

                <a 
                  href={product.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View →
                </a>
              </div>

              {product.topics?.edges?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.topics.edges.slice(0, 3).map((topic, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {topic.node.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a 
          href="https://producthunt.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          Discover more on ProductHunt
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
