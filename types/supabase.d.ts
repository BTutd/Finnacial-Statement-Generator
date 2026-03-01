import { Session,User } from "inspector/promises";

export interface AuthState {
    session:Session | null;
    user:Useer | null;
}