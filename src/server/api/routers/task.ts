import { Priority } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
    create: protectedProcedure.input(z.object({
        title: z.string(),
        dueDate: z.date(),
        priority: z.nativeEnum(Priority),
        tomatoesToComplete: z.number(),
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.email;
        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",

                message: "You must be logged in to create a task",
            });
        }
        return ctx.prisma.task.create({
            data: {
                userId,
                title: input.title,
                dueDate: input.dueDate,
                priority: input.priority,
                tomatoes_to_complete: input.tomatoesToComplete,
            },
        });
    }),
    update: protectedProcedure.input(z.object({
        taskId: z.string(),
        title: z.string().optional(),
        dueDate: z.date().optional(),
        description: z.string().optional(),
        priority: z.nativeEnum(Priority).optional(),
        category: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.findUnique({
            where: {
                id: input.taskId,
            },
        });
        if (!task) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Task not found",
            });
        }
        return ctx.prisma.task.update({
            where: {
                id: input.taskId,
            },
            data: {
                title: input.title,
                dueDate: input.dueDate,
                description: input.description,
                priority: input.priority,
                category: input.category,
            },
        });
    }),
    addTomato: protectedProcedure.input(z.object({
        taskId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.findUnique({
            where: {
                id: input.taskId,
            },
        });

        if (!task) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Task not found",
            });
        }

        return ctx.prisma.task.update({
            where: {
                id: input.taskId,
            },
            data: {
                tomatoes: task.tomatoes + 1,
            },
        });
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.email;
        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be logged in to create a task",
            });
        }
        return ctx.prisma.task.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),
    delete: protectedProcedure.input(z.object({
        taskId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.findUnique({
            where: {
                id: input.taskId,
            },
        });

        if (!task) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Task not found",
            });
        }

        return ctx.prisma.task.delete({
            where: {
                id: input.taskId,
            },
        });
    }),
    toggleStatus: protectedProcedure.input(z.object({
        taskId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.findUnique({
            where: {
                id: input.taskId,
            },
        });

        if (!task) {
            throw new TRPCError({
                code: "NOT_FOUND",
            });
        }

        if (!task.done) {
            await ctx.prisma.task.update({
                data: {
                    done: true,
                    completedAt: new Date(),
                },
                where: {
                    id: input.taskId,
                },
            });
            return { done: true };
        } else {
            await ctx.prisma.task.update({
                data: {
                    done: false,
                    completedAt: null,
                },
                where: {
                    id: input.taskId,
                },
            });
            return { done: false };
        }
    }),
});
