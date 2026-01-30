import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import AuthenticatedLayout from './layout/AuthenticatedLayout';

type LayoutProps = {
	children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { data: session } = useSession();

	// If user is authenticated, use AuthenticatedLayout with navigation
	if (session) {
		return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
	}

	// For public pages (like sign-in), render children without navigation
	return <>{children}</>;
};

export default Layout;
