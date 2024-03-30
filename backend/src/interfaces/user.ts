export interface IUser {
    id: string;
    email: string;
    created_at: Date;
    last_login: Date;
    is_active: boolean;
}

export interface IUserCreateRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface IUserCreateResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: Date;
}

export interface IUserLoginRequest {
    email: string;
    password: string;
}

export interface IUserLoginResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    access_token: string;
}

export interface IUserDetailsResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface IUserVerificationRequest {
    code: string;
}

export interface IUserWithVerificationCode {
    id: string;
    codes: IVerificationCodes[];
}

interface IVerificationCodes {
    id: string;
    code: string;
    created_at: Date;
    expired_at: Date;
}
