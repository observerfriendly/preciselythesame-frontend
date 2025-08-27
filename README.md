# Precisely The Same Frontend

A modern full-stack application connecting Vercel, Git, Neon Database, and Supabase for www.preciselythesame.com.

## 🚀 **Features**

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Neon Database** for PostgreSQL
- **Supabase** for additional backend services
- **Vercel** for deployment
- **API Routes** for backend functionality
- **Database Schema** with proper indexing

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **Backend**: Supabase
- **Deployment**: Vercel
- **ORM**: Drizzle ORM
- **Database Driver**: Neon Serverless Driver

## 📁 **Project Structure**

```
vercel-neon-supabase-frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/route.ts
│   │   │   ├── projects/route.ts
│   │   │   └── preciselythesame/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── UserForm.tsx
│   │   └── ProjectForm.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── neon.ts
│   │   └── db.ts
│   └── types/
│       └── database.ts
├── database/
│   └── schema.sql
├── .env.local
├── vercel.json
├── package.json
└── README.md
```

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Configuration**
Your `.env.local` file is already configured with:
- Neon Database connection string
- Supabase credentials
- OpenAI API key
- GitHub token

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🗄️ **Database Setup**

### **Run Database Schema**
```bash
npm run db:setup
```

### **Database Tables**
- `preciselythesame` - Main project table
- `users` - User management
- `projects` - Project management

## 🌐 **API Endpoints**

### **Users API**
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user

### **Projects API**
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create new project

### **PreciselyTheSame API**
- `GET /api/preciselythesame` - Fetch data
- `POST /api/preciselythesame` - Create record

## 🔗 **Service Connections**

- **Neon Database**: PostgreSQL database with serverless driver
- **Supabase**: Authentication and additional backend services
- **Vercel**: Deployment and hosting
- **GitHub**: Version control and CI/CD

## 📝 **Development Commands**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Setup database schema
```

## 🌍 **Environment Variables**

Required environment variables are configured in `.env.local`:
- `DATABASE_URL` - Neon PostgreSQL connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key
- `GITHUB_TOKEN` - GitHub personal access token

## 🚀 **Deployment**

The project is configured for Vercel deployment with:
- Automatic builds from Git
- Environment variable management
- Serverless functions for API routes
- Edge network optimization

## 📱 **Features**

- **User Management**: Create and manage users
- **Project Management**: Create and manage projects
- **Real-time Database**: Neon PostgreSQL with serverless driver
- **Modern UI**: Responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **API First**: RESTful API endpoints

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ for Precisely The Same**
