import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    const data = await sql`SELECT * FROM preciselythesame ORDER BY created_at DESC`
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching preciselythesame data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newRecord = await sql`
      INSERT INTO preciselythesame (created_at)
      VALUES (NOW())
      RETURNING *
    `
    
    return NextResponse.json(newRecord[0], { status: 201 })
  } catch (error) {
    console.error('Error creating preciselythesame record:', error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}
