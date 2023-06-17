import { getSession } from "@auth0/nextjs-auth0";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req, res } = ctx;
    const session = await getSession(req, res);
    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: "/home",
            },
        };
    }

    return {
        props: {},
    };
};

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Tasks App - Lief Assignment</title>
                <meta name="description" content="A pomodoro based to-do app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="grid place-content-center h-screen">
                <section className=" bg-white p-5 rounded shadow-lg">
                    <h1 className="text-xl font-bold">
                        A Pomodoro-Based To-Do App
                    </h1>
                    <p className="text-gray-500">Login/Signup to use the app.</p>
                    <div className="flex justify-end mt-5">
                        <Button asChild>
                            <Link href="/api/auth/login">Login/Signup</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
