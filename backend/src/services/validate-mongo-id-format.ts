// validate ID format, should 24 characters
export const validateMongoIdFormat = (value: string) => {
	if (value.length !== 24) {
		throw new Error(
			`incorrect ID format, expected 24 characters long hex string`
		);
	}

	return true;
};
