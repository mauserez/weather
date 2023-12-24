import weatherStyle from "./css/weather.module.css";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "../FormComponents";
import { getWeather } from "../../api/weather/openWeatherApi";
import { getUserLocation } from "../../api/localGeo/localGeo";

import { WeatherDataType, WeatherFoundType } from "./types/weatherTypes";

import { WeatherCity } from "./weatherComponents/WeatherCity";
import { WeatherNow } from "./weatherComponents/WeatherNowDetails";
import { WeatherForecast } from "./weatherComponents/WeatherForecast";
import {
	WeatherLoading,
	WeatherNoData,
	WeatherNoLocation,
} from "./weatherComponents/WeatherOther";

const appStatuses = {
	"-1": "Started",
	"-2": "No geolocation allowed",
	"0": "Request data",
	"1": "Request OK",
	"3": "Request Error No data",
};

const needToRequestData = (state: string) => {
	return [appStatuses["-1"], appStatuses["0"]].includes(state) ? true : false;
};

const Weather = () => {
	const [appStatus, setAppStatus] = useState(appStatuses["-1"]);
	const [forecastState, setForecastState] = useState(false);

	const userLocationInit = localStorage.userLocation
		? JSON.parse(localStorage.userLocation)
		: { lat: 0, lon: 0 };
	const [userLocation, setUserLocation] = useState(userLocationInit);

	const [searchValue, setSearchValue] = useState("");
	const [weatherData, setWeatherData] = useState({} as WeatherDataType);

	const controllerRefTimeOut = useRef<NodeJS.Timeout>();
	const controllerRef = useRef<AbortController>();

	useEffect(() => {
		if (controllerRef.current) {
			controllerRef.current.abort();
		}

		if (controllerRefTimeOut.current) {
			clearTimeout(controllerRefTimeOut.current);
		}

		if (!localStorage.userLocation) {
			getUserLocation({ setCoords: setUserLocation });
			if (userLocation.lat === -1) {
				setAppStatus(appStatuses["-2"]);
			}
		}
		if (userLocation.lat > 0) {
			if (needToRequestData(appStatus)) {
				controllerRef.current = new AbortController();
				const signal = controllerRef.current.signal;
				controllerRefTimeOut.current = setTimeout(() => {
					Promise.resolve(
						getWeather(
							{
								q: searchValue,
								lat: userLocation.lat,
								lon: userLocation.lon,
							},
							signal
						)
					).then((result) => {
						if (result === undefined) {
							setAppStatus(appStatuses["3"]);
						}

						if (result) {
							if (result.city && result.now && result.forecast) {
								setWeatherData({ ...result });
								setAppStatus(appStatuses["1"]);
							}
						}
					});
				}, 700);
			}
		}
	}, [searchValue, userLocation, appStatus]);

	return appStatus === appStatuses["-1"] ? (
		<WeatherLoading />
	) : (
		<div
			className={`flex flex-col justify-start items-center gap-8 w-full h-full`}
		>
			{appStatus === appStatuses["-2"] ? (
				<WeatherNoLocation />
			) : (
				<>
					<div
						className={`flex gap-4 font-semibold ${weatherStyle.weatherSearchWrap}`}
					>
						<Button
							onClick={() => {
								getUserLocation({
									setCoords: setUserLocation,
									force: true,
								});
							}}
							className={`rounded-2xl text-2xl hover:shadow-md white-color`}
							text={" "}
						>
							<i className="bi bi-geo-alt-fill"></i>
						</Button>
						<Input
							wrapClassName={weatherStyle.weatherSearchParent}
							placeholder="Enter city"
							changeCustom={(value: string) => {
								setAppStatus(appStatuses["0"]);
								setSearchValue(value);
							}}
							className={`flex-2 py-4 px-3 rounded-2xl
							secondary-color focus:shadow-md hover:shadow-md
							${weatherStyle.weatherSearch}
							`}
						/>
						<Button
							onClick={() => {
								setForecastState(!forecastState);
							}}
							className={`rounded-2xl hover:shadow-md
							${weatherStyle.weatherForecastToggle}`}
							text={!forecastState ? "Forecast" : "Today Details"}
						/>
					</div>

					{appStatus !== appStatuses["3"] ? (
						<WeatherFound
							weatherData={weatherData}
							forecastState={forecastState}
						/>
					) : (
						<WeatherNoData />
					)}
				</>
			)}
		</div>
	);
};

const WeatherFound = (props: WeatherFoundType) => {
	const { weatherData, forecastState } = props;

	return (
		<div className={`${weatherStyle.weather} w-full gap-8`}>
			<WeatherCity
				city={weatherData.city}
				weather={weatherData.now}
				weatherForecast={weatherData.forecast}
			/>

			<div>
				{!forecastState ? (
					<WeatherNow {...weatherData.now} />
				) : (
					<div>
						<WeatherForecast weatherForecast={weatherData.forecast} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Weather;
