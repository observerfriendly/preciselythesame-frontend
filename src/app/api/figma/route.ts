import { NextRequest, NextResponse } from 'next/server'
import { figmaHelpers } from '@/lib/figma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileKey = searchParams.get('fileKey')
    
    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 })
    }

    const fileData = await figmaHelpers.getFile(fileKey)
    
    return NextResponse.json({
      file: fileData,
      message: "File loaded successfully"
    })
  } catch (error) {
    console.error('Error fetching Figma data:', error)
    return NextResponse.json({ error: 'Failed to fetch Figma data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fileKey } = await request.json()
    
    if (!fileKey) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 })
    }

    const fileData = await figmaHelpers.getFile(fileKey)
    
    return NextResponse.json({
      message: "File processed successfully",
      file: fileData
    })
  } catch (error) {
    console.error('Error processing Figma file:', error)
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}
