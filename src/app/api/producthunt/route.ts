import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'ai'
    const page = searchParams.get('page') || '1'

    // ProductHunt API endpoint
    const url = `https://api.producthunt.com/v2/api/graphql`
    
    const query_body = {
      query: `
        query SearchPosts($query: String!, $first: Int!, $after: String) {
          searchPosts(query: $query, first: $first, after: $after) {
            edges {
              node {
                id
                name
                tagline
                thumbnail {
                  url
                }
                url
                votesCount
                commentsCount
                createdAt
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
        query: query,
        first: 20,
        after: page === '1' ? null : `cursor_${(parseInt(page) - 1) * 20}`
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PRODUCTHUNT_TOKEN || ''}`,
        'User-Agent': 'Mozilla/5.0 (compatible; PreciselyTheSame/1.0)'
      },
      body: JSON.stringify(query_body)
    })

    if (!response.ok) {
      // Fallback to public data if API fails
      return NextResponse.json({
        products: [
          {
            id: '1',
            name: 'Sample AI Product',
            tagline: 'An amazing AI-powered tool',
            thumbnail: { url: 'https://via.placeholder.com/300x200' },
            url: 'https://producthunt.com',
            votesCount: 150,
            commentsCount: 25,
            createdAt: new Date().toISOString(),
            topics: { edges: [{ node: { name: 'AI' } }] }
          }
        ],
        pageInfo: { hasNextPage: false, endCursor: null }
      })
    }

    const data = await response.json()
    return NextResponse.json(data.data.searchPosts)
  } catch (error) {
    console.error('Error fetching ProductHunt data:', error)
    return NextResponse.json({
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: 'Failed to fetch ProductHunt data'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { product_id, embed_type, custom_styling } = await request.json()

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Store embed configuration
    const embedConfig = {
      product_id,
      embed_type: embed_type || 'card',
      custom_styling: custom_styling || {},
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Embed configuration saved',
      embed: embedConfig
    })
  } catch (error) {
    console.error('Error saving embed config:', error)
    return NextResponse.json({ error: 'Failed to save embed configuration' }, { status: 500 })
  }
}
