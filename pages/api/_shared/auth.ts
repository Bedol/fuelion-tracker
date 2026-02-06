import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendUnauthenticated } from './errors';

export const requireSessionUserId = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<number | null> => {
	const session = await getServerSession(req, res, authOptions);
	const userId = session?.user?.id;
	const normalizedUserId = typeof userId === 'string' ? Number(userId) : userId;

	if (typeof normalizedUserId !== 'number' || Number.isNaN(normalizedUserId)) {
		sendUnauthenticated(res, 'Authentication required.');
		return null;
	}

	return normalizedUserId;
};
