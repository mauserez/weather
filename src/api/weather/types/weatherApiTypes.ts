import { AssociativeArray } from "../../../types/types";

export type WeatherApiParamsType = {
	q?: string;
	lat?: number;
	lon?: number;
};

export type CityApiResultType = {
	name: string;
	local_names: { [key: string]: string | boolean | number };
	lat: number;
	lon: number;
	country: string;
	state: string;
};

export type WeatherNowApiResultType = {
	base: string;
	clouds: { all: number };
	cod: number;
	coord: { lon: number; lat: number };
	dt: number;
	id: number;
	main: {
		feels_like: number;
		grnd_level: number;
		humidity: number;
		pressure: number;
		sea_level: number;
		temp: number;
		temp_max: number;
		temp_min: number;
	} & AssociativeArray;
	name: string;
	snow: { "1h": number };
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	visibility: number;
	weather: {
		description: string;
		icon: string;
		id: number;
		main: string;
	}[];
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
};

export type WeatherForecastApiResultTypeListItem = {
	clouds: { all: number };
	dt: number;
	dt_txt: string;
	main: {
		feels_like: number;
		grnd_level: number;
		humidity: number;
		pressure: number;
		sea_level: number;
		temp: number;
		temp_kf: number;
		temp_max: number;
		temp_min: number;
		temp_day: number;
		temp_night: number;
	};
	pop: number;
	snow: { "3h": number };
	sys: { pod: string };
	visibility: number;
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	forecastDay?: string;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
};

export type WeatherForecastApiResultType = {
	city: {
		coord: { lat: number; lon: number };
		country: string;
		id: number;
		name: string;
		population: number;
		sunrise: number;
		sunset: number;
		timezone: number;
	};
	list: WeatherForecastApiResultTypeListItem[];
};
