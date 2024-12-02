import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY} from "../config";

export class JwtService {
    static async getToken(username, now) {
        return jwt.sign(
            {
                username,
                now
            },SECRET_JWT_KEY,
            {expiresIn: '1d'}
        );
    }

}