import countries from './data/countries.json';

const getCountries = () => {
	// Using https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json as a source saved in the data folder
	return countries;
};

export { getCountries };
