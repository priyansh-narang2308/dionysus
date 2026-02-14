import { db } from "@/server/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


const SyncUser = async () => {

    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }

    // Fetch user from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    if (!user.emailAddresses[0]?.emailAddress) {
        return redirect('/sign-in')
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await db.user.upsert({
        where: {
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
        },
        update: {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
        },
        create: {
            id: userId,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
        }
    })

    redirect("/dashboard")
}

export default SyncUser