import { Fueling, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from '../../../lib/prisma';
import { requireSessionUserId } from '../_shared/auth';
import { sendForbidden, sendForbiddenAsNotFound } from '../_shared/errors';
import { ensureOwnedFueling } from '../_shared/ownership';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) return;

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	const ownedFueling = await ensureOwnedFueling(Number(id), userId);
	if (!ownedFueling) {
		return sendForbiddenAsNotFound(res, 'Fueling not found.');
	}

	const fueling = await prisma.fueling.findUnique({
		where: { id: ownedFueling.id },
	});

	if (!fueling) {
		return res.status(404).json({ error: 'Fueling not found' });
	}

	res.json(fueling);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) return;

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	const data = req.body;

	const ownedFueling = await ensureOwnedFueling(Number(id), userId);
	if (!ownedFueling) {
		return sendForbidden(
			res,
			'You do not have permission to update this fueling.'
		);
	}

	// Map fuel_type to fuel_type_id
	const fuelTypeMap: Record<string, number> = {
		gasoline: 1,
		diesel: 2,
		lpg: 3,
		electric: 4,
		hybrid: 5,
	};

	// Convert data for Prisma
	const updateData: Prisma.FuelingUpdateInput = {
		cost: data.cost !== undefined ? parseFloat(data.cost) : undefined,
		quantity:
			data.quantity !== undefined ? parseFloat(data.quantity) : undefined,
		mileage: data.mileage !== undefined ? parseFloat(data.mileage) : undefined,
		cost_per_unit:
			data.cost_per_unit !== undefined ? data.cost_per_unit : undefined,
		date: data.date ? new Date(data.date) : undefined,
		full_tank: data.full_tank !== undefined ? data.full_tank : undefined,
		fuel_type_id:
			data.fuel_type !== undefined
				? fuelTypeMap[data.fuel_type] || 1
				: undefined,
	};

	const nextMileage =
		data.mileage !== undefined ? parseFloat(data.mileage) : undefined;

	let updated;
	if (nextMileage !== undefined) {
		updated = await prisma.$transaction(async (tx) => {
			const updatedFueling = await tx.fueling.update({
				where: { id: ownedFueling.id },
				data: updateData,
			});

			const vehicle = await tx.vehicle.findUnique({
				where: { id: updatedFueling.vehicle_id },
			});

			if (vehicle && vehicle.mileage < nextMileage) {
				await tx.vehicle.update({
					where: { id: updatedFueling.vehicle_id },
					data: { mileage: nextMileage },
				});
			}

			return updatedFueling;
		});
	} else {
		updated = await prisma.fueling.update({
			where: { id: ownedFueling.id },
			data: updateData,
		});
	}

	res.json(updated);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	const userId = await requireSessionUserId(req, res);
	if (!userId) return;

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	const ownedFueling = await ensureOwnedFueling(Number(id), userId);
	if (!ownedFueling) {
		return sendForbidden(
			res,
			'You do not have permission to delete this fueling.'
		);
	}

	await prisma.fueling.delete({
		where: { id: ownedFueling.id },
	});

	res.status(204).end();
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Fueling | {}>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		case 'PUT':
			return handlePut(req, res);
		case 'DELETE':
			return handleDelete(req, res);
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
