export interface ServiceResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
export interface User {
    id: string;
    name: string;
    email: string;
}
export interface SignupResponse extends ServiceResponse<User> {
}
export interface LoginResponse extends ServiceResponse<{
    token: string;
    user: User;
}> {
}
export interface RoomsResponse extends ServiceResponse<{
    rooms: any[];
}> {
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}
//# sourceMappingURL=types.d.ts.map