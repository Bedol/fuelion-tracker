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

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	const fueling = await prisma.fueling.findUnique({
		where: { id: Number(id) },
	});

	if (!fueling) {
		return res.status(404).json({ error: 'Fueling not found' });
	}

	res.json(fueling);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	const data = req.body;

	// Check if fueling exists
	const existingFueling = await prisma.fueling.findUnique({
		where: { id: Number(id) },
	});

	if (!existingFueling) {
		return res.status(404).json({ error: 'Fueling not found' });
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

	const updated = await prisma.fueling.update({
		where: { id: Number(id) },
		data: updateData,
	});

	// Update vehicle mileage if this fueling has higher mileage
	const vehicle = await prisma.vehicle.findUnique({
		where: { id: updated.vehicle_id },
	});

	if (vehicle && data.mileage && vehicle.mileage < parseFloat(data.mileage)) {
		await prisma.vehicle.update({
			where: { id: updated.vehicle_id },
			data: { mileage: parseFloat(data.mileage) },
		});
	}

	res.json(updated);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { id } = req.query;
	if (!id || Array.isArray(id)) {
		return res.status(400).json({ error: 'Invalid fueling ID' });
	}

	// Check if fueling exists
	const existingFueling = await prisma.fueling.findUnique({
		where: { id: Number(id) },
	});

	if (!existingFueling) {
		return res.status(404).json({ error: 'Fueling not found' });
	}

	await prisma.fueling.delete({
		where: { id: Number(id) },
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
