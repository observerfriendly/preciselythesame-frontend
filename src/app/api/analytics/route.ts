import { NextResponse } from 'next/server'
import sql from '@/lib/neon'

export async function GET() {
  try {
    // Check if tables exist first
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as users_exist,
      EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      ) as projects_exist
    `

    const usersExist = tableCheck[0]?.users_exist
    const projectsExist = tableCheck[0]?.projects_exist

    if (!usersExist || !projectsExist) {
      // Return empty data if tables don't exist
      return NextResponse.json({
        stats: {
          totalUsers: 0,
          totalProjects: 0,
          usersThisMonth: 0,
          projectsThisMonth: 0
        },
        recentUsers: [],
        recentProjects: [],
        message: 'Database tables not set up yet. Please run database setup.'
      })
    }

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
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      stats: {
        totalUsers: 0,
        totalProjects: 0,
        usersThisMonth: 0,
        projectsThisMonth: 0
      },
      recentUsers: [],
      recentProjects: []
    }, { status: 500 })
  }
}
