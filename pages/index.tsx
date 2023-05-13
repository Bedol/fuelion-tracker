import Head from 'next/head';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Fuelion Tracker</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='max-w-3xl mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-4'>Welcome to Fuelion Tracker!</h1>
				<p className='text-lg text-gray-700 mb-6'>
					Fuelion Tracker is a web application designed to help you keep track
					of your vehicle refuelings. It allows you to record and manage
					refueling data for your vehicles, providing you with valuable insights
					into your fuel consumption and expenses.
				</p>

				<p className='text-lg text-gray-700 mb-4'>
					With Fuelion Tracker, you can:
				</p>
				<ul className='list-disc list-inside mb-6'>
					<li className='mb-2'>
						Easily add new refuelings, specifying the vehicle, fuel type,
						amount, and cost.
					</li>
					<li className='mb-2'>
						View detailed statistics and charts to analyze your fuel consumption
						patterns.
					</li>
					<li className='mb-2'>
						Set reminders for regular maintenance and important vehicle-related
						tasks.
					</li>
					<li className='mb-2'>
						Export and download your refueling data for further analysis or
						record-keeping.
					</li>
				</ul>

				<p className='text-lg text-gray-700'>
					Fuelion Tracker is designed to be user-friendly, intuitive, and
					efficient, making it a valuable tool for both personal and business
					use. Start using Fuelion Tracker today and take control of your
					vehicle&apos;s fuel management!
				</p>

				<p className='text-lg text-gray-700 mt-6'>
					Sign up now and experience the convenience of tracking your refuelings
					with Fuelion Tracker.
				</p>
			</div>
		</div>
	);
}
