import type { Time } from '../time';
import type { Day } from './day';

type ScheduleRules = Array<Rule>;
type Rule = {
	day: Day;
	intervals: Array<Interval>;
};

export type Interval = {
	from: Time;
	to: Time;
};

type ScheduleProps = {
	scheduleId: number;
	professionalId: number;
	name: string;
	scheduleRules: ScheduleRules;
	servicesIds: Array<number>;
};

export class Schedule {
	props: ScheduleProps;

	constructor(props: ScheduleProps) {
		this.props = props;
	}
}
