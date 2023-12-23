import {
	WeatherForecastApiResultType,
	WeatherForecastApiResultTypeListItem,
} from "../../../api/weather/types/weatherApiTypes";
import weatherStyle from "../../Weather/css/weather.module.css";

import { ComponentProps, useState } from "react";

import {
	currentUtcDatePlusTz,
	utcDateFromUnixPlusTz,
} from "../../../libs/dayJsHelper";
import {
	WeatherIcon,
	WeatherByDayIcon,
	WeatherThermometer,
} from "./WeatherOther";
import { Button, Ticket } from "../../FormComponents";

type WeatherShortForecastType = ComponentProps<"div"> & {
	weatherForecast: WeatherForecastApiResultType;
	sliceCount?: number;
};

export const WeatherShortForecast = (props: WeatherShortForecastType) => {
	const sliceCount = props.sliceCount ? props.sliceCount : 6;
	const weatherForecastSlice = props.weatherForecast.list.slice(0, sliceCount);

	return (
		<div className="flex flex-col gap-4">
			<div
				className={`gap-4 font-bold ${weatherStyle.weatherNowShortForecast} `}
			>
				{weatherForecastSlice.map((forecast, i) => {
					return (
						<div
							key={i}
							className="text-center bg-white rounded-2xl p-1 secondary-color"
						>
							<div className="text-lg">
								{utcDateFromUnixPlusTz(
									forecast.dt,
									props.weatherForecast.city.timezone,
									"HH:00"
								)}
							</div>
							<div className={``}>
								<span className={`text-2xl`}>
									{Math.round(forecast.main.temp)}
								</span>
								<span className={`text-sm`}> C</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

type WeatherForecastType = Omit<WeatherShortForecastType, "sliceCount">;
export const WeatherForecast = (props: WeatherForecastType) => {
	const initialForecastType = "day" as "day" | "hour";
	const [forecastType, setForecastType] = useState(initialForecastType);

	const handleForecastType = () => {
		const newForecastType = forecastType === "day" ? "hour" : "day";
		setForecastType(newForecastType);
	};

	return (
		<Ticket
			className={`px-0 border-0 shadow-none ${weatherStyle.weatherForecast}`}
		>
			<div
				className="text-2xl md:text-3xl text-left
				font-semibold mb-4 secondary-color flex justify-between sticky
				top-0 bg-white pb-1"
			>
				Forecast
				<Button
					className="text-sm bg-none bg-white neon-color"
					text={forecastType === "day" ? "By hour" : "By day"}
					onClick={handleForecastType}
				/>
			</div>
			<WeatherForecastBody forecastType={forecastType} {...props} />
		</Ticket>
	);
};

const WeatherForecastBody = (
	props: WeatherForecastType & { forecastType?: "day" | "hour" }
) => {
	let { weatherForecast, forecastType } = props;
	forecastType = forecastType === undefined ? "day" : forecastType;
	let list = weatherForecast.list;

	if (forecastType === "day") {
		list = reCalcForecastByDay(
			weatherForecast.list,
			weatherForecast.city.timezone
		);
	}

	return (
		<div className={`font-bold ${weatherStyle.weatherForecastBody}`}>
			{list.map((forecast, i) => {
				const tempDay = forecast.main.temp_day ?? 0;
				const tempNight = forecast.main.temp_night ?? 0;
				return (
					<div
						key={i}
						className={`${weatherStyle.weatherForecastRow}
							rounded-2xl p-1 gap-2 items-center
							bg-neon px-3 py-3`}
					>
						<div className="flex justify-between flex-wrap">
							{forecastType === "day" ? (
								<>
									<div className="text-2xl flex text-center items-center gap-2">
										{utcDateFromUnixPlusTz(
											forecast.dt,
											weatherForecast.city.timezone,
											"DD.MM"
										)}
									</div>

									<div className={`flex gap-1 items-center`}>
										<div className="flex">
											<WeatherThermometer
												className="text-xl"
												temperature={tempDay}
											></WeatherThermometer>
											<div>
												<span className={`text-xl`}>{Math.round(tempDay)}</span>
												<span className={`text-sm`}> C</span>
											</div>
										</div>

										{forecast.main.temp_night ? (
											<div className="flex text-slate-300">
												<WeatherThermometer
													className="text-xl"
													temperature={tempNight}
												></WeatherThermometer>
												<div>
													<span className={`text-xl`}>
														{Math.round(tempNight) ?? 0}
													</span>
													<span className={`text-sm`}> C</span>
												</div>
											</div>
										) : (
											""
										)}
									</div>
								</>
							) : (
								<>
									<div className="text-lg flex text-center items-center gap-2">
										{utcDateFromUnixPlusTz(
											forecast.dt,
											weatherForecast.city.timezone,
											"DD.MM HH:mm"
										)}
									</div>

									<div className={`flex gap-1 items-center`}>
										<WeatherThermometer
											className="text-2xl"
											temperature={forecast.main.temp}
										></WeatherThermometer>
										<div>
											<span className={`text-2xl`}>
												{Math.round(forecast.main.temp)}
											</span>
											<span className={`text-sm`}> C</span>
										</div>
									</div>
								</>
							)}
						</div>

						<div className="flex justify-between flex-wrap gap-4">
							<div className={`flex gap-1 items-center`}>
								<i className="bi bi-wind text-2xl"></i>
								<span className={`text-2xl`}>
									{Math.round(forecast.wind.speed)}
								</span>
								<span className={`text-sm mt-2`}>m/s</span>
							</div>

							<div className={`flex gap-1 items-center`}>
								<i className="bi bi-moisture text-2xl"></i>
								<span className={`text-2xl`}>
									{Math.round(forecast.main.humidity)}
								</span>
								<span className={`text-sm mt-2`}>%</span>
							</div>
						</div>
						<div className="flex justify-between flex-wrap gap-4">
							<div className={`flex gap-1 items-center`}>
								{forecastType === "day" ? (
									<WeatherByDayIcon
										className="text-3xl"
										apiIconName={forecast.weather[0].icon}
									></WeatherByDayIcon>
								) : (
									<WeatherIcon
										className="text-3xl"
										apiIconName={forecast.weather[0].icon}
									></WeatherIcon>
								)}
							</div>
							<div className={`flex gap-1 items-center`}>
								<span className={`text-2xl`}>
									{Math.round(forecast.main.pressure * 0.750062)}
								</span>
								<span className={`text-sm mt-2`}>mm</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const reCalcForecastByDay = (
	detailedList: WeatherForecastApiResultTypeListItem[],
	timezone: number
) => {
	const preList = {} as {
		[key: string]: WeatherForecastApiResultTypeListItem;
	};

	detailedList.forEach((e, i) => {
		const tzSeconds = timezone;
		const today = parseFloat(currentUtcDatePlusTz(tzSeconds, "YYYYMMDD"));
		const dtFormatted = parseFloat(
			utcDateFromUnixPlusTz(e.dt, tzSeconds, "YYYYMMDD")
		);

		const curDt = dtFormatted;
		const prevDt = dtFormatted - 1;

		if (curDt > today) {
			const timeFormatted = utcDateFromUnixPlusTz(e.dt, tzSeconds, "HH:mm");

			if (!preList[curDt]) {
				preList[curDt] = e;
			}

			if (["11:00", "12:00", "13:00"].includes(timeFormatted)) {
				e.forecastDay = currentUtcDatePlusTz(tzSeconds, "DD.MM");
				e.main.temp_day = e.main.temp;
				preList[curDt] = e;
			}

			if (prevDt > today) {
				if (!preList[prevDt]) {
					preList[prevDt] = e;
				}

				if (["02:00", "03:00", "04:00"].includes(timeFormatted)) {
					if (preList[prevDt]) {
						preList[prevDt].main.temp_night = e.main.temp;
					}
				}
			}
		}
	});

	let list = [];

	for (const item of Object.keys(preList)) {
		if (item) {
			list.push(preList[item]);
		}
	}

	return list;
};
