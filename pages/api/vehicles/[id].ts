import { Vehicles } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

const handle = async (req: NextApiRequest, res: NextApiResponse<Vehicles>) => {
	const { id } = req.query;
	const { method, body } = req;

	switch (method) {
		case 'GET':
			{
				const result = await prisma.vehicles.findUnique({
					where: { id: parseInt(id as string) },
				});
				res.json(result);
			}
			break;
		case 'PUT':
			{
				const result = await prisma.vehicles.update({
					where: { id: parseInt(id as string) },
					data: body,
				});
				res.json(result);
			}
			break;
		case 'DELETE':
			{
				const result = await prisma.vehicles.delete({
					where: { id: parseInt(id as string) },
				});
				res.json(result);
			}
			break;
		default:
			res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};

export default handle;
