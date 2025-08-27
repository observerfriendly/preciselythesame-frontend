import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    const newUser = await sql`
      INSERT INTO users (email, name)
      VALUES (${email}, ${name})
      RETURNING *
    `
    
    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
