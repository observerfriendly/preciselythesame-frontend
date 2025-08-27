import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Check if mcps table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'mcps'
      ) as mcps_exist
    `

    if (!tableCheck[0]?.mcps_exist) {
      return NextResponse.json([], { status: 200 })
    }

    const mcps = await sql`SELECT * FROM mcps ORDER BY created_at DESC`
    return NextResponse.json(mcps)
  } catch (error) {
    console.error('Error fetching MCPs:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, endpoint, api_key, status, type } = await request.json()

    if (!name || !endpoint) {
      return NextResponse.json({ error: 'Name and endpoint are required' }, { status: 400 })
    }

    // Check if mcps table exists, create if not
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'mcps'
      ) as mcps_exist
    `

    if (!tableCheck[0]?.mcps_exist) {
      await sql`
        CREATE TABLE IF NOT EXISTS mcps (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          endpoint VARCHAR(500) NOT NULL,
          api_key TEXT,
          status VARCHAR(50) DEFAULT 'active',
          type VARCHAR(100) DEFAULT 'mcp',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    }

    const result = await sql`
      INSERT INTO mcps (name, description, endpoint, api_key, status, type)
      VALUES (${name}, ${description}, ${endpoint}, ${api_key}, ${status || 'active'}, ${type || 'mcp'})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating MCP:', error)
    return NextResponse.json({ error: 'Failed to create MCP' }, { status: 500 })
  }
}
