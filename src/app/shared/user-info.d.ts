export interface UserInfo {
    _id?: string | null;
    firstname: string,
    lastname: string,
    birthdate?: Date | null,
    sexe?: string | null,
    address?: string | null,
    profilePicture: string,
    profileCover?: string | null,
    userId: string,
    createdAt: Date,
    email: string,
    username?: string | null
}