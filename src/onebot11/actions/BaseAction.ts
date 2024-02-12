import {ActionName, BaseCheckResult} from "./types"
import { OB11Response } from "./utils"
import { OB11Return } from "../types";

class BaseAction<PayloadType, ReturnDataType> {
    actionName: ActionName
    protected async check(payload: PayloadType): Promise<BaseCheckResult> {
        return {
            valid: true,
        }
    }

    public async handle(payload: PayloadType): Promise<OB11Return<ReturnDataType | null>> {
        const result = await this.check(payload)
        if (!result.valid) {
            return OB11Response.error(result.message)
        }
        try {
            const resData = await this._handle(payload)
            return OB11Response.ok(resData)
        }catch (e) {
            return OB11Response.error(e.toString())
        }
    }

    protected async _handle(payload: PayloadType): Promise<ReturnDataType> {
        throw `pleas override ${this.actionName} _handle`
    }
}

export default BaseAction