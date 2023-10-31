/// <reference path="./global.d.ts" />

// import express from "express";
// const { ipcRenderer } = require('electron');
enum AtType {
    notAt = 0,
    atUser = 2
}

const host = "http://localhost:5000"

let groups: Group[] = []
let friends: User[] = []
let groupMembers: { group_id: string, groupMembers: User[] }[] = []

function getFriend(qq: string) {
    return friends.find(friend => friend.uid == qq)
}

function getGroup(qq: string) {
    return groups.find(group => group.uid == qq)
}

let self_qq: string = ""

let uid_maps: Record<string, string> = {}  // 一串加密的字符串 -> qq号

function forwardMessage(message: MessageElement) {
    try {
        let onebot_message_data: any = {
            self: {
                platform: "qq",
                user_id: self_qq
            },
            time: 0,
            type: "message",
            detail_type: message.peer.chatType,
            sub_type: "",
            message: message.raw.elements.map(element => {
                let message_data: any = {
                    data: {}
                }
                if (element.textElement?.atType == AtType.atUser) {
                    message_data["type"] = "at"
                    message_data["data"]["mention"] = element.textElement.atUid
                } else if (element.textElement) {
                    message_data["type"] = "text"
                    message_data["data"]["text"] = element.textElement.content
                } else if (element.picElement) {
                    message_data["type"] = "image"
                    message_data["data"]["file_id"] = element.picElement.fileUuid
                    message_data["data"]["path"] = element.picElement.sourcePath
                } else if (element.replyElement) {
                    message_data["type"] = "reply"
                    message_data["data"]["reply"] = element.replyElement.sourceMsgIdInRecords
                }
                return message_data
            })
        }

        if (message.peer.chatType == "group") {
            onebot_message_data["group_id"] = message.peer.uid
            // todo: 将加密的uid转成qq号
            let groupMember = groupMembers.find(group => group.group_id == message.peer.uid)?.groupMembers.find(member => member.uid == message.sender.uid)
            onebot_message_data["user_id"] = groupMember!.uin
            console.log("收到群消息", onebot_message_data)
        } else if (message.peer.chatType == "private") {
            onebot_message_data["user_id"] = message.peer.uid
        }
        console.log("发送上传消息给ipcmain", onebot_message_data)
        llonebot.postData(onebot_message_data);
    } catch (e) {
        console.log("上传消息事件失败", e)
    }
}

function handleNewMessage(messages: MessageElement[]) {
    messages.forEach(message => {
        if (message.peer.chatType == "group") {
            let group = groupMembers.find(group => group.group_id == message.peer.uid)
            if (!group) {
                group = {
                    group_id: message.peer.uid,
                    groupMembers: []
                }
                groupMembers.push(group)
            }
            let existMember = group!.groupMembers.find(member => member.uid == message.sender.uid)
            if (!existMember) {
                window.LLAPI.getUserInfo(message.sender.uid).then(user => {
                    let member = {memberName: message.sender.memberName, uid: user.uin, nickName: user.nickName}
                    // group!.groupMembers.push(member)
                    group!.groupMembers.push(user)
                    llonebot.updateGroupMembers(group!)
                    forwardMessage(message)
                }).catch(err => {
                    console.log("获取群成员信息失败", err)
                })
            }else{
                forwardMessage(message)
            }
        }
        else{
            forwardMessage(message);
        }
    })
}

function onLoad() {
    llonebot.startExpress();
    llonebot.listenSendMessage((postData: PostDataSendMsg) => {
        if (postData.action == "send_private_msg" || postData.action == "send_group_msg") {
            let peer: Peer | null = null;
            if (postData.action == "send_private_msg") {
                let friend = getFriend(postData.params.user_id)
                if (friend) {
                    peer = {
                        chatType: "private",
                        name: friend.nickName,
                        uid: friend.uin
                    }
                }
            } else if (postData.action == "send_group_msg") {
                let group = getGroup(postData.params.group_id)
                if (group) {
                    peer = {
                        chatType: "group",
                        name: group.name,
                        uid: group.uid
                    }
                }
            }
            if (peer) {
                LLAPI.sendMessage(peer, postData.params.message).then(res => console.log("消息发送成功:", res),
                    err => console.log("消息发送失败", postData, err))
            }
        }
    });

    window.LLAPI.getGroupsList(false).then(groupsList => {
        groups = groupsList
        llonebot.updateGroups(groupsList)
    })

    window.LLAPI.on("new-messages", (messages) => {
        console.log("收到新消息", messages)
        // 往groupMembers里面添加群成员
        if (!self_qq){
            window.LLAPI.getAccountInfo().then(accountInfo => {
                console.log("getAccountInfo", accountInfo)
                self_qq = accountInfo.uin
                handleNewMessage(messages)
            })
        }else{
            handleNewMessage(messages)
        }
    });
    // console.log("getAccountInfo", LLAPI.getAccountInfo());
}

// 打开设置界面时触发
function onConfigView(view: any) {

}

export {
    onLoad,
    onConfigView
}