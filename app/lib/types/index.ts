export type UserProfile = {
	id: string;
	username: string;
	full_name: string;
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
	hours: luxon.DateTime[];
	available: boolean;
};
