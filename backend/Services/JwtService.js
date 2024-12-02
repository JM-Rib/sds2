import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY} from "../config";

export class JwtService {
    static async getToken(name, surname, now) {
        return jwt.sign(
            {
                name,
                surname,
                now
            },SECRET_JWT_KEY,
            {expiresIn: '1d'}
        );
    }

}