import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, user_id } = await request.json()
    
    const newProject = await sql`
      INSERT INTO projects (name, description, user_id)
      VALUES (${name}, ${description}, ${user_id})
      RETURNING *
    `
    
    return NextResponse.json(newProject[0], { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
