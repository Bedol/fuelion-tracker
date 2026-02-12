import type { Fueling } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from '../../../lib/prisma';
import { requireSessionUserId } from '../_shared/auth';
import { sendForbidden } from '../_shared/errors';
import type { ApiErrorEnvelope } from '../_shared/errors';
import { ensureOwnedVehicle, getOwnedFuelingWhere } from '../_shared/ownership';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) return;

	const { vehicleId, skip = '0', take = '20' } = req.query;
	if (!vehicleId) {
		return res.status(400).json({ error: 'vehicleId required' });
	}

	const fuelings = await prisma.fueling.findMany({
		where: {
			vehicle_id: Number(vehicleId),
			...getOwnedFuelingWhere(userId),
		},
		orderBy: { date: 'desc' },
		skip: Number(skip),
		take: Number(take),
	});

	res.json(fuelings);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) return;

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

	const vehicleId = Number(data.vehicle_id);
	if (Number.isNaN(vehicleId)) {
		return res.status(400).json({ error: 'Invalid vehicle_id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, userId);
	if (!ownedVehicle) {
		return sendForbidden(
			res,
			'You do not have permission to create fuelings for this vehicle.'
		);
	}

	const vehicle = await prisma.vehicle.findFirst({
		where: { id: vehicleId, user_id: userId },
		select: { mileage: true },
	});

	if (!vehicle) {
		return sendForbidden(
			res,
			'You do not have permission to create fuelings for this vehicle.'
		);
	}

	// Convert string values to numbers for Prisma
	// Only include valid database fields - explicitly map each field
	const fuelingData = {
		vehicle_id: vehicleId,
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
		full_tank: data.full_tank !== undefined ? data.full_tank : true,
	};

	let fueling;
	if (vehicle.mileage < fuelingData.mileage) {
		fueling = await prisma.$transaction(async (tx) => {
			const createdFueling = await tx.fueling.create({
				data: fuelingData,
			});

			await tx.vehicle.update({
				where: { id: fuelingData.vehicle_id },
				data: { mileage: fuelingData.mileage },
			});

			return createdFueling;
		});
	} else {
		fueling = await prisma.fueling.create({
			data: fuelingData,
		});
	}

	res.status(201).json(fueling);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Fueling | Fueling[] | ApiErrorEnvelope>
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
