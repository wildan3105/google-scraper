export interface IUserLogin {
    id: string;
    login_timestamp: Date;
    ip_address: string;
}

export interface IUserLoginRequest {
    login_timetamp: Date;
    ip_address?: string;
}

export interface IUserLoginResponse {
    id: string;
    login_timestamp: Date;
    ip_address?: string;
}
