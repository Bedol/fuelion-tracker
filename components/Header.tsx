import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
	const { data: session } = useSession();
	return (
		<header className='bg-gray-100 p-4'>
			<nav className='container mx-auto flex items-center justify-between'>
				<div>
					<Link href='/'>
						<div className='text-xl font-bold'>Fuelion Tracker</div>
					</Link>
				</div>
				<div>
					{session ? (
						<div
							className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer'
							onClick={() => signOut()}
						>
							Logout
						</div>
					) : (
						<div
							className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'
							onClick={() => signIn()}
						>
							Signin
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
