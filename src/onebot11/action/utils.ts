import {OB11Return} from '../types';

export class OB11Response {
    static res<T>(data: T, status: string, retcode: number, message: string = ""): OB11Return<T> {
        return {
            status: status,
            retcode: retcode,
            data: data,
            message: message,
            wording: message,
            echo: ""
        }
    }

    static ok<T>(data: T, echo: string = "") {
        let res = OB11Response.res<T>(data, "ok", 0)
        if (echo) {
            res.echo = echo;
        }
        return res;
    }

    static error(err: string, retcode: number, echo: string = "") {
        let res = OB11Response.res(null, "failed", retcode, err)
        if (echo) {
            res.echo = echo;
        }
        return res;
    }
}
