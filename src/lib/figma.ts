import { Api } from 'figma-api'

const client = new Api({
  personalAccessToken: process.env.FIGMA_ACCESS_TOKEN!
})

export default client

// Simple helper functions
export const figmaHelpers = {
  // Get file information
  async getFile(fileKey: string) {
    try {
      return await client.getFile(fileKey)
    } catch (error) {
      console.error('Error fetching Figma file:', error)
      throw error
    }
  },

  // Get user info
  async getMe() {
    try {
      return await client.getMe()
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  },

  // Get team projects
  async getTeamProjects(teamId: string) {
    try {
      return await client.getTeamProjects(teamId)
    } catch (error) {
      console.error('Error fetching team projects:', error)
      throw error
    }
  }
}
