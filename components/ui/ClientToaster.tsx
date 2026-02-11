'use client';

import { useEffect, useState } from 'react';
import { Toaster } from './toaster';

const ClientToaster = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return <Toaster />;
};

export default ClientToaster;
