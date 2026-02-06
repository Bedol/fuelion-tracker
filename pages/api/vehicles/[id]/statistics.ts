import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma';
import { buildVehicleStatistics } from '../../../../lib/statistics/aggregation';
import { requireSessionUserId } from '../../_shared/auth';
import type { ApiErrorEnvelope } from '../../_shared/errors';
import { sendForbiddenAsNotFound } from '../../_shared/errors';
import { ensureOwnedVehicle } from '../../_shared/ownership';
import type { VehicleStatisticsResponse } from '../../../../types/statistics_types';

const handleGet = async (
	req: NextApiRequest,
	res: NextApiResponse<
		VehicleStatisticsResponse | ApiErrorEnvelope | { error: string }
	>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const { id, year } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const vehicleId = Number(id);
	if (Number.isNaN(vehicleId)) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, sessionUserId);
	if (!ownedVehicle) {
		return sendForbiddenAsNotFound(res);
	}

	let requestedYear: number | undefined;
	if (year !== undefined) {
		if (Array.isArray(year)) {
			return res.status(400).json({ error: 'Invalid year' });
		}
		const parsedYear = Number(year);
		if (!Number.isInteger(parsedYear)) {
			return res.status(400).json({ error: 'Invalid year' });
		}
		requestedYear = parsedYear;
	}

	const fuelings = await prisma.fueling.findMany({
		where: { vehicle_id: vehicleId },
		select: {
			date: true,
			mileage: true,
			quantity: true,
			cost: true,
			full_tank: true,
		},
		orderBy: { date: 'asc' },
	});

	const statistics = buildVehicleStatistics(fuelings, requestedYear);
	return res.status(200).json(statistics);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<VehicleStatisticsResponse | { error: string }>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		default:
			res.setHeader('Allow', ['GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
