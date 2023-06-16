import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="manifest" href="/manifest.json" />

                <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
                <meta name="theme-color" content="#fff" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
