import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Layout from "../components/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </SWRConfig>
  );
}

export default MyApp;
