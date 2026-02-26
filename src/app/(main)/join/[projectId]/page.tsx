import { db } from '@/server/db'
import { SignIn } from '@clerk/nextjs'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: Promise<{ projectId: string }>
}

const CenterCard = ({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-sm p-8 text-center space-y-4">
      <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      {description && (
        <p className="text-sm text-neutral-500">{description}</p>
      )}
      {action}
    </div>
  </div>
)

const JoinPage = async ({ params }: Props) => {
  const { projectId } = await params
  const { userId } = await auth()

  if (!userId) {
    return (
      <CenterCard
        title="Authentication required"
        description="Please sign in to continue"
        action={<SignIn />}
      />
    )
  }

  try {
    let dbUser = await db.user.findUnique({
      where: { id: userId },
    })

    if (!dbUser) {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)

      dbUser = await db.user.create({
        data: {
          id: userId,
          emailAddress: user.emailAddresses[0]?.emailAddress ?? '',
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
        },
      })
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return (
        <CenterCard
          title="Project not found"
          description="This project may not exist or the link is invalid"
          action={
            <a
              href="/dashboard"
              className="inline-block mt-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition"
            >
              Go to dashboard
            </a>
          }
        />
      )
    }

    await db.userToProject.create({
      data: {
        projectId,
        userId,
      },
    })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return (
        <CenterCard
          title="Already a member"
          description="You are already part of this project"
          action={
            <a
              href="/dashboard"
              className="inline-block mt-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition"
            >
              Go to dashboard
            </a>
          }
        />
      )
    }


    console.error('Error joining project:', error)

    return (
      <CenterCard
        title="Something went wrong"
        description="Please try again later"
        action={
          <a
            href="/dashboard"
            className="inline-block mt-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition"
          >
            Go to dashboard
          </a>
        }
      />
    )
  }

  return redirect('/dashboard')
}

export default JoinPage