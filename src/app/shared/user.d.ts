import { UserInfo } from './user-info';

export interface User {
    _id: string;
    username: string;
    userInfos?: UserInfo | null;
    createdAt: Date,
    verified: boolean | null,
    contactIds: string[]
    token?: UserToken | null;

}

interface UserToken {
    verify: string
}