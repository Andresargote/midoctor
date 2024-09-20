import type { Interval } from '../schedule/schedule';

type ExceptionProps = {
	date: Date;
	intervals: Array<Interval>;
};

export class Exception {
	private props: ExceptionProps;

	get date() {
		return this.props.date;
	}

	get intervals() {
		return this.props.intervals;
	}

	constructor(props: ExceptionProps) {
		this.props = props;
	}
}
