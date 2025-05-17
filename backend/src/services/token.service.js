let cachedTokenData = null;

function transformToTimestamp(timeString) {
	if (timeString.endsWith("h")) {
		const hours = parseInt(timeString.slice(0, -1), 10);

		if (isNaN(hours)) {
			throw new Error("Invalid time format");
		}
		const milliseconds = hours * 60 * 60 * 1000;

		const timestamp = Date.now() + milliseconds;

		return timestamp;
	} else {
		throw new Error("Time string must end with 'h'");
	}
}

const fetchNewToken = async () => {
	try {
		const tokenResponse = await fetch(
			`${process.env.AGENT_API_URL}/api/authenticate`,
			{
				method: "POST",
				body: JSON.stringify({
					user: process.env.USER_SUPPORT_UNIT,
					secretKey: process.env.SECRET_KEY,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (tokenResponse.status !== 200) {
			console.log("Cannot retrieve new login token");
		}

		const { token, expiresIn } = await tokenResponse.json();
		cachedTokenData = { token, expiresIn: transformToTimestamp(expiresIn) };
		return cachedTokenData;
	} catch (error) {
		console.error("Error fetching token:", error.message);
		throw new Error("Failed to fetch token");
	}
};

const getToken = async () => {
	if (
		cachedTokenData?.token &&
		cachedTokenData?.expiresIn &&
		cachedTokenData.expiresIn > Date.now()
	) {
		return cachedTokenData;
	}

	return await fetchNewToken();
};

export { getToken as default };
