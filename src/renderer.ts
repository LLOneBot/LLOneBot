/// <reference path="./global.d.ts" />


function onLoad(){
    LLAPI.on("new-messages", (messages) => {
        console.log("收到新消息", messages)
    });
    console.log("getAccountInfo", LLAPI.getAccountInfo());
    console.log("getFriendList", LLAPI.getFriendList(false));
    console.log("getGroupList", LLAPI.getGroupList(false));
}

// 打开设置界面时触发
function onConfigView(view: any) {

}

export {
    onLoad,
    onConfigView
}