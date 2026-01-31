import { Fueling } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { vehicleId } = req.query;
	if (!vehicleId) {
		return res.status(400).json({ error: 'vehicleId required' });
	}

	const lastFueling = await prisma.fueling.findFirst({
		where: { vehicle_id: Number(vehicleId) },
		orderBy: { date: 'desc' },
	});

	if (!lastFueling) {
		return res.status(404).json({ error: 'No fuelings found' });
	}

	res.json(lastFueling);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Fueling | {}>
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		default:
			res.setHeader('Allow', ['GET']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
