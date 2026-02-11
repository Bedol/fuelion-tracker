import { FuelingType, TypeOfFuel } from './types';

const typeOfFuelings = [
	{ label: 'Full', value: FuelingType.FULL },
	{ label: 'Partial', value: FuelingType.PARTIAL },
];

const typeOfFuel = [
	{ label: 'Gasoline', value: TypeOfFuel.GASOLINE },
	{ label: 'Diesel', value: TypeOfFuel.DIESEL },
	{ label: 'LPG', value: TypeOfFuel.LPG },
	{ label: 'Electric', value: TypeOfFuel.ELECTRIC },
];

const currencies = [
	{ label: 'PLN', value: 'PLN' },
	{ label: 'EUR', value: 'EUR' },
	{ label: 'USD', value: 'USD' },
];

const gasStations = [
	{ label: 'BP', value: 'BP' },
	{ label: 'Lotos', value: 'Lotos' },
	{ label: 'Orlen', value: 'Orlen' },
	{ label: 'Shell', value: 'Shell' },
	{ label: 'Statoil', value: 'Statoil' },
	{ label: 'Total', value: 'Total' },
];

export { typeOfFuelings, typeOfFuel, currencies, gasStations };
