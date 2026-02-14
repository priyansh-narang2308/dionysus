import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github-fetch";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                githubUrl: z.string(),
                githubToken: z.string().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {

            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    githubUrl: input.githubUrl,
                    userToProjects: {
                        create: {
                            userId: ctx.user.userId! //not always be true
                        }
                    }
                }
            })
            await pullCommits(project.id)
            return project
        }),
    // Fetch all the projects from the database
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        const projects = await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
        return projects
    })
});