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
                            userId: ctx.user.userId
                        }
                    }
                }
            })
            // loads alll docs and summary embeddingsj
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
                        userId: ctx.user.userId
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
            const deleteEmbeddings = ctx.db.sourceCodeEmbedding.deleteMany({ where: { projectId: input.projectId } })
            const deleteCommits = ctx.db.githubCommits.deleteMany({ where: { projectId: input.projectId } })
            const deleteQuestions = ctx.db.saveQuestion.deleteMany({ where: { projectId: input.projectId } })
            const deleteUserProjects = ctx.db.userToProject.deleteMany({ where: { projectId: input.projectId } })
            const deleteProject = ctx.db.project.delete({ where: { id: input.projectId } })

            return await ctx.db.$transaction([
                deleteEmbeddings,
                deleteCommits,
                deleteQuestions,
                deleteUserProjects,
                deleteProject
            ])
        }),
    refreshCommits: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .mutation(async ({ input }) => {
            return await pullCommits(input.projectId)
        }),

    saveAnswer: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                question: z.string(),
                answer: z.string(),
                filesReferences: z.array(z.object({
                    fileName: z.string(),
                    sourceCode: z.string(),
                    summary: z.string()
                })).optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const savedQuestion = await ctx.db.saveQuestion.create({
                data: {
                    projectId: input.projectId,
                    question: input.question,
                    answer: input.answer,
                    filesReference: input.filesReferences ?? {},
                    userId: ctx.user.userId
                }
            })
            return savedQuestion
        }),

    //get the questions
    getQuestions: protectedProcedure
        .input(
            z.object({
                projectId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const questions = await ctx.db.saveQuestion.findMany({
                where: {
                    projectId: input.projectId
                },
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return questions
        })
});