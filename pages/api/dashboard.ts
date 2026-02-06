import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../lib/prisma';
import { buildAllTimeSummary } from '../../lib/statistics/aggregation';
import { authOptions } from './auth/[...nextauth]';
import type {
	DashboardActivityItem,
	DashboardResponse,
	DashboardVehicleSummary,
} from '../../types/dashboard_types';

type DashboardErrorResponse = { error: string };

const handleGet = async (
	req: NextApiRequest,
	res: NextApiResponse<DashboardResponse | DashboardErrorResponse>
) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user?.id) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const vehicles = await prisma.vehicle.findMany({
		where: { user_id: session.user.id },
		select: {
			id: true,
			brand_name: true,
			model_name: true,
			registration_number: true,
			fuel_type: true,
			currency: true,
		},
		orderBy: [{ brand_name: 'asc' }, { model_name: 'asc' }],
	});

	if (vehicles.length === 0) {
		return res.status(200).json({ vehicles: [], recentActivity: [] });
	}

	const vehicleIds = vehicles.map((vehicle) => vehicle.id);
	const fuelings = await prisma.fueling.findMany({
		where: { vehicle_id: { in: vehicleIds } },
		select: {
			vehicle_id: true,
			date: true,
			mileage: true,
			quantity: true,
			cost: true,
			full_tank: true,
		},
	});

	const fuelingsByVehicle = new Map<number, typeof fuelings>();
	fuelings.forEach((fueling) => {
		const existing = fuelingsByVehicle.get(fueling.vehicle_id);
		if (existing) {
			existing.push(fueling);
			return;
		}
		fuelingsByVehicle.set(fueling.vehicle_id, [fueling]);
	});

	const vehiclesWithSummary: DashboardVehicleSummary[] = vehicles.map(
		(vehicle) => {
			const vehicleFuelings = fuelingsByVehicle.get(vehicle.id) ?? [];
			const { totalSpent, averageConsumption, totalDistance } =
				buildAllTimeSummary(vehicleFuelings);
			const lastFuelingDate = vehicleFuelings.reduce<Date | null>(
				(latest, fueling) => {
					if (!fueling.date) {
						return latest;
					}
					if (!latest || fueling.date > latest) {
						return fueling.date;
					}
					return latest;
				},
				null
			);

			return {
				id: vehicle.id,
				brandName: vehicle.brand_name,
				modelName: vehicle.model_name,
				registrationNumber: vehicle.registration_number,
				fuelType: vehicle.fuel_type,
				currency: vehicle.currency,
				totalSpent,
				averageConsumption,
				totalDistance,
				lastFuelingDate: lastFuelingDate ? lastFuelingDate.toISOString() : null,
			};
		}
	);

	const recentFuelings = await prisma.fueling.findMany({
		where: { vehicle: { user_id: session.user.id } },
		select: {
			vehicle_id: true,
			date: true,
			mileage: true,
			quantity: true,
			cost: true,
			vehicle: {
				select: {
					brand_name: true,
					model_name: true,
					registration_number: true,
				},
			},
		},
		orderBy: { date: 'desc' },
		take: 8,
	});

	const recentActivity: DashboardActivityItem[] = recentFuelings.map(
		(fueling) => ({
			vehicleId: fueling.vehicle_id,
			vehicleLabel: `${fueling.vehicle.brand_name} ${fueling.vehicle.model_name}`,
			registrationNumber: fueling.vehicle.registration_number,
			date: fueling.date ? fueling.date.toISOString() : null,
			cost: fueling.cost,
			quantity: fueling.quantity,
			mileage: fueling.mileage,
		})
	);

	return res.status(200).json({
		vehicles: vehiclesWithSummary,
		recentActivity,
	});
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<DashboardResponse | DashboardErrorResponse>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		default:
			res.setHeader('Allow', ['GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
