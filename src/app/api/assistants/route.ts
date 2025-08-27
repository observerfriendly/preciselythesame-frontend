import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Check if assistants table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'assistants'
      ) as assistants_exist
    `

    if (!tableCheck[0]?.assistants_exist) {
      return NextResponse.json([], { status: 200 })
    }

    const assistants = await sql`SELECT * FROM assistants ORDER BY created_at DESC`
    return NextResponse.json(assistants)
  } catch (error) {
    console.error('Error fetching assistants:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { assistantId, name, model, instructions, tools, metadata } = await request.json()

    if (!assistantId || !name || !model) {
      return NextResponse.json({ error: 'Assistant ID, name, and model are required' }, { status: 400 })
    }

    // Check if assistants table exists, create if not
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'assistants'
      ) as assistants_exist
    `

    if (!tableCheck[0]?.assistants_exist) {
      await sql`
        CREATE TABLE IF NOT EXISTS assistants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          openai_assistant_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          model VARCHAR(100) NOT NULL,
          instructions TEXT,
          tools JSONB DEFAULT '[]',
          metadata JSONB DEFAULT '{}',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    }

    const result = await sql`
      INSERT INTO assistants (
        openai_assistant_id, 
        name, 
        model, 
        instructions, 
        tools, 
        metadata
      )
      VALUES (
        ${assistantId}, 
        ${name}, 
        ${model}, 
        ${instructions || ''}, 
        ${JSON.stringify(tools || [])}, 
        ${JSON.stringify(metadata || {})}
      )
      ON CONFLICT (openai_assistant_id) 
      DO UPDATE SET
        name = EXCLUDED.name,
        model = EXCLUDED.model,
        instructions = EXCLUDED.instructions,
        tools = EXCLUDED.tools,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating/updating assistant:', error)
    return NextResponse.json({ error: 'Failed to create/update assistant' }, { status: 500 })
  }
}
