import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Check if agents table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'agents'
      ) as agents_exist
    `

    if (!tableCheck[0]?.agents_exist) {
      return NextResponse.json([], { status: 200 })
    }

    const agents = await sql`SELECT * FROM agents ORDER BY created_at DESC`
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const agentConfig = await request.json()

    if (!agentConfig.name || !agentConfig.model) {
      return NextResponse.json({ error: 'Name and model are required' }, { status: 400 })
    }

    // Check if agents table exists, create if not
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'agents'
      ) as agents_exist
    `

    if (!tableCheck[0]?.agents_exist) {
      await sql`
        CREATE TABLE IF NOT EXISTS agents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          model VARCHAR(100) NOT NULL,
          visual_mode_default BOOLEAN DEFAULT true,
          reasoning_modes JSONB,
          tools JSONB,
          core_features JSONB,
          output_formats JSONB,
          prompt_styles JSONB,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    }

    const result = await sql`
      INSERT INTO agents (
        name, 
        model, 
        visual_mode_default, 
        reasoning_modes, 
        tools, 
        core_features, 
        output_formats, 
        prompt_styles
      )
      VALUES (
        ${agentConfig.name}, 
        ${agentConfig.model}, 
        ${agentConfig.visual_mode_default || true}, 
        ${JSON.stringify(agentConfig.reasoning_modes || [])}, 
        ${JSON.stringify(agentConfig.tools || [])}, 
        ${JSON.stringify(agentConfig.core_features || [])}, 
        ${JSON.stringify(agentConfig.output_formats || [])}, 
        ${JSON.stringify(agentConfig.prompt_styles || [])}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
