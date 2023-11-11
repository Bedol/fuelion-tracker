import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '../components/Layout';
import '../styles/globals.css';

const queryClient = new QueryClient();
const system = createSystem(defaultConfig);

const isProduction = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider value={system}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider session={pageProps.session}>
					<Layout>
						<HydrationBoundary state={pageProps.dehydratedState}>
							<Component {...pageProps} />
						</HydrationBoundary>
					</Layout>
				</SessionProvider>
				{!isProduction && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</ChakraProvider>
	);
}

export default MyApp;
