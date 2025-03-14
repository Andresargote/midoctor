'use server';
import { SUPABASE_TABLES } from '@/app/lib/shared/supabase_tables';
import { buildDateTime, checkScheduleCollision } from '@/app/lib/shared/time';
import { ScheduleWithService } from '@/app/lib/types/schedule';
import { createClient } from '@/app/lib/utils/supabase/server';
import { DateTime } from 'luxon';
import { ClientNewScheduleEmail } from '../EmailTemplates/ClientNewSchedule';
import { DoctorNewScheduleEmail } from '../EmailTemplates/DoctorNewSchedule';
import { resend } from '@/app/lib/utils/resend';

type CreateScheduleData = {
	service_id: string;
	availability_id: string;
	profesional_id: string;
	consult_id: string;
	date: string;
	time: string; // Client time
	name: string;
	email: string;
	phone: string;
	comment: string;
	timezone: string; // Client timezone
};

type ProfesionalScheduleData = {
	availabilityTimezone: string;
	serviceDuration: {
		hours: number;
		minutes: number;
	};
};

// TODO: Refactor this function, it's too long
// Extract database calls
// Better error handling
export async function createSchedule(
	schedule: CreateScheduleData,
	profesionalSchedule: ProfesionalScheduleData,
) {
	try {
		const supabase = await createClient();

		let professionalStartAt: DateTime;
		let professionalEndAt: DateTime;

		let clientStartAt: DateTime;
		let clientEndAt: DateTime;

		if (profesionalSchedule.availabilityTimezone === schedule.timezone) {
			const startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			professionalStartAt = startAt;
			professionalEndAt = startAt.plus(profesionalSchedule.serviceDuration);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(profesionalSchedule.serviceDuration);
		} else {
			let startAt = buildDateTime(
				schedule.date,
				schedule.time,
				schedule.timezone,
			);

			clientStartAt = startAt;
			clientEndAt = startAt.plus(profesionalSchedule.serviceDuration);

			professionalStartAt = startAt.setZone(
				profesionalSchedule.availabilityTimezone,
			);
			professionalEndAt = startAt
				.setZone(profesionalSchedule.availabilityTimezone)
				.plus(profesionalSchedule.serviceDuration);
		}

		const maybeSchedules = await supabase
			.from(SUPABASE_TABLES.SCHEDULES)
			.select(
				`
					*,
					service:service_id(*)
				`,
			)
			.eq('professional_date', professionalStartAt.toISODate());

		let alreadyBooked = false;

		// TODO: REMOVE THIS FROM THE ACTION FUNCTION
		if (maybeSchedules.data && maybeSchedules.data.length > 0) {
			// check if there is a collision in the schedules (Incomplete)
			alreadyBooked = checkScheduleCollision(
				professionalStartAt,
				professionalEndAt,
				maybeSchedules.data as ScheduleWithService[],
			);
		}

		if (alreadyBooked) {
			return {
				error: true,
				type: 'reserved',
			};
		}

		const scheduleData = {
			professional_id: schedule.profesional_id,
			service_id: schedule.service_id,
			availability_id: schedule.availability_id,
			consult_id: schedule.consult_id,
			name: schedule.name,
			email: schedule.email,
			phone_number: schedule.phone,
			comment: schedule.comment,
			professional_date: professionalStartAt.toISODate(),
			professional_time: {
				start_at: professionalStartAt.toISO(),
				end_at: professionalEndAt.toISO(),
				timezone: profesionalSchedule.availabilityTimezone,
			},
			client_time: {
				start_at: clientStartAt.toISO(),
				end_at: clientEndAt.toISO(),
				timezone: schedule.timezone,
			},
		};

		const { error } = await supabase
			.from(SUPABASE_TABLES.SCHEDULES)
			.insert(scheduleData);

		if (error) {
			return {
				error: true,
				type: 'error',
			};
		}

		const professional = await supabase
			.from(SUPABASE_TABLES.PROFILE)
			.select('*')
			.eq('id', schedule.profesional_id)
			.maybeSingle();

		const consult = await supabase
			.from(SUPABASE_TABLES.CONSULTS)
			.select('*')
			.eq('id', schedule.consult_id)
			.maybeSingle();

		const service = await supabase
			.from(SUPABASE_TABLES.SERVICES)
			.select('name')
			.eq('service_id', schedule.service_id)
			.maybeSingle();

		if (professional.data) {
			const clientEmail = await resend.emails.send({
				from: 'MiDoctor <info@midoctor.io>',
				to: [schedule.email],
				subject: 'MiDoctor - ¡Tu cita está confirmada!',
				react: ClientNewScheduleEmail({
					professionalName: professional?.data?.full_name,
					clientName: schedule?.name,
					serviceName: service?.data?.name,
					address: consult?.data?.address,
					phoneNumber: consult?.data?.phone_number,
					startAt: clientStartAt,
				}),
			});

			if (clientEmail.error) {
				console.log(clientEmail.error, 'Fail client email');
			}

			const doctorEmail = await resend.emails.send({
				from: 'MiDoctor <info@midoctor.io>',
				to: [professional.data.email],
				subject: 'MiDoctor - Tienes una nueva cita programada',
				react: DoctorNewScheduleEmail({
					professionalName: professional.data.full_name,
					clientName: schedule.name,
					email: schedule.email,
					serviceName: service?.data?.name,
					startAt: professionalStartAt,
				}),
			});

			if (doctorEmail.error) {
				console.log(doctorEmail.error, 'Fail doctor email');
			}
		}

		return {
			error: false,
			type: 'success',
		};
	} catch (error) {
		console.log(error);
		return {
			error: true,
			type: 'error',
		};
	}
}
