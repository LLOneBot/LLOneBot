import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace SysMsg. */
export namespace SysMsg {

    /** Properties of a SystemMessage. */
    interface ISystemMessage {

        /** SystemMessage header */
        header?: (SysMsg.ISystemMessageHeader[]|null);

        /** SystemMessage msgSpec */
        msgSpec?: (SysMsg.ISystemMessageMsgSpec[]|null);

        /** SystemMessage bodyWrapper */
        bodyWrapper?: (SysMsg.ISystemMessageBodyWrapper|null);
    }

    /** Represents a SystemMessage. */
    class SystemMessage implements ISystemMessage {

        /**
         * Constructs a new SystemMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ISystemMessage);

        /** SystemMessage header. */
        public header: SysMsg.ISystemMessageHeader[];

        /** SystemMessage msgSpec. */
        public msgSpec: SysMsg.ISystemMessageMsgSpec[];

        /** SystemMessage bodyWrapper. */
        public bodyWrapper?: (SysMsg.ISystemMessageBodyWrapper|null);

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessage instance
         */
        public static create(properties?: SysMsg.ISystemMessage): SysMsg.SystemMessage;

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link SysMsg.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link SysMsg.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.SystemMessage;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.SystemMessage;

        /**
         * Verifies a SystemMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessage
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.SystemMessage;

        /**
         * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
         * @param message SystemMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.SystemMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SystemMessageHeader. */
    interface ISystemMessageHeader {

        /** SystemMessageHeader peerNumber */
        peerNumber?: (number|null);

        /** SystemMessageHeader peerString */
        peerString?: (string|null);

        /** SystemMessageHeader uin */
        uin?: (number|null);

        /** SystemMessageHeader uid */
        uid?: (string|null);
    }

    /** Represents a SystemMessageHeader. */
    class SystemMessageHeader implements ISystemMessageHeader {

        /**
         * Constructs a new SystemMessageHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ISystemMessageHeader);

        /** SystemMessageHeader peerNumber. */
        public peerNumber: number;

        /** SystemMessageHeader peerString. */
        public peerString: string;

        /** SystemMessageHeader uin. */
        public uin: number;

        /** SystemMessageHeader uid. */
        public uid?: (string|null);

        /**
         * Creates a new SystemMessageHeader instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessageHeader instance
         */
        public static create(properties?: SysMsg.ISystemMessageHeader): SysMsg.SystemMessageHeader;

        /**
         * Encodes the specified SystemMessageHeader message. Does not implicitly {@link SysMsg.SystemMessageHeader.verify|verify} messages.
         * @param message SystemMessageHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ISystemMessageHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessageHeader message, length delimited. Does not implicitly {@link SysMsg.SystemMessageHeader.verify|verify} messages.
         * @param message SystemMessageHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ISystemMessageHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessageHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.SystemMessageHeader;

        /**
         * Decodes a SystemMessageHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.SystemMessageHeader;

        /**
         * Verifies a SystemMessageHeader message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessageHeader message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessageHeader
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.SystemMessageHeader;

        /**
         * Creates a plain object from a SystemMessageHeader message. Also converts values to other types if specified.
         * @param message SystemMessageHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.SystemMessageHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessageHeader to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemMessageHeader
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SystemMessageMsgSpec. */
    interface ISystemMessageMsgSpec {

        /** SystemMessageMsgSpec msgType */
        msgType?: (number|null);

        /** SystemMessageMsgSpec subType */
        subType?: (number|null);

        /** SystemMessageMsgSpec subSubType */
        subSubType?: (number|null);

        /** SystemMessageMsgSpec msgSeq */
        msgSeq?: (number|null);

        /** SystemMessageMsgSpec time */
        time?: (number|null);

        /** SystemMessageMsgSpec other */
        other?: (number|null);
    }

    /** Represents a SystemMessageMsgSpec. */
    class SystemMessageMsgSpec implements ISystemMessageMsgSpec {

        /**
         * Constructs a new SystemMessageMsgSpec.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ISystemMessageMsgSpec);

        /** SystemMessageMsgSpec msgType. */
        public msgType: number;

        /** SystemMessageMsgSpec subType. */
        public subType: number;

        /** SystemMessageMsgSpec subSubType. */
        public subSubType: number;

        /** SystemMessageMsgSpec msgSeq. */
        public msgSeq: number;

        /** SystemMessageMsgSpec time. */
        public time: number;

        /** SystemMessageMsgSpec other. */
        public other: number;

        /**
         * Creates a new SystemMessageMsgSpec instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessageMsgSpec instance
         */
        public static create(properties?: SysMsg.ISystemMessageMsgSpec): SysMsg.SystemMessageMsgSpec;

        /**
         * Encodes the specified SystemMessageMsgSpec message. Does not implicitly {@link SysMsg.SystemMessageMsgSpec.verify|verify} messages.
         * @param message SystemMessageMsgSpec message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ISystemMessageMsgSpec, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessageMsgSpec message, length delimited. Does not implicitly {@link SysMsg.SystemMessageMsgSpec.verify|verify} messages.
         * @param message SystemMessageMsgSpec message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ISystemMessageMsgSpec, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessageMsgSpec message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessageMsgSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.SystemMessageMsgSpec;

        /**
         * Decodes a SystemMessageMsgSpec message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessageMsgSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.SystemMessageMsgSpec;

        /**
         * Verifies a SystemMessageMsgSpec message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessageMsgSpec message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessageMsgSpec
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.SystemMessageMsgSpec;

        /**
         * Creates a plain object from a SystemMessageMsgSpec message. Also converts values to other types if specified.
         * @param message SystemMessageMsgSpec
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.SystemMessageMsgSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessageMsgSpec to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemMessageMsgSpec
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SystemMessageBodyWrapper. */
    interface ISystemMessageBodyWrapper {

        /** SystemMessageBodyWrapper body */
        body?: (Uint8Array|null);
    }

    /** Represents a SystemMessageBodyWrapper. */
    class SystemMessageBodyWrapper implements ISystemMessageBodyWrapper {

        /**
         * Constructs a new SystemMessageBodyWrapper.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ISystemMessageBodyWrapper);

        /** SystemMessageBodyWrapper body. */
        public body: Uint8Array;

        /**
         * Creates a new SystemMessageBodyWrapper instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessageBodyWrapper instance
         */
        public static create(properties?: SysMsg.ISystemMessageBodyWrapper): SysMsg.SystemMessageBodyWrapper;

        /**
         * Encodes the specified SystemMessageBodyWrapper message. Does not implicitly {@link SysMsg.SystemMessageBodyWrapper.verify|verify} messages.
         * @param message SystemMessageBodyWrapper message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ISystemMessageBodyWrapper, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessageBodyWrapper message, length delimited. Does not implicitly {@link SysMsg.SystemMessageBodyWrapper.verify|verify} messages.
         * @param message SystemMessageBodyWrapper message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ISystemMessageBodyWrapper, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessageBodyWrapper message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessageBodyWrapper
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.SystemMessageBodyWrapper;

        /**
         * Decodes a SystemMessageBodyWrapper message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessageBodyWrapper
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.SystemMessageBodyWrapper;

        /**
         * Verifies a SystemMessageBodyWrapper message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessageBodyWrapper message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessageBodyWrapper
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.SystemMessageBodyWrapper;

        /**
         * Creates a plain object from a SystemMessageBodyWrapper message. Also converts values to other types if specified.
         * @param message SystemMessageBodyWrapper
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.SystemMessageBodyWrapper, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessageBodyWrapper to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemMessageBodyWrapper
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LikeDetail. */
    interface ILikeDetail {

        /** LikeDetail txt */
        txt?: (string|null);

        /** LikeDetail uin */
        uin?: (number|null);

        /** LikeDetail nickname */
        nickname?: (string|null);
    }

    /** Represents a LikeDetail. */
    class LikeDetail implements ILikeDetail {

        /**
         * Constructs a new LikeDetail.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ILikeDetail);

        /** LikeDetail txt. */
        public txt: string;

        /** LikeDetail uin. */
        public uin: number;

        /** LikeDetail nickname. */
        public nickname: string;

        /**
         * Creates a new LikeDetail instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LikeDetail instance
         */
        public static create(properties?: SysMsg.ILikeDetail): SysMsg.LikeDetail;

        /**
         * Encodes the specified LikeDetail message. Does not implicitly {@link SysMsg.LikeDetail.verify|verify} messages.
         * @param message LikeDetail message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ILikeDetail, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LikeDetail message, length delimited. Does not implicitly {@link SysMsg.LikeDetail.verify|verify} messages.
         * @param message LikeDetail message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ILikeDetail, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LikeDetail message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LikeDetail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.LikeDetail;

        /**
         * Decodes a LikeDetail message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LikeDetail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.LikeDetail;

        /**
         * Verifies a LikeDetail message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LikeDetail message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LikeDetail
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.LikeDetail;

        /**
         * Creates a plain object from a LikeDetail message. Also converts values to other types if specified.
         * @param message LikeDetail
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.LikeDetail, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LikeDetail to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LikeDetail
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LikeMsg. */
    interface ILikeMsg {

        /** LikeMsg count */
        count?: (number|null);

        /** LikeMsg time */
        time?: (number|null);

        /** LikeMsg detail */
        detail?: (SysMsg.ILikeDetail|null);
    }

    /** Represents a LikeMsg. */
    class LikeMsg implements ILikeMsg {

        /**
         * Constructs a new LikeMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.ILikeMsg);

        /** LikeMsg count. */
        public count: number;

        /** LikeMsg time. */
        public time: number;

        /** LikeMsg detail. */
        public detail?: (SysMsg.ILikeDetail|null);

        /**
         * Creates a new LikeMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LikeMsg instance
         */
        public static create(properties?: SysMsg.ILikeMsg): SysMsg.LikeMsg;

        /**
         * Encodes the specified LikeMsg message. Does not implicitly {@link SysMsg.LikeMsg.verify|verify} messages.
         * @param message LikeMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.ILikeMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LikeMsg message, length delimited. Does not implicitly {@link SysMsg.LikeMsg.verify|verify} messages.
         * @param message LikeMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.ILikeMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LikeMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LikeMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.LikeMsg;

        /**
         * Decodes a LikeMsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LikeMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.LikeMsg;

        /**
         * Verifies a LikeMsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LikeMsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LikeMsg
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.LikeMsg;

        /**
         * Creates a plain object from a LikeMsg message. Also converts values to other types if specified.
         * @param message LikeMsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.LikeMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LikeMsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LikeMsg
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProfileLikeTip. */
    interface IProfileLikeTip {

        /** ProfileLikeTip msg */
        msg?: (SysMsg.ILikeMsg|null);
    }

    /** Represents a ProfileLikeTip. */
    class ProfileLikeTip implements IProfileLikeTip {

        /**
         * Constructs a new ProfileLikeTip.
         * @param [properties] Properties to set
         */
        constructor(properties?: SysMsg.IProfileLikeTip);

        /** ProfileLikeTip msg. */
        public msg?: (SysMsg.ILikeMsg|null);

        /**
         * Creates a new ProfileLikeTip instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProfileLikeTip instance
         */
        public static create(properties?: SysMsg.IProfileLikeTip): SysMsg.ProfileLikeTip;

        /**
         * Encodes the specified ProfileLikeTip message. Does not implicitly {@link SysMsg.ProfileLikeTip.verify|verify} messages.
         * @param message ProfileLikeTip message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: SysMsg.IProfileLikeTip, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileLikeTip message, length delimited. Does not implicitly {@link SysMsg.ProfileLikeTip.verify|verify} messages.
         * @param message ProfileLikeTip message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: SysMsg.IProfileLikeTip, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileLikeTip message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileLikeTip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SysMsg.ProfileLikeTip;

        /**
         * Decodes a ProfileLikeTip message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileLikeTip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SysMsg.ProfileLikeTip;

        /**
         * Verifies a ProfileLikeTip message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProfileLikeTip message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProfileLikeTip
         */
        public static fromObject(object: { [k: string]: any }): SysMsg.ProfileLikeTip;

        /**
         * Creates a plain object from a ProfileLikeTip message. Also converts values to other types if specified.
         * @param message ProfileLikeTip
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: SysMsg.ProfileLikeTip, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProfileLikeTip to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProfileLikeTip
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
