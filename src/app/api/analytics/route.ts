import { NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Get analytics data
    const [
      totalUsers,
      totalProjects,
      usersThisMonth,
      projectsThisMonth
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM projects`,
      sql`SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '1 month'`,
      sql`SELECT COUNT(*) as count FROM projects WHERE created_at >= NOW() - INTERVAL '1 month'`
    ])

    // Get recent activity
    const recentUsers = await sql`
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    const recentProjects = await sql`
      SELECT id, name, description, created_at 
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers[0]?.count || 0,
        totalProjects: totalProjects[0]?.count || 0,
        usersThisMonth: usersThisMonth[0]?.count || 0,
        projectsThisMonth: projectsThisMonth[0]?.count || 0
      },
      recentUsers,
      recentProjects
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
