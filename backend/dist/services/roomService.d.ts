export declare class roomServices {
    static create(data: {
        slug: string;
        userId: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        isDeleted: boolean;
        slug: string;
        adminId: string;
    }>;
    static join(data: {
        slug: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        isDeleted: boolean;
        slug: string;
        adminId: string;
    }>;
    static getChats(data: {
        roomId: number;
    }): Promise<{
        msg: string;
        chats?: undefined;
    } | {
        chats: string[] | undefined;
        msg: string;
    }>;
    static delete(data: {
        roomId: number;
        admin: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        isDeleted: boolean;
        slug: string;
        adminId: string;
    } | {
        msg: string;
    }>;
}
//# sourceMappingURL=roomService.d.ts.map