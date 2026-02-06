import type { Prisma, Vehicle } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireSessionUserId } from '../_shared/auth';
import type { ApiErrorEnvelope } from '../_shared/errors';
import { sendForbidden, sendForbiddenAsNotFound } from '../_shared/errors';
import { ensureOwnedVehicle } from '../_shared/ownership';

type VehicleDetailResponse = Vehicle | ApiErrorEnvelope | { error: string };

const parseVehicleId = (
	idParam: string | string[] | undefined
): number | null => {
	if (!idParam || Array.isArray(idParam)) {
		return null;
	}
	const parsed = Number(idParam);
	return Number.isInteger(parsed) ? parsed : null;
};

const parseOptionalNumber = (value: unknown): number | null | undefined => {
	if (value === undefined) {
		return undefined;
	}
	if (value === null || value === '') {
		return null;
	}
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const parseOptionalString = (value: unknown): string | null | undefined => {
	if (value === undefined) {
		return undefined;
	}
	if (value === null) {
		return null;
	}
	if (typeof value !== 'string') {
		return undefined;
	}
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

const handleGet = async (
	req: NextApiRequest,
	res: NextApiResponse<VehicleDetailResponse>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const vehicleId = parseVehicleId(req.query.id);
	if (!vehicleId) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, sessionUserId);
	if (!ownedVehicle) {
		return sendForbiddenAsNotFound(res);
	}

	const result = await prisma.vehicle.findUnique({
		where: { id: vehicleId },
	});
	return res.json(result);
};

const handlePut = async (
	req: NextApiRequest,
	res: NextApiResponse<VehicleDetailResponse>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const vehicleId = parseVehicleId(req.query.id);
	if (!vehicleId) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, sessionUserId);
	if (!ownedVehicle) {
		return sendForbidden(res);
	}

	const data = req.body as Record<string, unknown> | undefined;
	if (!data || typeof data !== 'object') {
		return res.status(400).json({ error: 'Invalid request body' });
	}

	const productionYearInput = data.production_year;
	if (productionYearInput === '') {
		return res.status(400).json({ error: 'Invalid production year' });
	}

	const productionYear =
		productionYearInput === undefined ? undefined : Number(productionYearInput);
	if (productionYearInput !== undefined && !Number.isInteger(productionYear)) {
		return res.status(400).json({ error: 'Invalid production year' });
	}

	const updateData: Prisma.VehicleUpdateInput = {
		brand_name:
			typeof data.brand_name === 'string' ? data.brand_name.trim() : undefined,
		model_name:
			typeof data.model_name === 'string' ? data.model_name.trim() : undefined,
		fuel_type: typeof data.fuel_type === 'string' ? data.fuel_type : undefined,
		production_year: productionYear,
		registration_number: parseOptionalString(data.registration_number),
		engine_capacity: parseOptionalNumber(data.engine_capacity),
		engine_power: parseOptionalNumber(data.engine_power),
		power_unit: parseOptionalString(data.power_unit),
		transmission: parseOptionalString(data.transmission),
	};

	const result = await prisma.vehicle.update({
		where: { id: vehicleId },
		data: updateData,
	});
	return res.json(result);
};

const handleDelete = async (
	req: NextApiRequest,
	res: NextApiResponse<VehicleDetailResponse>
) => {
	const sessionUserId = await requireSessionUserId(req, res);
	if (!sessionUserId) return;

	const vehicleId = parseVehicleId(req.query.id);
	if (!vehicleId) {
		return res.status(400).json({ error: 'Invalid vehicle id' });
	}

	const ownedVehicle = await ensureOwnedVehicle(vehicleId, sessionUserId);
	if (!ownedVehicle) {
		return sendForbidden(res);
	}

	const result = await prisma.vehicle.delete({
		where: { id: vehicleId },
	});
	return res.json(result);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<VehicleDetailResponse>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		case 'PUT':
			return handlePut(req, res);
		case 'DELETE':
			return handleDelete(req, res);
		default:
			res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
