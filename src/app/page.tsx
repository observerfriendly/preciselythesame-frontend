import UserForm from '@/components/UserForm'
import ProjectForm from '@/components/ProjectForm'
import FigmaDesign from '@/components/FigmaDesign'
import FigmaFileFinder from '@/components/FigmaFileFinder'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Figma Design Section */}
      <FigmaDesign 
        fileKey="cZEd1WxF4CZ6016wHQNiVT"
        title="DAILY DAIRY"
        description="MY COLLECTION — A MILK CAP A DAY, EVERY DAY"
      />
      
      {/* Admin Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Panel
            </h2>
            <p className="text-lg text-gray-600">
              Manage users, projects, and Figma designs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create User</h3>
              <UserForm />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create Project</h3>
              <ProjectForm />
            </div>
          </div>

          {/* Figma File Discovery */}
          <div className="mb-12">
            <FigmaFileFinder />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">API Endpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800">Users API</h4>
                <p className="text-sm text-gray-600">GET /api/users</p>
                <p className="text-sm text-gray-600">POST /api/users</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800">Projects API</h4>
                <p className="text-sm text-gray-600">GET /api/projects</p>
                <p className="text-sm text-gray-600">POST /api/projects</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800">PreciselyTheSame API</h4>
                <p className="text-sm text-gray-600">GET /api/preciselythesame</p>
                <p className="text-sm text-gray-600">POST /api/preciselythesame</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800">Figma API</h4>
                <p className="text-sm text-gray-600">GET /api/figma</p>
                <p className="text-sm text-gray-600">POST /api/figma</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500">
            <p>Connected to: Neon Database • Supabase • Vercel • GitHub • Figma</p>
          </div>
        </div>
      </div>
    </main>
  )
}
