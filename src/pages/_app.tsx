import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "~/styles/globals.css";
import { PomodoroContextProvider } from "~/context/global";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <PomodoroContextProvider>
                <main className={inter.className}>
                    <Component {...pageProps} />;
                </main>
            </PomodoroContextProvider>
        </UserProvider>
    );
};

export default api.withTRPC(MyApp);
