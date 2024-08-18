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
	owner_id: string;
	name: string;
	price: number;
	duration: {
		hours: number;
		minutes: number;
	};
};
