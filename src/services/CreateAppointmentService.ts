import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}
class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const parsedDate = startOfHour(date);
    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      parsedDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This Appointment was already booked!');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: parsedDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
