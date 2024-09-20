import { InvalidTimeError } from './errors';

type TimeProps = {
	hour: number;
	minutes: number;
};

export class Time {
	private props: TimeProps;

	get hour(): number {
		return this.props.hour;
	}

	get minutes(): number {
		return this.props.minutes;
	}

	private constructor(props: TimeProps) {
		this.props = props;
	}

	public static newTime(props: TimeProps) {
		// check it has a valid state
		const INVALID_HOUR = props.hour > 23 || props.hour < 0;
		const INVALID_MINUTES = props.minutes > 59 || props.minutes < 0;

		if (INVALID_HOUR || INVALID_MINUTES) {
			throw new InvalidTimeError();
		}

		return new Time(props);
	}

	public isEqual(o: Time) {
		return this.hour === o.hour && this.minutes === o.minutes;
	}

	public greaterThan(o: Time) {
		return (
			this.hour > o.hour || (this.hour === o.hour && this.minutes > o.minutes)
		);
	}

	public lessThan(o: Time) {
		return (
			this.hour < o.hour || (this.hour === o.hour && this.minutes < o.minutes)
		);
	}
}

export function addTime(first: Time, second: Time): Time {
	let hour = first.hour + second.hour;
	let minutes = first.minutes + second.minutes;

	if (minutes >= 60) {
		minutes -= 60;
		hour += 1;
	}

	if (hour > 23) {
		throw new InvalidTimeError();
	}

	return Time.newTime({
		hour,
		minutes: minutes,
	});
}

/**
 * @param first
 * value to substract from
 *
 * @param second
 * negative value
 * */
export function substractTime(first: Time, second: Time): Time {
	let hour = first.hour - second.hour;
	let minutes = first.minutes + second.minutes;

	if (minutes >= 60) {
		minutes -= 60;
		hour += 1;
	}

	if (hour > 23) {
		throw new InvalidTimeError();
	}

	return Time.newTime({
		hour,
		minutes: minutes,
	});
}
