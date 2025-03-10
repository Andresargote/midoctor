import { ScheduleStatusValues } from '../scheduleStatus';

export type UserProfile = {
	id: string;
	username: string;
	full_name: string;
	profession: string;
	about_me: string;
	avatar_url: string;
	created_at: string | null;
	updated_at: string | null;
};

export type Service = {
	service_id: string;
	owner_id: string;
	name: string;
	price: number;
	duration: {
		hours: number;
		minutes: number;
	};
};

export type Consult = {
	id: string;
	is_online: boolean;
	name: string;
	address: string;
	phone_number: string;
	user_id: string;
};

export type Slot = {
	start: string;
	end: string;
};

export type Day = {
	idDay: number;
	day: string;
	available: boolean;
	slots: Slot[];
};

export type Availability = {
	id: string;
	user_id: string;
	timezone: string;
	name: string;
	active: boolean;
	days: Day[];
};

export type WeekDay = {
	day: luxon.DateTime;
	hours: {
		hour: luxon.DateTime;
		isBooked: boolean;
	}[];
	available: boolean;
};

export type Schedule = {
	id: number;
	created_at: string;
	service_id: number;
	availability_id: number;
	name: string;
	email: string;
	comment: string;
	phone_number: string;
	consult_id: string;
	professional_date: string;
	professional_time: {
		start_at: string;
		end_at: string;
		timezone: string;
	};
	client_time: {
		start_at: string;
		end_at: string;
		timezone: string;
	};
	status: ScheduleStatusValues;
	professional_id: string;
	service: {
		name: string;
		price: number;
		duration: any;
		service_id: string;
	};
	consult: {
		name: string;
		address: string;
		is_online: boolean;
		id: number;
		phone_number: string;
	};
	availability: {
		id: number;
		timezone: string;
	};
	profile: {
		full_name: string;
	};
};
