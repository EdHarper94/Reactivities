import z from "zod";
import { requiredString } from "../util/utils";

export const registerSchema = z.object({
    email: z.email(),
    displayName: requiredString("DisplayName"),
    password: requiredString("Password")
})

export type RegisterSchema = z.infer<typeof registerSchema>;