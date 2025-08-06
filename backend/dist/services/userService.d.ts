import { ServiceResponse } from "./../types/types";
export declare class UserService {
    static signup(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<ServiceResponse>;
    static login(data: {
        email: string;
        password: string;
    }): Promise<ServiceResponse<{
        token: string;
        user: object;
    }>>;
    static getRooms(userId: string): Promise<ServiceResponse<{
        rooms: any[];
    }>>;
}
//# sourceMappingURL=userService.d.ts.map