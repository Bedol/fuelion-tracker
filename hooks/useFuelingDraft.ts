'use client';

import { useState, useCallback, useEffect } from 'react';

// Simple debounce implementation (project doesn't have lodash)
const debounce = <T extends (...args: unknown[]) => void>(
	fn: T,
	ms: number
) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => fn(...args), ms);
	};
};

type DraftValues = Record<string, unknown>;

export const useFuelingDraft = (vehicleId: number) => {
	const [hasDraft, setHasDraft] = useState(false);

	const DRAFT_KEY = `fueling-draft-${vehicleId}`;

	// Load draft from localStorage
	const loadDraft = useCallback((): DraftValues | null => {
		if (typeof window === 'undefined') return null;
		const saved = localStorage.getItem(DRAFT_KEY);
		if (saved) {
			setHasDraft(true);
			try {
				return JSON.parse(saved);
			} catch {
				return null;
			}
		}
		return null;
	}, [DRAFT_KEY]);

	// Save draft to localStorage (debounced, 1 second delay)
	const saveDraft = useCallback(
		debounce((values: DraftValues) => {
			if (typeof window === 'undefined') return;
			localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
			setHasDraft(true);
		}, 1000),
		[DRAFT_KEY]
	);

	// Clear draft from localStorage
	const clearDraft = useCallback(() => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(DRAFT_KEY);
		setHasDraft(false);
	}, [DRAFT_KEY]);

	// Check for existing draft on mount
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem(DRAFT_KEY);
		setHasDraft(!!saved);
	}, [DRAFT_KEY]);

	// Add beforeunload warning when draft exists
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasDraft) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [hasDraft]);

	return {
		loadDraft,
		saveDraft,
		clearDraft,
		hasDraft,
	};
};
