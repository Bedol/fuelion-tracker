import { State } from "country-state-city";

const getStates = (countryCode: string) => {
  const states = State.getStatesOfCountry(countryCode);
  return states;
};

export { getStates };
