import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-sm p-6 flex justify-center">
        <SignIn />
      </div>
    </div>
  )
}