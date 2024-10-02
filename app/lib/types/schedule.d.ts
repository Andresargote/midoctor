import { Service } from '.';

export type Schedule = {
	id: string;
	professional_id: number;
	professional_id: string;
	service_id: string;
	name: string;
	email: string;
	comment: string;
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
};

export type ScheduleWithService = Schedule & {
	service: Service;
};
