import { EventEmitter } from 'events';
import { UserEventListener } from './listeners/user-event';
import { User } from '../domain/user-entity';
import { EmailService } from '../services/external/email/index';

const emailService = new EmailService();

class Event extends EventEmitter {}

const events = new Event();
const userEventListener = new UserEventListener(emailService);

events.on('new_user', async (user: User, code: string) => {
    await userEventListener.handleNewUser(user, code);
});

events.on('user_logout', async (userId: string) => {
    await userEventListener.handleUserLogout(userId);
});

export default events;
