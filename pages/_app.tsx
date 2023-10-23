import { SessionProvider } from 'next-auth/react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Layout from '../components/Layout';
import '../styles/globals.css';

const queryClient = new QueryClient();

const isProduction = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={pageProps.session}>
				<Layout>
					<Hydrate state={pageProps.dehydratedState}>
						<Component {...pageProps} />
					</Hydrate>
				</Layout>
			</SessionProvider>
			{!isProduction && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}

export default MyApp;
