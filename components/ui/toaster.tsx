'use client';

import {
	Toaster as ChakraToaster,
	Portal,
	Spinner,
	Stack,
	Toast,
	createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
	placement: 'bottom-end',
	pauseOnPageIdle: true,
});

export const Toaster = () => {
	return (
		<Portal>
			{/* @ts-ignore - Chakra v3 Toaster render-prop children pattern */}
			<ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
				{(toast) => (
					// @ts-ignore
					<Toast.Root width={{ md: 'sm' }}>
						{toast.type === 'loading' ? (
							<Spinner size='sm' color='blue.solid' />
						) : (
							// @ts-ignore
							<Toast.Indicator />
						)}
						<Stack gap='1' flex='1' maxWidth='100%'>
							{toast.title && (
								// @ts-ignore
								<Toast.Title>{toast.title}</Toast.Title>
							)}
							{toast.description && (
								// @ts-ignore
								<Toast.Description>{toast.description}</Toast.Description>
							)}
						</Stack>
						{toast.action && (
							// @ts-ignore
							<Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
						)}
						{toast.closable && (
							// @ts-ignore
							<Toast.CloseTrigger />
						)}
					</Toast.Root>
				)}
			</ChakraToaster>
		</Portal>
	);
};
