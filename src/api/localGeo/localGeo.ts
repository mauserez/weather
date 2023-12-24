export const getUserLocation = (props: {
	setCoords?: (coords: { lat: number; lon: number }) => void;
	force?: boolean;
	callback?: () => void;
}) => {
	const { setCoords, callback, force } = props;

	if (localStorage.userLocation) {
		const coords = JSON.parse(localStorage.userLocation);

		if (setCoords) {
			setCoords(coords);
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

				if (setCoords) {
					setCoords(coords);
					localStorage.setItem("userLocation", JSON.stringify(coords));
				}

				if (callback) {
					callback();
				}
			},
			(error) => {
				if (setCoords) {
					setCoords({ lat: -1, lon: -1 });
				}
			}
		);
	} else {
		if (setCoords) {
			setCoords({ lat: -1, lon: -1 });
		}
	}
};
