import type { Prisma, Vehicle } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireSessionUserId } from '../_shared/auth';
import type { ApiErrorEnvelope } from '../_shared/errors';
import { getOwnedVehicleWhere } from '../_shared/ownership';

type VehicleIndexResponse =
	| Vehicle[]
	| Vehicle
	| ApiErrorEnvelope
	| { error: string };

const handleGet = async (
	req: NextApiRequest,
	res: NextApiResponse<VehicleIndexResponse>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const vehicles = await prisma.vehicle.findMany({
		where: getOwnedVehicleWhere(sessionUserId),
		orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }, { id: 'desc' }],
	});
	return res.json(vehicles);
};

const handlePost = async (
	req: NextApiRequest,
	res: NextApiResponse<VehicleIndexResponse>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const data = req.body as Record<string, unknown> | undefined;
	if (!data || typeof data !== 'object') {
		return res.status(400).json({ error: 'Invalid request body' });
	}

	const brandName =
		typeof data.brand_name === 'string' ? data.brand_name.trim() : '';
	const modelName =
		typeof data.model_name === 'string' ? data.model_name.trim() : '';
	const fuelType = typeof data.fuel_type === 'string' ? data.fuel_type : '';
	const productionYearInput = data.production_year;

	if (
		!brandName ||
		!modelName ||
		!fuelType ||
		productionYearInput === undefined
	) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	if (productionYearInput === '') {
		return res.status(400).json({ error: 'Invalid production year' });
	}

	const productionYear = Number(productionYearInput);
	if (!Number.isInteger(productionYear)) {
		return res.status(400).json({ error: 'Invalid production year' });
	}

	const parseOptionalNumber = (value: unknown): number | null => {
		if (value === undefined || value === null || value === '') {
			return null;
		}
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	};

	const parseOptionalString = (value: unknown): string | null => {
		if (typeof value !== 'string') {
			return null;
		}
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : null;
	};

	const vehicleData: Prisma.VehicleCreateInput = {
		user: { connect: { id: sessionUserId } },
		brand_name: brandName,
		model_name: modelName,
		production_year: productionYear,
		fuel_type: fuelType,
		registration_number: parseOptionalString(data.registration_number),
		engine_capacity: parseOptionalNumber(data.engine_capacity),
		engine_power: parseOptionalNumber(data.engine_power),
		power_unit: parseOptionalString(data.power_unit),
		transmission: parseOptionalString(data.transmission),
	};

	const result = await prisma.vehicle.create({ data: vehicleData });
	return res.status(201).json(result);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<VehicleIndexResponse>
) {
	switch (req.method) {
		case 'POST':
			return handlePost(req, res);
		case 'GET':
			return handleGet(req, res);
		default:
			res.setHeader('Allow', ['POST', 'GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
