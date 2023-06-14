import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input, ctx }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.session.user;
    }),
});
