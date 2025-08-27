import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Check if projects table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      ) as projects_exist
    `

    if (!tableCheck[0]?.projects_exist) {
      return NextResponse.json([], { status: 200 })
    }

    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, user_id } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if projects table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      ) as projects_exist
    `

    if (!tableCheck[0]?.projects_exist) {
      return NextResponse.json({ error: 'Database not set up' }, { status: 500 })
    }

    const result = await sql`
      INSERT INTO projects (name, description, user_id)
      VALUES (${name}, ${description}, ${user_id})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
