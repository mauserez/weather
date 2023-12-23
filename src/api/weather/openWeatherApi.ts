import axios from "axios";
import { apiKey } from "./openWeatherAxios";
import { getCityCoordinates } from "./openWeatherGetCityApi";
import {
	WeatherApiParamsType,
	CityApiResultType,
	WeatherForecastApiResultType,
	WeatherNowApiResultType,
} from "./types/weatherApiTypes";

export const openWeatherAxios = axios.create();
openWeatherAxios.defaults.baseURL = "https://api.openweathermap.org/data/2.5";

export const getWeather = async (
	weatherApiParams: WeatherApiParamsType,
	signal?: AbortSignal
) => {
	const city: CityApiResultType | null = await getCityCoordinates(
		weatherApiParams,
		signal
	);

	const data = {
		now: {} as WeatherNowApiResultType,
		forecast: {} as WeatherForecastApiResultType,
		city: {} as CityApiResultType,
	};

	if (!city) {
		return;
	}

	let prmsObj: {} = {
		lat: city.lat,
		lon: city.lon,
		units: "metric",
		appid: apiKey,
	};

	const params = new URLSearchParams(prmsObj).toString();

	const getWeatherNow = openWeatherAxios.get<WeatherNowApiResultType>(
		`/weather?${params}`,
		{
			signal: signal,
		}
	);

	const getWeatherForecast = openWeatherAxios.get<WeatherForecastApiResultType>(
		`/forecast?${params}`,
		{
			signal: signal,
		}
	);

	return await Promise.all([getWeatherNow, getWeatherForecast])
		.then((results) => {
			data.now = results[0].data;
			data.forecast = results[1].data;
			data.city = city;

			return data;
		})
		.catch((e) => {
			console.log(e);
		});
};
