'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import VisualModeConfigUI from './VisualModeConfigUI'

interface Agent {
  id: string
  name: string
  model: string
  visual_mode_default: boolean
  reasoning_modes: string[]
  tools: string[]
  core_features: string[]
  output_formats: string[]
  prompt_styles: string[]
  status: string
  created_at: string
}

interface AgentManagerProps {
  className?: string
}

export default function AgentManager({ className = '' }: AgentManagerProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfigurator, setShowConfigurator] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agents')
      const data = await response.json()
      setAgents(data)
    } catch (err) {
      setError('Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const deleteAgent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    
    try {
      const response = await fetch(`/api/agents/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchAgents()
      }
    } catch (err) {
      setError('Failed to delete agent')
    }
  }

  const testAgent = async (agent: Agent) => {
    try {
      // Simulate agent testing
      alert(`Testing agent: ${agent.name}\nModel: ${agent.model}\nTools: ${agent.tools.length}`)
    } catch (err) {
      alert('Agent test failed')
    }
  }

  if (showConfigurator) {
    return (
      <div className={className}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Agent Configurator</h2>
          <Button 
            variant="outline"
            onClick={() => {
              setShowConfigurator(false)
              setSelectedAgent(null)
            }}
          >
            Back to Agents
          </Button>
        </div>
        <VisualModeConfigUI />
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <h2 className="text-2xl font-bold text-gray-900">AI Agent Management</h2>
          <p className="text-gray-600">Configure and manage your AI agents with advanced reasoning modes</p>
        </div>
        <Button
          onClick={() => setShowConfigurator(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Agent
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">Model: {agent.model}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    agent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {agent.status}
                  </span>
                  {agent.visual_mode_default && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Visual
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Tools:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.tools.slice(0, 3).map((tool, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tool}
                      </span>
                    ))}
                    {agent.tools.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{agent.tools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Reasoning Modes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.reasoning_modes.map((mode, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Created {new Date(agent.created_at).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testAgent(agent)}
                  >
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedAgent(agent)
                      setShowConfigurator(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAgent(agent.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Agents Configured</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI agent with advanced reasoning modes and tool integrations.
            </p>
            <Button
              onClick={() => setShowConfigurator(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
