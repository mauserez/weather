import { ComponentProps } from "react";
import {
	CityApiResultType,
	WeatherForecastApiResultType,
	WeatherNowApiResultType,
} from "../../../api/weather/types/weatherApiTypes";

export type WeatherDataType = {
	city: CityApiResultType;
	now: WeatherNowApiResultType;
	forecast: WeatherForecastApiResultType;
};

export type WeatherFoundType = ComponentProps<"div"> & {
	weatherData: WeatherDataType;
	forecastState: boolean;
};
