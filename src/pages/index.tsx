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
                <h1 className="text-xl font-medium mb-2.5">Lief Assignment</h1>
                <section className=" bg-white p-5 rounded shadow-lg">
                    <h1 className="text-xl font-bold">
                        A Pomodoro-Based To-Do App
                    </h1>
                    <p className="text-gray-500">Login/Signup to use the app.</p>
                    <div className="border p-1 mt-2 bg-gray-100">
                        <h3>Demo account</h3>
                        <div>
                            <span className="text-gray-500">
                                Email : &nbsp;
                            </span>
                            <span className="select-all">
                                demo@email.com
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">
                                Password : &nbsp;
                            </span>
                            <span className="select-all">
                                Password@123
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5">
                        <Button asChild>
                            <Link target="_blank" href="/api/auth/login">Login/Signup</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
