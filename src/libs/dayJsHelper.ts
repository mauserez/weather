import dayjs, { utc } from "dayjs";
import dayJsUtc from "dayjs/plugin/utc";

dayjs.extend(dayJsUtc);

export const currentUtcDatePlusTz = (
	tzSeconds: number,
	format: string = "YYYY-MM-DD"
) => {
	const date = dayjs.utc().add(tzSeconds, "second").format(format).toString();

	return date;
};

export const utcDateFromUnixPlusTz = (
	unixTs: number,
	tzSeconds: number,
	format: string = "YYYY-MM-DD"
) => {
	return dayjs
		.unix(unixTs + tzSeconds)
		.utc()
		.format(format);
};
