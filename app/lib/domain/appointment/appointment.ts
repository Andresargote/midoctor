import type { Service } from "../service";
import type { Time } from "../time";

export enum AppointmentStatusOptions {
	Pending = 0,
	Completed = 1,
	Canceled = 2,
}

type AppointmentStatus = 0 | 1 | 2;

type AppointmentProps = {
	id: number;
	clientId: number;
	professionalId: number;
	scheduleId: number;
	time: Time;
	service: Service;
	date: Date;
	status: AppointmentStatus;
};

export class Appointment {
	private props: AppointmentProps;

	get id(): number {
		return this.props.id;
	}
	get clientId(): number {
		return this.props.clientId;
	}
	get professionalId(): number {
		return this.props.professionalId;
	}
	get scheduleId(): number {
		return this.props.scheduleId;
	}
	get time(): Time {
		return this.props.time;
	}
	get service() {
		return this.props.service;
	}
	get date(): Date {
		return this.props.date;
	}
	get status(): AppointmentStatus {
		return this.props.status;
	}

	constructor(props: AppointmentProps) {
		this.props = props;
	}
}
