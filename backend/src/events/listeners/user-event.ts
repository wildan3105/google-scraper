import { EmailService } from '../../services/external/email/index';
import { User } from '../../domain/user-entity';
import { emailTemplates, emailType } from '../../services/external/email/template';
import { BASE_URL } from '../../config';

export class UserEventListener {
    private emailService: EmailService;

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }

    async handleNewUser(user: User, code: string): Promise<void> {
        try {
            const fullVerificationLink = BASE_URL + '/users/verify?code=' + code;
            const emailContent = {
                recipient: user.email,
                subject: emailTemplates(emailType.NEW_USER),
                content: `Hi <b> ${user.first_name}</b>! <br><br> Welcome to the express-typescript-postgres app. Please activate your account by clicking this link (valid for the next 7 days): <a href=${BASE_URL}/users/verify?code=${code}> Link</a> <br><br> In case the above link didn't work for you, please click below link: <br> ${fullVerificationLink}`
            };

            console.log(`Sending email to ${user.email} for verification`);

            await this.emailService.sendEmail(emailContent);
        } catch (e) {
            console.error(`error when handling new user event ${e}`);
        }
    }

    async handleUserLogout(userId: string): Promise<void> {
        try {
            // TODO: invalidate token and or send notif to user
            console.log(`${userId} is logging out`);
        } catch (e) {
            console.error(`error when handling user logout event ${e}`);
        }
    }
}
