import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "~/styles/globals.css";
import { PomodoroContextProvider } from "~/context/global";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <PomodoroContextProvider>
                <Component {...pageProps} />;
            </PomodoroContextProvider>
        </UserProvider>
    );
};

export default api.withTRPC(MyApp);
