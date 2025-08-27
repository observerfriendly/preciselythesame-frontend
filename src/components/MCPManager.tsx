'use client'

import { useState, useEffect } from 'react'

interface MCP {
  id: string
  name: string
  description?: string
  endpoint: string
  api_key?: string
  status: string
  type: string
  created_at: string
}

interface MCPManagerProps {
  className?: string
}

export default function MCPManager({ className = '' }: MCPManagerProps) {
  const [mcps, setMcps] = useState<MCP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpoint: '',
    api_key: '',
    type: 'mcp'
  })

  useEffect(() => {
    fetchMcps()
  }, [])

  const fetchMcps = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mcps')
      const data = await response.json()
      setMcps(data)
    } catch (err) {
      setError('Failed to load MCPs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/mcps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', description: '', endpoint: '', api_key: '', type: 'mcp' })
        setShowForm(false)
        fetchMcps()
      } else {
        setError('Failed to create MCP')
      }
    } catch (err) {
      setError('Failed to create MCP')
    }
  }

  const testMCP = async (mcp: MCP) => {
    try {
      const response = await fetch('/api/mcp-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mcp_id: mcp.id,
          method: 'tools/list',
          params: {}
        })
      })

      if (response.ok) {
        alert('MCP is working!')
      } else {
        alert('MCP test failed')
      }
    } catch (err) {
      alert('MCP test failed')
    }
  }

  const deleteMCP = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MCP?')) return
    
    try {
      const response = await fetch(`/api/mcps/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchMcps()
      }
    } catch (err) {
      setError('Failed to delete MCP')
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">MCP Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add MCP'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New MCP</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mcp">MCP</option>
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/mcp"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Optional)</label>
              <input
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="What does this MCP do?"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add MCP
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {mcps.map((mcp) => (
          <div key={mcp.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold">{mcp.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mcp.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mcp.status}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {mcp.type}
                  </span>
                </div>
                
                {mcp.description && (
                  <p className="text-gray-600 mb-2">{mcp.description}</p>
                )}
                
                <p className="text-sm text-gray-500 font-mono">{mcp.endpoint}</p>
                
                <p className="text-xs text-gray-400 mt-2">
                  Added {new Date(mcp.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => testMCP(mcp)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Test
                </button>
                <button
                  onClick={() => deleteMCP(mcp.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {mcps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No MCPs configured yet.</p>
            <p className="text-sm">Add your first MCP to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
