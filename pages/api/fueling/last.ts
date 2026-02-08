import { Fueling } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from '../../../lib/prisma';
import { requireSessionUserId } from '../_shared/auth';
import { sendApiError } from '../_shared/errors';
import { ensureOwnedVehicle, getOwnedFuelingWhere } from '../_shared/ownership';

const parseVehicleId = (
	value: string | string[] | undefined
): number | null => {
	if (!value || Array.isArray(value)) {
		return null;
	}

	const parsed = Number(value);
	if (!Number.isInteger(parsed)) {
		return null;
	}

	return parsed;
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) {
		return;
	}

	const vehicleId = parseVehicleId(req.query.vehicleId);
	if (!vehicleId) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, userId);
	if (!ownedVehicle) {
		return sendApiError(res, 404, 'NOT_FOUND', 'Vehicle not found.');
	}

	const lastFueling = await prisma.fueling.findFirst({
		where: {
			vehicle_id: vehicleId,
			...getOwnedFuelingWhere(userId),
		},
		orderBy: { date: 'desc' },
	});

	if (!lastFueling) {
		return sendApiError(res, 404, 'NOT_FOUND', 'Fueling not found.');
	}

	res.json(lastFueling);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Fueling | object>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		default:
			res.setHeader('Allow', ['GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
