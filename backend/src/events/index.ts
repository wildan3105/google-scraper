import { EventEmitter } from 'events';
import { UserEventListener } from './listeners/user-event';
import { KeywordEventListener } from './listeners/keyword-event';
import { User } from '../domain/user-entity';
import { EmailService } from '../services/external/email/index';
import { UserEventTypes, KeywordEventTypes } from './enum';

const emailService = new EmailService();

class Event extends EventEmitter {}

const events = new Event();
const userEventListener = new UserEventListener(emailService);
const keywordEventListener = new KeywordEventListener();

events.on(UserEventTypes.newUser, async (user: User, code: string) => {
    await userEventListener.handleNewUser(user, code);
});

events.on(UserEventTypes.userActivated, async (email: string) => {
    await userEventListener.handleUserActivated(email);
});

events.on(UserEventTypes.userLogout, async (userId: string) => {
    await userEventListener.handleUserLogout(userId);
});

events.on(KeywordEventTypes.keywordsUploaded, async (userId: string, keywords: string[]) => {
    await keywordEventListener.handleKeywordsUploadEvent(userId, keywords);
});

export default events;
