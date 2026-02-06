import type { NextApiResponse } from 'next';

export type ApiErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND';

export type ApiErrorDetails = Record<string, string | number | boolean>;

export type ApiErrorEnvelope = {
	error: {
		code: ApiErrorCode;
		message: string;
		details?: ApiErrorDetails;
	};
};

type ApiErrorResponse = NextApiResponse<ApiErrorEnvelope>;

export const sendApiError = (
	res: ApiErrorResponse,
	status: number,
	code: ApiErrorCode,
	message: string,
	details?: ApiErrorDetails
): ApiErrorResponse => {
	const error = details ? { code, message, details } : { code, message };
	res.status(status).json({ error });
	return res;
};

export const sendUnauthenticated = (
	res: ApiErrorResponse,
	message = 'Authentication required.',
	details?: ApiErrorDetails
): ApiErrorResponse =>
	sendApiError(res, 401, 'UNAUTHENTICATED', message, details);

export const sendForbidden = (
	res: ApiErrorResponse,
	message = 'You do not have permission to perform this action.',
	details?: ApiErrorDetails
): ApiErrorResponse => sendApiError(res, 403, 'FORBIDDEN', message, details);

export const sendForbiddenAsNotFound = (
	res: ApiErrorResponse,
	message = 'Resource not found.',
	details?: ApiErrorDetails
): ApiErrorResponse => sendApiError(res, 403, 'NOT_FOUND', message, details);
