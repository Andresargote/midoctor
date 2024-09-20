export function generateHoursAndMinutes(
	startTime: string,
	endTime: string,
	interval: number,
) {
	// Convierte el tiempo en minutos desde medianoche
	function timeToMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
	// Convierte minutos a formato de tiempo 'HH:MM'
	function minutesToTime(minutes: number) {
		const hours = Math.floor(minutes / 60)
			.toString()
			.padStart(2, '0');
		const mins = (minutes % 60).toString().padStart(2, '0');
		return `${hours}:${mins}`;
	}

	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);
	const hoursAndMinutes = [];

	for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
		hoursAndMinutes.push(minutesToTime(minutes));
	}

	//hoursAndMinutes.push('23:59');

	return hoursAndMinutes;
}
