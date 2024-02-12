import { OB11Return } from '../types';

export class OB11Response {
    static res<T>(data: T, status: number = 0, message: string = ""): OB11Return<T> {
        return {
            status: status,
            retcode: status,
            data: data,
            message: message
        }
    }
    static ok<T>(data: T) {
        return OB11Response.res<T>(data)
    }
    static error(err: string) {
        return OB11Response.res(null, -1, err)
    }
}
