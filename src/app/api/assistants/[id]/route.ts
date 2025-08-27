import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if assistants table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'assistants'
      ) as assistants_exist
    `

    if (!tableCheck[0]?.assistants_exist) {
      return NextResponse.json({ error: 'Assistants table not found' }, { status: 404 })
    }

    const assistant = await sql`
      SELECT * FROM assistants 
      WHERE openai_assistant_id = ${id} OR id = ${id}
    `

    if (assistant.length === 0) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 })
    }

    return NextResponse.json(assistant[0])
  } catch (error) {
    console.error('Error fetching assistant:', error)
    return NextResponse.json({ error: 'Failed to fetch assistant' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()

    const result = await sql`
      UPDATE assistants 
      SET 
        name = COALESCE(${updates.name}, name),
        model = COALESCE(${updates.model}, model),
        instructions = COALESCE(${updates.instructions}, instructions),
        tools = COALESCE(${JSON.stringify(updates.tools)}, tools),
        metadata = COALESCE(${JSON.stringify(updates.metadata)}, metadata),
        updated_at = NOW()
      WHERE openai_assistant_id = ${id} OR id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating assistant:', error)
    return NextResponse.json({ error: 'Failed to update assistant' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await sql`
      DELETE FROM assistants 
      WHERE openai_assistant_id = ${id} OR id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Assistant deleted successfully' })
  } catch (error) {
    console.error('Error deleting assistant:', error)
    return NextResponse.json({ error: 'Failed to delete assistant' }, { status: 500 })
  }
}
