import { OB11User } from '../../types'
import { OB11Constructor } from '../../constructor'
import { getSelfInfo, getSelfNick } from '../../../common/data'
import BaseAction from '../BaseAction'
import { ActionName } from '../types'

class GetLoginInfo extends BaseAction<null, OB11User> {
  actionName = ActionName.GetLoginInfo

  protected async _handle(payload: null) {
    return OB11Constructor.selfInfo({
      ...getSelfInfo(),
      nick: await getSelfNick(true)
    })
  }
}

export default GetLoginInfo
