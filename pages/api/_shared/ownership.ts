import type { Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';

export type OwnedVehicle = { id: number };
export type OwnedFueling = { id: number; vehicle_id: number };

export const getOwnedVehicleWhere = (
	userId: number
): Prisma.VehicleWhereInput => ({
	user_id: userId,
});

export const getOwnedFuelingWhere = (
	userId: number
): Prisma.FuelingWhereInput => ({
	vehicle: { user_id: userId },
});

export const ensureOwnedVehicle = async (
	vehicleId: number,
	userId: number
): Promise<OwnedVehicle | null> =>
	prisma.vehicle.findFirst({
		where: { id: vehicleId, user_id: userId },
		select: { id: true },
	});

export const ensureOwnedFueling = async (
	fuelingId: number,
	userId: number
): Promise<OwnedFueling | null> =>
	prisma.fueling.findFirst({
		where: { id: fuelingId, vehicle: { user_id: userId } },
		select: { id: true, vehicle_id: true },
	});
