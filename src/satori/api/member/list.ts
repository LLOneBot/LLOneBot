import { GuildMember, List } from '@satorijs/protocol'
import { Handler } from '../index'
import { decodeGuildMember } from '../../utils'

interface Payload {
  guild_id: string
  next?: string
}

export const getGuildMemberList: Handler<List<GuildMember>, Payload> = async (ctx, payload) => {
  const members = await ctx.ntGroupApi.getGroupMembers(payload.guild_id)
  return {
    data: Array.from(members.values()).map(decodeGuildMember)
  }
}
