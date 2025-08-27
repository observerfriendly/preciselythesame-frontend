'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface CodeInterpreterProps {
  className?: string
}

export default function CodeInterpreter({ className = '' }: CodeInterpreterProps) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [context, setContext] = useState('')
  const [interpretation, setInterpretation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' }
  ]

  const handleInterpret = async () => {
    if (!code.trim()) {
      setError('Please enter some code to interpret')
      return
    }

    setLoading(true)
    setError(null)
    setInterpretation('')

    try {
      const response = await fetch('/api/code-interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          language,
          context: context.trim() || undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setInterpretation(data.interpretation)
      } else {
        setError(data.error || 'Failed to interpret code')
      }
    } catch (err) {
      setError('Error connecting to code interpreter')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setCode('')
    setContext('')
    setInterpretation('')
    setError(null)
  }

  const loadExample = () => {
    setCode(`def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`)
    setLanguage('python')
    setContext('This is a recursive implementation of the Fibonacci sequence.')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🔍 Code Interpreter</h2>
        <p className="text-gray-600">Analyze and interpret your code with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Input</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programming Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context (Optional)</label>
                <Input
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="What is this code supposed to do?"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleInterpret}
                  disabled={loading || !code.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Interpreting...' : 'Interpret Code'}
                </Button>
                <Button
                  onClick={loadExample}
                  variant="outline"
                  disabled={loading}
                >
                  Load Example
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interpretation</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Analyzing your code...</span>
              </div>
            )}

            {interpretation && !loading && (
              <div className="bg-gray-50 rounded-md p-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                    {interpretation}
                  </pre>
                </div>
              </div>
            )}

            {!interpretation && !loading && !error && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>Enter code and click "Interpret Code" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Interpreter Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-semibold text-gray-900">Code Analysis</h4>
              <p className="text-sm text-gray-600">Deep analysis of your code structure and logic</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900">Performance</h4>
              <p className="text-sm text-gray-600">Identify performance bottlenecks and optimization opportunities</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-semibold text-gray-900">Security</h4>
              <p className="text-sm text-gray-600">Detect potential security vulnerabilities</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">��</div>
              <h4 className="font-semibold text-gray-900">Best Practices</h4>
              <p className="text-sm text-gray-600">Suggestions for code quality and maintainability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
