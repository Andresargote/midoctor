import type { Time } from '../time';

type ServiceProps = {
	serviceId: number;
	professionalId: number;
	name: string;
	description: string;
	price: number;
	duration: Time;
};

export class Service {
	private props: ServiceProps;

	get serviceId(): number {
		return this.props.serviceId;
	}
	get professionalId(): number {
		return this.props.professionalId;
	}
	get name(): string {
		return this.props.name;
	}
	get description(): string {
		return this.props.description;
	}
	get price(): number {
		return this.props.price;
	}
	get duration(): Time {
		return this.props.duration;
	}

	constructor(props: ServiceProps) {
		this.props = props;
	}
}
