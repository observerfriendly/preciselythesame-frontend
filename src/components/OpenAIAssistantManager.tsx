'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface OpenAIAssistant {
  id: string
  openai_assistant_id: string
  name: string
  model: string
  instructions: string
  tools: any[]
  metadata: any
  status: string
  created_at: string
  updated_at: string
}

interface OpenAIAssistantManagerProps {
  className?: string
}

export default function OpenAIAssistantManager({ className = '' }: OpenAIAssistantManagerProps) {
  const [assistants, setAssistants] = useState<OpenAIAssistant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState<OpenAIAssistant | null>(null)
  const [formData, setFormData] = useState({
    assistantId: 'asst_WkSKOZgwEZP7LSPvbuk56ehN',
    name: 'Standing Room GPT Agent',
    model: 'gpt-4o',
    instructions: 'You are a helpful AI assistant with advanced reasoning capabilities.',
    tools: ['code_interpreter', 'file_search', 'web'],
    metadata: {}
  })

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/assistants')
      const data = await response.json()
      setAssistants(data)
    } catch (err) {
      setError('Failed to load assistants')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setAssistants(prev => [result, ...prev.filter(a => a.id !== result.id)])
        setShowForm(false)
        setFormData({
          assistantId: 'asst_WkSKOZgwEZP7LSPvbuk56ehN',
          name: 'Standing Room GPT Agent',
          model: 'gpt-4o',
          instructions: 'You are a helpful AI assistant with advanced reasoning capabilities.',
          tools: ['code_interpreter', 'file_search', 'web'],
          metadata: {}
        })
      } else {
        setError('Failed to create assistant')
      }
    } catch (err) {
      setError('Error creating assistant')
    }
  }

  const deleteAssistant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assistant?')) return
    
    try {
      const response = await fetch(`/api/assistants/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setAssistants(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      setError('Failed to delete assistant')
    }
  }

  const testAssistant = async (assistant: OpenAIAssistant) => {
    try {
      // Simulate testing the assistant
      alert(`Testing OpenAI Assistant: ${assistant.name}\nID: ${assistant.openai_assistant_id}\nModel: ${assistant.model}`)
    } catch (err) {
      alert('Assistant test failed')
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">OpenAI Assistant Management</h2>
          <p className="text-gray-600">Manage your OpenAI Assistants and integrate them with your backend</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add OpenAI Assistant
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Add Assistant Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add OpenAI Assistant</h3>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI Assistant ID</label>
                  <Input
                    value={formData.assistantId}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistantId: e.target.value }))}
                    placeholder="asst_..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Assistant Name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="gpt-4o"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Assistant instructions..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tools (comma separated)</label>
                <Input
                  value={formData.tools.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, tools: e.target.value.split(', ').filter(Boolean) }))}
                  placeholder="code_interpreter, file_search, web"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Assistant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assistants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assistants.map((assistant) => (
          <Card key={assistant.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{assistant.name}</h3>
                  <p className="text-sm text-gray-500">Model: {assistant.model}</p>
                  <p className="text-xs text-gray-400 font-mono">ID: {assistant.openai_assistant_id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assistant.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assistant.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Instructions:</span>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assistant.instructions}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Tools:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assistant.tools.map((tool, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Updated {new Date(assistant.updated_at).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testAssistant(assistant)}
                  >
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAssistant(assistant.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assistants.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No OpenAI Assistants Configured</h3>
            <p className="text-gray-600 mb-6">
              Add your OpenAI Assistants to integrate them with your backend system.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Add Your First Assistant
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Add Section for Your Specific Assistant */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add: Standing Room GPT Agent</h3>
          <p className="text-gray-600 mb-4">
            Your assistant ID <code className="bg-gray-100 px-2 py-1 rounded">asst_WkSKOZgwEZP7LSPvbuk56ehN</code> is ready to be integrated.
          </p>
          <Button
            onClick={() => {
              setFormData({
                assistantId: 'asst_WkSKOZgwEZP7LSPvbuk56ehN',
                name: 'Standing Room GPT Agent',
                model: 'gpt-4o',
                instructions: 'You are a helpful AI assistant with advanced reasoning capabilities.',
                tools: ['code_interpreter', 'file_search', 'web'],
                metadata: {}
              })
              setShowForm(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Quick Add This Assistant
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
