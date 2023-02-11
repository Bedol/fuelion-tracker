import Head from 'next/head';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Fuelion Tracker</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='md:container md:mx-auto py-4'>
				<h1>Welcome to Fuelion Tracker</h1>
				<p>Track your money speded to the fuel</p>
			</div>
		</div>
	);
}
