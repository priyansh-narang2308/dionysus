import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github-fetch";
import { indexGithubRepo } from "@/lib/github-loader-files";

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
            // loads alll docs and summary embeddings
            await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
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
    }),

    getCommits: protectedProcedure
        .input(
            z.object({
                projectId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            await pullCommits(input.projectId).catch((error) => {
                console.log(error)
            })
            const commits = await ctx.db.githubCommits.findMany({
                where: {
                    projectId: input.projectId
                },
                orderBy: {
                    commitDate: 'desc'
                }
            })
            return commits
        }),
    archiveProject: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.project.update({
                where: { id: input.projectId },
                data: { deletedAt: new Date() }
            })
        }),
    refreshCommits: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .mutation(async ({ input }) => {
            return await pullCommits(input.projectId)
        })
});