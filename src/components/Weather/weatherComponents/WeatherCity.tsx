import weatherStyle from "../../Weather/css/weather.module.css";

import {
	CityApiResultType,
	WeatherNowApiResultType,
	WeatherForecastApiResultType,
} from "../../../api/weather/types/weatherApiTypes";

import { useState, useEffect } from "react";
import { currentUtcDatePlusTz } from "../../../libs/dayJsHelper";

import { Ticket } from "../../FormComponents";

import { WeatherShortForecast } from "./WeatherForecast";

export const WeatherCity = (props: {
	city: CityApiResultType;
	weather: WeatherNowApiResultType;
	weatherForecast: WeatherForecastApiResultType;
	className?: string;
}) => {
	const city = props.city;
	const weather = props.weather;
	const weatherForecast = props.weatherForecast;
	const format = "HH:mm";
	const [timeState, setTimeState] = useState(
		currentUtcDatePlusTz(weather.timezone, format)
	);

	useEffect(() => {
		setTimeState(currentUtcDatePlusTz(weather.timezone, format));
		const id = setInterval(() => {
			setTimeState(currentUtcDatePlusTz(weather.timezone, format));
		}, 5000);

		return () => {
			clearInterval(id);
		};
	}, [weather.timezone]);

	const temp = Math.round(weather.main.temp);

	return (
		<Ticket
			style={{
				backgroundImage: `url("${process.env.PUBLIC_URL}/img/weather/${weather.weather[0].icon}.jpg")`,
			}}
			className={`bg-cover bg-no-repeat gap-6 ${weatherStyle.weatherNow} ${
				props.className ?? ""
			}`}
		>
			<div
				className={`flex justify-between ${weatherStyle.weatherText} h-full`}
			>
				<div className="flex-2 flex flex-col h-full justify-between gap-8">
					<div>
						<div className="text-2xl md:text-3xl font-semibold break-all">
							{city.name}
						</div>
						<div className="md:text-2xl">{city.state}</div>
					</div>
					<div className="text-2xl">{weather.weather[0].main}</div>
				</div>
				<div className="flex flex-col h-full justify-between">
					<div
						className={`flex-1 flex text-5xl
						lg:text-6xl justify-end font-semibold`}
					>
						{temp}
						<span className="text-2xl font-semibold">C</span>
					</div>
					<div className="flex text-4xl justify-end font-semibold">
						{timeState}
					</div>
				</div>
			</div>
			<WeatherShortForecast weatherForecast={weatherForecast} />
		</Ticket>
	);
};
