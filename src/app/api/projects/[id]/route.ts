import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete the project
    await sql`DELETE FROM projects WHERE id = ${id}`

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name, description } = await request.json()

    // Update the project
    await sql`
      UPDATE projects 
      SET name = ${name}, description = ${description}, updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
