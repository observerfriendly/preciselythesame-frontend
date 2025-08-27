'use client'

import { useState } from 'react'

export default function FigmaFileFinder() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findMyFiles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // This will help us discover your Figma files
      const response = await fetch('/api/figma/discover')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        setError('Failed to discover files')
      }
    } catch (err) {
      setError('Error discovering files')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">🔍 Find Your Figma Files</h3>
      
      <button
        onClick={findMyFiles}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-6"
      >
        {loading ? 'Searching...' : '🔍 Discover My Figma Files'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Your Figma Files:</h4>
          {files.map((file: any) => (
            <div key={file.key} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">{file.name}</h5>
                  <p className="text-sm text-gray-600">File Key: <code className="bg-gray-100 px-2 py-1 rounded">{file.key}</code></p>
                  <p className="text-sm text-gray-500">Last modified: {new Date(file.lastModified).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(file.key)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Copy Key
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Click "Discover My Figma Files" above</li>
          <li>2. Find your "DAILY DAIRY" design file</li>
          <li>3. Copy the File Key</li>
          <li>4. Use it in your FigmaDesign component</li>
        </ol>
      </div>
    </div>
  )
}
