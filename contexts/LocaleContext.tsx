import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

export type Locale = 'pl' | 'en';

type Dictionary = Record<string, any>;

type LocaleContextType = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type LocaleProviderProps = {
	children: ReactNode;
};

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
	// Initialize locale from localStorage or default to 'pl'
	const [locale, setLocaleState] = useState<Locale>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('locale');
			return saved === 'pl' || saved === 'en' ? saved : 'pl';
		}
		return 'pl';
	});
	const [dictionary, setDictionary] = useState<Dictionary>({});

	// Wrapper to persist locale changes to localStorage
	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		if (typeof window !== 'undefined') {
			localStorage.setItem('locale', newLocale);
		}
	};

	useEffect(() => {
		// Dynamically import dictionary based on locale
		import(`../lib/i18n/dictionaries/${locale}.json`)
			.then((module) => setDictionary(module.default || module))
			.catch((error) => {
				console.error(`Failed to load dictionary for locale: ${locale}`, error);
				setDictionary({});
			});
	}, [locale]);

	const t = (key: string): string => {
		// Support nested keys using dot notation (e.g., "nav.vehicles")
		const keys = key.split('.');
		let value: any = dictionary;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = value[k];
			} else {
				// Graceful degradation: return key if not found
				return key;
			}
		}

		// Return the value if it's a string, otherwise return the key
		return typeof value === 'string' ? value : key;
	};

	return (
		<LocaleContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocale = (): LocaleContextType => {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return context;
};
