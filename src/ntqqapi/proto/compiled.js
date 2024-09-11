/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const SysMsg = $root.SysMsg = (() => {

    /**
     * Namespace SysMsg.
     * @exports SysMsg
     * @namespace
     */
    const SysMsg = {};

    SysMsg.SystemMessage = (function() {

        /**
         * Properties of a SystemMessage.
         * @memberof SysMsg
         * @interface ISystemMessage
         * @property {Array.<SysMsg.ISystemMessageHeader>|null} [header] SystemMessage header
         * @property {Array.<SysMsg.ISystemMessageMsgSpec>|null} [msgSpec] SystemMessage msgSpec
         * @property {SysMsg.ISystemMessageBodyWrapper|null} [bodyWrapper] SystemMessage bodyWrapper
         */

        /**
         * Constructs a new SystemMessage.
         * @memberof SysMsg
         * @classdesc Represents a SystemMessage.
         * @implements ISystemMessage
         * @constructor
         * @param {SysMsg.ISystemMessage=} [properties] Properties to set
         */
        function SystemMessage(properties) {
            this.header = [];
            this.msgSpec = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessage header.
         * @member {Array.<SysMsg.ISystemMessageHeader>} header
         * @memberof SysMsg.SystemMessage
         * @instance
         */
        SystemMessage.prototype.header = $util.emptyArray;

        /**
         * SystemMessage msgSpec.
         * @member {Array.<SysMsg.ISystemMessageMsgSpec>} msgSpec
         * @memberof SysMsg.SystemMessage
         * @instance
         */
        SystemMessage.prototype.msgSpec = $util.emptyArray;

        /**
         * SystemMessage bodyWrapper.
         * @member {SysMsg.ISystemMessageBodyWrapper|null|undefined} bodyWrapper
         * @memberof SysMsg.SystemMessage
         * @instance
         */
        SystemMessage.prototype.bodyWrapper = null;

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @function create
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {SysMsg.ISystemMessage=} [properties] Properties to set
         * @returns {SysMsg.SystemMessage} SystemMessage instance
         */
        SystemMessage.create = function create(properties) {
            return new SystemMessage(properties);
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.SystemMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.header && message.header.length))
                            message.header = [];
                        message.header.push($root.SysMsg.SystemMessageHeader.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.msgSpec && message.msgSpec.length))
                            message.msgSpec = [];
                        message.msgSpec.push($root.SysMsg.SystemMessageMsgSpec.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.bodyWrapper = $root.SysMsg.SystemMessageBodyWrapper.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemMessage message.
         * @function verify
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                if (!Array.isArray(message.header))
                    return "header: array expected";
                for (let i = 0; i < message.header.length; ++i) {
                    let error = $root.SysMsg.SystemMessageHeader.verify(message.header[i]);
                    if (error)
                        return "header." + error;
                }
            }
            if (message.msgSpec != null && message.hasOwnProperty("msgSpec")) {
                if (!Array.isArray(message.msgSpec))
                    return "msgSpec: array expected";
                for (let i = 0; i < message.msgSpec.length; ++i) {
                    let error = $root.SysMsg.SystemMessageMsgSpec.verify(message.msgSpec[i]);
                    if (error)
                        return "msgSpec." + error;
                }
            }
            if (message.bodyWrapper != null && message.hasOwnProperty("bodyWrapper")) {
                let error = $root.SysMsg.SystemMessageBodyWrapper.verify(message.bodyWrapper);
                if (error)
                    return "bodyWrapper." + error;
            }
            return null;
        };

        /**
         * Gets the default type url for SystemMessage
         * @function getTypeUrl
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.SystemMessage";
        };

        return SystemMessage;
    })();

    SysMsg.SystemMessageHeader = (function() {

        /**
         * Properties of a SystemMessageHeader.
         * @memberof SysMsg
         * @interface ISystemMessageHeader
         * @property {number|null} [peerNumber] SystemMessageHeader peerNumber
         * @property {string|null} [peerString] SystemMessageHeader peerString
         * @property {number|null} [uin] SystemMessageHeader uin
         * @property {string|null} [uid] SystemMessageHeader uid
         */

        /**
         * Constructs a new SystemMessageHeader.
         * @memberof SysMsg
         * @classdesc Represents a SystemMessageHeader.
         * @implements ISystemMessageHeader
         * @constructor
         * @param {SysMsg.ISystemMessageHeader=} [properties] Properties to set
         */
        function SystemMessageHeader(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessageHeader peerNumber.
         * @member {number} peerNumber
         * @memberof SysMsg.SystemMessageHeader
         * @instance
         */
        SystemMessageHeader.prototype.peerNumber = 0;

        /**
         * SystemMessageHeader peerString.
         * @member {string} peerString
         * @memberof SysMsg.SystemMessageHeader
         * @instance
         */
        SystemMessageHeader.prototype.peerString = "";

        /**
         * SystemMessageHeader uin.
         * @member {number} uin
         * @memberof SysMsg.SystemMessageHeader
         * @instance
         */
        SystemMessageHeader.prototype.uin = 0;

        /**
         * SystemMessageHeader uid.
         * @member {string|null|undefined} uid
         * @memberof SysMsg.SystemMessageHeader
         * @instance
         */
        SystemMessageHeader.prototype.uid = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(SystemMessageHeader.prototype, "_uid", {
            get: $util.oneOfGetter($oneOfFields = ["uid"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new SystemMessageHeader instance using the specified properties.
         * @function create
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {SysMsg.ISystemMessageHeader=} [properties] Properties to set
         * @returns {SysMsg.SystemMessageHeader} SystemMessageHeader instance
         */
        SystemMessageHeader.create = function create(properties) {
            return new SystemMessageHeader(properties);
        };

        /**
         * Decodes a SystemMessageHeader message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.SystemMessageHeader} SystemMessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageHeader.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.SystemMessageHeader();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.peerNumber = reader.uint32();
                        break;
                    }
                case 2: {
                        message.peerString = reader.string();
                        break;
                    }
                case 5: {
                        message.uin = reader.uint32();
                        break;
                    }
                case 6: {
                        message.uid = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemMessageHeader message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.SystemMessageHeader} SystemMessageHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageHeader.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemMessageHeader message.
         * @function verify
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemMessageHeader.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.peerNumber != null && message.hasOwnProperty("peerNumber"))
                if (!$util.isInteger(message.peerNumber))
                    return "peerNumber: integer expected";
            if (message.peerString != null && message.hasOwnProperty("peerString"))
                if (!$util.isString(message.peerString))
                    return "peerString: string expected";
            if (message.uin != null && message.hasOwnProperty("uin"))
                if (!$util.isInteger(message.uin))
                    return "uin: integer expected";
            if (message.uid != null && message.hasOwnProperty("uid")) {
                properties._uid = 1;
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            }
            return null;
        };

        /**
         * Gets the default type url for SystemMessageHeader
         * @function getTypeUrl
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemMessageHeader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.SystemMessageHeader";
        };

        return SystemMessageHeader;
    })();

    SysMsg.SystemMessageMsgSpec = (function() {

        /**
         * Properties of a SystemMessageMsgSpec.
         * @memberof SysMsg
         * @interface ISystemMessageMsgSpec
         * @property {number|null} [msgType] SystemMessageMsgSpec msgType
         * @property {number|null} [subType] SystemMessageMsgSpec subType
         * @property {number|null} [subSubType] SystemMessageMsgSpec subSubType
         * @property {number|null} [msgSeq] SystemMessageMsgSpec msgSeq
         * @property {number|null} [time] SystemMessageMsgSpec time
         * @property {number|null} [other] SystemMessageMsgSpec other
         */

        /**
         * Constructs a new SystemMessageMsgSpec.
         * @memberof SysMsg
         * @classdesc Represents a SystemMessageMsgSpec.
         * @implements ISystemMessageMsgSpec
         * @constructor
         * @param {SysMsg.ISystemMessageMsgSpec=} [properties] Properties to set
         */
        function SystemMessageMsgSpec(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessageMsgSpec msgType.
         * @member {number} msgType
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.msgType = 0;

        /**
         * SystemMessageMsgSpec subType.
         * @member {number} subType
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.subType = 0;

        /**
         * SystemMessageMsgSpec subSubType.
         * @member {number} subSubType
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.subSubType = 0;

        /**
         * SystemMessageMsgSpec msgSeq.
         * @member {number} msgSeq
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.msgSeq = 0;

        /**
         * SystemMessageMsgSpec time.
         * @member {number} time
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.time = 0;

        /**
         * SystemMessageMsgSpec other.
         * @member {number} other
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         */
        SystemMessageMsgSpec.prototype.other = 0;

        /**
         * Creates a new SystemMessageMsgSpec instance using the specified properties.
         * @function create
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {SysMsg.ISystemMessageMsgSpec=} [properties] Properties to set
         * @returns {SysMsg.SystemMessageMsgSpec} SystemMessageMsgSpec instance
         */
        SystemMessageMsgSpec.create = function create(properties) {
            return new SystemMessageMsgSpec(properties);
        };

        /**
         * Decodes a SystemMessageMsgSpec message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.SystemMessageMsgSpec} SystemMessageMsgSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageMsgSpec.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.SystemMessageMsgSpec();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.msgType = reader.uint32();
                        break;
                    }
                case 2: {
                        message.subType = reader.uint32();
                        break;
                    }
                case 3: {
                        message.subSubType = reader.uint32();
                        break;
                    }
                case 5: {
                        message.msgSeq = reader.uint32();
                        break;
                    }
                case 6: {
                        message.time = reader.uint32();
                        break;
                    }
                case 13: {
                        message.other = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemMessageMsgSpec message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.SystemMessageMsgSpec} SystemMessageMsgSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageMsgSpec.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemMessageMsgSpec message.
         * @function verify
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemMessageMsgSpec.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msgType != null && message.hasOwnProperty("msgType"))
                if (!$util.isInteger(message.msgType))
                    return "msgType: integer expected";
            if (message.subType != null && message.hasOwnProperty("subType"))
                if (!$util.isInteger(message.subType))
                    return "subType: integer expected";
            if (message.subSubType != null && message.hasOwnProperty("subSubType"))
                if (!$util.isInteger(message.subSubType))
                    return "subSubType: integer expected";
            if (message.msgSeq != null && message.hasOwnProperty("msgSeq"))
                if (!$util.isInteger(message.msgSeq))
                    return "msgSeq: integer expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.other != null && message.hasOwnProperty("other"))
                if (!$util.isInteger(message.other))
                    return "other: integer expected";
            return null;
        };

        /**
         * Gets the default type url for SystemMessageMsgSpec
         * @function getTypeUrl
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemMessageMsgSpec.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.SystemMessageMsgSpec";
        };

        return SystemMessageMsgSpec;
    })();

    SysMsg.SystemMessageBodyWrapper = (function() {

        /**
         * Properties of a SystemMessageBodyWrapper.
         * @memberof SysMsg
         * @interface ISystemMessageBodyWrapper
         * @property {Uint8Array|null} [body] SystemMessageBodyWrapper body
         */

        /**
         * Constructs a new SystemMessageBodyWrapper.
         * @memberof SysMsg
         * @classdesc Represents a SystemMessageBodyWrapper.
         * @implements ISystemMessageBodyWrapper
         * @constructor
         * @param {SysMsg.ISystemMessageBodyWrapper=} [properties] Properties to set
         */
        function SystemMessageBodyWrapper(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessageBodyWrapper body.
         * @member {Uint8Array} body
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @instance
         */
        SystemMessageBodyWrapper.prototype.body = $util.newBuffer([]);

        /**
         * Creates a new SystemMessageBodyWrapper instance using the specified properties.
         * @function create
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {SysMsg.ISystemMessageBodyWrapper=} [properties] Properties to set
         * @returns {SysMsg.SystemMessageBodyWrapper} SystemMessageBodyWrapper instance
         */
        SystemMessageBodyWrapper.create = function create(properties) {
            return new SystemMessageBodyWrapper(properties);
        };

        /**
         * Decodes a SystemMessageBodyWrapper message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.SystemMessageBodyWrapper} SystemMessageBodyWrapper
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageBodyWrapper.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.SystemMessageBodyWrapper();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.body = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemMessageBodyWrapper message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.SystemMessageBodyWrapper} SystemMessageBodyWrapper
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessageBodyWrapper.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemMessageBodyWrapper message.
         * @function verify
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemMessageBodyWrapper.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.body != null && message.hasOwnProperty("body"))
                if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                    return "body: buffer expected";
            return null;
        };

        /**
         * Gets the default type url for SystemMessageBodyWrapper
         * @function getTypeUrl
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemMessageBodyWrapper.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.SystemMessageBodyWrapper";
        };

        return SystemMessageBodyWrapper;
    })();

    SysMsg.LikeDetail = (function() {

        /**
         * Properties of a LikeDetail.
         * @memberof SysMsg
         * @interface ILikeDetail
         * @property {string|null} [txt] LikeDetail txt
         * @property {number|null} [uin] LikeDetail uin
         * @property {string|null} [nickname] LikeDetail nickname
         */

        /**
         * Constructs a new LikeDetail.
         * @memberof SysMsg
         * @classdesc Represents a LikeDetail.
         * @implements ILikeDetail
         * @constructor
         * @param {SysMsg.ILikeDetail=} [properties] Properties to set
         */
        function LikeDetail(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LikeDetail txt.
         * @member {string} txt
         * @memberof SysMsg.LikeDetail
         * @instance
         */
        LikeDetail.prototype.txt = "";

        /**
         * LikeDetail uin.
         * @member {number} uin
         * @memberof SysMsg.LikeDetail
         * @instance
         */
        LikeDetail.prototype.uin = 0;

        /**
         * LikeDetail nickname.
         * @member {string} nickname
         * @memberof SysMsg.LikeDetail
         * @instance
         */
        LikeDetail.prototype.nickname = "";

        /**
         * Creates a new LikeDetail instance using the specified properties.
         * @function create
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {SysMsg.ILikeDetail=} [properties] Properties to set
         * @returns {SysMsg.LikeDetail} LikeDetail instance
         */
        LikeDetail.create = function create(properties) {
            return new LikeDetail(properties);
        };

        /**
         * Decodes a LikeDetail message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.LikeDetail} LikeDetail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LikeDetail.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.LikeDetail();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.txt = reader.string();
                        break;
                    }
                case 3: {
                        message.uin = reader.uint32();
                        break;
                    }
                case 5: {
                        message.nickname = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LikeDetail message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.LikeDetail} LikeDetail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LikeDetail.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LikeDetail message.
         * @function verify
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LikeDetail.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txt != null && message.hasOwnProperty("txt"))
                if (!$util.isString(message.txt))
                    return "txt: string expected";
            if (message.uin != null && message.hasOwnProperty("uin"))
                if (!$util.isInteger(message.uin))
                    return "uin: integer expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            return null;
        };

        /**
         * Gets the default type url for LikeDetail
         * @function getTypeUrl
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LikeDetail.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.LikeDetail";
        };

        return LikeDetail;
    })();

    SysMsg.LikeMsg = (function() {

        /**
         * Properties of a LikeMsg.
         * @memberof SysMsg
         * @interface ILikeMsg
         * @property {number|null} [count] LikeMsg count
         * @property {number|null} [time] LikeMsg time
         * @property {SysMsg.ILikeDetail|null} [detail] LikeMsg detail
         */

        /**
         * Constructs a new LikeMsg.
         * @memberof SysMsg
         * @classdesc Represents a LikeMsg.
         * @implements ILikeMsg
         * @constructor
         * @param {SysMsg.ILikeMsg=} [properties] Properties to set
         */
        function LikeMsg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LikeMsg count.
         * @member {number} count
         * @memberof SysMsg.LikeMsg
         * @instance
         */
        LikeMsg.prototype.count = 0;

        /**
         * LikeMsg time.
         * @member {number} time
         * @memberof SysMsg.LikeMsg
         * @instance
         */
        LikeMsg.prototype.time = 0;

        /**
         * LikeMsg detail.
         * @member {SysMsg.ILikeDetail|null|undefined} detail
         * @memberof SysMsg.LikeMsg
         * @instance
         */
        LikeMsg.prototype.detail = null;

        /**
         * Creates a new LikeMsg instance using the specified properties.
         * @function create
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {SysMsg.ILikeMsg=} [properties] Properties to set
         * @returns {SysMsg.LikeMsg} LikeMsg instance
         */
        LikeMsg.create = function create(properties) {
            return new LikeMsg(properties);
        };

        /**
         * Decodes a LikeMsg message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.LikeMsg} LikeMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LikeMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.LikeMsg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.count = reader.uint32();
                        break;
                    }
                case 2: {
                        message.time = reader.uint32();
                        break;
                    }
                case 3: {
                        message.detail = $root.SysMsg.LikeDetail.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LikeMsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.LikeMsg} LikeMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LikeMsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LikeMsg message.
         * @function verify
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LikeMsg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            if (message.time != null && message.hasOwnProperty("time"))
                if (!$util.isInteger(message.time))
                    return "time: integer expected";
            if (message.detail != null && message.hasOwnProperty("detail")) {
                let error = $root.SysMsg.LikeDetail.verify(message.detail);
                if (error)
                    return "detail." + error;
            }
            return null;
        };

        /**
         * Gets the default type url for LikeMsg
         * @function getTypeUrl
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LikeMsg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.LikeMsg";
        };

        return LikeMsg;
    })();

    SysMsg.ProfileLikeTip = (function() {

        /**
         * Properties of a ProfileLikeTip.
         * @memberof SysMsg
         * @interface IProfileLikeTip
         * @property {SysMsg.ILikeMsg|null} [msg] ProfileLikeTip msg
         */

        /**
         * Constructs a new ProfileLikeTip.
         * @memberof SysMsg
         * @classdesc Represents a ProfileLikeTip.
         * @implements IProfileLikeTip
         * @constructor
         * @param {SysMsg.IProfileLikeTip=} [properties] Properties to set
         */
        function ProfileLikeTip(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileLikeTip msg.
         * @member {SysMsg.ILikeMsg|null|undefined} msg
         * @memberof SysMsg.ProfileLikeTip
         * @instance
         */
        ProfileLikeTip.prototype.msg = null;

        /**
         * Creates a new ProfileLikeTip instance using the specified properties.
         * @function create
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {SysMsg.IProfileLikeTip=} [properties] Properties to set
         * @returns {SysMsg.ProfileLikeTip} ProfileLikeTip instance
         */
        ProfileLikeTip.create = function create(properties) {
            return new ProfileLikeTip(properties);
        };

        /**
         * Decodes a ProfileLikeTip message from the specified reader or buffer.
         * @function decode
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SysMsg.ProfileLikeTip} ProfileLikeTip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileLikeTip.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.SysMsg.ProfileLikeTip();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 14: {
                        message.msg = $root.SysMsg.LikeMsg.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileLikeTip message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SysMsg.ProfileLikeTip} ProfileLikeTip
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileLikeTip.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileLikeTip message.
         * @function verify
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileLikeTip.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg")) {
                let error = $root.SysMsg.LikeMsg.verify(message.msg);
                if (error)
                    return "msg." + error;
            }
            return null;
        };

        /**
         * Gets the default type url for ProfileLikeTip
         * @function getTypeUrl
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProfileLikeTip.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/SysMsg.ProfileLikeTip";
        };

        return ProfileLikeTip;
    })();

    return SysMsg;
})();

export { $root as default };
