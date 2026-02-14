import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                githubUrl: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            console.log("Eh", ctx.user.userId)
        }),
});