import { NextResponse } from 'next/server'
import { figmaHelpers } from '@/lib/figma'

export async function GET() {
  try {
    // Get user info to find their files
    const user = await figmaHelpers.getMe()
    
    // For now, return user info and a message about files
    // We'll need to implement file discovery differently
    return NextResponse.json({
      user: {
        id: user.id,
        handle: user.handle,
        img_url: user.img_url
      },
      message: "User authenticated successfully. File discovery coming soon.",
      files: []
    })
  } catch (error) {
    console.error('Error discovering Figma files:', error)
    return NextResponse.json({ 
      error: 'Failed to discover Figma files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
