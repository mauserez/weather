import weatherStyle from "../../Weather/css/weather.module.css";

import { AssociativeArrayNumStr } from "../../../types/types";
import { WeatherNowApiResultType } from "../../../api/weather/types/weatherApiTypes";
import { utcDateFromUnixPlusTz } from "../../../libs/dayJsHelper";

export const WeatherNow = (weather: WeatherNowApiResultType) => {
	const weatherMain = weather.main as AssociativeArrayNumStr;
	const weatherWind = weather.wind as AssociativeArrayNumStr;
	const weatherSys = weather.sys as AssociativeArrayNumStr;

	const metrics = {
		feels_like: { name: "Feels", unit: "c", data: weatherMain, ts: false },
		humidity: { name: "Humid", unit: "%", data: weatherMain, ts: false },
		pressure: { name: "Pressure", unit: "mm", data: weatherMain, ts: false },
		speed: { name: "Wind", unit: "m/s", data: weatherWind, ts: false },
		sunrise: { name: "Sunrise", unit: "", data: weatherSys, ts: true },
		sunset: { name: "Sunset", unit: "", data: weatherSys, ts: true },
	};

	return (
		<div className={weatherStyle.weatherDetails}>
			{Object.entries(metrics).map((metric, i) => {
				let val = metric[1].data[metric[0]];

				if (metric[0] === "pressure") {
					if (typeof val === "number") {
						val = val * 0.750062;
					}
				}

				if (metric[1].ts) {
					if (typeof val === "number") {
						val = utcDateFromUnixPlusTz(val, weather.timezone, "HH:mm");
					}
				}

				return (
					<WeatherDetailsElement
						valueUnit={metric[1].unit}
						className=""
						key={metric[0]}
						text={metric[1].name}
						value={val}
					/>
				);
			})}
		</div>
	);
};

type WeatherElementProps = React.HTMLAttributes<HTMLDivElement> & {
	text?: string | number;
	value?: string | number;
	valueUnit?: string;
};

export const WeatherDetailsElement = (props: WeatherElementProps) => {
	const value =
		typeof props.value === "number" ? Math.round(props.value) : props.value;

	return (
		<div
			className={`
			rounded-2xl def-border px-3 py-2 flex flex-col justify-between bg-neon
			${props.className ?? ""}
			`}
		>
			<div className="text-2xl font-semibold">{props.text}</div>
			<div className="flex items-end justify-end gap-1">
				<div className="text-4xl font-bold">{value}</div>
				<span className="text-3xl font-semibold">{props.valueUnit ?? ""}</span>
			</div>
		</div>
	);
};
