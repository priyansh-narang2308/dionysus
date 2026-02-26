import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";

const bodyParser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string(),
})

export const maxDuration = 300 //5 minutes

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    let meetingId: string | undefined;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const body = await req.json()
        const parsed = bodyParser.parse(body)
        meetingId = parsed.meetingId;
        const { meetingUrl } = parsed;

        const { summaries } = await processMeeting(meetingUrl)

        await db.issue.createMany({
            // Fectch all the data
            skipDuplicates: true,
            data: summaries.map((summary) => {
                return {
                    start: summary.start,
                    end: summary.end,
                    gist: summary.gist ?? "",
                    headline: summary.headline ?? "",
                    summary: summary.summary ?? "",
                    meetingId: meetingId!,
                }
            })

        })
        await db.meeting.update({
            where: {
                id: meetingId
            },
            data: {
                status: "COMPLETED",
                name: summaries[0]?.headline ?? "Untitled Meeting"
            }
        })
        return NextResponse.json({ success: true })

    } catch (error) {
        console.error(error)
        if (meetingId && error instanceof Error && (error.message.includes("No transcript found") || error.message.includes("AssemblyAI Error"))) {
            await db.meeting.update({
                where: { id: meetingId },
                data: { status: "FAILED" }
            })
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to process meeting" }, { status: 500 })
    }
}