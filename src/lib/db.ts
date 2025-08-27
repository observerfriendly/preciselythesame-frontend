import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../types/database'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Also export the raw sql for direct queries
export default sql
