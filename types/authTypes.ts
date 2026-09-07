export interface SignUpFields {
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    webexId: string | null | undefined;
    agentPhoneNumber: string | null | undefined;
    email: string | null | undefined;
    emailVerified: string | null | undefined;
    password: string | null | undefined;
    passwordVerified: string | null | undefined;
}

export interface LoginFields {
    email: string | null | undefined;
    password: string | null | undefined;
}

export interface UserData {
    firstName: string;
    lastName: string;
    webexId: string | null | undefined;
    agentPhoneNumber: string;
    email: string
}

export interface UserUpdateFields extends UserData {
    password: string | null | undefined;
}
export interface UserUpdateData extends UserData {
    password: string | null | undefined;
}