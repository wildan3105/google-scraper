export enum emailType {
    NEW_USER = 'NEW_USER',
    FORGET_PASSWORD = 'FORGET_PASSWORD'
}

export const emailTemplates = (type: emailType): string => {
    let title: string;
    switch (type) {
        case emailType.NEW_USER:
            title = 'Verify your account';
            break;
        case emailType.FORGET_PASSWORD:
            title = 'Reset password';
            break;
        default:
            title = 'Unknown';
    }

    return title;
};
