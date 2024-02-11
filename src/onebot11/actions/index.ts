import { OB11Return } from '../types';
import { handleReqData } from '../../server/httpserver';

export async function handleAction(
    jsonData: any,
): Promise<OB11Return<any> | undefined> {
    const resData = await handleReqData(jsonData)
    return resData
}
