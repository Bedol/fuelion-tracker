'use client';

import { useEffect, useState } from 'react';
import { Toaster } from '@chakra-ui/react';
import { toaster } from './toaster';

const ClientToaster = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return <Toaster toaster={toaster} />;
};

export default ClientToaster;
