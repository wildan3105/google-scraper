export interface IUserVerificationCode {
    id: string;
    code: string;
    created_at: Date;
    expired_at: Date;
}

export interface ICreateVerificationCode {
    code: string;
    expired_at: Date;
    user_id: string;
}

export interface IFindVerificationCodeResponse {
    user_id: string;
    expired_at: Date;
    code: string;
    created_at: Date;
}
