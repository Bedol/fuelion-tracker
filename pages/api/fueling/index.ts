import { Fueling, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { vehicleId, skip = '0', take = '20' } = req.query;
	if (!vehicleId) {
		return res.status(400).json({ error: 'vehicleId required' });
	}

	const fuelings = await prisma.fueling.findMany({
		where: { vehicle_id: Number(vehicleId) },
		orderBy: { date: 'desc' },
		skip: Number(skip),
		take: Number(take),
	});

	res.json(fuelings);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const data = req.body;

	// Validate required fields
	if (
		!data.vehicle_id ||
		!data.cost ||
		!data.quantity ||
		!data.mileage ||
		!data.date
	) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Map fuel_type to fuel_type_id
	const fuelTypeMap: Record<string, number> = {
		gasoline: 1,
		diesel: 2,
		lpg: 3,
		electric: 4,
		hybrid: 5,
	};

	// Convert string values to numbers for Prisma
	const fuelingData = {
		...data,
		vehicle_id: Number(data.vehicle_id),
		cost: parseFloat(data.cost),
		quantity: parseFloat(data.quantity),
		mileage: parseFloat(data.mileage),
		cost_per_unit:
			data.cost_per_unit ||
			parseFloat(
				(parseFloat(data.cost) / parseFloat(data.quantity)).toFixed(3)
			),
		date: new Date(data.date),
		fuel_type_id: fuelTypeMap[data.fuel_type] || 1,
		currency_id: 1, // Default currency - simplified for v1
	};

	const fueling = await prisma.fueling.create({
		data: fuelingData,
	});

	// Update vehicle mileage if this fueling has higher mileage
	const vehicle = await prisma.vehicle.findUnique({
		where: { id: fuelingData.vehicle_id },
	});

	if (vehicle && vehicle.mileage < fuelingData.mileage) {
		await prisma.vehicle.update({
			where: { id: fuelingData.vehicle_id },
			data: { mileage: fuelingData.mileage },
		});
	}

	res.status(201).json(fueling);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Prisma.PrismaPromise<Fueling[]> | {}>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		case 'POST':
			return handlePost(req, res);
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
