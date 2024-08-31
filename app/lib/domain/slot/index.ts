import type { Time } from "../time";

type SlotStatus = 0 | 1 | 2;

export enum SlotStatusOptions {
	Unavailable = 0,
	Available = 1,
	Booked = 2,
}

type SlotProps = {
	time: Time;
	status?: SlotStatus;
};

export class Slot {
	private props: SlotProps;

	get time(): Time {
		return this.props.time;
	}

	get status(): SlotStatus {
		return this.props.status as SlotStatus;
	}

	public setStatus(value: SlotStatus) {
		this.props.status = value;
	}

	constructor(props: SlotProps) {
		this.props = {
			...props,
			status: props.status ?? SlotStatusOptions.Available,
		};
	}
}
