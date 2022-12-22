import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/Layout";
import { ChakraProvider } from '@chakra-ui/react'
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
