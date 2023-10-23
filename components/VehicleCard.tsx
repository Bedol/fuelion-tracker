import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const VehicleCard = ({ vehicle }) => {
	const router = useRouter();
	const handleCardClick = (e) => {
		e.preventDefault();
		console.log('Card clicked');
		router.push(`/vehicles/${vehicle.id}/statistics`);
	};

	return (
		<div
			className='p-4 border rounded-md shadow-md hover:cursor-pointer hover:shadow-lg'
			onClick={handleCardClick}
		>
			<div className='flex flex-col items-center'>
				<div className='w-40 h-40 relative'>
					<Image
						src='https://via.placeholder.com/150'
						alt='Vehicle Image'
						width={150}
						height={150}
						className='rounded-md'
					/>
				</div>
				<h2 className='mt-4 font-bold text-xl'>
					{vehicle.brand_name} {vehicle.model_name}
				</h2>
			</div>
		</div>
	);
};

export default VehicleCard;
