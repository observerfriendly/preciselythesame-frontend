import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete the user
    await sql`DELETE FROM users WHERE id = ${id}`

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name, email } = await request.json()

    // Update the user
    await sql`
      UPDATE users 
      SET name = ${name}, email = ${email}, updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
