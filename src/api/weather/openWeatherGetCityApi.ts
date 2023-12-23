import axios from "axios";
import { apiKey } from "./openWeatherAxios";
import {
	WeatherApiParamsType,
	CityApiResultType,
} from "./types/weatherApiTypes";

export const openWeatherAxios = axios.create();
openWeatherAxios.defaults.baseURL = "http://api.openweathermap.org/geo/1.0/";

export const getCityCoordinates = async (
	weatherApiParams: WeatherApiParamsType,
	signal?: AbortSignal
) => {
	let apiUrlParts = "";
	let apiMethod = "";

	if (weatherApiParams.q) {
		apiMethod = "direct";
		apiUrlParts += `&q=${weatherApiParams.q}`;
	} else {
		apiMethod = "reverse";
		apiUrlParts += `&lat=${weatherApiParams.lat}&lon=${weatherApiParams.lon}`;
	}

	return await openWeatherAxios
		.get<CityApiResultType[]>(
			`/${apiMethod}?appId=${apiKey}&limit=1${apiUrlParts}`,
			{ signal: signal }
		)
		.then((response) => {
			return response.data[0];
		})
		.catch((e) => {
			return null;
		});
};
