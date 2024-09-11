/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

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
         * Encodes the specified SystemMessage message. Does not implicitly {@link SysMsg.SystemMessage.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {SysMsg.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && message.header.length)
                for (let i = 0; i < message.header.length; ++i)
                    $root.SysMsg.SystemMessageHeader.encode(message.header[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.msgSpec != null && message.msgSpec.length)
                for (let i = 0; i < message.msgSpec.length; ++i)
                    $root.SysMsg.SystemMessageMsgSpec.encode(message.msgSpec[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.bodyWrapper != null && Object.hasOwnProperty.call(message, "bodyWrapper"))
                $root.SysMsg.SystemMessageBodyWrapper.encode(message.bodyWrapper, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link SysMsg.SystemMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {SysMsg.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.SystemMessage} SystemMessage
         */
        SystemMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.SystemMessage)
                return object;
            let message = new $root.SysMsg.SystemMessage();
            if (object.header) {
                if (!Array.isArray(object.header))
                    throw TypeError(".SysMsg.SystemMessage.header: array expected");
                message.header = [];
                for (let i = 0; i < object.header.length; ++i) {
                    if (typeof object.header[i] !== "object")
                        throw TypeError(".SysMsg.SystemMessage.header: object expected");
                    message.header[i] = $root.SysMsg.SystemMessageHeader.fromObject(object.header[i]);
                }
            }
            if (object.msgSpec) {
                if (!Array.isArray(object.msgSpec))
                    throw TypeError(".SysMsg.SystemMessage.msgSpec: array expected");
                message.msgSpec = [];
                for (let i = 0; i < object.msgSpec.length; ++i) {
                    if (typeof object.msgSpec[i] !== "object")
                        throw TypeError(".SysMsg.SystemMessage.msgSpec: object expected");
                    message.msgSpec[i] = $root.SysMsg.SystemMessageMsgSpec.fromObject(object.msgSpec[i]);
                }
            }
            if (object.bodyWrapper != null) {
                if (typeof object.bodyWrapper !== "object")
                    throw TypeError(".SysMsg.SystemMessage.bodyWrapper: object expected");
                message.bodyWrapper = $root.SysMsg.SystemMessageBodyWrapper.fromObject(object.bodyWrapper);
            }
            return message;
        };

        /**
         * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.SystemMessage
         * @static
         * @param {SysMsg.SystemMessage} message SystemMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.header = [];
                object.msgSpec = [];
            }
            if (options.defaults)
                object.bodyWrapper = null;
            if (message.header && message.header.length) {
                object.header = [];
                for (let j = 0; j < message.header.length; ++j)
                    object.header[j] = $root.SysMsg.SystemMessageHeader.toObject(message.header[j], options);
            }
            if (message.msgSpec && message.msgSpec.length) {
                object.msgSpec = [];
                for (let j = 0; j < message.msgSpec.length; ++j)
                    object.msgSpec[j] = $root.SysMsg.SystemMessageMsgSpec.toObject(message.msgSpec[j], options);
            }
            if (message.bodyWrapper != null && message.hasOwnProperty("bodyWrapper"))
                object.bodyWrapper = $root.SysMsg.SystemMessageBodyWrapper.toObject(message.bodyWrapper, options);
            return object;
        };

        /**
         * Converts this SystemMessage to JSON.
         * @function toJSON
         * @memberof SysMsg.SystemMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified SystemMessageHeader message. Does not implicitly {@link SysMsg.SystemMessageHeader.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {SysMsg.ISystemMessageHeader} message SystemMessageHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageHeader.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.peerNumber != null && Object.hasOwnProperty.call(message, "peerNumber"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.peerNumber);
            if (message.peerString != null && Object.hasOwnProperty.call(message, "peerString"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.peerString);
            if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.uin);
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.uid);
            return writer;
        };

        /**
         * Encodes the specified SystemMessageHeader message, length delimited. Does not implicitly {@link SysMsg.SystemMessageHeader.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {SysMsg.ISystemMessageHeader} message SystemMessageHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageHeader.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a SystemMessageHeader message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.SystemMessageHeader} SystemMessageHeader
         */
        SystemMessageHeader.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.SystemMessageHeader)
                return object;
            let message = new $root.SysMsg.SystemMessageHeader();
            if (object.peerNumber != null)
                message.peerNumber = object.peerNumber >>> 0;
            if (object.peerString != null)
                message.peerString = String(object.peerString);
            if (object.uin != null)
                message.uin = object.uin >>> 0;
            if (object.uid != null)
                message.uid = String(object.uid);
            return message;
        };

        /**
         * Creates a plain object from a SystemMessageHeader message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.SystemMessageHeader
         * @static
         * @param {SysMsg.SystemMessageHeader} message SystemMessageHeader
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemMessageHeader.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.peerNumber = 0;
                object.peerString = "";
                object.uin = 0;
            }
            if (message.peerNumber != null && message.hasOwnProperty("peerNumber"))
                object.peerNumber = message.peerNumber;
            if (message.peerString != null && message.hasOwnProperty("peerString"))
                object.peerString = message.peerString;
            if (message.uin != null && message.hasOwnProperty("uin"))
                object.uin = message.uin;
            if (message.uid != null && message.hasOwnProperty("uid")) {
                object.uid = message.uid;
                if (options.oneofs)
                    object._uid = "uid";
            }
            return object;
        };

        /**
         * Converts this SystemMessageHeader to JSON.
         * @function toJSON
         * @memberof SysMsg.SystemMessageHeader
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessageHeader.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified SystemMessageMsgSpec message. Does not implicitly {@link SysMsg.SystemMessageMsgSpec.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {SysMsg.ISystemMessageMsgSpec} message SystemMessageMsgSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageMsgSpec.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msgType != null && Object.hasOwnProperty.call(message, "msgType"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.msgType);
            if (message.subType != null && Object.hasOwnProperty.call(message, "subType"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.subType);
            if (message.subSubType != null && Object.hasOwnProperty.call(message, "subSubType"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.subSubType);
            if (message.msgSeq != null && Object.hasOwnProperty.call(message, "msgSeq"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.msgSeq);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.time);
            if (message.other != null && Object.hasOwnProperty.call(message, "other"))
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.other);
            return writer;
        };

        /**
         * Encodes the specified SystemMessageMsgSpec message, length delimited. Does not implicitly {@link SysMsg.SystemMessageMsgSpec.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {SysMsg.ISystemMessageMsgSpec} message SystemMessageMsgSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageMsgSpec.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a SystemMessageMsgSpec message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.SystemMessageMsgSpec} SystemMessageMsgSpec
         */
        SystemMessageMsgSpec.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.SystemMessageMsgSpec)
                return object;
            let message = new $root.SysMsg.SystemMessageMsgSpec();
            if (object.msgType != null)
                message.msgType = object.msgType >>> 0;
            if (object.subType != null)
                message.subType = object.subType >>> 0;
            if (object.subSubType != null)
                message.subSubType = object.subSubType >>> 0;
            if (object.msgSeq != null)
                message.msgSeq = object.msgSeq >>> 0;
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.other != null)
                message.other = object.other >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a SystemMessageMsgSpec message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.SystemMessageMsgSpec
         * @static
         * @param {SysMsg.SystemMessageMsgSpec} message SystemMessageMsgSpec
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemMessageMsgSpec.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.msgType = 0;
                object.subType = 0;
                object.subSubType = 0;
                object.msgSeq = 0;
                object.time = 0;
                object.other = 0;
            }
            if (message.msgType != null && message.hasOwnProperty("msgType"))
                object.msgType = message.msgType;
            if (message.subType != null && message.hasOwnProperty("subType"))
                object.subType = message.subType;
            if (message.subSubType != null && message.hasOwnProperty("subSubType"))
                object.subSubType = message.subSubType;
            if (message.msgSeq != null && message.hasOwnProperty("msgSeq"))
                object.msgSeq = message.msgSeq;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.other != null && message.hasOwnProperty("other"))
                object.other = message.other;
            return object;
        };

        /**
         * Converts this SystemMessageMsgSpec to JSON.
         * @function toJSON
         * @memberof SysMsg.SystemMessageMsgSpec
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessageMsgSpec.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified SystemMessageBodyWrapper message. Does not implicitly {@link SysMsg.SystemMessageBodyWrapper.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {SysMsg.ISystemMessageBodyWrapper} message SystemMessageBodyWrapper message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageBodyWrapper.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.body);
            return writer;
        };

        /**
         * Encodes the specified SystemMessageBodyWrapper message, length delimited. Does not implicitly {@link SysMsg.SystemMessageBodyWrapper.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {SysMsg.ISystemMessageBodyWrapper} message SystemMessageBodyWrapper message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessageBodyWrapper.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a SystemMessageBodyWrapper message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.SystemMessageBodyWrapper} SystemMessageBodyWrapper
         */
        SystemMessageBodyWrapper.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.SystemMessageBodyWrapper)
                return object;
            let message = new $root.SysMsg.SystemMessageBodyWrapper();
            if (object.body != null)
                if (typeof object.body === "string")
                    $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
                else if (object.body.length >= 0)
                    message.body = object.body;
            return message;
        };

        /**
         * Creates a plain object from a SystemMessageBodyWrapper message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @static
         * @param {SysMsg.SystemMessageBodyWrapper} message SystemMessageBodyWrapper
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemMessageBodyWrapper.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.body = "";
                else {
                    object.body = [];
                    if (options.bytes !== Array)
                        object.body = $util.newBuffer(object.body);
                }
            if (message.body != null && message.hasOwnProperty("body"))
                object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
            return object;
        };

        /**
         * Converts this SystemMessageBodyWrapper to JSON.
         * @function toJSON
         * @memberof SysMsg.SystemMessageBodyWrapper
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessageBodyWrapper.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified LikeDetail message. Does not implicitly {@link SysMsg.LikeDetail.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {SysMsg.ILikeDetail} message LikeDetail message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LikeDetail.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txt != null && Object.hasOwnProperty.call(message, "txt"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txt);
            if (message.uin != null && Object.hasOwnProperty.call(message, "uin"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.uin);
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.nickname);
            return writer;
        };

        /**
         * Encodes the specified LikeDetail message, length delimited. Does not implicitly {@link SysMsg.LikeDetail.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {SysMsg.ILikeDetail} message LikeDetail message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LikeDetail.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a LikeDetail message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.LikeDetail} LikeDetail
         */
        LikeDetail.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.LikeDetail)
                return object;
            let message = new $root.SysMsg.LikeDetail();
            if (object.txt != null)
                message.txt = String(object.txt);
            if (object.uin != null)
                message.uin = object.uin >>> 0;
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            return message;
        };

        /**
         * Creates a plain object from a LikeDetail message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.LikeDetail
         * @static
         * @param {SysMsg.LikeDetail} message LikeDetail
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LikeDetail.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.txt = "";
                object.uin = 0;
                object.nickname = "";
            }
            if (message.txt != null && message.hasOwnProperty("txt"))
                object.txt = message.txt;
            if (message.uin != null && message.hasOwnProperty("uin"))
                object.uin = message.uin;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            return object;
        };

        /**
         * Converts this LikeDetail to JSON.
         * @function toJSON
         * @memberof SysMsg.LikeDetail
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LikeDetail.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified LikeMsg message. Does not implicitly {@link SysMsg.LikeMsg.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {SysMsg.ILikeMsg} message LikeMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LikeMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.count);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.time);
            if (message.detail != null && Object.hasOwnProperty.call(message, "detail"))
                $root.SysMsg.LikeDetail.encode(message.detail, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LikeMsg message, length delimited. Does not implicitly {@link SysMsg.LikeMsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {SysMsg.ILikeMsg} message LikeMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LikeMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a LikeMsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.LikeMsg} LikeMsg
         */
        LikeMsg.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.LikeMsg)
                return object;
            let message = new $root.SysMsg.LikeMsg();
            if (object.count != null)
                message.count = object.count >>> 0;
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.detail != null) {
                if (typeof object.detail !== "object")
                    throw TypeError(".SysMsg.LikeMsg.detail: object expected");
                message.detail = $root.SysMsg.LikeDetail.fromObject(object.detail);
            }
            return message;
        };

        /**
         * Creates a plain object from a LikeMsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.LikeMsg
         * @static
         * @param {SysMsg.LikeMsg} message LikeMsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LikeMsg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.count = 0;
                object.time = 0;
                object.detail = null;
            }
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.detail != null && message.hasOwnProperty("detail"))
                object.detail = $root.SysMsg.LikeDetail.toObject(message.detail, options);
            return object;
        };

        /**
         * Converts this LikeMsg to JSON.
         * @function toJSON
         * @memberof SysMsg.LikeMsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LikeMsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified ProfileLikeTip message. Does not implicitly {@link SysMsg.ProfileLikeTip.verify|verify} messages.
         * @function encode
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {SysMsg.IProfileLikeTip} message ProfileLikeTip message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileLikeTip.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                $root.SysMsg.LikeMsg.encode(message.msg, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProfileLikeTip message, length delimited. Does not implicitly {@link SysMsg.ProfileLikeTip.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {SysMsg.IProfileLikeTip} message ProfileLikeTip message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileLikeTip.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Creates a ProfileLikeTip message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SysMsg.ProfileLikeTip} ProfileLikeTip
         */
        ProfileLikeTip.fromObject = function fromObject(object) {
            if (object instanceof $root.SysMsg.ProfileLikeTip)
                return object;
            let message = new $root.SysMsg.ProfileLikeTip();
            if (object.msg != null) {
                if (typeof object.msg !== "object")
                    throw TypeError(".SysMsg.ProfileLikeTip.msg: object expected");
                message.msg = $root.SysMsg.LikeMsg.fromObject(object.msg);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProfileLikeTip message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SysMsg.ProfileLikeTip
         * @static
         * @param {SysMsg.ProfileLikeTip} message ProfileLikeTip
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileLikeTip.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.msg = null;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = $root.SysMsg.LikeMsg.toObject(message.msg, options);
            return object;
        };

        /**
         * Converts this ProfileLikeTip to JSON.
         * @function toJSON
         * @memberof SysMsg.ProfileLikeTip
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileLikeTip.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
