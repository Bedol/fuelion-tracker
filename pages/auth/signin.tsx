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
		<>
			{Object.values(providers).map((provider: CommonProviderOptions) => (
				<div key={provider.name}>
					<button onClick={() => signIn(provider.id)}>
						Sign in with {provider.name}
					</button>
				</div>
			))}
		</>
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
