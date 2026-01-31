import React from 'react';
import { useRouter } from 'next/router';
import { Vehicle } from '@prisma/client';

type VehicleCardProps = {
	vehicle: Vehicle;
};

type FuelTypeConfig = {
	icon: string;
	label: string;
	bgColor: string;
	textColor: string;
};

const fuelTypeMap: Record<string, FuelTypeConfig> = {
	gasoline: {
		icon: '⛽',
		label: 'Gasoline',
		bgColor: 'bg-red-100',
		textColor: 'text-red-800',
	},
	diesel: {
		icon: '🛢️',
		label: 'Diesel',
		bgColor: 'bg-gray-100',
		textColor: 'text-gray-800',
	},
	lpg: {
		icon: '💨',
		label: 'LPG',
		bgColor: 'bg-blue-100',
		textColor: 'text-blue-800',
	},
	electric: {
		icon: '⚡',
		label: 'Electric',
		bgColor: 'bg-green-100',
		textColor: 'text-green-800',
	},
	hybrid: {
		icon: '🔋',
		label: 'Hybrid',
		bgColor: 'bg-teal-100',
		textColor: 'text-teal-800',
	},
};

const getFuelTypeDisplay = (fuelType: string): FuelTypeConfig => {
	const normalizedType = fuelType.toLowerCase().trim();
	return (
		fuelTypeMap[normalizedType] || {
			icon: '⛽',
			label: fuelType,
			bgColor: 'bg-gray-100',
			textColor: 'text-gray-800',
		}
	);
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
	const router = useRouter();
	const fuelTypeDisplay = getFuelTypeDisplay(vehicle.fuel_type);

	const handleCardClick = () => {
		router.push(`/vehicles/${vehicle.id}`);
	};

	return (
		<div
			className='p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:cursor-pointer transition-all duration-200 hover:border-blue-300'
			onClick={handleCardClick}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleCardClick();
				}
			}}
			aria-label={`${vehicle.brand_name} ${vehicle.model_name} ${vehicle.production_year}`}
		>
			{/* Fuel Type Badge */}
			<div className='mb-4'>
				<span
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${fuelTypeDisplay.bgColor} ${fuelTypeDisplay.textColor}`}
				>
					<span className='text-base'>{fuelTypeDisplay.icon}</span>
					{fuelTypeDisplay.label}
				</span>
			</div>

			{/* Vehicle Info */}
			<div className='space-y-2'>
				<h2 className='text-xl font-bold text-gray-900 leading-tight'>
					{vehicle.brand_name} {vehicle.model_name}
				</h2>

				<div className='flex flex-col gap-1 text-sm text-gray-600'>
					<span className='font-medium'>{vehicle.production_year}</span>
					<span
						className={
							vehicle.registration_number
								? 'text-gray-700 font-semibold'
								: 'text-gray-400 italic'
						}
					>
						{vehicle.registration_number || 'No plates'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default VehicleCard;
