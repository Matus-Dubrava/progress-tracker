export const parseDateTime = (dateTime) => {
	const [date, time] = dateTime.split('T');
	return `${date} ${time.split('.')[0]}`;
};
