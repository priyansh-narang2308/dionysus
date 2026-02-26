import { AssemblyAI } from "assemblyai";
import type { Transcript } from "assemblyai";
import { env } from "../env";

const client = new AssemblyAI({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  apiKey: env.ASSEMBLYAI_API_KEY,
});



function msToTime(ms: number) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const processMeeting = async (
  meetingUrl: string,
): Promise<{
  transcript: Transcript;
  summaries: Array<{
    start: string;
    end: string;
    gist: string | null;
    headline: string | null;
    summary: string | null;
  }>;
}> => {
  const transcript = await client.transcripts.transcribe({
    audio: meetingUrl,
    auto_chapters: true,
  });

  if (transcript.status === "error") {
    throw new Error(`AssemblyAI Error: ${transcript.error}`);
  }

  if (!transcript.text) {
    throw new Error("No transcript found: The audio might be silent or have no speech.");
  }

  const summaries =
    transcript.chapters?.map((chapter) => ({
      // This is what assembly ai generates!!
      start: msToTime(chapter.start),
      end: msToTime(chapter.end),
      gist: chapter.gist,
      headline: chapter.headline,
      summary: chapter.summary,
    })) ?? [];

  return {
    transcript,
    summaries,
  };
};

