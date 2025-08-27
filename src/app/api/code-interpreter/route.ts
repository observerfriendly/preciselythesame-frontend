import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { code, language = 'python', context } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // Create a thread for code interpretation
    const thread = await openai.beta.threads.create()

    // Add the code to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Please analyze and interpret this ${language} code:\n\n${code}\n\n${context ? `Context: ${context}` : ''}`,
    })

    // Create a run with code interpreter
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID || 'asst_WkSKOZgwEZP7LSPvbuk56ehN',
      tools: [{ type: 'code_interpreter' }],
    })

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    if (runStatus.status === 'failed') {
      return NextResponse.json({ 
        error: 'Code interpretation failed',
        details: runStatus.last_error 
      }, { status: 500 })
    }

    // Get the messages from the thread
    const messages = await openai.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data[0] // Get the most recent message

    return NextResponse.json({
      interpretation: lastMessage.content[0]?.text?.value || 'No interpretation available',
      run_id: run.id,
      thread_id: thread.id,
      status: runStatus.status
    })

  } catch (error) {
    console.error('Code interpreter error:', error)
    return NextResponse.json({ 
      error: 'Failed to interpret code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Code Interpreter API is running',
    supported_languages: ['python', 'javascript', 'typescript', 'html', 'css', 'sql'],
    features: [
      'Code analysis and interpretation',
      'Syntax checking',
      'Performance suggestions',
      'Security analysis',
      'Best practices recommendations'
    ]
  })
}
