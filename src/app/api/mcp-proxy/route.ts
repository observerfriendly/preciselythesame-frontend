import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function POST(request: NextRequest) {
  try {
    const { mcp_id, method, params } = await request.json()

    if (!mcp_id || !method) {
      return NextResponse.json({ error: 'MCP ID and method are required' }, { status: 400 })
    }

    // Get MCP configuration from database
    const mcps = await sql`
      SELECT * FROM mcps WHERE id = ${mcp_id} AND status = 'active'
    `

    if (!mcps || mcps.length === 0) {
      return NextResponse.json({ error: 'MCP not found or inactive' }, { status: 404 })
    }

    const mcp = mcps[0]

    // Proxy the request to the MCP endpoint
    const response = await fetch(mcp.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': mcp.api_key ? `Bearer ${mcp.api_key}` : '',
        'User-Agent': 'PreciselyTheSame-MCP-Proxy/1.0'
      },
      body: JSON.stringify({
        method,
        params,
        id: Date.now().toString()
      })
    })

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.status}`)
    }

    const result = await response.json()

    // Log the MCP usage
    await sql`
      INSERT INTO mcp_logs (mcp_id, method, status, response_time)
      VALUES (${mcp_id}, ${method}, 'success', ${Date.now()})
    `.catch(() => {
      // Ignore logging errors
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('MCP proxy error:', error)
    return NextResponse.json({ 
      error: 'MCP request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mcp_id = searchParams.get('mcp_id')

    if (!mcp_id) {
      return NextResponse.json({ error: 'MCP ID is required' }, { status: 400 })
    }

    // Get MCP status and info
    const mcps = await sql`
      SELECT id, name, description, status, type, created_at 
      FROM mcps WHERE id = ${mcp_id}
    `

    if (!mcps || mcps.length === 0) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    const mcp = mcps[0]

    // Get recent logs
    const logs = await sql`
      SELECT method, status, created_at 
      FROM mcp_logs 
      WHERE mcp_id = ${mcp_id} 
      ORDER BY created_at DESC 
      LIMIT 10
    `.catch(() => [])

    return NextResponse.json({
      mcp,
      logs,
      status: 'active'
    })
  } catch (error) {
    console.error('Error fetching MCP info:', error)
    return NextResponse.json({ error: 'Failed to fetch MCP info' }, { status: 500 })
  }
}
