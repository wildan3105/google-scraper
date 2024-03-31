import { EventEmitter } from 'events';
import { UserEventListener } from './listeners/user-event';
import { User } from '../domain/user-entity';
import { EmailService } from '../services/external/email/index';
import { UserEventTypes } from './enum';

const emailService = new EmailService();

class Event extends EventEmitter {}

const events = new Event();
const userEventListener = new UserEventListener(emailService);

events.on(UserEventTypes.newUser, async (user: User, code: string) => {
    await userEventListener.handleNewUser(user, code);
});

events.on(UserEventTypes.userActivated, async (email: string) => {
    await userEventListener.handleUserActivated(email);
});

events.on(UserEventTypes.userLogout, async (userId: string) => {
    await userEventListener.handleUserLogout(userId);
});

export default events;
