import weatherStyle from "./css/weather.module.css";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "../FormComponents";
import { getWeather } from "../../api/weather/openWeatherApi";
import { getUserLocation } from "../../api/localGeo/localGeo";

import {
	CityApiResultType,
	WeatherForecastApiResultType,
	WeatherNowApiResultType,
} from "../../api/weather/types/weatherApiTypes";

import { WeatherCity } from "./weatherComponents/WeatherCity";
import { WeatherNow } from "./weatherComponents/WeatherNowDetails";
import { WeatherForecast } from "./weatherComponents/WeatherForecast";
import {
	WeatherLoading,
	WeatherNoData,
	WeatherNoLocation,
} from "./weatherComponents/WeatherOther";

const Weather = () => {
	const cityInitState = {} as CityApiResultType;
	const weatherNowInitState = {} as WeatherNowApiResultType;
	const WeatherForeacastInitState = {} as WeatherForecastApiResultType;

	const [appState, setAppState] = useState(-1);
	const [forecastState, setForecastState] = useState(false);

	const userLocationInit = localStorage.userLocation
		? JSON.parse(localStorage.userLocation)
		: { lat: 0, lon: 0 };

	const [searchValue, setSearchValue] = useState("");
	const [userLocation, setUserLocation] = useState(userLocationInit);
	const [cityState, setCityState] = useState(cityInitState);
	const [weatherNowState, setweatherNowState] = useState(weatherNowInitState);
	const [weatherForecastState, setweatherForecastState] = useState(
		WeatherForeacastInitState
	);

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
			getUserLocation({ setState: setUserLocation });
			if (userLocation.lat === -1) {
				setAppState(2);
			}
		}
		if (userLocation.lat > 0) {
			if ([-1, 0].includes(appState)) {
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
							setAppState(3);
						}

						if (result) {
							if (result.city && result.now && result.forecast) {
								setCityState({ ...result.city });
								setweatherNowState({ ...result.now });
								setweatherForecastState({ ...result.forecast });
								setAppState(1);
							}
						}
					});
				}, 700);
			}
		}
	}, [searchValue, userLocation, appState]);

	const weatherStateClass = appState === 0 ? "weather__loading" : "";

	return appState === -1 ? (
		<WeatherLoading />
	) : (
		<div
			className={`flex flex-col
			justify-start items-center ${weatherStateClass} gap-8 w-full h-full`}
		>
			{appState === 2 ? (
				<WeatherNoLocation />
			) : (
				<>
					<div className={`flex gap-4 ${weatherStyle.weatherSearchWrap}`}>
						<Button
							onClick={() => {
								getUserLocation({
									setState: setUserLocation,
									force: true,
								});
							}}
							className={`
							font-semibold rounded-2xl
							hover:shadow-md white-color
							text-2xl
							`}
							text={" "}
						>
							<i className="bi bi-geo-alt-fill"></i>
						</Button>
						<Input
							wrapClassName={weatherStyle.weatherSearchParent}
							placeholder="Enter city"
							changeCustom={(value: string) => {
								setAppState(0);
								setSearchValue(value);
							}}
							className={`
							flex-2
							font-semibold py-4 px-3
							rounded-2xl secondary-color
							focus:shadow-md hover:shadow-md
							${weatherStyle.weatherSearch}
							`}
						/>
						<Button
							onClick={() => {
								setForecastState(!forecastState);
							}}
							className={`
							font-semibold rounded-2xl
							hover:shadow-md secondary-color
							${weatherStyle.weatherForecastToggle}
							`}
							text={forecastState === false ? "Forecast" : "Today Details"}
						/>
					</div>

					{appState !== 3 ? (
						<div className={`${weatherStyle.weather} w-full gap-8`}>
							<WeatherCity
								city={cityState}
								weather={weatherNowState}
								weatherForecast={weatherForecastState}
							/>

							<div>
								{forecastState === false ? (
									<WeatherNow {...weatherNowState} />
								) : (
									<div>
										<WeatherForecast weatherForecast={weatherForecastState} />
									</div>
								)}
							</div>
						</div>
					) : (
						<WeatherNoData />
					)}
				</>
			)}
		</div>
	);
};

export default Weather;
