import { Fueling, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from '../../../lib/prisma';

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse<Prisma.PrismaPromise<Fueling[]> | {}>
) {
	const { method, body } = req;

	switch (method) {
		case 'POST':
			{
				const fueling = await prisma.fueling.create({
					data: body,
				});

				// Find vehicle and update mileage if needed
				const vehicle = await prisma.vehicles.findUnique({
					where: {
						id: body.vehicleId,
					},
				});

				if (vehicle.mileage < body.mileage) {
					await prisma.vehicles.update({
						where: {
							id: body.vehicleId,
						},
						data: {
							mileage: body.mileage,
						},
					});
				}
				res.json(fueling);
			}
			break;
		case 'GET':
			{
				const fueling = await prisma.fueling.findMany();
				res.json(fueling);
			}
			break;
		default:
			res.setHeader('Allow', ['POST', 'GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
