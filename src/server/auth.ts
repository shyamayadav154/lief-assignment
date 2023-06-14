import { GetServerSidePropsContext } from "next/types";
import {getSession} from '@auth0/nextjs-auth0'
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getSession(ctx.req, ctx.res);
};
