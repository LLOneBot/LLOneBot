export enum ElementType {
    TEXT = 1,
    PIC = 2,
    PTT = 4,
    REPLY = 7,
}

export interface SendTextElement {
    elementType: ElementType.TEXT,
    elementId: "",
    textElement: {
        content: string,
        atType: number,
        atUid: string,
        atTinyId: string,
        atNtUid: string,
    }
}
export interface SendPttElement {
    elementType: ElementType.PTT,
    elementId: "",
    pttElement: {
        fileName: string,
        filePath: string,
        md5HexStr: string,
        fileSize: number,
        duration: number,
        formatType: number,
        voiceType: number,
        voiceChangeType: number,
        canConvert2Text: boolean,
        waveAmplitudes: number[],
        fileSubId: "",
        playState: number,
        autoConvertText: number,
    }
}

export interface SendPicElement {
    elementType: ElementType.PIC,
    elementId: "",
    picElement: {
        md5HexStr: string,
        fileSize: number,
        picWidth: number,
        picHeight: number,
        fileName: string,
        sourcePath: string,
        original: boolean,
        picType: number,
        picSubType: number,
        fileUuid: string,
        fileSubId: string,
        thumbFileSize: number,
        summary: string,
    }
}

export interface SendReplyElement {
    elementType: ElementType.REPLY,
    elementId: "",
    replyElement: {
        replayMsgSeq: string,
        replayMsgId: string,
        senderUin: string,
        senderUinStr: string,
    }
}

export type SendMessageElement = SendTextElement | SendPttElement | SendPicElement | SendReplyElement