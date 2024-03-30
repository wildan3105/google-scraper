import axios, { AxiosRequestHeaders } from 'axios';

import { ELASTIC_EMAIL_BASE_URL, ELASTIC_EMAIL_API_KEY } from '../../../config';
import { EmailRequest } from './interface';
import { defaultValues } from './config';
interface sendEmailBody {
    recipient: string;
    subject: string;
    content: string;
}

export class EmailService {
    private baseURL: string;
    private apiKey: string;

    constructor(baseURL: string = ELASTIC_EMAIL_BASE_URL as string, apiKey: string = ELASTIC_EMAIL_API_KEY as string) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }

    async sendEmail(payload: sendEmailBody): Promise<void> {
        try {
            const requestBody: EmailRequest = {
                Recipients: {
                    To: [payload.recipient]
                },
                Content: {
                    From: defaultValues.senderEmail,
                    Subject: payload.subject,
                    Body: [
                        {
                            ContentType: 'HTML',
                            Content: payload.content,
                            Charset: 'UTF-8'
                        }
                    ]
                }
            };
            const request = {
                url: this.baseURL + '/emails/transactional',
                method: 'POST',
                body: requestBody
            };

            const authHeader = {
                'X-ElasticEmail-ApiKey': this.apiKey
            } as unknown as AxiosRequestHeaders;

            await axios.post(request.url, request.body, { headers: authHeader });
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response) {
                    if (e.response.status === 400 && e.response.data.Error === 'APIKey Expired') {
                        throw new Error(`Incorrect Elastic Email API key. Please recheck your environment variable.`);
                    }
                }
            }
            console.log(`error when sending email: ${e}`);
        }
    }
}
