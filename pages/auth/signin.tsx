import { Box, Button } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import {
	BuiltInProviderType,
	CommonProviderOptions,
} from 'next-auth/providers';
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
	signIn,
} from 'next-auth/react';

export default function SignIn({ providers }) {
	return (
		<Box>
			{Object.values(providers).map((provider: CommonProviderOptions) => (
				<Box key={provider.name}>
					<Button variant='solid' onClick={() => signIn(provider.id)}>
						Sign in with {provider.name}
					</Button>
				</Box>
			))}
		</Box>
	);
}

export async function getServerSideProps(_context: NextPageContext): Promise<{
	props: {
		providers: Record<
			LiteralUnion<BuiltInProviderType, string>,
			ClientSafeProvider
		>;
	};
}> {
	const providers = await getProviders();
	return {
		props: { providers },
	};
}
