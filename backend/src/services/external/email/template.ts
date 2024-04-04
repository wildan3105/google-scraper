export enum emailType {
    NEW_USER = 'NEW_USER',
    USER_ACTIVATED = 'USER_ACTIVATED'
}

export const emailTemplates = (type: emailType): string => {
    let title: string;
    switch (type) {
        case emailType.NEW_USER:
            title = 'Verify your account';
            break;
        case emailType.USER_ACTIVATED:
            title = 'Congrats! Your account is now active 🎉';
            break;
        default:
            title = 'Unknown';
    }

    return title;
};
