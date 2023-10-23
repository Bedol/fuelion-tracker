import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type LayoutProps = {
	children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='flex'>
			<Sidebar />
			<div className='flex flex-col w-full'>
				<Header />
				<main className='p-4'>{children}</main>
			</div>
		</div>
	);
};

export default Layout;
