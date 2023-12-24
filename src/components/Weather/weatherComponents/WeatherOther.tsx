import { ComponentProps } from "react";
import { AssociativeArray } from "../../../types/types";
import { Button, Card } from "../../FormComponents";
import weatherStyle from "../../Weather/css/weather.module.css";

export const WeatherNoLocation = () => {
	return (
		<div>
			<Card
				className={`text-3xl justify-center items-center bg-neon flex-col gap-4 ${weatherStyle.weatherError}`}
			>
				<span className="text-center">
					Share your <br /> location.
					<br />
				</span>
				<span className="text-center">
					Then refresh
					<br /> the page
				</span>
				<i className="bi bi-geo-alt-fill text-6xl"></i>
				<Button className="bg-none bg-white px-4 text-2xl neon-color" text="">
					<a
						rel="noreferrer"
						target="_blank"
						href="https://support.google.com/chrome/answer/142065"
					>
						Instruction
					</a>
				</Button>
			</Card>
		</div>
	);
};

export const WeatherNoData = () => {
	return (
		<Card
			className={`text-3xl justify-center items-center bg-neon ${weatherStyle.weatherError}`}
		>
			<span className="mb-4 text-center">
				No data <br />
				available for <br />
				your request
			</span>
			<i className="bi bi-emoji-dizzy text-6xl"></i>
		</Card>
	);
};

export const WeatherLoading = () => {
	return (
		<Card
			className={`text-3xl justify-center items-center bg-neon ${weatherStyle.weatherError}`}
		>
			<span className="mb-4 text-center">Loading...</span>
			<i className="bi bi-globe-central-south-asia text-6xl animate-spin"></i>
		</Card>
	);
};

type WeatherThermometerType = ComponentProps<"div"> & {
	temperature: number;
};
export const WeatherThermometer = (props: WeatherThermometerType) => {
	const temp = props.temperature;
	let icon = "";

	if (temp < -5) {
		icon = "-snow";
	} else if (temp <= 0) {
		icon = "";
	} else if (temp < 10) {
		icon = "-low";
	} else if (temp < 30) {
		icon = "-half";
	} else if (temp >= 30) {
		icon = "-high";
	}

	return (
		<i className={`bi bi-thermometer${icon} ${props.className ?? ""}`}></i>
	);
};

type WeatherIconType = ComponentProps<"div"> & {
	apiIconName: string;
};
export const WeatherIcon = (props: WeatherIconType) => {
	const iconName = props.apiIconName;

	const iconClassList: AssociativeArray = {
		"01d": "sun-fill",
		"01n": "moon-fill",
		"02d": "cloud-sun-fill",
		"02n": "cloud-moon-fill",
		"03d": "cloudy-fill",
		"03n": "cloudy-fill",
		"04d": "clouds-fill",
		"04n": "clouds-fill",
		"09d": "cloud-rain-heavy-fill",
		"09n": "cloud-rain-heavy-fill",
		"10d": "cloud-rain-fill",
		"10n": "cloud-rain-fill",
		"11d": "cloud-lightning-rain-fill",
		"11n": "cloud-lightning-rain-fill",
		"13d": "cloud-snow-fill",
		"13n": "cloud-snow-fill",
		"50d": "cloud-haze-fill",
		"50n": "cloud-haze-fill",
	};

	const className = props.className ?? "";

	return <i className={`bi bi-${iconClassList[iconName]} ${className}`}></i>;
};

export const WeatherByDayIcon = (props: WeatherIconType) => {
	const iconName = props.apiIconName;

	const iconClassList: AssociativeArray = {
		"01d": "sun-fill",
		"01n": "sun-fill",
		"02d": "cloud-sun-fill",
		"02n": "cloud-sun-fill",
		"03d": "cloudy-fill",
		"03n": "cloudy-fill",
		"04d": "clouds-fill",
		"04n": "clouds-fill",
		"09d": "cloud-rain-heavy-fill",
		"09n": "cloud-rain-heavy-fill",
		"10d": "cloud-rain-fill",
		"10n": "cloud-rain-fill",
		"11d": "cloud-lightning-rain-fill",
		"11n": "cloud-lightning-rain-fill",
		"13d": "cloud-snow-fill",
		"13n": "cloud-snow-fill",
		"50d": "cloud-haze-fill",
		"50n": "cloud-haze-fill",
	};

	const className = props.className ?? "";

	return <i className={`bi bi-${iconClassList[iconName]} ${className}`}></i>;
};
