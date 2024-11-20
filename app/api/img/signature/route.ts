import { v2 as cloudinary } from 'cloudinary';

async function getAccurateTimestamp() {
	try {
		const response = await fetch('https://worldtimeapi.org/api/ip');
		const data = await response.json();
		return Math.round(new Date(data.utc_datetime).getTime() / 1000);
	} catch (error) {
		console.error('Error fetching time:', error);
		return Math.round(Date.now() / 1000);
	}
}

export async function GET() {
	const timestamp = await getAccurateTimestamp();
	const apiSecret = process.env.CLOUDINARY_API_SECRET ?? '';

	const signature = cloudinary.utils.api_sign_request(
		{
			timestamp: timestamp,
			upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET ?? '',
		},
		apiSecret,
	);

	return Response.json({
		signature,
		timestamp,
		api_key: process.env.CLOUDINARY_API_KEY,
	});
}
