import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join The Pulse</h1>
          <p className="text-gray-600">Start staying informed about trending topics</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
