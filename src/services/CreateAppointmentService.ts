import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import User from '../models/User';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}
class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const usersRepository = getRepository(User);
    const provider = await usersRepository.findOne({
      where: { id: provider_id },
    });
    if (!provider) {
      throw new Error('Provider does not exists.');
    }
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const parsedDate = startOfHour(date);
    const findAppointmentInSameDate = await appointmentsRepository.findByDateAndProvider(
      parsedDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw Error('This Appointment was already booked!');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: parsedDate,
    });
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
