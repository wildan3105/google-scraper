import { EmailService } from '../../services/external/email/index';
import { User } from '../../domain/user-entity';
import { emailTemplates, emailType } from '../../services/external/email/template';
import { BASE_URL, APP_NAME } from '../../config';

export class UserEventListener {
    constructor(private emailService: EmailService) {}

    async handleNewUser(user: User, code: string): Promise<void> {
        try {
            const fullVerificationLink = BASE_URL + '/api/users/verify?code=' + code;
            const emailContent = {
                recipient: user.email,
                subject: emailTemplates(emailType.NEW_USER),
                content: `Hi there! <br><br> Welcome to the ${APP_NAME}. Please activate your account by clicking this link (valid for the next 7 days): <a href=${BASE_URL}/api/users/verify?code=${code}> Link</a> <br><br> In case the above link didn't work for you, please click below link: <br> ${fullVerificationLink}`
            };

            console.log(`Sending email to ${user.email} for verification`);

            await this.emailService.sendEmail(emailContent);
        } catch (e) {
            console.error(`error when handling new user event ${e}`);
        }
    }

    async handleUserActivated(email: string): Promise<void> {
        try {
            const emailContent = {
                recipient: email,
                subject: emailTemplates(emailType.USER_ACTIVATED),
                content: `Hi there! <br> Congratulations! <br><br> Your account is now fully active. Please login here => ${BASE_URL}/login`
            };

            console.log(`Sending email to ${email} for activating notification`);

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
