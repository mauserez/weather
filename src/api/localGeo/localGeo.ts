export const getUserLocation = (props: {
	setState?: (coords: { lat: number; lon: number }) => void;
	force?: boolean;
	callback?: () => void;
}) => {
	const setState = props.setState;
	const callback = props.callback;

	if (localStorage.userLocation) {
		const coords = JSON.parse(localStorage.userLocation);

		if (setState) {
			setState(coords);
		}

		if (props.force !== true) {
			return;
		}
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				};

				if (setState) {
					setState(coords);
					localStorage.setItem("userLocation", JSON.stringify(coords));
				}

				if (callback) {
					callback();
				}
			},
			(error) => {
				if (setState) {
					setState({ lat: -1, lon: -1 });
				}
			}
		);
	} else {
		if (setState) {
			setState({ lat: -1, lon: -1 });
		}
	}
};
