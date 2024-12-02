import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY} from "../config.js";

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

    static async validateToken(token) {
        return jwt.verify(token, SECRET_JWT_KEY);
    }

}