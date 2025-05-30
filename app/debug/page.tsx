import dbConnect from '../../lib/db';
import { User } from '../../lib/models/User';

export default async function DebugPage() {
  let connectionStatus = 'Unknown';
  let userCount = 0;
  let users: any[] = [];
  let error = '';

  try {
    await dbConnect();
    connectionStatus = 'Connected';
    
    userCount = await User.countDocuments();
    users = await User.find({}).select('email createdAt').limit(5).lean();
  } catch (err: any) {
    connectionStatus = 'Failed';
    error = err.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Information</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Database Connection</h2>
              <div className={`p-3 rounded-md ${connectionStatus === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Status: {connectionStatus}
                {error && <div className="mt-2">Error: {error}</div>}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">User Statistics</h2>
              <div className="p-3 bg-blue-100 text-blue-800 rounded-md">
                Total Users: {userCount}
              </div>
            </div>

            {users.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Users</h2>
                <div className="bg-gray-100 rounded-md p-4">
                  {users.map((user, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded border">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-sm text-gray-600">
                        Created: {new Date(user.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Environment Variables</h2>
              <div className="bg-gray-100 rounded-md p-4 space-y-2">
                <div>
                  <span className="font-medium">MONGODB_URI:</span> 
                  <span className="ml-2 text-sm">
                    {process.env.MONGODB_URI ? 'Set ✓' : 'Not Set ✗'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">JWT_SECRET:</span> 
                  <span className="ml-2 text-sm">
                    {process.env.JWT_SECRET ? 'Set ✓' : 'Not Set ✗'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">NODE_ENV:</span> 
                  <span className="ml-2 text-sm">{process.env.NODE_ENV || 'Not Set'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Quick Test</h3>
              <p className="text-yellow-700 mb-4">
                If you see users above, try logging in with one of those emails. 
                If no users exist, try registering a new account first.
              </p>
              <div className="space-x-4">
                <a 
                  href="/register" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Register New User
                </a>
                <a 
                  href="/login" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Try Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
