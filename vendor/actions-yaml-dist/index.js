/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 468:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyValuePair = exports.DictionaryContextData = exports.ArrayContextData = exports.StringContextData = exports.NumberContextData = exports.BooleanContextData = exports.ContextData = exports.CASE_SENSITIVE_DICTIONARY_TYPE = exports.NUMBER_TYPE = exports.BOOLEAN_TYPE = exports.DICTIONARY_TYPE = exports.ARRAY_TYPE = exports.STRING_TYPE = void 0;
const nodes_1 = __nccwpck_require__(1137);
exports.STRING_TYPE = 0;
exports.ARRAY_TYPE = 1;
exports.DICTIONARY_TYPE = 2;
exports.BOOLEAN_TYPE = 3;
exports.NUMBER_TYPE = 4;
exports.CASE_SENSITIVE_DICTIONARY_TYPE = 5;
////////////////////////////////////////////////////////////////////////////////
// Context data classes
////////////////////////////////////////////////////////////////////////////////
class ContextData {
    constructor(type) {
        this.t = type;
    }
    get type() {
        var _a;
        return (_a = this.t) !== null && _a !== void 0 ? _a : 0;
    }
    /**
     * Returns all context data object (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit dictionary keys
     */
    static *traverse(value, omitKeys) {
        yield value;
        switch (value === null || value === void 0 ? void 0 : value.type) {
            case exports.ARRAY_TYPE:
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                let state = new TraversalState(undefined, value);
                while (state) {
                    if (state.moveNext(omitKeys !== null && omitKeys !== void 0 ? omitKeys : false)) {
                        value = state.current;
                        yield value;
                        switch (value === null || value === void 0 ? void 0 : value.type) {
                            case exports.ARRAY_TYPE:
                            case exports.DICTIONARY_TYPE:
                            case exports.CASE_SENSITIVE_DICTIONARY_TYPE:
                                state = new TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
    /**
     * Converts to ContextData from serialized ContextData.
     */
    static fromContextDataJSON(string) {
        return ContextData.fromDeserializedContextData(JSON.parse(string));
    }
    /**
     * Converts to ContextData from serialized ContextData that has already been JSON-parsed into regular JavaScript objects.
     */
    static fromDeserializedContextData(object) {
        var _a, _b, _c, _d, _e, _f;
        switch (typeof object) {
            case "boolean":
                return new BooleanContextData(object);
            case "number":
                return new NumberContextData(object);
            case "string":
                return new StringContextData(object);
            case "object": {
                if (object === null) {
                    return null;
                }
                const type = Object.prototype.hasOwnProperty.call(object, "t")
                    ? object.t
                    : exports.STRING_TYPE;
                switch (type) {
                    case exports.BOOLEAN_TYPE:
                        return new BooleanContextData((_a = object.b) !== null && _a !== void 0 ? _a : false);
                    case exports.NUMBER_TYPE:
                        return new NumberContextData((_b = object.n) !== null && _b !== void 0 ? _b : 0);
                    case exports.STRING_TYPE:
                        return new StringContextData((_c = object.s) !== null && _c !== void 0 ? _c : "");
                    case exports.ARRAY_TYPE: {
                        const array = new ArrayContextData();
                        for (const item of (_d = object.a) !== null && _d !== void 0 ? _d : []) {
                            array.push(ContextData.fromDeserializedContextData(item));
                        }
                        return array;
                    }
                    case exports.DICTIONARY_TYPE:
                    case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                        const dictionary = new DictionaryContextData(type === exports.CASE_SENSITIVE_DICTIONARY_TYPE);
                        for (const pair of (_e = object.d) !== null && _e !== void 0 ? _e : []) {
                            const key = (_f = pair.k) !== null && _f !== void 0 ? _f : "";
                            const value = ContextData.fromDeserializedContextData(pair.v);
                            dictionary.set(key, value);
                        }
                        return dictionary;
                    }
                    default:
                        throw new Error(`Unexpected context type '${type}' when converting deserialized context data to context data`);
                }
            }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting deserialized context data to context data`);
        }
    }
    /**
     * Convert plain JSON objects into ContextData. Supports boolean, number, string, array, object, null
     */
    static fromJSON(string) {
        return ContextData.fromObject(JSON.parse(string));
    }
    /**
     * Convert plain JavaScript types into ContextData. Supports boolean, number, string, array, object, null, undefined.
     */
    static fromObject(object) {
        return ContextData.fromObjectInternal(object, 1, 100);
    }
    /**
     * Convert to plain JavaScript types: boolean, number, string, array, object, null.
     */
    static toObject(value) {
        switch (value === null || value === void 0 ? void 0 : value.type) {
            case null:
                return null;
            case exports.BOOLEAN_TYPE:
                return value.value;
            case exports.NUMBER_TYPE:
                return value.value;
            case exports.STRING_TYPE:
                return value.value;
            case exports.ARRAY_TYPE: {
                const array = value;
                const result = [];
                for (let i = 0; i < array.length; i++) {
                    result.push(ContextData.toObject(array.get(i)));
                }
                return result;
            }
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                const dictionary = value;
                const result = {};
                for (let i = 0; i < dictionary.keyCount; i++) {
                    const pair = dictionary.getPair(i);
                    result[pair.key] = ContextData.toObject(pair.value);
                }
                return result;
            }
            default:
                throw new Error(`Unexpected type '${value === null || value === void 0 ? void 0 : value.type}' when converting context data to object`);
        }
    }
    static fromObjectInternal(object, depth, maxDepth) {
        if (depth > 100) {
            throw new Error(`Reached max depth '${maxDepth}' when converting object to context data`);
        }
        switch (typeof object) {
            case "boolean":
                return new BooleanContextData(object);
            case "number":
                return new NumberContextData(object);
            case "string":
                return new StringContextData(object);
            case "undefined":
                return null;
            case "object":
                if (object === null) {
                    return null;
                }
                else if (Object.prototype.hasOwnProperty.call(object, "length")) {
                    const array = new ArrayContextData();
                    for (let i = 0; i < object.length; i++) {
                        array.push(ContextData.fromObjectInternal(object[i], depth + 1, maxDepth));
                    }
                    return array;
                }
                else {
                    const dictionary = new DictionaryContextData();
                    for (const key of Object.keys(object)) {
                        dictionary.set(key, ContextData.fromObjectInternal(object[key], depth + 1, maxDepth));
                    }
                    return dictionary;
                }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting object to context data`);
        }
    }
}
exports.ContextData = ContextData;
class BooleanContextData extends ContextData {
    constructor(boolean) {
        super(exports.BOOLEAN_TYPE);
        if (boolean !== false) {
            this.b = boolean;
        }
    }
    // Required for interface BooleanCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Boolean;
    }
    get value() {
        var _a;
        return (_a = this.b) !== null && _a !== void 0 ? _a : false;
    }
    clone() {
        return new BooleanContextData(this.value);
    }
    // Required for interface BooleanCompatible
    getBoolean() {
        return this.value;
    }
}
exports.BooleanContextData = BooleanContextData;
class NumberContextData extends ContextData {
    constructor(number) {
        super(exports.NUMBER_TYPE);
        if (number !== 0) {
            this.n = number;
        }
    }
    // Required for interface NumberCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Number;
    }
    get value() {
        var _a;
        return (_a = this.n) !== null && _a !== void 0 ? _a : 0;
    }
    clone() {
        return new NumberContextData(this.value);
    }
    // Required for interface NumberCompatible
    getNumber() {
        return this.value;
    }
}
exports.NumberContextData = NumberContextData;
class StringContextData extends ContextData {
    constructor(string) {
        super(exports.STRING_TYPE);
        if (string !== "") {
            this.s = string;
        }
    }
    // Required for interface StringCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.String;
    }
    get value() {
        var _a;
        return (_a = this.s) !== null && _a !== void 0 ? _a : "";
    }
    clone() {
        return new StringContextData(this.value);
    }
    // Required for interface StringCompatible
    getString() {
        return this.value;
    }
}
exports.StringContextData = StringContextData;
class ArrayContextData extends ContextData {
    constructor() {
        super(exports.ARRAY_TYPE);
        this.a = [];
    }
    // Required for interface ReadOnlyArrayCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Array;
    }
    get length() {
        return this.a.length;
    }
    push(item) {
        this.a.push(item);
    }
    get(index) {
        var _a;
        return (_a = this.a[index]) !== null && _a !== void 0 ? _a : null;
    }
    clone() {
        const result = new ArrayContextData();
        for (let i = 0; i < this.length; i++) {
            result.push(this.get(i));
        }
        return result;
    }
    // Required for interface ReadOnlyArrayCompatible
    getArrayLength() {
        return this.length;
    }
    // Required for interface ReadOnlyArrayCompatible
    getArrayItem(index) {
        return this.get(index);
    }
}
exports.ArrayContextData = ArrayContextData;
class DictionaryContextData extends ContextData {
    constructor(caseSensitive) {
        super(caseSensitive ? exports.CASE_SENSITIVE_DICTIONARY_TYPE : exports.DICTIONARY_TYPE);
        this.d = [];
        this._getHiddenProperty = (propertyName, createDefaultValue) => {
            const func = this._getHiddenProperty;
            if (!Object.prototype.hasOwnProperty.call(func, propertyName)) {
                func[propertyName] = createDefaultValue();
            }
            return func[propertyName];
        };
    }
    get _indexLookup() {
        // Prevent index lookup from being serialized
        return this._getHiddenProperty("indexLookup", () => {
            return {};
        });
    }
    get keyCount() {
        return this.d.length;
    }
    // Required for interface ReadOnlyObjectCompatible
    get compatibleValueKind() {
        return nodes_1.ValueKind.Object;
    }
    get(key) {
        const lookupKey = this.getLookupKey(key);
        if (Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey)) {
            const index = this._indexLookup[lookupKey];
            return this.d[index].value;
        }
        return null;
    }
    getPair(index) {
        return this.d[index];
    }
    set(key, value) {
        const lookupKey = this.getLookupKey(key);
        if (Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey)) {
            const index = this._indexLookup[lookupKey];
            const existingPair = this.d[index];
            this.d[index] = new KeyValuePair(existingPair.key, value);
        }
        else {
            this.d.push(new KeyValuePair(key, value));
            this._indexLookup[lookupKey] = this.d.length - 1;
        }
    }
    // Required for interface ReadOnlyObjectCompatible
    hasObjectKey(key) {
        const lookupKey = this.getLookupKey(key);
        return Object.prototype.hasOwnProperty.call(this._indexLookup, lookupKey);
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectKeys() {
        const result = [];
        for (const pair of this.d) {
            result.push(pair.key);
        }
        return result;
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectKeyCount() {
        return this.d.length;
    }
    // Required for interface ReadOnlyObjectCompatible
    getObjectValue(key) {
        return this.get(key);
    }
    clone() {
        const result = new DictionaryContextData();
        for (const pair of this.d) {
            result.set(pair.key, pair.value);
        }
        return result;
    }
    /**
     * Translates to upper if case-insensitive
     */
    getLookupKey(key) {
        return this.type === exports.DICTIONARY_TYPE ? key.toUpperCase() : key;
    }
}
exports.DictionaryContextData = DictionaryContextData;
class KeyValuePair {
    constructor(key, value) {
        this.k = key;
        this.v = value;
    }
    get key() {
        return this.k;
    }
    get value() {
        return this.v;
    }
}
exports.KeyValuePair = KeyValuePair;
class TraversalState {
    constructor(parent, data) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._data = data;
    }
    moveNext(omitKeys) {
        switch (this._data.type) {
            case exports.ARRAY_TYPE: {
                const array = this._data;
                if (++this.index < array.length) {
                    this.current = array.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case exports.DICTIONARY_TYPE:
            case exports.CASE_SENSITIVE_DICTIONARY_TYPE: {
                const object = this._data;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.current = object.getPair(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < object.keyCount) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.current = object.getPair(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.current = new StringContextData(object.getPair(this.index).key);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected context data type '${this._data.type}' when traversing state`);
        }
    }
}
//# sourceMappingURL=context-data.js.map

/***/ }),

/***/ 1295:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OR = exports.AND = exports.EQUAL = exports.LESS_THAN_OR_EQUAL = exports.LESS_THAN = exports.GREATER_THAN_OR_EQUAL = exports.GREATER_THAN = exports.NOT_EQUAL = exports.NOT = exports.WILDCARD = exports.DEREFERENCE = exports.SEPARATOR = exports.END_PARAMETER = exports.END_INDEX = exports.END_GROUP = exports.START_PARAMETER = exports.START_INDEX = exports.START_GROUP = exports.TRUE = exports.NULL = exports.NEGATIVE_INFINITY = exports.NAN = exports.MAX_LENGTH = exports.MAX_DEPTH = exports.INFINITY = exports.FALSE = void 0;
exports.FALSE = "false";
exports.INFINITY = "Infinity";
exports.MAX_DEPTH = 50;
exports.MAX_LENGTH = 21000; // Under 85,000 large object heap threshold, even if .NET switches to UTF-32
exports.NAN = "NaN";
exports.NEGATIVE_INFINITY = "-Infinity";
exports.NULL = "null";
exports.TRUE = "true";
// Punctuation
exports.START_GROUP = "("; // logical grouping
exports.START_INDEX = "[";
exports.START_PARAMETER = "("; // function call
exports.END_GROUP = ")"; // logical grouping
exports.END_INDEX = "]";
exports.END_PARAMETER = ")"; // function calll
exports.SEPARATOR = ",";
exports.DEREFERENCE = ".";
exports.WILDCARD = "*";
// Operators
exports.NOT = "!";
exports.NOT_EQUAL = "!=";
exports.GREATER_THAN = ">";
exports.GREATER_THAN_OR_EQUAL = ">=";
exports.LESS_THAN = "<";
exports.LESS_THAN_OR_EQUAL = "<=";
exports.EQUAL = "==";
exports.AND = "&&";
exports.OR = "||";
//# sourceMappingURL=expression-constants.js.map

/***/ }),

/***/ 8548:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.indent = exports.stringEscape = exports.parseNumber = exports.testPrimitive = exports.testLegalKeyword = exports.formatValue = void 0;
const expression_constants_1 = __nccwpck_require__(1295);
const nodes_1 = __nccwpck_require__(1137);
function formatValue(value, kind) {
    switch (kind) {
        case nodes_1.ValueKind.Null:
            return expression_constants_1.NULL;
        case nodes_1.ValueKind.Boolean:
            return value ? expression_constants_1.TRUE : expression_constants_1.FALSE;
        case nodes_1.ValueKind.Number:
            return `${value}`;
        case nodes_1.ValueKind.String: {
            const strValue = value;
            return `'${stringEscape(strValue)}'`;
        }
        case nodes_1.ValueKind.Array:
            return "Array";
        case nodes_1.ValueKind.Object:
            return "Object";
        default:
            // Should never reach here
            throw new Error(`Unable to convert to format value. Unexpected value kind '${kind}'`);
    }
}
exports.formatValue = formatValue;
function testLegalKeyword(str) {
    if (!str) {
        return false;
    }
    const first = str[0];
    if ((first >= "a" && first <= "z") ||
        (first >= "A" && first <= "Z") ||
        first == "_") {
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if ((c >= "a" && c <= "z") ||
                (c >= "A" && c <= "Z") ||
                (c >= "0" && c <= "9") ||
                c == "_" ||
                c == "-") {
                // Intentionally empty
            }
            else {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
exports.testLegalKeyword = testLegalKeyword;
function testPrimitive(kind) {
    switch (kind) {
        case nodes_1.ValueKind.Null:
        case nodes_1.ValueKind.Boolean:
        case nodes_1.ValueKind.Number:
        case nodes_1.ValueKind.String:
            return true;
        default:
            return false;
    }
}
exports.testPrimitive = testPrimitive;
function parseNumber(str) {
    return Number(str);
}
exports.parseNumber = parseNumber;
function stringEscape(value) {
    return value.replace(/'/g, "''");
}
exports.stringEscape = stringEscape;
function indent(level, str) {
    const result = [];
    for (let i = 0; i < level; i++) {
        result.push(str);
    }
    return result.join("");
}
exports.indent = indent;
//# sourceMappingURL=expression-utility.js.map

/***/ }),

/***/ 8293:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Contains = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Contains extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().indexOf(rightString.toUpperCase()) >= 0;
            }
        }
        else {
            const collection = left.getCollectionInterface();
            if ((collection === null || collection === void 0 ? void 0 : collection.compatibleValueKind) === nodes_1.ValueKind.Array) {
                const array = collection;
                const length = array.getArrayLength();
                if (length > 0) {
                    const right = this.parameters[1].evaluate(context);
                    for (let i = 0; i < length; i++) {
                        const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(i)));
                        if (right.abstractEqual(itemResult)) {
                            found = true;
                            break;
                        }
                    }
                }
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.Contains = Contains;
//# sourceMappingURL=contains.js.map

/***/ }),

/***/ 3047:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndsWith = void 0;
const nodes_1 = __nccwpck_require__(1137);
class EndsWith extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().endsWith(rightString.toUpperCase());
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.EndsWith = EndsWith;
//# sourceMappingURL=ends-with.js.map

/***/ }),

/***/ 5529:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Format = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Format extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const format = this.parameters[0].evaluate(context).convertToString();
        let index = 0;
        const result = new FormatResultBuilder(this, context, this.createMemoryCounter(context));
        while (index < format.length) {
            const lbrace = format.indexOf("{", index);
            let rbrace = format.indexOf("}", index);
            // Left brace
            if (lbrace >= 0 && (rbrace < 0 || rbrace > lbrace)) {
                // Escaped left brace
                if (Format.safeCharAt(format, lbrace + 1) === "{") {
                    result.appendString(format.substr(index, lbrace - index + 1));
                    index = lbrace + 2;
                    continue;
                }
                // Left brace, number, optional format specifiers, right brace
                if (rbrace > lbrace + 1) {
                    const argIndex = Format.readArgIndex(format, lbrace + 1);
                    if (argIndex.success) {
                        const formatSpecifiers = Format.readFormatSpecifiers(format, argIndex.endIndex + 1);
                        if (formatSpecifiers.success) {
                            rbrace = formatSpecifiers.rbrace;
                            // Check parameter count
                            if (argIndex.result > this.parameters.length - 2) {
                                throw new Error(`The following format string references more arguments than were supplied: ${format}`);
                            }
                            // Append the portion before the left brace
                            if (lbrace > index) {
                                result.appendString(format.substr(index, lbrace - index));
                            }
                            // Append the arg
                            result.appendArgument(argIndex.result, formatSpecifiers.result);
                            index = rbrace + 1;
                            continue;
                        }
                    }
                }
                throw new Error(`The following format string is invalid: ${format}`);
            }
            // Right brace
            else if (rbrace >= 0) {
                // Escaped right brace
                if (Format.safeCharAt(format, rbrace + 1) === "}") {
                    result.appendString(format.substr(index, rbrace - index + 1));
                    index = rbrace + 2;
                }
                else {
                    throw new Error(`The following format string is invalid: ${format}`);
                }
            }
            // Last segment
            else {
                result.appendString(format.substr(index));
                break;
            }
        }
        return {
            value: result.build(),
            memory: undefined,
        };
    }
    static format(memoryCounter, format, args) {
        const result = [];
        let index = 0;
        while (index < format.length) {
            const lbrace = format.indexOf("{", index);
            let rbrace = format.indexOf("}", index);
            // Left brace
            if (lbrace >= 0 && (rbrace < 0 || rbrace > lbrace)) {
                // Escaped left brace
                if (Format.safeCharAt(format, lbrace + 1) === "{") {
                    result.push(format.substr(index, lbrace - index + 1));
                    memoryCounter.addString(result[result.length - 1]);
                    index = lbrace + 2;
                    continue;
                }
                // Left brace, number, optional format specifiers, right brace
                if (rbrace > lbrace + 1) {
                    const argIndex = Format.readArgIndex(format, lbrace + 1);
                    if (argIndex.success) {
                        const formatSpecifiers = Format.readFormatSpecifiers(format, argIndex.endIndex + 1);
                        if (formatSpecifiers.success) {
                            if (formatSpecifiers.result) {
                                throw new Error("Format specifies not currently supported");
                            }
                            rbrace = formatSpecifiers.rbrace;
                            // Check parameter count
                            if (argIndex.result > args.length - 1) {
                                throw new Error(`The following format string references more arguments than were supplied: ${format}`);
                            }
                            // Append the portion before the left brace
                            if (lbrace > index) {
                                result.push(format.substr(index, lbrace - index));
                                memoryCounter.addString(result[result.length - 1]);
                            }
                            // Append the arg
                            result.push(`${args[argIndex.result]}`);
                            memoryCounter.addString(result[result.length - 1]);
                            index = rbrace + 1;
                            continue;
                        }
                    }
                }
                throw new Error(`The following format string is invalid: ${format}`);
            }
            // Right brace
            else if (rbrace >= 0) {
                // Escaped right brace
                if (Format.safeCharAt(format, rbrace + 1) === "}") {
                    result.push(format.substr(index, rbrace - index + 1));
                    memoryCounter.addString(result[result.length - 1]);
                    index = rbrace + 2;
                }
                else {
                    throw new Error(`The following format string is invalid: ${format}`);
                }
            }
            // Last segment
            else {
                result.push(format.substr(index));
                memoryCounter.addString(result[result.length - 1]);
                break;
            }
        }
        return result.join("");
    }
    static readArgIndex(string, startIndex) {
        // Count the number of digits
        let length = 0;
        while (true) {
            const nextChar = Format.safeCharAt(string, startIndex + length);
            if (nextChar >= "0" && nextChar <= "9") {
                length++;
            }
            else {
                break;
            }
        }
        // Validate at least one digit
        if (length < 1) {
            return {
                success: false,
            };
        }
        // Parse the number
        const endIndex = startIndex + length - 1;
        const result = parseInt(string.substr(startIndex, length));
        return {
            success: !isNaN(result),
            result: result,
            endIndex: endIndex,
        };
    }
    static readFormatSpecifiers(string, startIndex) {
        // No format specifiers
        let c = Format.safeCharAt(string, startIndex);
        if (c === "}") {
            return {
                success: true,
                result: "",
                rbrace: startIndex,
            };
        }
        // Validate starts with ":"
        if (c !== ":") {
            return {
                success: false,
                result: "",
                rbrace: 0,
            };
        }
        // Read the specifiers
        const specifiers = [];
        let index = (startIndex = 1);
        while (true) {
            // Validate not the end of the string
            if (index >= string.length) {
                return {
                    success: false,
                    result: "",
                    rbrace: 0,
                };
            }
            c = string[index];
            // Not right-brace
            if (c !== "}") {
                specifiers.push(c);
                index++;
            }
            // Escaped right-brace
            else if (Format.safeCharAt(string, index + 1) === "}") {
                specifiers.push("}");
                index += 2;
            }
            // Closing right-brace
            else {
                return {
                    success: true,
                    result: specifiers.join(""),
                    rbrace: index,
                };
            }
        }
    }
    static safeCharAt(string, index) {
        if (string.length > index) {
            return string[index];
        }
        return "\0";
    }
}
exports.Format = Format;
class FormatResultBuilder {
    constructor(node, context, counter) {
        this._cache = [];
        this._segments = [];
        this._node = node;
        this._context = context;
        this._counter = counter;
        while (this._cache.length < node.parameters.length - 1) {
            this._cache.push(undefined);
        }
    }
    build() {
        // Build the final string. This is when lazy segments are evaluated.
        return this._segments
            .map((x) => {
            var _a;
            return ((_a = x) === null || _a === void 0 ? void 0 : _a.isLazyString) === true
                ? x.value
                : x;
        })
            .join("");
    }
    // Append a static value
    appendString(value) {
        if (value.length > 0) {
            // Track memory
            this._counter.addString(value);
            // Append the segment
            this._segments.push(value);
        }
    }
    // Append an argument
    appendArgument(argIndex, formatSpecifiers) {
        // Delay execution until the .build() is called
        this._segments.push(new LazyString(() => {
            let result;
            // Get the arg from the cache
            let argValue = this._cache[argIndex];
            // Evaluate the arg and cache the result
            if (argValue === undefined) {
                // The evaluation result is required when format specifiers are used. Otherwise the string
                // result is required. Go ahead and store both values. Since convertToString() produces tracing,
                // we need to run that now so the tracing appears in order in the log.
                const evaluationResult = this._node.parameters[argIndex + 1].evaluate(this._context);
                const stringResult = evaluationResult.convertToString();
                argValue = {
                    evaluationResult,
                    stringResult,
                };
                this._cache[argIndex] = argValue;
            }
            // No format specifiers
            if (!formatSpecifiers) {
                result = argValue.stringResult;
            }
            // Invalid
            else {
                throw new Error(`The format specifiers '${formatSpecifiers}' are not valid for objects of type '${argValue.evaluationResult.kind}'`);
            }
            // Track memory
            if (result) {
                this._counter.addString(result);
            }
            return result;
        }));
    }
}
class LazyString {
    constructor(getValue) {
        this.isLazyString = true;
        this._getValue = getValue;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._getValue();
        }
        return this._value;
    }
}
//# sourceMappingURL=format.js.map

/***/ }),

/***/ 104:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FromJson = void 0;
const context_data_1 = __nccwpck_require__(468);
const nodes_1 = __nccwpck_require__(1137);
class FromJson extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const json = this.parameters[0].evaluate(context).convertToString();
        const contextData = context_data_1.ContextData.fromJSON(json);
        const memory = this.createMemoryCounter(context);
        memory.addContextData(contextData, true);
        return {
            value: contextData,
            memory: new nodes_1.ResultMemory(memory.currentBytes, true),
        };
    }
}
exports.FromJson = FromJson;
//# sourceMappingURL=from-json.js.map

/***/ }),

/***/ 7736:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Join = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Join extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return true;
    }
    evaluateCore(context) {
        const items = this.parameters[0].evaluate(context);
        const collection = items.getCollectionInterface();
        // Array
        if ((collection === null || collection === void 0 ? void 0 : collection.compatibleValueKind) === nodes_1.ValueKind.Array) {
            const array = collection;
            const length = array.getArrayLength();
            let result = [];
            if (length > 0) {
                const memory = this.createMemoryCounter(context);
                // Append the first item
                const item = array.getArrayItem(0);
                const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(item));
                const itemString = itemResult.convertToString();
                memory.addString(itemString);
                result.push(itemString);
                // More items?
                if (length > 1) {
                    let separator = ",";
                    if (this.parameters.length > 1) {
                        const separatorResult = this.parameters[1].evaluate(context);
                        if (separatorResult.isPrimitive) {
                            separator = separatorResult.convertToString();
                        }
                    }
                    for (let i = 0; i < length; i++) {
                        // Append the separator
                        memory.addString(separator);
                        result.push(separator);
                        // Append the next item
                        const nextItem = array.getArrayItem(i);
                        const nextItemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(nextItem));
                        const nextItemString = nextItemResult.convertToString();
                        memory.addString(nextItemString);
                        result.push(nextItemString);
                    }
                }
            }
            return {
                value: result,
                memory: undefined,
            };
        }
        // Primitive
        else if (items.isPrimitive) {
            return {
                value: items.convertToString(),
                memory: undefined,
            };
        }
        // Otherwise return empty string
        else {
            return {
                value: "",
                memory: undefined,
            };
        }
    }
}
exports.Join = Join;
//# sourceMappingURL=join.js.map

/***/ }),

/***/ 7186:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartsWith = void 0;
const nodes_1 = __nccwpck_require__(1137);
class StartsWith extends nodes_1.FunctionNode {
    get traceFullyRealized() {
        return false;
    }
    evaluateCore(context) {
        let found = false;
        const left = this.parameters[0].evaluate(context);
        if (left.isPrimitive) {
            const leftString = left.convertToString();
            const right = this.parameters[1].evaluate(context);
            if (right.isPrimitive) {
                const rightString = right.convertToString();
                found = leftString.toUpperCase().startsWith(rightString.toUpperCase());
            }
        }
        return {
            value: found,
            memory: undefined,
        };
    }
}
exports.StartsWith = StartsWith;
//# sourceMappingURL=starts-with.js.map

/***/ }),

/***/ 3988:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToJson = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8548));
const nodes_1 = __nccwpck_require__(1137);
class ToJson extends nodes_1.FunctionNode {
    evaluateCore(context) {
        const json = [];
        const memory = this.createMemoryCounter(context);
        let current = this.parameters[0].evaluate(context);
        const ancestors = [];
        do {
            // Descend as much as possible
            while (true) {
                // Collection
                const collection = current.getCollectionInterface();
                if (collection) {
                    // Array
                    if (collection.compatibleValueKind === nodes_1.ValueKind.Array) {
                        const array = collection;
                        if (array.getArrayLength() > 0) {
                            // Write array start
                            ToJson.writeArrayStart(json, memory, ancestors);
                            // Move to first item
                            const enumerator = new ArrayEnumerator(context, current);
                            enumerator.moveNext();
                            ancestors.push(enumerator);
                            current = enumerator.current;
                        }
                        else {
                            // Write empty array
                            ToJson.writeEmptyArray(json, memory, ancestors);
                            break;
                        }
                    }
                    // Object
                    else if (collection.compatibleValueKind === nodes_1.ValueKind.Object) {
                        const object = collection;
                        if (object.getObjectKeyCount() > 0) {
                            // Write object start
                            ToJson.writeObjectStart(json, memory, ancestors);
                            // Move to first pair
                            const enumerator = new ObjectEnumerator(context, current);
                            enumerator.moveNext();
                            ancestors.push(enumerator);
                            // Write key
                            ToJson.writeObjectKey(json, memory, enumerator.current.key, ancestors);
                            // Move to value
                            current = enumerator.current.value;
                        }
                        else {
                            // Write empty object
                            ToJson.writeEmptyObject(json, memory, ancestors);
                            break;
                        }
                    }
                    else {
                        throw new Error(`Unexpected collection kind '${collection.compatibleValueKind}'`);
                    }
                }
                // Primitive
                else {
                    // Write value
                    ToJson.writeValue(json, memory, current, ancestors);
                    break;
                }
            }
            // Next sibling or ancestor sibling
            do {
                if (ancestors.length > 0) {
                    const parent = ancestors[ancestors.length - 1];
                    // Parent array
                    if (parent.kind === nodes_1.ValueKind.Array) {
                        const arrayEnumerator = parent;
                        // Move to next item
                        if (arrayEnumerator.moveNext()) {
                            current = arrayEnumerator.current;
                            break;
                        }
                        // Move to parent
                        else {
                            ancestors.pop();
                            current = arrayEnumerator.array;
                            // Write array end
                            ToJson.writeArrayEnd(json, memory, ancestors);
                        }
                    }
                    // Parent object
                    else if (parent.kind === nodes_1.ValueKind.Object) {
                        const objectEnumerator = parent;
                        // Move to next pair
                        if (objectEnumerator.moveNext()) {
                            // Write key
                            ToJson.writeObjectKey(json, memory, objectEnumerator.current.key, ancestors);
                            // Move to value
                            current = objectEnumerator.current.value;
                            break;
                        }
                        // Move to parent
                        else {
                            ancestors.pop();
                            current = objectEnumerator.object;
                            // Write object end
                            ToJson.writeObjectEnd(json, memory, ancestors);
                        }
                    }
                    else {
                        throw new Error(`Unexpected parent collection kind '${parent.kind}'`);
                    }
                }
                else {
                    current = undefined;
                }
            } while (current);
        } while (current);
        return {
            value: json.join(""),
            memory: undefined,
        };
    }
    static writeArrayStart(json, memory, ancestors) {
        const string = ToJson.prefixValue("[", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeObjectStart(json, memory, ancestors) {
        const string = ToJson.prefixValue("{", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeArrayEnd(json, memory, ancestors) {
        const string = `\n${expressionUtility.indent(ancestors.length, "  ")}]`;
        memory.addString(string);
        json.push(string);
    }
    static writeObjectEnd(json, memory, ancestors) {
        const string = `\n${expressionUtility.indent(ancestors.length, "  ")}}`;
        memory.addString(string);
        json.push(string);
    }
    static writeEmptyArray(json, memory, ancestors) {
        const string = ToJson.prefixValue("[]", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeEmptyObject(json, memory, ancestors) {
        const string = ToJson.prefixValue("{}", ancestors);
        memory.addString(string);
        json.push(string);
    }
    static writeObjectKey(json, memory, key, ancestors) {
        const string = ToJson.prefixValue(JSON.stringify(key.convertToString()), ancestors, true);
        memory.addString(string);
        json.push(string);
    }
    static writeValue(json, memory, value, ancestors) {
        let string;
        switch (value.kind) {
            case nodes_1.ValueKind.Null:
                string = "null";
                break;
            case nodes_1.ValueKind.Boolean:
                string = value.value ? "true" : "false";
                break;
            case nodes_1.ValueKind.Number:
                string = value.convertToString();
                break;
            case nodes_1.ValueKind.String:
                string = JSON.stringify(value.value);
                break;
            default:
                string = "{}"; // The value is an object we don't know how to traverse
                break;
        }
        string = ToJson.prefixValue(string, ancestors);
        memory.addString(string);
        json.push(string);
    }
    static prefixValue(value, ancestors, isObjectKey = false) {
        const level = ancestors.length;
        const parent = level > 0 ? ancestors[ancestors.length - 1] : undefined;
        if (!isObjectKey && (parent === null || parent === void 0 ? void 0 : parent.kind) === nodes_1.ValueKind.Object) {
            return `: ${value}`;
        }
        else if (level > 0) {
            return `${parent.isFirst ? "" : ","}\n${expressionUtility.indent(level, "  ")}${value}`;
        }
        else {
            return value;
        }
    }
}
exports.ToJson = ToJson;
class ArrayEnumerator {
    constructor(context, array) {
        this._index = -1;
        this._context = context;
        this.array = array;
    }
    get kind() {
        return nodes_1.ValueKind.Array;
    }
    get isFirst() {
        return this._index === 0;
    }
    moveNext() {
        const array = this.array.value;
        if (this._index + 1 < array.getArrayLength()) {
            this._index++;
            this.current = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(this._index)));
            return true;
        }
        else {
            this.current = undefined;
            return false;
        }
    }
}
class ObjectEnumerator {
    constructor(context, object) {
        this._index = -1;
        this._context = context;
        this.object = object;
        this._keys = object.value.getObjectKeys();
    }
    get kind() {
        return nodes_1.ValueKind.Object;
    }
    get isFirst() {
        return this._index === 0;
    }
    moveNext() {
        if (this._index + 1 < this._keys.length) {
            this._index++;
            const object = this.object.value;
            const keyString = this._keys[this._index];
            const key = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(keyString));
            const value = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(object.getObjectValue(keyString)));
            this.current = {
                key,
                value,
            };
            return true;
        }
        else {
            this.current = undefined;
            return false;
        }
    }
}
//# sourceMappingURL=to-json.js.map

/***/ }),

/***/ 731:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LexicalAnalyzer = exports.Token = exports.TokenKind = exports.Associativity = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8548));
const expression_constants_1 = __nccwpck_require__(1295);
const nodes_1 = __nccwpck_require__(1137);
const or_1 = __nccwpck_require__(8704);
const and_1 = __nccwpck_require__(8341);
const equal_1 = __nccwpck_require__(2481);
const less_than_or_equal_1 = __nccwpck_require__(7233);
const less_than_1 = __nccwpck_require__(4239);
const greater_than_or_equal_1 = __nccwpck_require__(7622);
const greater_than_1 = __nccwpck_require__(7158);
const not_equal_1 = __nccwpck_require__(6839);
const not_1 = __nccwpck_require__(2979);
const operators_1 = __nccwpck_require__(9687);
var Associativity;
(function (Associativity) {
    Associativity[Associativity["None"] = 0] = "None";
    Associativity[Associativity["LeftToRight"] = 1] = "LeftToRight";
    Associativity[Associativity["RightToLeft"] = 2] = "RightToLeft";
})(Associativity = exports.Associativity || (exports.Associativity = {}));
var TokenKind;
(function (TokenKind) {
    // Punctuation
    TokenKind[TokenKind["StartGroup"] = 0] = "StartGroup";
    TokenKind[TokenKind["StartIndex"] = 1] = "StartIndex";
    TokenKind[TokenKind["StartParameters"] = 2] = "StartParameters";
    TokenKind[TokenKind["EndGroup"] = 3] = "EndGroup";
    TokenKind[TokenKind["EndIndex"] = 4] = "EndIndex";
    TokenKind[TokenKind["EndParameters"] = 5] = "EndParameters";
    TokenKind[TokenKind["Separator"] = 6] = "Separator";
    TokenKind[TokenKind["Dereference"] = 7] = "Dereference";
    TokenKind[TokenKind["Wildcard"] = 8] = "Wildcard";
    TokenKind[TokenKind["LogicalOperator"] = 9] = "LogicalOperator";
    // Values
    TokenKind[TokenKind["Null"] = 10] = "Null";
    TokenKind[TokenKind["Boolean"] = 11] = "Boolean";
    TokenKind[TokenKind["Number"] = 12] = "Number";
    TokenKind[TokenKind["String"] = 13] = "String";
    TokenKind[TokenKind["PropertyName"] = 14] = "PropertyName";
    TokenKind[TokenKind["Function"] = 15] = "Function";
    TokenKind[TokenKind["NamedContext"] = 16] = "NamedContext";
    TokenKind[TokenKind["Unexpected"] = 17] = "Unexpected";
})(TokenKind = exports.TokenKind || (exports.TokenKind = {}));
class Token {
    constructor(kind, rawValue, index, parsedValue) {
        this.kind = kind;
        this.rawValue = rawValue;
        this.index = index;
        this.parsedValue = parsedValue;
    }
    get associativity() {
        switch (this.kind) {
            case TokenKind.StartGroup:
                return Associativity.None;
            case TokenKind.LogicalOperator:
                if (this.rawValue === expression_constants_1.NOT) {
                    return Associativity.RightToLeft;
                }
                break;
        }
        return this.isOperator ? Associativity.LeftToRight : Associativity.None;
    }
    get isOperator() {
        switch (this.kind) {
            case TokenKind.StartGroup: // "(" logical grouping
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
            case TokenKind.EndGroup: // ")" logical grouping
            case TokenKind.EndIndex: // "]"
            case TokenKind.EndParameters: // ")" function call
            case TokenKind.Separator: // ","
            case TokenKind.Dereference: // "."
            case TokenKind.LogicalOperator: // "!", "==", etc
                return true;
            default:
                return false;
        }
    }
    /**
     * Operator precedence. The value is only meaningful for operator tokens.
     */
    get precedence() {
        switch (this.kind) {
            case TokenKind.StartGroup: // "(" logical grouping
                return 20;
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
            case TokenKind.Dereference: // "."
                return 19;
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return 16;
                    case expression_constants_1.GREATER_THAN: // ">"
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                    case expression_constants_1.LESS_THAN: // "<"
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                        return 11;
                    case expression_constants_1.EQUAL: // "=="
                    case expression_constants_1.NOT_EQUAL: // "!="
                        return 10;
                    case expression_constants_1.AND: // "&&"
                        return 6;
                    case expression_constants_1.OR: // "||"
                        return 5;
                }
                break;
            case TokenKind.EndGroup: // ")" logical grouping
            case TokenKind.EndIndex: // "]"
            case TokenKind.EndParameters: // ")" function call
            case TokenKind.Separator: // ","
                return 1;
        }
        return 0;
    }
    /**
     * Expected number of operands. The value is only meaningful for standalone unary operators and binary operators.
     */
    get operandCount() {
        switch (this.kind) {
            case TokenKind.StartIndex: // "["
            case TokenKind.Dereference: // "."
                return 2;
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return 1;
                    case expression_constants_1.GREATER_THAN: // ">"
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                    case expression_constants_1.LESS_THAN: // "<"
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                    case expression_constants_1.EQUAL: // "=="
                    case expression_constants_1.NOT_EQUAL: // "!="
                    case expression_constants_1.AND: // "&&"
                    case expression_constants_1.OR: // "|"
                        return 2;
                }
                break;
        }
        return 0;
    }
    toNode() {
        switch (this.kind) {
            case TokenKind.StartIndex: // "["
            case TokenKind.Dereference: // "."
                return new operators_1.Index();
            case TokenKind.LogicalOperator:
                switch (this.rawValue) {
                    case expression_constants_1.NOT: // "!"
                        return new not_1.Not();
                    case expression_constants_1.NOT_EQUAL: // "!="
                        return new not_equal_1.NotEqual();
                    case expression_constants_1.GREATER_THAN: // ">"
                        return new greater_than_1.GreaterThan();
                    case expression_constants_1.GREATER_THAN_OR_EQUAL: // ">="
                        return new greater_than_or_equal_1.GreaterThanOrEqual();
                    case expression_constants_1.LESS_THAN: // "<"
                        return new less_than_1.LessThan();
                    case expression_constants_1.LESS_THAN_OR_EQUAL: // "<="
                        return new less_than_or_equal_1.LessThanOrEqual();
                    case expression_constants_1.EQUAL: // "=="
                        return new equal_1.Equal();
                    case expression_constants_1.AND: // "&&"
                        return new and_1.And();
                    case expression_constants_1.OR: // "||"
                        return new or_1.Or();
                    default:
                        throw new Error(`Unexpected logical operator '${this.rawValue}' when creating node`);
                }
            case TokenKind.Null:
            case TokenKind.Boolean:
            case TokenKind.Number:
            case TokenKind.String:
                return new nodes_1.LiteralNode(this.parsedValue);
            case TokenKind.PropertyName:
                return new nodes_1.LiteralNode(this.rawValue);
            case TokenKind.Wildcard: // "*"
                return new nodes_1.WildcardNode();
        }
        throw new Error(`Unexpected kind '${this.kind}' when creating node`);
    }
}
exports.Token = Token;
class LexicalAnalyzer {
    constructor(expression) {
        /** Unclosed start token */
        this._unclosedTokens = [];
        /** Index within raw expression string */
        this._index = 0;
        this._expression = expression;
    }
    get _lastUnclosedToken() {
        if (this._unclosedTokens.length == 0) {
            return undefined;
        }
        return this._unclosedTokens[this._unclosedTokens.length - 1];
    }
    get hasUnclosedTokens() {
        return this._unclosedTokens.length > 0;
    }
    getNextToken() {
        var _a, _b;
        // Skip whitespace
        while (this._index < this._expression.length &&
            /\s/.test(this._expression[this._index])) {
            this._index++;
        }
        // End of string
        if (this._index >= this._expression.length) {
            return undefined;
        }
        let token;
        // Read the first character to determine the type of token
        const c = this._expression[this._index];
        switch (c) {
            case expression_constants_1.START_GROUP: // "("
                // Function call
                if (((_a = this._lastToken) === null || _a === void 0 ? void 0 : _a.kind) === TokenKind.Function) {
                    token = this.createToken(TokenKind.StartParameters, c, this._index++);
                }
                // Logical grouping
                else {
                    token = this.createToken(TokenKind.StartGroup, c, this._index++);
                }
                break;
            case expression_constants_1.START_INDEX: // "["
                token = this.createToken(TokenKind.StartIndex, c, this._index++);
                break;
            case expression_constants_1.END_GROUP: // ")"
                // Function call
                if (((_b = this._lastUnclosedToken) === null || _b === void 0 ? void 0 : _b.kind) === TokenKind.StartParameters) {
                    // "(" function call
                    token = this.createToken(TokenKind.EndParameters, c, this._index++);
                }
                // Logical grouping
                else {
                    token = this.createToken(TokenKind.EndGroup, c, this._index++);
                }
                break;
            case expression_constants_1.END_INDEX: // "]"
                token = this.createToken(TokenKind.EndIndex, c, this._index++);
                break;
            case expression_constants_1.SEPARATOR: // ","
                token = this.createToken(TokenKind.Separator, c, this._index++);
                break;
            case expression_constants_1.WILDCARD: // "*"
                token = this.createToken(TokenKind.Wildcard, c, this._index++);
                break;
            case "'":
                token = this.readStringToken();
                break;
            case "!": // "!" and "!="
            case ">": // ">" and ">="
            case "<": // "<" and "<="
            case "=": // "=="
            case "&": // "&&"
            case "|": // "||"
                token = this.readOperator();
                break;
            default:
                if (c == ".") {
                    // Number
                    if (this._lastToken == null ||
                        this._lastToken.kind == TokenKind.Separator || // ","
                        this._lastToken.kind == TokenKind.StartGroup || // "(" logical grouping
                        this._lastToken.kind == TokenKind.StartIndex || // "["
                        this._lastToken.kind == TokenKind.StartParameters || // "(" function call
                        this._lastToken.kind == TokenKind.LogicalOperator) {
                        // "!", "==", etc
                        token = this.readNumberToken();
                    }
                    // "."
                    else {
                        token = this.createToken(TokenKind.Dereference, c, this._index++);
                    }
                }
                else if (c == "-" || c == "+" || (c >= "0" && c <= "9")) {
                    token = this.readNumberToken();
                }
                else {
                    token = this.readKeywordToken();
                }
                break;
        }
        this._lastToken = token;
        return token;
    }
    readNumberToken() {
        const startIndex = this._index;
        do {
            this._index++;
        } while (this._index < this._expression.length &&
            (!LexicalAnalyzer.testTokenBoundary(this._expression[this._index]) ||
                this._expression[this._index] === "."));
        const length = this._index - startIndex;
        const str = this._expression.substr(startIndex, length);
        const n = expressionUtility.parseNumber(str);
        if (isNaN(n)) {
            return this.createToken(TokenKind.Unexpected, str, startIndex);
        }
        return this.createToken(TokenKind.Number, str, startIndex, n);
    }
    readKeywordToken() {
        var _a;
        // Read to the end of the keyword
        const startIndex = this._index;
        this._index++; // Skip the first char. It is already known to be the start of the keyword
        while (this._index < this._expression.length &&
            !LexicalAnalyzer.testTokenBoundary(this._expression[this._index])) {
            this._index++;
        }
        // Test if valid keyword character sequence
        const length = this._index - startIndex;
        const str = this._expression.substr(startIndex, length);
        if (expressionUtility.testLegalKeyword(str)) {
            // Test if follows property dereference operator
            if (((_a = this._lastToken) === null || _a === void 0 ? void 0 : _a.kind) === TokenKind.Dereference) {
                return this.createToken(TokenKind.PropertyName, str, startIndex);
            }
            switch (str) {
                // Null
                case expression_constants_1.NULL:
                    return this.createToken(TokenKind.Null, str, startIndex);
                // Boolean
                case expression_constants_1.TRUE:
                    return this.createToken(TokenKind.Boolean, str, startIndex, true);
                case expression_constants_1.FALSE:
                    return this.createToken(TokenKind.Boolean, str, startIndex, false);
                // NaN
                case expression_constants_1.NAN:
                    return this.createToken(TokenKind.Number, str, startIndex, NaN);
                // Infinity
                case expression_constants_1.INFINITY:
                    return this.createToken(TokenKind.Number, str, startIndex, Infinity);
            }
            // Lookahead
            let tempIndex = this._index;
            while (tempIndex < this._expression.length &&
                /\s/.test(this._expression[tempIndex])) {
                tempIndex++;
            }
            // Function
            if (tempIndex < this._expression.length &&
                this._expression[tempIndex] == expression_constants_1.START_GROUP) {
                // "("
                return this.createToken(TokenKind.Function, str, startIndex);
            }
            // Named-context
            else {
                return this.createToken(TokenKind.NamedContext, str, startIndex);
            }
        }
        // Invalid keyword
        else {
            return this.createToken(TokenKind.Unexpected, str, startIndex);
        }
    }
    readStringToken() {
        const startIndex = this._index;
        let c;
        let closed = false;
        let str = "";
        this._index++; // Skip the leading single-quote
        while (this._index < this._expression.length) {
            c = this._expression[this._index++];
            if (c === "'") {
                // End of string
                if (this._index >= this._expression.length ||
                    this._expression[this._index] != "'") {
                    closed = true;
                    break;
                }
                // Escaped single quote
                this._index++;
            }
            str += c;
        }
        const length = this._index - startIndex;
        const rawValue = this._expression.substr(startIndex, length);
        if (closed) {
            return this.createToken(TokenKind.String, rawValue, startIndex, str);
        }
        return this.createToken(TokenKind.Unexpected, rawValue, startIndex);
    }
    readOperator() {
        const startIndex = this._index;
        let raw;
        this._index++;
        // Check for a two-character operator
        if (this._index < this._expression.length) {
            this._index++;
            raw = this._expression.substr(startIndex, 2);
            switch (raw) {
                case expression_constants_1.NOT_EQUAL:
                case expression_constants_1.GREATER_THAN_OR_EQUAL:
                case expression_constants_1.LESS_THAN_OR_EQUAL:
                case expression_constants_1.EQUAL:
                case expression_constants_1.AND:
                case expression_constants_1.OR:
                    return this.createToken(TokenKind.LogicalOperator, raw, startIndex);
            }
            // Backup
            this._index--;
        }
        // Check for one-character operator
        raw = this._expression.substr(startIndex, 1);
        switch (raw) {
            case expression_constants_1.NOT:
            case expression_constants_1.GREATER_THAN:
            case expression_constants_1.LESS_THAN:
                return this.createToken(TokenKind.LogicalOperator, raw, startIndex);
        }
        // Unexpected
        while (this._index < this._expression.length &&
            !LexicalAnalyzer.testTokenBoundary(this._expression[this._index])) {
            this._index++;
        }
        const length = this._index - startIndex;
        raw = this._expression.substr(startIndex, length);
        return this.createToken(TokenKind.Unexpected, raw, startIndex);
    }
    createToken(kind, rawValue, index, parsedValue) {
        var _a, _b, _c, _d;
        // Check whether the current token is legal based on the last token
        let legal = false;
        switch (kind) {
            case TokenKind.StartGroup: // "(" logical grouping
                // Is first or follows "," or "(" or "[" or a logical operator
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.StartIndex, TokenKind.LogicalOperator);
                break;
            case TokenKind.StartIndex: // "["
                // Follows ")", "]", "*", a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.StartParameters: // "(" function call
                // Follows a function
                legal = this.checkLastToken(TokenKind.Function);
                break;
            case TokenKind.EndGroup: // ")" logical grouping
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.EndIndex: // "]"
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.EndParameters: // ")" function call
                // Follows "(" function call, ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.StartParameters, TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Separator: // ","
                // Follows ")", "]", "*", a literal, a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Dereference: // "."
                // Follows ")", "]", "*", a property name, or a named-context
                legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.PropertyName, TokenKind.NamedContext);
                break;
            case TokenKind.Wildcard: // "*"
                // Follows "[" or "."
                legal = this.checkLastToken(TokenKind.StartIndex, TokenKind.Dereference);
                break;
            case TokenKind.LogicalOperator: // "!", "==", etc
                switch (rawValue) {
                    case expression_constants_1.NOT:
                        // Is first or follows "," or "(" or "[" or a logical operator
                        legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.StartIndex, TokenKind.LogicalOperator);
                        break;
                    default:
                        // Follows ")", "]", "*", a literal, a property name, or a named-context
                        legal = this.checkLastToken(TokenKind.EndGroup, TokenKind.EndParameters, TokenKind.EndIndex, TokenKind.Wildcard, TokenKind.Null, TokenKind.Boolean, TokenKind.Number, TokenKind.String, TokenKind.PropertyName, TokenKind.NamedContext);
                        break;
                }
                break;
            case TokenKind.Null:
            case TokenKind.Boolean:
            case TokenKind.Number:
            case TokenKind.String:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
            case TokenKind.PropertyName:
                // Follows "."
                legal = this.checkLastToken(TokenKind.Dereference);
                break;
            case TokenKind.Function:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
            case TokenKind.NamedContext:
                // Is first or follows "," or "[" or "(" or a logical operator (e.g. "!" or "==" etc)
                legal = this.checkLastToken(undefined, TokenKind.Separator, TokenKind.StartIndex, TokenKind.StartGroup, TokenKind.StartParameters, TokenKind.LogicalOperator);
                break;
        }
        // Illegal
        if (!legal) {
            return new Token(TokenKind.Unexpected, rawValue, index);
        }
        // Legal so far
        const token = new Token(kind, rawValue, index, parsedValue);
        switch (kind) {
            case TokenKind.StartGroup: // "(" logical grouping
            case TokenKind.StartIndex: // "["
            case TokenKind.StartParameters: // "(" function call
                // Track start token
                this._unclosedTokens.push(token);
                break;
            case TokenKind.EndGroup: // ")" logical grouping
                // Check inside logical grouping
                if (((_a = this._lastUnclosedToken) === null || _a === void 0 ? void 0 : _a.kind) !== TokenKind.StartGroup) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.EndIndex: // "]"
                // Check inside indexer
                if (((_b = this._lastUnclosedToken) === null || _b === void 0 ? void 0 : _b.kind) != TokenKind.StartIndex) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.EndParameters: // ")" function call
                // Check inside function call
                if (((_c = this._lastUnclosedToken) === null || _c === void 0 ? void 0 : _c.kind) !== TokenKind.StartParameters) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                // Pop start token
                this._unclosedTokens.pop();
                break;
            case TokenKind.Separator: // ","
                // Check inside function call
                if (((_d = this._lastUnclosedToken) === null || _d === void 0 ? void 0 : _d.kind) !== TokenKind.StartParameters) {
                    return new Token(TokenKind.Unexpected, rawValue, index);
                }
                break;
        }
        return token;
    }
    checkLastToken(...allowed) {
        var _a;
        const lastKind = (_a = this._lastToken) === null || _a === void 0 ? void 0 : _a.kind;
        return allowed.some((x) => x === lastKind);
    }
    static testTokenBoundary(c) {
        switch (c) {
            case expression_constants_1.START_GROUP: // "("
            case expression_constants_1.START_INDEX: // "["
            case expression_constants_1.END_GROUP: // ")"
            case expression_constants_1.END_INDEX: // "]"
            case expression_constants_1.SEPARATOR: // ","
            case expression_constants_1.DEREFERENCE: // "."
            case "!": // "!" and "!="
            case ">": // ">" and ">="
            case "<": // "<" and "<="
            case "=": // "=="
            case "&": // "&&"
            case "|": // "||"
                return true;
            default:
                return /\s/.test(c);
        }
    }
}
exports.LexicalAnalyzer = LexicalAnalyzer;
//# sourceMappingURL=lexical-analyzer.js.map

/***/ }),

/***/ 1137:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResultMemory = exports.MemoryCounter = exports.CanonicalValue = exports.ValueKind = exports.EvaluationContext = exports.EvaluationResult = exports.EvaluationOptions = exports.FunctionNode = exports.ContainerNode = exports.SimpleNamedContextNode = exports.NamedContextNode = exports.WildcardNode = exports.LiteralNode = exports.AbstractExpressionNode = exports.NodeType = void 0;
const trace_writer_1 = __nccwpck_require__(5617);
const expressionUtility = __importStar(__nccwpck_require__(8548));
const expression_constants_1 = __nccwpck_require__(1295);
const context_data_1 = __nccwpck_require__(468);
////////////////////////////////////////////////////////////////////////////////
// Expression node classes
////////////////////////////////////////////////////////////////////////////////
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Literal"] = 0] = "Literal";
    NodeType[NodeType["Wildcard"] = 1] = "Wildcard";
    NodeType[NodeType["Container"] = 2] = "Container";
    NodeType[NodeType["NamedContext"] = 3] = "NamedContext";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class AbstractExpressionNode {
    constructor() {
        /** Used for tracing. Indicates the nest-level */
        this._level = 0;
        /** Used for tracing. Indicates the name of a non-literal node */
        this.name = "";
    }
    /**
     * Entry point when evaluating an expression tree
     */
    evaluateTree(trace, state, options) {
        // SDK consumer error
        if (this.parent) {
            throw new Error(`Expected IExpressionNode.Evaluate to be called on a root node only`);
        }
        // Evaluate
        trace = trace !== null && trace !== void 0 ? trace : new trace_writer_1.NoOperationTraceWriter();
        const context = new EvaluationContext(trace, state, options, this);
        trace.info(`Evaluating: ${this.convertToExpression()}`);
        const result = this.evaluate(context);
        // Trace the result
        this.traceTreeResult(context, result.value, result.kind);
        return result;
    }
    /**
     * This function is intended only for ExpressionNode authors to call when evaluating a child node.
     * The EvaluationContext caches result-state specific to the evaluation of the entire expression tree.
     * */
    evaluate(context) {
        var _a;
        // Evaluate
        this._level = !this.parent ? 0 : this.parent._level + 1;
        context.trace.verbose(`${expressionUtility.indent(this._level, "..")}Evaluating ${this.name}`);
        const coreResult = this.evaluateCore(context);
        if (!coreResult.memory) {
            coreResult.memory = new ResultMemory();
        }
        // Convert to canonical value
        const canonicalResult = new CanonicalValue(coreResult.value);
        // The depth can be safely trimmed when the total size of the core result is known,
        // or when the total size of the core result can easily be determined.
        const trimDepth = coreResult.memory.isTotal ||
            (!canonicalResult.raw &&
                expressionUtility.testPrimitive(canonicalResult.kind));
        // Account for the memory overhead of the core result
        let coreBytes;
        if (typeof coreResult.memory.bytes === "number") {
            coreBytes = coreResult.memory.bytes;
        }
        else {
            const objectToCalculate = (_a = canonicalResult.raw) !== null && _a !== void 0 ? _a : canonicalResult.value;
            coreBytes =
                typeof objectToCalculate === "string"
                    ? MemoryCounter.calculateStringBytes(objectToCalculate)
                    : MemoryCounter.MIN_OBJECT_SIZE; // Add something
        }
        context.memory.addAmount(this._level, coreBytes, trimDepth);
        // Account for the memory overhead of the conversion result
        if (canonicalResult.raw) {
            const conversionBytes = typeof canonicalResult.value === "string"
                ? MemoryCounter.calculateStringBytes(canonicalResult.value)
                : MemoryCounter.MIN_OBJECT_SIZE;
            context.memory.addAmount(this._level, conversionBytes);
        }
        const result = new EvaluationResult(canonicalResult, this._level);
        const message = `${expressionUtility.indent(this._level, "..")}=> ${expressionUtility.formatValue(canonicalResult.value, canonicalResult.kind)}`;
        context.trace.verbose(message);
        // Store the trace result
        if (this.traceFullyRealized) {
            context.setTraceResult(this, result);
        }
        return result;
    }
    createMemoryCounter(context) {
        return new MemoryCounter(this, context.options.maxMemory);
    }
    traceTreeResult(context, result, kind) {
        // Get the realized expression
        const realizedExpression = this.convertToRealizedExpression(context);
        // Format the result
        const traceValue = expressionUtility.formatValue(result, kind);
        // Only trace the realized expression when meaningfully different
        if (realizedExpression !== traceValue) {
            if (kind === ValueKind.Number &&
                realizedExpression === `'${traceValue}'`) {
                // Intentionally empty. Don't bother tracing the realized expression when the result is a
                // number and the realized expression is a precisely matching string.
            }
            else {
                context.trace.info(`Expanded: ${realizedExpression}`);
            }
        }
        // Always trace the result
        context.trace.info(`Result: ${traceValue}`);
    }
}
exports.AbstractExpressionNode = AbstractExpressionNode;
class LiteralNode extends AbstractExpressionNode {
    constructor(val) {
        super();
        const canonicalValue = new CanonicalValue(val);
        this.name = ValueKind[canonicalValue.kind];
        this.value = canonicalValue.value;
        this.kind = canonicalValue.kind;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return expressionUtility.formatValue(this.value, this.kind);
    }
    convertToRealizedExpression(context) {
        return expressionUtility.formatValue(this.value, this.kind);
    }
    get nodeType() {
        return NodeType.Literal;
    }
    /** Evalutes the node */
    evaluateCore(context) {
        return {
            value: this.value,
            memory: undefined,
        };
    }
}
exports.LiteralNode = LiteralNode;
class WildcardNode extends AbstractExpressionNode {
    // Prevent the value from being stored on the evaluation context.
    // This avoids unneccessarily duplicating the value in memory.
    get traceFullyRealized() {
        return false;
    }
    get nodeType() {
        return NodeType.Wildcard;
    }
    convertToExpression() {
        return expression_constants_1.WILDCARD;
    }
    convertToRealizedExpression(context) {
        return expression_constants_1.WILDCARD;
    }
    evaluateCore(context) {
        return {
            value: expression_constants_1.WILDCARD,
            memory: undefined,
        };
    }
}
exports.WildcardNode = WildcardNode;
class NamedContextNode extends AbstractExpressionNode {
    get traceFullyRealized() {
        return true;
    }
    get nodeType() {
        return NodeType.NamedContext;
    }
    convertToExpression() {
        return this.name;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return this.name;
    }
}
exports.NamedContextNode = NamedContextNode;
class SimpleNamedContextNode extends NamedContextNode {
    constructor(value) {
        super();
        this._value = value;
    }
    evaluateCore(context) {
        return {
            value: this._value,
            memory: undefined,
        };
    }
}
exports.SimpleNamedContextNode = SimpleNamedContextNode;
class ContainerNode extends AbstractExpressionNode {
    constructor() {
        super(...arguments);
        this._parameters = [];
    }
    get nodeType() {
        return NodeType.Container;
    }
    get parameters() {
        return this._parameters;
    }
    addParameter(node) {
        this._parameters.push(node);
        node.parent = this;
    }
}
exports.ContainerNode = ContainerNode;
class FunctionNode extends ContainerNode {
    /**
     * Generally this should not be overridden. True indicates the result of the node is traced as part of the "expanded"
     * (i.e. "realized") trace information. Otherwise the node expression is printed, and parameters to the node may or
     * may not be fully realized - depending on each respective parameter's trace-fully-realized setting.
     *
     * The purpose is so the end user can understand how their expression expanded at run time. For example, consider
     * the expression: eq(variables.publish, 'true'). The runtime-expanded expression may be: eq('true', 'true')
     */
    get traceFullyRealized() {
        return true;
    }
    /** Do not override. Used internally for tracing only. */
    convertToExpression() {
        return `${this.name}(${this.parameters
            .map((x) => x.convertToExpression())
            .join(", ")})`;
    }
    /** Do not override. Used internally for tracing only. */
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `${this.name}(${this.parameters.map((x) => x.convertToRealizedExpression(context))})`;
    }
}
exports.FunctionNode = FunctionNode;
////////////////////////////////////////////////////////////////////////////////
// Evaluation classes
////////////////////////////////////////////////////////////////////////////////
class EvaluationOptions {
    constructor(copy) {
        if (copy) {
            this.maxMemory = copy.maxMemory;
        }
        else {
            this.maxMemory = 0;
        }
    }
}
exports.EvaluationOptions = EvaluationOptions;
/**
 * Contains the result of the evaluation of a node. The value is canonicalized.
 * This class contains helper methods for comparison, coercion, etc.
 */
class EvaluationResult {
    constructor(value, level) {
        this._level = level !== null && level !== void 0 ? level : 0;
        this.value = value.value;
        this.kind = value.kind;
        this.raw = value.raw;
    }
    get isFalsy() {
        switch (this.kind) {
            case ValueKind.Null:
                return true;
            case ValueKind.Boolean: {
                const b = this.value;
                return b;
            }
            case ValueKind.Number: {
                const n = this.value;
                return n == 0 || isNaN(n);
            }
            case ValueKind.String: {
                const s = this.value;
                return s === "";
            }
            default:
                return false;
        }
    }
    get isTruthy() {
        return !this.isFalsy;
    }
    get isPrimitive() {
        return expressionUtility.testPrimitive(this.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractEqual(right) {
        return EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractGreaterThan(right) {
        return EvaluationResult.abstractGreaterThan(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractGreaterThanOrEqual(right) {
        return (EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind) ||
            EvaluationResult.abstractGreaterThan(this.value, right.value, this.kind, right.kind));
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractLessThan(right) {
        return EvaluationResult.abstractLessThan(this.value, right.value, this.kind, right.kind);
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractLessThanOrEqual(right) {
        return (EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind) ||
            EvaluationResult.abstractLessThan(this.value, right.value, this.kind, right.kind));
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    abstractNotEqual(right) {
        return !EvaluationResult.abstractEqual(this.value, right.value, this.kind, right.kind);
    }
    convertToNumber() {
        return EvaluationResult.convertToNumber(this.value, this.kind);
    }
    convertToString() {
        switch (this.kind) {
            case ValueKind.Null:
                return "";
            case ValueKind.Boolean:
                return this.value ? expression_constants_1.TRUE : expression_constants_1.FALSE;
            case ValueKind.Number:
                // The value -0 should convert to '0'
                if (Object.is(this.value, -0)) {
                    return "0";
                }
                return this.value.toString();
            case ValueKind.String:
                return this.value;
            default:
                return ValueKind[this.kind];
        }
    }
    getCollectionInterface() {
        var _a;
        if (this.kind === ValueKind.Object || this.kind === ValueKind.Array) {
            switch ((_a = this.value[COMPATIBLE_VALUE_KIND]) !== null && _a !== void 0 ? _a : -1) {
                case ValueKind.Array:
                    return this.value;
                case ValueKind.Object:
                    return this.value;
            }
        }
        return;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractEqual(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Null
                case ValueKind.Null:
                    return true;
                // Number
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue === canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() ==
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return canonicalLeftValue === canonicalRightValue;
                // Object
                // Array
                case ValueKind.Object:
                case ValueKind.Array:
                    return canonicalLeftValue === canonicalRightValue; // Same reference?
            }
        }
        return false;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractGreaterThan(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Nummber
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue > canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() >
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return canonicalLeftValue && !canonicalRightValue;
            }
        }
        return false;
    }
    /**
     * Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
     * Except string comparison is ignore-case, and objects are not coerced to primitives.
     */
    static abstractLessThan(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        const coercionResult = EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        canonicalLeftValue = coercionResult.canonicalLeftValue;
        canonicalRightValue = coercionResult.canonicalRightValue;
        leftKind = coercionResult.leftKind;
        rightKind = coercionResult.rightKind;
        // Same kind
        if (leftKind === rightKind) {
            switch (leftKind) {
                // Nummber
                case ValueKind.Number:
                    if (isNaN(canonicalLeftValue) || isNaN(canonicalRightValue)) {
                        return false;
                    }
                    return canonicalLeftValue < canonicalRightValue;
                // String
                case ValueKind.String:
                    return (canonicalLeftValue.toUpperCase() <
                        canonicalRightValue.toUpperCase());
                // Boolean
                case ValueKind.Boolean:
                    return !canonicalLeftValue && canonicalRightValue;
            }
        }
        return false;
    }
    static coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind) {
        // Same kind
        if (leftKind === rightKind) {
            // Intentionally empty
        }
        // Number, String
        else if (leftKind === ValueKind.Number && rightKind === ValueKind.String) {
            canonicalRightValue = EvaluationResult.convertToNumber(canonicalRightValue, rightKind);
            rightKind = ValueKind.Number;
        }
        // String, Number
        else if (leftKind === ValueKind.String && rightKind === ValueKind.Number) {
            canonicalLeftValue = EvaluationResult.convertToNumber(canonicalLeftValue, leftKind);
            leftKind = ValueKind.Number;
        }
        // Boolean|Null, Any
        else if (leftKind === ValueKind.Boolean || leftKind === ValueKind.Null) {
            canonicalLeftValue = EvaluationResult.convertToNumber(canonicalLeftValue, leftKind);
            leftKind = ValueKind.Number;
            return EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        }
        // Any, Boolean|Null
        else if (rightKind === ValueKind.Boolean || rightKind === ValueKind.Null) {
            canonicalRightValue = EvaluationResult.convertToNumber(canonicalRightValue, rightKind);
            rightKind = ValueKind.Number;
            return EvaluationResult.coerceTypes(canonicalLeftValue, canonicalRightValue, leftKind, rightKind);
        }
        return {
            canonicalLeftValue,
            canonicalRightValue,
            leftKind,
            rightKind,
        };
    }
    /**
     * For primitives, follows the Javascript rules (the Number function in Javascript). Otherwise NaN.
     */
    static convertToNumber(canonicalValue, kind) {
        switch (kind) {
            case ValueKind.Null:
                return 0;
            case ValueKind.Boolean:
                return canonicalValue === true ? 1 : 0;
            case ValueKind.Number:
                return canonicalValue;
            case ValueKind.String:
                return expressionUtility.parseNumber(canonicalValue);
        }
        return NaN;
    }
}
exports.EvaluationResult = EvaluationResult;
/**
 * Stores context related to the evaluation of an expression tree
 */
class EvaluationContext {
    constructor(trace, state, options, node) {
        this._traceResults = new Map();
        this.trace = trace;
        this.state = state;
        // Copy the options
        options = new EvaluationOptions(options);
        if (options.maxMemory === 0) {
            // Set a reasonable default max memory
            options.maxMemory = 1048576; // 1mb
        }
        this.options = options;
        this.memory = new EvaluationMemory(options.maxMemory, node);
        this._traceMemory = new MemoryCounter(undefined, options.maxMemory);
    }
    setTraceResult(node, result) {
        // Remove if previously added. This typically should not happen. This could happen
        // due to a badly authored function. So we'll handle it and track memory correctly.
        const previousResult = this._traceResults.get(node);
        if (previousResult) {
            this._traceMemory.subtractString(previousResult);
            this._traceResults.delete(node);
        }
        // Check max memory
        const value = expressionUtility.formatValue(result.value, result.kind);
        if (this._traceMemory.tryAddString(value)) {
            // Store the result
            this._traceResults.set(node, value);
        }
    }
    getTraceResult(node) {
        return this._traceResults.get(node);
    }
}
exports.EvaluationContext = EvaluationContext;
////////////////////////////////////////////////////////////////////////////////
// Value types, canonicalization, and interfaces for type compatibility
////////////////////////////////////////////////////////////////////////////////
var ValueKind;
(function (ValueKind) {
    ValueKind[ValueKind["Array"] = 0] = "Array";
    ValueKind[ValueKind["Boolean"] = 1] = "Boolean";
    ValueKind[ValueKind["Null"] = 2] = "Null";
    ValueKind[ValueKind["Number"] = 3] = "Number";
    ValueKind[ValueKind["Object"] = 4] = "Object";
    ValueKind[ValueKind["String"] = 5] = "String";
})(ValueKind = exports.ValueKind || (exports.ValueKind = {}));
class CanonicalValue {
    constructor(value) {
        switch (typeof value) {
            case "undefined":
                this.value = null;
                this.kind = ValueKind.Null;
                return;
            case "boolean":
                this.value = value;
                this.kind = ValueKind.Boolean;
                return;
            case "number":
                this.value = value;
                this.kind = ValueKind.Number;
                return;
            case "string":
                this.value = value;
                this.kind = ValueKind.String;
                return;
        }
        if (value === null) {
            this.value = null;
            this.kind = ValueKind.Null;
            return;
        }
        switch (value[COMPATIBLE_VALUE_KIND]) {
            case ValueKind.Null:
                this.value = null;
                this.kind = ValueKind.Null;
                return;
            case ValueKind.Boolean: {
                const b = value;
                this.value = b.getBoolean();
                this.kind = ValueKind.Boolean;
                return;
            }
            case ValueKind.Number: {
                const n = value;
                this.value = n.getNumber();
                this.kind = ValueKind.Number;
                return;
            }
            case ValueKind.String: {
                const s = value;
                this.value = s.getString();
                this.kind = ValueKind.String;
                return;
            }
            case ValueKind.Object:
                this.value = value;
                this.kind = ValueKind.Object;
                return;
            case ValueKind.Array:
                this.value = value;
                this.kind = ValueKind.Array;
                return;
        }
        this.value = value;
        this.kind = ValueKind.Object;
    }
}
exports.CanonicalValue = CanonicalValue;
const COMPATIBLE_VALUE_KIND = "compatibleValueKind";
////////////////////////////////////////////////////////////////////////////////
// Classes related to tracking memory utilization
////////////////////////////////////////////////////////////////////////////////
/**
 * Helper class for ExpressionNode authors. This class helps calculate memory overhead for a result object.
 */
class MemoryCounter {
    constructor(node, maxBytes) {
        this._currentBytes = 0;
        this._node = node;
        this.maxBytes = (maxBytes !== null && maxBytes !== void 0 ? maxBytes : 0) > 0 ? maxBytes : 2147483647; // max int32
    }
    get currentBytes() {
        return this._currentBytes;
    }
    addAmount(bytes) {
        if (!this.tryAddAmount(bytes)) {
            if (this._node) {
                throw new Error(`The maximum allowed memory size was exceeded while evaluating the following expression: ${this._node.convertToExpression()}`);
            }
            throw new Error("The maximum allowed memory size was exceeded");
        }
    }
    addContextData(value, traverse) {
        this.addAmount(MemoryCounter.calculateContextDataBytes(value, traverse));
    }
    addMinObjectSize() {
        this.addAmount(MemoryCounter.MIN_OBJECT_SIZE);
    }
    addPointer() {
        this.addAmount(MemoryCounter.POINTER_SIZE);
    }
    addString(value) {
        this.addAmount(MemoryCounter.calculateStringBytes(value));
    }
    subtractAmount(bytes) {
        if (bytes > this._currentBytes) {
            throw new Error("Bytes to subtract exceeds total bytes");
        }
        this._currentBytes -= bytes;
    }
    subtractString(value) {
        this.subtractAmount(MemoryCounter.calculateStringBytes(value));
    }
    tryAddAmount(bytes) {
        bytes += this._currentBytes;
        if (bytes > this.maxBytes) {
            return false;
        }
        this._currentBytes = bytes;
        return true;
    }
    tryAddString(value) {
        return this.tryAddAmount(MemoryCounter.calculateStringBytes(value));
    }
    static calculateStringBytes(value) {
        // This measurement doesn't have to be perfect.
        // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
        return MemoryCounter.STRING_BASE_OVERHEAD + value.length * 2;
    }
    static calculateContextDataBytes(value, traverse) {
        let result = 0;
        const values = traverse ? context_data_1.ContextData.traverse(value) : [value];
        for (const item of values) {
            // This measurement doesn't have to be perfect
            // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
            switch (item === null || item === void 0 ? void 0 : item.type) {
                case context_data_1.STRING_TYPE: {
                    const str = item.value;
                    result += this.MIN_OBJECT_SIZE + this.calculateStringBytes(str);
                    break;
                }
                case context_data_1.ARRAY_TYPE:
                case context_data_1.DICTIONARY_TYPE:
                case context_data_1.CASE_SENSITIVE_DICTIONARY_TYPE:
                case context_data_1.BOOLEAN_TYPE:
                case context_data_1.NUMBER_TYPE:
                    // Min object size is good enough. Allows for base + a few fields.
                    result += this.MIN_OBJECT_SIZE;
                    break;
                case undefined:
                    result += this.POINTER_SIZE;
                    break;
                default:
                    throw new Error(`Unexpected pipeline context data type '${item === null || item === void 0 ? void 0 : item.type}'`);
            }
        }
        return result;
    }
}
exports.MemoryCounter = MemoryCounter;
MemoryCounter.MIN_OBJECT_SIZE = 24;
MemoryCounter.POINTER_SIZE = 8;
MemoryCounter.STRING_BASE_OVERHEAD = 26;
class ResultMemory {
    constructor(bytes = undefined, isTotal = undefined) {
        /**
         * Indicates whether Bytes represents the total size of the result.
         * True indicates the accounting-overhead of downstream parameters can be discarded.
         *
         * For example, consider a function fromJson() which takes a string paramter,
         * and returns an object. The object is newly created and a rough
         * measurement should be returned for the amount of bytes it consumes in memory.
         * Set isTotal to true, since new object contains no references
         * to previously allocated memory.
         *
         * For another example, consider a function which wraps a complex parameter result.
         * The field bytes should be set to the amount of newly allocated memory.
         * However since the object references previously allocated memory, set isTotal
         * to false.
         */
        this.isTotal = false;
        if (bytes !== undefined) {
            this.bytes = bytes;
        }
        if (isTotal !== undefined) {
            this.isTotal = isTotal;
        }
    }
}
exports.ResultMemory = ResultMemory;
/**
 * This is an internal class.
 *
 * This class is used to track current memory consumption
 * across the entire expression evaluation.
 */
class EvaluationMemory {
    constructor(maxBytes, node) {
        this._depths = [];
        this._maxActiveDepth = -1;
        this._totalBytes = 0;
        this._maxBytes = maxBytes;
        this._node = node;
    }
    addAmount(depth, bytes, trimDepth) {
        // Trim depth
        if (trimDepth) {
            while (this._maxActiveDepth > depth) {
                const bytes = this._depths[this._maxActiveDepth];
                if (bytes > 0) {
                    // Coherency check
                    if (bytes > this._totalBytes) {
                        throw new Error("Bytes to subtract exceeds total bytes");
                    }
                    // Subtract from the total
                    this._totalBytes -= bytes;
                    // Reset the bytes
                    this._depths[this._maxActiveDepth] = 0;
                }
                this._maxActiveDepth--;
            }
        }
        // Grow the depths
        if (depth > this._maxActiveDepth) {
            // Grow the array
            while (this._depths.length <= depth) {
                this._depths.push(0);
            }
            // Adjust the max active depth
            this._maxActiveDepth = depth;
        }
        // Add to the depth
        this._depths[depth] += bytes;
        // Add to the total
        this._totalBytes += bytes;
        // Check max
        if (this._totalBytes > this._maxBytes) {
            throw new Error(`The maximum allowed memory size was exceeded while evaluating the following expression: ${this._node.convertToExpression()}`);
        }
    }
}
//# sourceMappingURL=nodes.js.map

/***/ }),

/***/ 8341:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.And = void 0;
const nodes_1 = __nccwpck_require__(1137);
class And extends nodes_1.ContainerNode {
    constructor() {
        super(...arguments);
        this.isAndOperator = true;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters
            .map((x) => x.convertToExpression())
            .join(" && ")})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters
            .map((x) => x.convertToRealizedExpression(context))
            .join(" && ")})`;
    }
    evaluateCore(context) {
        let result;
        for (const parameter of this.parameters) {
            result = parameter.evaluate(context);
            if (result.isFalsy) {
                break;
            }
        }
        return {
            value: result === null || result === void 0 ? void 0 : result.value,
            memory: undefined,
        };
    }
}
exports.And = And;
//# sourceMappingURL=and.js.map

/***/ }),

/***/ 2481:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Equal = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Equal extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} == ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} == ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractEqual(right),
            memory: undefined,
        };
    }
}
exports.Equal = Equal;
//# sourceMappingURL=equal.js.map

/***/ }),

/***/ 7622:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreaterThanOrEqual = void 0;
const nodes_1 = __nccwpck_require__(1137);
class GreaterThanOrEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} >= ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} >= ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractGreaterThanOrEqual(right),
            memory: undefined,
        };
    }
}
exports.GreaterThanOrEqual = GreaterThanOrEqual;
//# sourceMappingURL=greater-than-or-equal.js.map

/***/ }),

/***/ 7158:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreaterThan = void 0;
const nodes_1 = __nccwpck_require__(1137);
class GreaterThan extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} > ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} > ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractGreaterThan(right),
            memory: undefined,
        };
    }
}
exports.GreaterThan = GreaterThan;
//# sourceMappingURL=greater-than.js.map

/***/ }),

/***/ 9687:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Index = void 0;
const expressionUtility = __importStar(__nccwpck_require__(8548));
const nodes_1 = __nccwpck_require__(1137);
class Index extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return true;
    }
    convertToExpression() {
        // Dot format, for example: github.sha
        if (this.parameters[1].nodeType == nodes_1.NodeType.Literal) {
            const literal = this.parameters[1];
            if (literal.kind === nodes_1.ValueKind.String &&
                expressionUtility.testLegalKeyword(literal.value)) {
                return `${this.parameters[0].convertToExpression()}.${literal.value}`;
            }
        }
        // Index format, for example: commits[0]
        return `${this.parameters[0].convertToExpression()}[${this.parameters[1].convertToExpression()}]`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `${this.parameters[0].convertToRealizedExpression(context)}[${this.parameters[1].convertToRealizedExpression(context)}]`;
    }
    evaluateCore(context) {
        var _a;
        const left = this.parameters[0].evaluate(context);
        const collection = left.getCollectionInterface();
        // Not a collection
        if (!collection) {
            return {
                value: this.parameters[1].nodeType === nodes_1.NodeType.Wildcard
                    ? new FilteredArray()
                    : undefined,
                memory: undefined,
            };
        }
        // Filtered array
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Array &&
            ((_a = collection) === null || _a === void 0 ? void 0 : _a.isFilteredArray) === true) {
            return this.handleFilteredArray(context, collection);
        }
        // Array
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Array) {
            return this.handleArray(context, collection);
        }
        // Object
        else if (collection.compatibleValueKind === nodes_1.ValueKind.Object) {
            return this.handleObject(context, collection);
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
    handleFilteredArray(context, filteredArray) {
        const result = new FilteredArray();
        const counter = this.createMemoryCounter(context);
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Apply the index to each nested object or array
        const length = filteredArray.getArrayLength();
        for (let i = 0; i < length; i++) {
            const item = filteredArray.getArrayItem(i);
            // Leverage the expression sdK to traverse the object
            const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(item));
            const collection = itemResult.getCollectionInterface();
            // Nested object
            if ((collection === null || collection === void 0 ? void 0 : collection.compatibleValueKind) === nodes_1.ValueKind.Object) {
                const nestedObject = collection;
                // Wildcard
                if (indexHelper.isWildcard) {
                    for (const nestedKey of nestedObject.getObjectKeys()) {
                        const nestedValue = nestedObject.getObjectValue(nestedKey);
                        result.add(nestedValue);
                        counter.addPointer();
                    }
                }
                // String
                else if (indexHelper.hasStringIndex) {
                    if (nestedObject.hasObjectKey(indexHelper.stringIndex)) {
                        const nestedValue = nestedObject.getObjectValue(indexHelper.stringIndex);
                        result.add(nestedValue);
                        counter.addPointer();
                    }
                }
            }
            // Nested array
            else if ((collection === null || collection === void 0 ? void 0 : collection.compatibleValueKind) === nodes_1.ValueKind.Array) {
                const nestedArray = collection;
                // Wildcard
                if (indexHelper.isWildcard) {
                    const nestedLength = nestedArray.getArrayLength();
                    for (let nestedIndex = 0; nestedIndex < nestedLength; nestedIndex++) {
                        const nestedItem = nestedArray.getArrayItem(nestedIndex);
                        result.add(nestedItem);
                        counter.addPointer();
                    }
                }
                // String
                else if (indexHelper.hasIntegerIndex &&
                    indexHelper.integerIndex < nestedArray.getArrayLength()) {
                    result.add(nestedArray.getArrayItem(indexHelper.integerIndex));
                    counter.addPointer();
                }
            }
        }
        return {
            value: result,
            memory: new nodes_1.ResultMemory(counter.currentBytes),
        };
    }
    handleObject(context, object) {
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Wildcard
        if (indexHelper.isWildcard) {
            const filteredArray = new FilteredArray();
            const counter = this.createMemoryCounter(context);
            counter.addMinObjectSize();
            for (const key of object.getObjectKeys()) {
                filteredArray.add(object.getObjectValue(key));
                counter.addPointer();
            }
            return {
                value: filteredArray,
                memory: new nodes_1.ResultMemory(counter.currentBytes),
            };
        }
        // String
        else if (indexHelper.hasStringIndex &&
            object.hasObjectKey(indexHelper.stringIndex)) {
            return {
                value: object.getObjectValue(indexHelper.stringIndex),
                memory: undefined,
            };
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
    handleArray(context, array) {
        const indexHelper = new IndexHelper(context, this.parameters[1]);
        // Wildcard
        if (indexHelper.isWildcard) {
            const filtered = new FilteredArray();
            const counter = this.createMemoryCounter(context);
            counter.addMinObjectSize();
            const length = array.getArrayLength();
            for (let i = 0; i < length; i++) {
                filtered.add(array.getArrayItem(i));
                counter.addPointer();
            }
            return {
                value: filtered,
                memory: new nodes_1.ResultMemory(counter.currentBytes),
            };
        }
        // Integer
        else if (indexHelper.hasIntegerIndex &&
            indexHelper.integerIndex < array.getArrayLength()) {
            return {
                value: array.getArrayItem(indexHelper.integerIndex),
                memory: undefined,
            };
        }
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
exports.Index = Index;
class FilteredArray {
    constructor() {
        this._list = [];
        this.compatibleValueKind = nodes_1.ValueKind.Array;
        this.isFilteredArray = true;
    }
    add(item) {
        this._list.push(item);
    }
    getArrayLength() {
        return this._list.length;
    }
    getArrayItem(index) {
        return this._list[index];
    }
}
class IndexHelper {
    constructor(context, parameter) {
        this._parameter = parameter;
        this._result = parameter.evaluate(context);
    }
    get isWildcard() {
        return this._parameter.nodeType === nodes_1.NodeType.Wildcard;
    }
    get hasIntegerIndex() {
        return this.integerIndex !== null;
    }
    get hasStringIndex() {
        return this.stringIndex !== null;
    }
    get integerIndex() {
        if (this._integerIndex === undefined) {
            let doubleIndex = this._result.convertToNumber();
            if (isNaN(doubleIndex) || doubleIndex < 0) {
                this._integerIndex = null;
            }
            doubleIndex = Math.floor(doubleIndex);
            if (doubleIndex > 2147483647) {
                // max integer in most languages
                this._integerIndex = null;
            }
            this._integerIndex = doubleIndex;
        }
        return this._integerIndex;
    }
    get stringIndex() {
        if (this._stringIndex === undefined) {
            this._stringIndex = this._result.isPrimitive
                ? this._result.convertToString()
                : null;
        }
        return this._stringIndex;
    }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7233:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LessThanOrEqual = void 0;
const nodes_1 = __nccwpck_require__(1137);
class LessThanOrEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} <= ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} <= ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractLessThanOrEqual(right),
            memory: undefined,
        };
    }
}
exports.LessThanOrEqual = LessThanOrEqual;
//# sourceMappingURL=less-than-or-equal.js.map

/***/ }),

/***/ 4239:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LessThan = void 0;
const nodes_1 = __nccwpck_require__(1137);
class LessThan extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} < ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} < ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractLessThan(right),
            memory: undefined,
        };
    }
}
exports.LessThan = LessThan;
//# sourceMappingURL=less-than.js.map

/***/ }),

/***/ 6839:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotEqual = void 0;
const nodes_1 = __nccwpck_require__(1137);
class NotEqual extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters[0].convertToExpression()} != ${this.parameters[1].convertToExpression()})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters[0].convertToRealizedExpression(context)} != ${this.parameters[1].convertToRealizedExpression(context)})`;
    }
    evaluateCore(context) {
        const left = this.parameters[0].evaluate(context);
        const right = this.parameters[1].evaluate(context);
        return {
            value: left.abstractNotEqual(right),
            memory: undefined,
        };
    }
}
exports.NotEqual = NotEqual;
//# sourceMappingURL=not-equal.js.map

/***/ }),

/***/ 2979:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Not = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Not extends nodes_1.ContainerNode {
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `!${this.parameters[0].convertToExpression()}`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `!${this.parameters[0].convertToRealizedExpression(context)}`;
    }
    evaluateCore(context) {
        const result = this.parameters[0].evaluate(context);
        return {
            value: result.isFalsy,
            memory: undefined,
        };
    }
}
exports.Not = Not;
//# sourceMappingURL=not.js.map

/***/ }),

/***/ 8704:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Or = void 0;
const nodes_1 = __nccwpck_require__(1137);
class Or extends nodes_1.ContainerNode {
    constructor() {
        super(...arguments);
        this.isOrOperator = true;
    }
    get traceFullyRealized() {
        return false;
    }
    convertToExpression() {
        return `(${this.parameters
            .map((x) => x.convertToExpression())
            .join(" || ")})`;
    }
    convertToRealizedExpression(context) {
        // Check if the result was stored
        const result = context.getTraceResult(this);
        if (result) {
            return result;
        }
        return `(${this.parameters
            .map((x) => x.convertToRealizedExpression(context))
            .join(" || ")})`;
    }
    evaluateCore(context) {
        let result;
        for (const parameter of this.parameters) {
            result = parameter.evaluate(context);
            if (result.isTruthy) {
                break;
            }
        }
        return {
            value: result === null || result === void 0 ? void 0 : result.value,
            memory: undefined,
        };
    }
}
exports.Or = Or;
//# sourceMappingURL=or.js.map

/***/ }),

/***/ 6325:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateExpressionSyntax = exports.createExpressionTree = void 0;
const trace_writer_1 = __nccwpck_require__(5617);
const nodes_1 = __nccwpck_require__(1137);
const lexical_analyzer_1 = __nccwpck_require__(731);
const expression_constants_1 = __nccwpck_require__(1295);
const contains_1 = __nccwpck_require__(8293);
const ends_with_1 = __nccwpck_require__(3047);
const format_1 = __nccwpck_require__(5529);
const join_1 = __nccwpck_require__(7736);
const starts_with_1 = __nccwpck_require__(7186);
const to_json_1 = __nccwpck_require__(3988);
const from_json_1 = __nccwpck_require__(104);
const WELL_KNOWN_FUNCTIONS = {};
function addFunction(name, minParameters, maxParameters, createNode) {
    WELL_KNOWN_FUNCTIONS[name.toUpperCase()] = {
        name,
        minParameters,
        maxParameters,
        createNode,
    };
}
addFunction("contains", 2, 2, () => new contains_1.Contains());
addFunction("endsWith", 2, 2, () => new ends_with_1.EndsWith());
addFunction("format", 1, 255, () => new format_1.Format());
addFunction("join", 1, 2, () => new join_1.Join());
addFunction("startsWith", 2, 2, () => new starts_with_1.StartsWith());
addFunction("toJson", 1, 1, () => new to_json_1.ToJson());
addFunction("fromJson", 1, 1, () => new from_json_1.FromJson());
function createExpressionTree(expression, trace, namedContexts, functions) {
    const context = new ParseContext(expression, trace, namedContexts, functions);
    context.trace.info(`Parsing expression: <${expression}>`);
    return createTreeInternal(context);
}
exports.createExpressionTree = createExpressionTree;
function validateExpressionSyntax(expression, trace) {
    const context = new ParseContext(expression, trace, undefined, undefined, true);
    context.trace.info(`Validating expression syntax: <${expression}>`);
    return createTreeInternal(context);
}
exports.validateExpressionSyntax = validateExpressionSyntax;
function createTreeInternal(context) {
    // Push the tokens
    for (;;) {
        context.token = context.lexicalAnalyzer.getNextToken();
        // No more tokens
        if (!context.token) {
            break;
        }
        // Unexpected
        else if (context.token.kind === lexical_analyzer_1.TokenKind.Unexpected) {
            throw createParseError(ParseErrorKind.UnexpectedSymbol, context.token, context.expression);
        }
        // Operator
        else if (context.token.isOperator) {
            pushOperator(context);
        }
        // Operand
        else {
            pushOperand(context);
        }
        context.lastToken = context.token;
    }
    // No tokens
    if (!context.lastToken) {
        return undefined;
    }
    // Check unexpected end of expression
    if (context.operators.length > 0) {
        let unexpectedLastToken = false;
        switch (context.lastToken.kind) {
            case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
            case lexical_analyzer_1.TokenKind.EndIndex: // "]"
            case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
                // Legal
                break;
            case lexical_analyzer_1.TokenKind.Function:
                // Illegal
                unexpectedLastToken = true;
                break;
            default:
                unexpectedLastToken = context.lastToken.isOperator;
                break;
        }
        if (unexpectedLastToken || context.lexicalAnalyzer.hasUnclosedTokens) {
            throw createParseError(ParseErrorKind.UnexpectedEndOfExpression, context.lastToken, context.expression);
        }
    }
    // Flush operators
    while (context.operators.length > 0) {
        flushTopOperator(context);
    }
    // Coherency check - verify exactly one operand
    if (context.operands.length !== 1) {
        throw new Error("Expected exactly one operand");
    }
    // Check max depth
    const result = context.operands[0];
    checkMaxDepth(context, result);
    return result;
}
function pushOperand(context) {
    // Create the node
    let node;
    switch (context.token.kind) {
        // Function
        case lexical_analyzer_1.TokenKind.Function: {
            const name = context.token.rawValue;
            const functionInfo = getFunctionInfo(context, name);
            if (functionInfo) {
                node = functionInfo.createNode();
                node.name = name;
            }
            else if (context.allowUnknownKeywords) {
                node = new NoOperationFunction();
                node.name = name;
            }
            else {
                throw createParseError(ParseErrorKind.UnrecognizedFunction, context.token, context.expression);
            }
            break;
        }
        // Named-context
        case lexical_analyzer_1.TokenKind.NamedContext: {
            const name = context.token.rawValue;
            const namedContextInfo = context.extensionNamedContexts[name.toUpperCase()];
            if (namedContextInfo) {
                node = namedContextInfo.createNode();
                node.name = name;
            }
            else if (context.allowUnknownKeywords) {
                node = new NoOperationNamedContext();
                node.name = name;
            }
            else {
                throw createParseError(ParseErrorKind.UnrecognizedNamedContext, context.token, context.expression);
            }
            break;
        }
        // Otherwise simple
        default:
            node = context.token.toNode();
            break;
    }
    // Push the operand
    context.operands.push(node);
}
function pushOperator(context) {
    // Flush higher or equal precedence
    if (context.token.associativity === lexical_analyzer_1.Associativity.LeftToRight) {
        const precedence = context.token.precedence;
        while (context.operators.length > 0) {
            const topOperator = context.operators[context.operators.length - 1];
            if (precedence <= topOperator.precedence &&
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartGroup && // Unless top is "(" logical grouping
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartIndex && // or unless top is "["
                topOperator.kind !== lexical_analyzer_1.TokenKind.StartParameters && // or unless top is "("
                topOperator.kind !== lexical_analyzer_1.TokenKind.Separator) {
                // or unless top is ","
                flushTopOperator(context);
                continue;
            }
            break;
        }
    }
    // Push the operator
    context.operators.push(context.token);
    // Process closing operators now, since context.lastToken is required
    // to accurately process TokenKind.EndParameters
    switch (context.token.kind) {
        case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
        case lexical_analyzer_1.TokenKind.EndIndex: // "]"
        case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
            flushTopOperator(context);
            break;
    }
}
function flushTopOperator(context) {
    var _a, _b, _c, _d;
    // Special handling for closing operators
    switch (context.operators[context.operators.length - 1].kind) {
        case lexical_analyzer_1.TokenKind.EndIndex: // "]"
            flushTopEndIndex(context);
            return;
        case lexical_analyzer_1.TokenKind.EndGroup: // ")" logical grouping
            flushTopEndGroup(context);
            return;
        case lexical_analyzer_1.TokenKind.EndParameters: // ")" function call
            flushTopEndParameters(context);
            return;
    }
    // Pop the operator
    const operator = context.operators.pop();
    // Create the node
    const node = operator.toNode();
    // Pop the operands, add to the node
    const operands = popOperands(context, operator.operandCount);
    for (const operand of operands) {
        // Flatten nested And
        if (((_a = node) === null || _a === void 0 ? void 0 : _a.isAndOperator) === true) {
            if (((_b = operand) === null || _b === void 0 ? void 0 : _b.isAndOperator) === true) {
                const nestedAnd = operand;
                for (const nestedParameter of nestedAnd.parameters) {
                    node.addParameter(nestedParameter);
                }
                continue;
            }
        }
        // Flatten nested Or
        else if (((_c = node) === null || _c === void 0 ? void 0 : _c.isOrOperator) === true) {
            if (((_d = operand) === null || _d === void 0 ? void 0 : _d.isOrOperator) === true) {
                const nestedOr = operand;
                for (const nestedParameter of nestedOr.parameters) {
                    node.addParameter(nestedParameter);
                }
                continue;
            }
        }
        node.addParameter(operand);
    }
    // Push the node to thee operand stack
    context.operands.push(node);
}
/**
 * Flushes the ")" logical grouping operator
 */
function flushTopEndGroup(context) {
    // Pop the operators
    popOperator(context, lexical_analyzer_1.TokenKind.EndGroup); // ")" logical grouping
    popOperator(context, lexical_analyzer_1.TokenKind.StartGroup); // "(" logical grouping
}
/**
 * Flushes the "]" operator
 */
function flushTopEndIndex(context) {
    // Pop the operators
    popOperator(context, lexical_analyzer_1.TokenKind.EndIndex); // "]"
    const operator = popOperator(context, lexical_analyzer_1.TokenKind.StartIndex); // "["
    // Create the node
    const node = operator.toNode();
    // Pop the operands, add to the node
    const operands = popOperands(context, operator.operandCount);
    for (const operand of operands) {
        node.addParameter(operand);
    }
    // Push the node to the operand stack
    context.operands.push(node);
}
/**
 * Flushes the ")" function call operator
 */
function flushTopEndParameters(context) {
    // Pop the operator
    let operator = popOperator(context, lexical_analyzer_1.TokenKind.EndParameters); // ")" function call
    // Coherency check - top operator is the current token
    if (operator !== context.token) {
        throw new Error("Expected the operator to be the current token");
    }
    let func;
    // No parameters
    if (context.lastToken.kind === lexical_analyzer_1.TokenKind.StartParameters) {
        // Node already exists on the operand stack
        func = context.operands[context.operands.length - 1];
    }
    // Has parameters
    else {
        // Pop the operands
        let parameterCount = 1;
        while (context.operators[context.operators.length - 1].kind ===
            lexical_analyzer_1.TokenKind.Separator) {
            parameterCount++;
            context.operators.pop();
        }
        const functionOperands = popOperands(context, parameterCount);
        // Node already exists on the operand stack
        func = context.operands[context.operands.length - 1];
        // Add the operands to the node
        for (const operand of functionOperands) {
            func.addParameter(operand);
        }
    }
    // Pop the "(" operator too
    operator = popOperator(context, lexical_analyzer_1.TokenKind.StartParameters);
    // Check min/max parameter count
    const functionInfo = getFunctionInfo(context, func.name);
    if (!functionInfo && context.allowUnknownKeywords) {
        // Don't check min/max
    }
    else if (func.parameters.length < functionInfo.minParameters) {
        throw createParseError(ParseErrorKind.TooFewParameters, operator, context.expression);
    }
    else if (func.parameters.length > functionInfo.maxParameters) {
        throw createParseError(ParseErrorKind.TooManyParameters, operator, context.expression);
    }
}
/**
 * Pops N operands from the operand stack. The operands are returned
 * in their natural listed order, i.e. not last-in-first-out.
 */
function popOperands(context, count) {
    const result = [];
    while (count-- > 0) {
        result.unshift(context.operands.pop());
    }
    return result;
}
/**
 * Pops an operator and asserts it is the expected kind.
 */
function popOperator(context, expected) {
    const token = context.operators.pop();
    if (token.kind !== expected) {
        throw new Error(`Expected operator '${expected}' to be popped. Actual '${token.kind}'`);
    }
    return token;
}
/**
 * Checks the max depth of the expression tree
 */
function checkMaxDepth(context, node, depth = 1) {
    if (depth > expression_constants_1.MAX_DEPTH) {
        throw createParseError(ParseErrorKind.ExceededMaxDepth, undefined, context.expression);
    }
    if (node.nodeType === nodes_1.NodeType.Container) {
        const container = node;
        for (const parameter of container.parameters) {
            checkMaxDepth(context, parameter, depth + 1);
        }
    }
}
function getFunctionInfo(context, name) {
    var _a;
    const upperName = name.toUpperCase();
    return ((_a = WELL_KNOWN_FUNCTIONS[upperName]) !== null && _a !== void 0 ? _a : context.extensionFunctions[upperName]);
}
function createParseError(kind, token, expression) {
    let description;
    switch (kind) {
        case ParseErrorKind.ExceededMaxDepth:
            description = `Exceeded max expression depth ${expression_constants_1.MAX_DEPTH}`;
            break;
        case ParseErrorKind.ExceededMaxLength:
            description = `Exceeded max expression length ${expression_constants_1.MAX_LENGTH}`;
            break;
        case ParseErrorKind.TooFewParameters:
            description = "Too few parameters supplied";
            break;
        case ParseErrorKind.TooManyParameters:
            description = "Too many parameters supplied";
            break;
        case ParseErrorKind.UnexpectedEndOfExpression:
            description = "Unexpected end of expression";
            break;
        case ParseErrorKind.UnexpectedSymbol:
            description = "Unexpected symbol";
            break;
        case ParseErrorKind.UnrecognizedFunction:
            description = "Unrecognized function";
            break;
        case ParseErrorKind.UnrecognizedNamedContext:
            description = "Unrecognized named-context";
            break;
        default:
            // Should never reach here
            throw new Error(`Unexpected parse exception kind '${kind}'`);
    }
    if (!token) {
        return new Error(description);
    }
    return new Error(`${description}: '${token.rawValue}'. Located at position ${token.index + 1} within expression: ${expression}`);
}
class NoOperationNamedContext extends nodes_1.NamedContextNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class NoOperationFunction extends nodes_1.FunctionNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class ParseContext {
    constructor(expression, trace, namedContexts, functions, allowUnknownKeywords) {
        this.extensionFunctions = {};
        this.extensionNamedContexts = {};
        this.operands = [];
        this.operators = [];
        this.expression = expression;
        if (this.expression.length > expression_constants_1.MAX_LENGTH) {
            throw createParseError(ParseErrorKind.ExceededMaxLength, undefined, expression);
        }
        this.trace = trace !== null && trace !== void 0 ? trace : new trace_writer_1.NoOperationTraceWriter();
        for (const namedContextInfo of namedContexts !== null && namedContexts !== void 0 ? namedContexts : []) {
            this.extensionNamedContexts[namedContextInfo.name.toUpperCase()] =
                namedContextInfo;
        }
        for (const functionInfo of functions !== null && functions !== void 0 ? functions : []) {
            this.extensionFunctions[functionInfo.name.toUpperCase()] = functionInfo;
        }
        this.lexicalAnalyzer = new lexical_analyzer_1.LexicalAnalyzer(this.expression);
        this.allowUnknownKeywords = allowUnknownKeywords !== null && allowUnknownKeywords !== void 0 ? allowUnknownKeywords : false;
    }
}
var ParseErrorKind;
(function (ParseErrorKind) {
    ParseErrorKind[ParseErrorKind["ExceededMaxDepth"] = 0] = "ExceededMaxDepth";
    ParseErrorKind[ParseErrorKind["ExceededMaxLength"] = 1] = "ExceededMaxLength";
    ParseErrorKind[ParseErrorKind["TooFewParameters"] = 2] = "TooFewParameters";
    ParseErrorKind[ParseErrorKind["TooManyParameters"] = 3] = "TooManyParameters";
    ParseErrorKind[ParseErrorKind["UnexpectedEndOfExpression"] = 4] = "UnexpectedEndOfExpression";
    ParseErrorKind[ParseErrorKind["UnexpectedSymbol"] = 5] = "UnexpectedSymbol";
    ParseErrorKind[ParseErrorKind["UnrecognizedFunction"] = 6] = "UnrecognizedFunction";
    ParseErrorKind[ParseErrorKind["UnrecognizedNamedContext"] = 7] = "UnrecognizedNamedContext";
})(ParseErrorKind || (ParseErrorKind = {}));
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 5617:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOperationTraceWriter = void 0;
class NoOperationTraceWriter {
    info(message) { }
    verbose(message) { }
}
exports.NoOperationTraceWriter = NoOperationTraceWriter;
//# sourceMappingURL=trace-writer.js.map

/***/ }),

/***/ 6374:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONObjectReader = void 0;
const tokens_1 = __nccwpck_require__(7603);
const parse_event_1 = __nccwpck_require__(7704);
class JSONObjectReader {
    constructor(fileId, input) {
        this._fileId = fileId;
        // todo: remove these or hide behind env var
        // console.log(`parsing: '${input}'`)
        const value = JSON.parse(input);
        this._generator = this.getParseEvents(value, true);
        this._current = this._generator.next();
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.Literal) {
                this._current = this._generator.next();
                // console.log("ParseEvent=Literal")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceEnd")
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingEnd")
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentEnd")
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentStart")
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
    /**
     * Returns all tokens (depth first)
     */
    *getParseEvents(value, root) {
        if (root) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentStart, undefined);
        }
        switch (typeof value) {
            case "undefined":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NullToken(this._fileId, undefined, undefined));
                break;
            case "boolean":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.BooleanToken(this._fileId, undefined, undefined, value));
                break;
            case "number":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NumberToken(this._fileId, undefined, undefined, value));
                break;
            case "string":
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this._fileId, undefined, undefined, value));
                break;
            case "object":
                // null
                if (value === null) {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.NullToken(this._fileId, undefined, undefined));
                }
                // array
                else if (Object.prototype.hasOwnProperty.call(value, "length")) {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceStart, new tokens_1.SequenceToken(this._fileId, undefined, undefined));
                    for (const item of value) {
                        for (const e of this.getParseEvents(item)) {
                            yield e;
                        }
                    }
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceEnd, undefined);
                }
                // object
                else {
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingStart, new tokens_1.MappingToken(this._fileId, undefined, undefined));
                    for (const key of Object.keys(value)) {
                        yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this._fileId, undefined, undefined, key));
                        for (const e of this.getParseEvents(value[key])) {
                            yield e;
                        }
                    }
                    yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingEnd, undefined);
                }
                break;
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
        if (root) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentEnd, undefined);
        }
    }
}
exports.JSONObjectReader = JSONObjectReader;
//# sourceMappingURL=json-object-reader.js.map

/***/ }),

/***/ 7704:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventType = exports.ParseEvent = void 0;
class ParseEvent {
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}
exports.ParseEvent = ParseEvent;
var EventType;
(function (EventType) {
    EventType[EventType["Literal"] = 0] = "Literal";
    EventType[EventType["SequenceStart"] = 1] = "SequenceStart";
    EventType[EventType["SequenceEnd"] = 2] = "SequenceEnd";
    EventType[EventType["MappingStart"] = 3] = "MappingStart";
    EventType[EventType["MappingEnd"] = 4] = "MappingEnd";
    EventType[EventType["DocumentStart"] = 5] = "DocumentStart";
    EventType[EventType["DocumentEnd"] = 6] = "DocumentEnd";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=parse-event.js.map

/***/ }),

/***/ 3032:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OneOfDefinition = exports.PropertyValue = exports.MappingDefinition = exports.SequenceDefinition = exports.StringDefinition = exports.NumberDefinition = exports.BooleanDefinition = exports.NullDefinition = exports.ScalarDefinition = exports.Definition = exports.TemplateSchema = exports.DefinitionType = void 0;
const template_constants_1 = __nccwpck_require__(5029);
const template_context_1 = __nccwpck_require__(389);
const template_memory_1 = __nccwpck_require__(2220);
const template_reader_1 = __nccwpck_require__(6938);
const tokens_1 = __nccwpck_require__(7603);
const trace_writer_1 = __nccwpck_require__(2544);
var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Null"] = 0] = "Null";
    DefinitionType[DefinitionType["Boolean"] = 1] = "Boolean";
    DefinitionType[DefinitionType["Number"] = 2] = "Number";
    DefinitionType[DefinitionType["String"] = 3] = "String";
    DefinitionType[DefinitionType["Sequence"] = 4] = "Sequence";
    DefinitionType[DefinitionType["Mapping"] = 5] = "Mapping";
    DefinitionType[DefinitionType["OneOf"] = 6] = "OneOf";
})(DefinitionType = exports.DefinitionType || (exports.DefinitionType = {}));
/**
 * This models the root schema object and contains definitions
 */
class TemplateSchema {
    constructor(mapping) {
        this.definitions = {};
        this.version = "";
        // Add built-in type: null
        this.definitions[template_constants_1.NULL] = new NullDefinition();
        // Add built-in type: boolean
        this.definitions[template_constants_1.BOOLEAN] = new BooleanDefinition();
        // Add built-in type: number
        this.definitions[template_constants_1.NUMBER] = new NumberDefinition();
        // Add built-in type: string
        this.definitions[template_constants_1.STRING] = new StringDefinition();
        // Add built-in type: sequence
        const sequenceDefinition = new SequenceDefinition();
        sequenceDefinition.itemType = template_constants_1.ANY;
        this.definitions[template_constants_1.SEQUENCE] = sequenceDefinition;
        // Add built-in type: mapping
        const mappingDefinition = new MappingDefinition();
        mappingDefinition.looseKeyType = template_constants_1.STRING;
        mappingDefinition.looseValueType = template_constants_1.ANY;
        this.definitions[template_constants_1.MAPPING] = mappingDefinition;
        // Add built-in type: any
        const anyDefinition = new OneOfDefinition();
        anyDefinition.oneOf.push(template_constants_1.NULL);
        anyDefinition.oneOf.push(template_constants_1.BOOLEAN);
        anyDefinition.oneOf.push(template_constants_1.NUMBER);
        anyDefinition.oneOf.push(template_constants_1.STRING);
        anyDefinition.oneOf.push(template_constants_1.SEQUENCE);
        anyDefinition.oneOf.push(template_constants_1.MAPPING);
        this.definitions[template_constants_1.ANY] = anyDefinition;
        if (mapping) {
            for (let i = 0; i < mapping.count; i++) {
                const pair = mapping.get(i);
                const key = pair.key.assertString(`${template_constants_1.TEMPLATE_SCHEMA} key`);
                switch (key.value) {
                    case template_constants_1.VERSION: {
                        this.version = pair.value.assertString(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.VERSION}`).value;
                        break;
                    }
                    case template_constants_1.DEFINITIONS: {
                        const definitions = pair.value.assertMapping(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS}`);
                        for (let j = 0; j < definitions.count; j++) {
                            const definitionsPair = definitions.get(j);
                            const definitionsKey = definitionsPair.key.assertString(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS} key`);
                            const definitionsValue = definitionsPair.value.assertMapping(`${template_constants_1.TEMPLATE_SCHEMA} ${template_constants_1.DEFINITIONS} value`);
                            let definition;
                            for (let k = 0; k < definitionsValue.count; k++) {
                                const definitionPair = definitionsValue.get(k);
                                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                                switch (definitionKey.value) {
                                    case template_constants_1.NULL:
                                        definition = new NullDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.BOOLEAN:
                                        definition = new BooleanDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.NUMBER:
                                        definition = new NumberDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.STRING:
                                        definition = new StringDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.SEQUENCE:
                                        definition = new SequenceDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.MAPPING:
                                        definition = new MappingDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.ONE_OF:
                                        definition = new OneOfDefinition(definitionsValue);
                                        break;
                                    case template_constants_1.CONTEXT:
                                    case template_constants_1.DESCRIPTION:
                                        continue;
                                    default:
                                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} mapping key`); // throws
                                        break;
                                }
                                break;
                            }
                            if (!definition) {
                                throw new Error(`Not enough information to construct definition '${definitionsKey.value}'`);
                            }
                            this.definitions[definitionsKey.value] = definition;
                        }
                        break;
                    }
                    default:
                        key.assertUnexpectedValue(`${template_constants_1.TEMPLATE_SCHEMA} key`); // throws
                        break;
                }
            }
        }
    }
    /**
     * Looks up a definition by name
     */
    getDefinition(name) {
        const result = this.definitions[name];
        if (result) {
            return result;
        }
        throw new Error(`Schema definition '${name}' not found`);
    }
    /**
     * Expands one-of definitions and returns all scalar definitions
     */
    getScalarDefinitions(definition) {
        const result = [];
        switch (definition.definitionType) {
            case DefinitionType.Null:
            case DefinitionType.Boolean:
            case DefinitionType.Number:
            case DefinitionType.String:
                result.push(definition);
                break;
            case DefinitionType.OneOf: {
                const oneOf = definition;
                for (const nestedName of oneOf.oneOf) {
                    const nestedDefinition = this.getDefinition(nestedName);
                    switch (nestedDefinition.definitionType) {
                        case DefinitionType.Null:
                        case DefinitionType.Boolean:
                        case DefinitionType.Number:
                        case DefinitionType.String:
                            result.push(nestedDefinition);
                            break;
                    }
                }
                break;
            }
        }
        return result;
    }
    /**
     * Expands one-of definitions and returns all matching definitions by type
     */
    getDefinitionsOfType(definition, type) {
        const result = [];
        if (definition.definitionType === type) {
            result.push(definition);
        }
        else if (definition.definitionType === DefinitionType.OneOf) {
            const oneOf = definition;
            for (const nestedName of oneOf.oneOf) {
                const nestedDefinition = this.getDefinition(nestedName);
                if (nestedDefinition.definitionType === type) {
                    result.push(nestedDefinition);
                }
            }
        }
        return result;
    }
    /**
     * Attempts match the property name to a property defined by any of the specified definitions.
     * If matched, any unmatching definitions are filtered from the definitions array.
     * Returns the type information for the matched property.
     */
    matchPropertyAndFilter(definitions, propertyName) {
        let result;
        // Check for a matching well-known property
        let notFoundInSome = false;
        for (const definition of definitions) {
            const propertyValue = definition.properties[propertyName];
            if (propertyValue) {
                result = propertyValue.type;
            }
            else {
                notFoundInSome = true;
            }
        }
        // Filter the matched definitions if needed
        if (result && notFoundInSome) {
            for (let i = 0; i < definitions.length;) {
                if (definitions[i].properties[propertyName]) {
                    i++;
                }
                else {
                    definitions.splice(i, 1);
                }
            }
        }
        return result;
    }
    validate() {
        const oneOfDefinitions = {};
        for (const name of Object.keys(this.definitions)) {
            if (!name.match(TemplateSchema._definitionNamePattern)) {
                throw new Error(`Invalid definition name '${name}'`);
            }
            const definition = this.definitions[name];
            // Delay validation for 'one-of' definitions
            if (definition.definitionType === DefinitionType.OneOf) {
                oneOfDefinitions[name] = definition;
            }
            // Otherwise validate now
            else {
                definition.validate(this, name);
            }
        }
        // Validate 'one-of' definitions
        for (const name of Object.keys(oneOfDefinitions)) {
            const oneOf = oneOfDefinitions[name];
            oneOf.validate(this, name);
        }
    }
    /**
     * Loads a user-defined schema file
     */
    static load(objectReader) {
        const context = new template_context_1.TemplateContext(new template_context_1.TemplateValidationErrors(10, 500), new template_memory_1.TemplateMemory(50, 1048576), TemplateSchema.getInternalSchema(), new trace_writer_1.NoOperationTraceWriter());
        const readTemplateResult = (0, template_reader_1.readTemplate)(context, template_constants_1.TEMPLATE_SCHEMA, objectReader, undefined);
        context.errors.check();
        const mapping = readTemplateResult.value.assertMapping(template_constants_1.TEMPLATE_SCHEMA);
        const schema = new TemplateSchema(mapping);
        schema.validate();
        return schema;
    }
    /**
     * Gets the internal schema used for reading user-defined schema files
     */
    static getInternalSchema() {
        if (TemplateSchema._internalSchema === undefined) {
            const schema = new TemplateSchema();
            // template-schema
            let mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.VERSION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.DEFINITIONS] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.DEFINITIONS));
            schema.definitions[template_constants_1.TEMPLATE_SCHEMA] = mappingDefinition;
            // definitions
            mappingDefinition = new MappingDefinition();
            mappingDefinition.looseKeyType = template_constants_1.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = template_constants_1.DEFINITION;
            schema.definitions[template_constants_1.DEFINITIONS] = mappingDefinition;
            // definition
            let oneOfDefinition = new OneOfDefinition();
            oneOfDefinition.oneOf.push(template_constants_1.NULL_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.BOOLEAN_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.NUMBER_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.STRING_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.SEQUENCE_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.MAPPING_DEFINITION);
            oneOfDefinition.oneOf.push(template_constants_1.ONE_OF_DEFINITION);
            schema.definitions[template_constants_1.DEFINITION] = oneOfDefinition;
            // null-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.NULL] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NULL_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.NULL_DEFINITION] = mappingDefinition;
            // null-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.NULL_DEFINITION_PROPERTIES] = mappingDefinition;
            // boolean-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.BOOLEAN] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.BOOLEAN_DEFINITION] = mappingDefinition;
            // boolean-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.BOOLEAN_DEFINITION_PROPERTIES] = mappingDefinition;
            // number-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.NUMBER] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NUMBER_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.NUMBER_DEFINITION] = mappingDefinition;
            // number-definition-properties
            mappingDefinition = new MappingDefinition();
            schema.definitions[template_constants_1.NUMBER_DEFINITION_PROPERTIES] = mappingDefinition;
            // string-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.STRING] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.STRING_DEFINITION] = mappingDefinition;
            // string-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.CONSTANT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.IGNORE_CASE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            mappingDefinition.properties[template_constants_1.REQUIRE_NON_EMPTY] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            schema.definitions[template_constants_1.STRING_DEFINITION_PROPERTIES] = mappingDefinition;
            // sequence-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.SEQUENCE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.SEQUENCE_DEFINITION] = mappingDefinition;
            // sequence-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.ITEM_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            schema.definitions[template_constants_1.SEQUENCE_DEFINITION_PROPERTIES] = mappingDefinition;
            // mapping-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.MAPPING] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.MAPPING_DEFINITION_PROPERTIES));
            schema.definitions[template_constants_1.MAPPING_DEFINITION] = mappingDefinition;
            // mapping-definition-properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.PROPERTIES] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.PROPERTIES));
            mappingDefinition.properties[template_constants_1.LOOSE_KEY_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.LOOSE_VALUE_TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            schema.definitions[template_constants_1.MAPPING_DEFINITION_PROPERTIES] = mappingDefinition;
            // properties
            mappingDefinition = new MappingDefinition();
            mappingDefinition.looseKeyType = template_constants_1.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = template_constants_1.PROPERTY_VALUE;
            schema.definitions[template_constants_1.PROPERTIES] = mappingDefinition;
            // property-value
            oneOfDefinition = new OneOfDefinition();
            oneOfDefinition.oneOf.push(template_constants_1.NON_EMPTY_STRING);
            oneOfDefinition.oneOf.push(template_constants_1.MAPPING_PROPERTY_VALUE);
            schema.definitions[template_constants_1.PROPERTY_VALUE] = oneOfDefinition;
            // mapping-property-value
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.TYPE] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.REQUIRED] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.BOOLEAN));
            schema.definitions[template_constants_1.MAPPING_PROPERTY_VALUE] = mappingDefinition;
            // one-of-definition
            mappingDefinition = new MappingDefinition();
            mappingDefinition.properties[template_constants_1.DESCRIPTION] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.STRING));
            mappingDefinition.properties[template_constants_1.CONTEXT] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            mappingDefinition.properties[template_constants_1.ONE_OF] = new PropertyValue(new tokens_1.StringToken(undefined, undefined, undefined, template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING));
            schema.definitions[template_constants_1.ONE_OF_DEFINITION] = mappingDefinition;
            // non-empty-string
            const stringDefinition = new StringDefinition();
            stringDefinition.requireNonEmpty = true;
            schema.definitions[template_constants_1.NON_EMPTY_STRING] = stringDefinition;
            // sequence-of-non-empty-string
            const sequenceDefinition = new SequenceDefinition();
            sequenceDefinition.itemType = template_constants_1.NON_EMPTY_STRING;
            schema.definitions[template_constants_1.SEQUENCE_OF_NON_EMPTY_STRING] = sequenceDefinition;
            schema.validate();
            TemplateSchema._internalSchema = schema;
        }
        return TemplateSchema._internalSchema;
    }
}
exports.TemplateSchema = TemplateSchema;
TemplateSchema._definitionNamePattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
/**
 * Defines the allowable schema for a user defined type
 */
class Definition {
    constructor(definition) {
        /**
         * Used by the template reader to determine allowed expression values and functions.
         * Also used by the template reader to validate function min/max parameters.
         */
        this.readerContext = [];
        /**
         * Used by the template evaluator to determine allowed expression values and functions.
         * The min/max parameter info is omitted.
         */
        this.evaluatorContext = [];
        if (definition) {
            for (let i = 0; i < definition.count;) {
                const definitionKey = definition
                    .get(i)
                    .key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.CONTEXT: {
                        const context = definition
                            .get(i)
                            .value.assertSequence(`${template_constants_1.DEFINITION} ${template_constants_1.CONTEXT}`);
                        definition.remove(i);
                        const seenReaderContext = {};
                        const seenEvaluatorContext = {};
                        for (let j = 0; j < context.count; j++) {
                            const itemStr = context
                                .get(j)
                                .assertString(`${template_constants_1.CONTEXT} item`).value;
                            const upperItemStr = itemStr.toUpperCase();
                            if (seenReaderContext[upperItemStr]) {
                                throw new Error(`Duplicate context item '${itemStr}'`);
                            }
                            seenReaderContext[upperItemStr] = true;
                            this.readerContext.push(itemStr);
                            // Remove min/max parameter info
                            const paramIndex = itemStr.indexOf("(");
                            const modifiedItemStr = paramIndex > 0
                                ? itemStr.substr(0, paramIndex + 1) + ")"
                                : itemStr;
                            const upperModifiedItemStr = modifiedItemStr.toUpperCase();
                            if (seenEvaluatorContext[upperModifiedItemStr]) {
                                throw new Error(`Duplicate context item '${modifiedItemStr}'`);
                            }
                            seenEvaluatorContext[upperModifiedItemStr] = true;
                            this.evaluatorContext.push(modifiedItemStr);
                        }
                        break;
                    }
                    case template_constants_1.DESCRIPTION: {
                        definition.remove(i);
                        break;
                    }
                    default: {
                        i++;
                        break;
                    }
                }
            }
        }
    }
}
exports.Definition = Definition;
class ScalarDefinition extends Definition {
    constructor(definition) {
        super(definition);
    }
}
exports.ScalarDefinition = ScalarDefinition;
class NullDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.NULL: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.NULL}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.NULL} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.NULL} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Null;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.NULL_TYPE;
    }
    validate(schema, name) { }
}
exports.NullDefinition = NullDefinition;
class BooleanDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.BOOLEAN: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.BOOLEAN} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Boolean;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.BOOLEAN_TYPE;
    }
    validate(schema, name) { }
}
exports.BooleanDefinition = BooleanDefinition;
class NumberDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.NUMBER: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER} key`);
                            switch (mappingKey.value) {
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.NUMBER} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Number;
    }
    isMatch(literal) {
        return literal.templateTokenType === tokens_1.NUMBER_TYPE;
    }
    validate(schema, name) { }
}
exports.NumberDefinition = NumberDefinition;
class StringDefinition extends ScalarDefinition {
    constructor(definition) {
        super(definition);
        this.constant = "";
        this.ignoreCase = false;
        this.requireNonEmpty = false;
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.STRING: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.STRING}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.CONSTANT: {
                                    const constantStringToken = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.CONSTANT}`);
                                    this.constant = constantStringToken.value;
                                    break;
                                }
                                case template_constants_1.IGNORE_CASE: {
                                    const ignoreCaseBooleanToken = mappingPair.value.assertBoolean(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.IGNORE_CASE}`);
                                    this.ignoreCase = ignoreCaseBooleanToken.value;
                                    break;
                                }
                                case template_constants_1.REQUIRE_NON_EMPTY: {
                                    const requireNonEmptyBooleanToken = mappingPair.value.assertBoolean(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} ${template_constants_1.REQUIRE_NON_EMPTY}`);
                                    this.requireNonEmpty = requireNonEmptyBooleanToken.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.STRING} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.String;
    }
    isMatch(literal) {
        if (literal.templateTokenType === tokens_1.STRING_TYPE) {
            const value = literal.value;
            if (this.constant) {
                return this.ignoreCase
                    ? this.constant.toUpperCase() === value.toUpperCase()
                    : this.constant === value;
            }
            else if (this.requireNonEmpty) {
                return !!value;
            }
            else {
                return true;
            }
        }
        return false;
    }
    validate(schema, name) {
        if (this.constant && this.requireNonEmpty) {
            throw new Error(`Properties '${template_constants_1.CONSTANT}' and '${template_constants_1.REQUIRE_NON_EMPTY}' cannot both be set`);
        }
    }
}
exports.StringDefinition = StringDefinition;
class SequenceDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.itemType = "";
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.SEQUENCE: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.ITEM_TYPE: {
                                    const itemType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} ${template_constants_1.ITEM_TYPE}`);
                                    this.itemType = itemType.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.SEQUENCE} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Sequence;
    }
    validate(schema, name) {
        if (!this.itemType) {
            throw new Error(`'${name}' does not defined '${template_constants_1.ITEM_TYPE}'`);
        }
        // Lookup item type
        schema.getDefinition(this.itemType);
    }
}
exports.SequenceDefinition = SequenceDefinition;
class MappingDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.properties = {};
        this.looseKeyType = "";
        this.looseValueType = "";
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.MAPPING: {
                        const mapping = definitionPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING}`);
                        for (let j = 0; j < mapping.count; j++) {
                            const mappingPair = mapping.get(j);
                            const mappingKey = mappingPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} key`);
                            switch (mappingKey.value) {
                                case template_constants_1.PROPERTIES: {
                                    const properties = mappingPair.value.assertMapping(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.PROPERTIES}`);
                                    for (let k = 0; k < properties.count; k++) {
                                        const propertiesPair = properties.get(k);
                                        const propertyName = propertiesPair.key.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.PROPERTIES} key`);
                                        this.properties[propertyName.value] = new PropertyValue(propertiesPair.value);
                                    }
                                    break;
                                }
                                case template_constants_1.LOOSE_KEY_TYPE: {
                                    const looseKeyType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.LOOSE_KEY_TYPE}`);
                                    this.looseKeyType = looseKeyType.value;
                                    break;
                                }
                                case template_constants_1.LOOSE_VALUE_TYPE: {
                                    const looseValueType = mappingPair.value.assertString(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} ${template_constants_1.LOOSE_VALUE_TYPE}`);
                                    this.looseValueType = looseValueType.value;
                                    break;
                                }
                                default:
                                    mappingKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} ${template_constants_1.MAPPING} key`); // throws
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.Mapping;
    }
    validate(schema, name) {
        // Lookup loose key type
        if (this.looseKeyType) {
            schema.getDefinition(this.looseKeyType);
            // Lookup loose value type
            if (this.looseValueType) {
                schema.getDefinition(this.looseValueType);
            }
            else {
                throw new Error(`Property '${template_constants_1.LOOSE_KEY_TYPE}' is defined but '${template_constants_1.LOOSE_VALUE_TYPE}' is not defined on '${name}'`);
            }
        }
        // Otherwise validate loose value type not be defined
        else if (this.looseValueType) {
            throw new Error(`Property '${template_constants_1.LOOSE_VALUE_TYPE}' is defined but '${template_constants_1.LOOSE_KEY_TYPE}' is not defined on '${name}'`);
        }
        // Lookup each property
        for (const propertyName of Object.keys(this.properties)) {
            const propertyValue = this.properties[propertyName];
            if (!propertyValue.type) {
                throw new Error(`Type not specified for the property '${propertyName}' on '${name}'`);
            }
            schema.getDefinition(propertyValue.type);
        }
    }
}
exports.MappingDefinition = MappingDefinition;
class PropertyValue {
    constructor(token) {
        this.type = "";
        this.required = false;
        if (token.templateTokenType === tokens_1.STRING_TYPE) {
            this.type = token.value;
        }
        else {
            const mapping = token.assertMapping(template_constants_1.MAPPING_PROPERTY_VALUE);
            for (let i = 0; i < mapping.count; i++) {
                const mappingPair = mapping.get(i);
                const mappingKey = mappingPair.key.assertString(`${template_constants_1.MAPPING_PROPERTY_VALUE} key`);
                switch (mappingKey.value) {
                    case template_constants_1.TYPE:
                        this.type = mappingPair.value.assertString(`${template_constants_1.MAPPING_PROPERTY_VALUE} ${template_constants_1.TYPE}`).value;
                        break;
                    case template_constants_1.REQUIRED:
                        this.required = mappingPair.value.assertBoolean(`${template_constants_1.MAPPING_PROPERTY_VALUE} ${template_constants_1.REQUIRED}`).value;
                        break;
                    default:
                        mappingKey.assertUnexpectedValue(`${template_constants_1.MAPPING_PROPERTY_VALUE} key`); // throws
                }
            }
        }
    }
}
exports.PropertyValue = PropertyValue;
/**
 * Must resolve to exactly one of the referenced definitions
 */
class OneOfDefinition extends Definition {
    constructor(definition) {
        super(definition);
        this.oneOf = [];
        if (definition) {
            for (let i = 0; i < definition.count; i++) {
                const definitionPair = definition.get(i);
                const definitionKey = definitionPair.key.assertString(`${template_constants_1.DEFINITION} key`);
                switch (definitionKey.value) {
                    case template_constants_1.ONE_OF: {
                        const oneOf = definitionPair.value.assertSequence(`${template_constants_1.DEFINITION} ${template_constants_1.ONE_OF}`);
                        for (let j = 0; j < oneOf.count; j++) {
                            const oneOfItem = oneOf
                                .get(j)
                                .assertString(`${template_constants_1.DEFINITION} ${template_constants_1.ONE_OF} item`);
                            this.oneOf.push(oneOfItem.value);
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${template_constants_1.DEFINITION} key`); // throws
                        break;
                }
            }
        }
    }
    get definitionType() {
        return DefinitionType.OneOf;
    }
    validate(schema, name) {
        if (this.oneOf.length === 0) {
            throw new Error(`'${name}' does not contain any references`);
        }
        let foundLooseKeyType = false;
        const mappingDefinitions = [];
        let sequenceDefinition;
        let nullDefinition;
        let booleanDefinition;
        let numberDefinition;
        const stringDefinitions = [];
        const seenNestedTypes = {};
        for (const nestedType of this.oneOf) {
            if (seenNestedTypes[nestedType]) {
                throw new Error(`'${name}' contains duplicate nested type '${nestedType}'`);
            }
            seenNestedTypes[nestedType] = true;
            const nestedDefinition = schema.getDefinition(nestedType);
            if (nestedDefinition.readerContext.length > 0) {
                throw new Error(`'${name}' is a one-of definition and references another definition that defines context. This is currently not supported.`);
            }
            switch (nestedDefinition.definitionType) {
                case DefinitionType.Mapping: {
                    const mappingDefinition = nestedDefinition;
                    mappingDefinitions.push(mappingDefinition);
                    if (mappingDefinition.looseKeyType) {
                        foundLooseKeyType = true;
                    }
                    break;
                }
                case DefinitionType.Sequence: {
                    // Multiple sequence definitions not allowed
                    if (sequenceDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.SEQUENCE}'`);
                    }
                    sequenceDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Null: {
                    // Multiple null definitions not allowed
                    if (nullDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.NULL}'`);
                    }
                    nullDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Boolean: {
                    // Multiple boolean definitions not allowed
                    if (booleanDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.BOOLEAN}'`);
                    }
                    booleanDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.Number: {
                    // Multiple number definitions not allowed
                    if (numberDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${template_constants_1.NUMBER}'`);
                    }
                    numberDefinition = nestedDefinition;
                    break;
                }
                case DefinitionType.String: {
                    const stringDefinition = nestedDefinition;
                    // Multiple string definitions
                    if (stringDefinitions.length > 0 &&
                        (!stringDefinitions[0].constant || !stringDefinition.constant)) {
                        throw new Error(`'${name}' refers to more than one '${template_constants_1.SCALAR}', but some do not set '${template_constants_1.CONSTANT}'`);
                    }
                    stringDefinitions.push(stringDefinition);
                    break;
                }
                default:
                    throw new Error(`'${name}' refers to a definition with type '${nestedDefinition.definitionType}'`);
            }
        }
        if (mappingDefinitions.length > 1) {
            if (foundLooseKeyType) {
                throw new Error(`'${name}' refers to two mappings and at least one sets '${template_constants_1.LOOSE_KEY_TYPE}'. This is not currently supported.`);
            }
            const seenProperties = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const propertyName of Object.keys(mappingDefinition.properties)) {
                    const newPropertyValue = mappingDefinition.properties[propertyName];
                    // Already seen
                    const existingPropertyValue = seenProperties[propertyName];
                    if (existingPropertyValue) {
                        // Types match
                        if (existingPropertyValue.type === newPropertyValue.type) {
                            continue;
                        }
                        // Collision
                        throw new Error(`'${name}' contains two mappings with the same property, but each refers to a different type. All matching properties must refer to the same type.`);
                    }
                    // New
                    else {
                        seenProperties[propertyName] = newPropertyValue;
                    }
                }
            }
        }
    }
}
exports.OneOfDefinition = OneOfDefinition;
//# sourceMappingURL=schema.js.map

/***/ }),

/***/ 5029:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VERSION = exports.TEMPLATE_SCHEMA = exports.STRUCTURE = exports.STRING_DEFINITION_PROPERTIES = exports.STRING_DEFINITION = exports.STRING = exports.SEQUENCE_OF_NON_EMPTY_STRING = exports.TYPE = exports.SEQUENCE_DEFINITION_PROPERTIES = exports.SEQUENCE_DEFINITION = exports.SEQUENCE = exports.SCALAR = exports.REQUIRE_NON_EMPTY = exports.REQUIRED = exports.PROPERTIES = exports.PROPERTY_VALUE = exports.OPEN_EXPRESSION = exports.ONE_OF_DEFINITION = exports.ONE_OF = exports.NUMBER_DEFINITION_PROPERTIES = exports.NUMBER_DEFINITION = exports.NUMBER = exports.NULL_DEFINITION_PROPERTIES = exports.NULL_DEFINITION = exports.NULL = exports.NON_EMPTY_STRING = exports.MAPPING_PROPERTY_VALUE = exports.MAPPING_DEFINITION_PROPERTIES = exports.MAPPING_DEFINITION = exports.MAPPING = exports.MAX_CONSTANT = exports.LOOSE_VALUE_TYPE = exports.LOOSE_KEY_TYPE = exports.ITEM_TYPE = exports.INSERT_DIRECTIVE = exports.IGNORE_CASE = exports.DESCRIPTION = exports.DEFINITIONS = exports.DEFINITION = exports.CONTEXT = exports.CONSTANT = exports.CLOSE_EXPRESSION = exports.BOOLEAN_DEFINITION_PROPERTIES = exports.BOOLEAN_DEFINITION = exports.BOOLEAN = exports.ANY = void 0;
exports.ANY = "any";
exports.BOOLEAN = "boolean";
exports.BOOLEAN_DEFINITION = "boolean-definition";
exports.BOOLEAN_DEFINITION_PROPERTIES = "boolean-definition-properties";
exports.CLOSE_EXPRESSION = "}}";
exports.CONSTANT = "constant";
exports.CONTEXT = "context";
exports.DEFINITION = "definition";
exports.DEFINITIONS = "definitions";
exports.DESCRIPTION = "description";
exports.IGNORE_CASE = "ignore-case";
exports.INSERT_DIRECTIVE = "insert";
exports.ITEM_TYPE = "item-type";
exports.LOOSE_KEY_TYPE = "loose-key-type";
exports.LOOSE_VALUE_TYPE = "loose-value-type";
exports.MAX_CONSTANT = "MAX";
exports.MAPPING = "mapping";
exports.MAPPING_DEFINITION = "mapping-definition";
exports.MAPPING_DEFINITION_PROPERTIES = "mapping-definition-properties";
exports.MAPPING_PROPERTY_VALUE = "mapping-property-value";
exports.NON_EMPTY_STRING = "non-empty-string";
exports.NULL = "null";
exports.NULL_DEFINITION = "null-definition";
exports.NULL_DEFINITION_PROPERTIES = "null-definition-properties";
exports.NUMBER = "number";
exports.NUMBER_DEFINITION = "number-definition";
exports.NUMBER_DEFINITION_PROPERTIES = "number-definition-properties";
exports.ONE_OF = "one-of";
exports.ONE_OF_DEFINITION = "one-of-definition";
exports.OPEN_EXPRESSION = "${{";
exports.PROPERTY_VALUE = "property-value";
exports.PROPERTIES = "properties";
exports.REQUIRED = "required";
exports.REQUIRE_NON_EMPTY = "require-non-empty";
exports.SCALAR = "scalar";
exports.SEQUENCE = "sequence";
exports.SEQUENCE_DEFINITION = "sequence-definition";
exports.SEQUENCE_DEFINITION_PROPERTIES = "sequence-definition-properties";
exports.TYPE = "type";
exports.SEQUENCE_OF_NON_EMPTY_STRING = "sequence-of-non-empty-string";
exports.STRING = "string";
exports.STRING_DEFINITION = "string-definition";
exports.STRING_DEFINITION_PROPERTIES = "string-definition-properties";
exports.STRUCTURE = "structure";
exports.TEMPLATE_SCHEMA = "template-schema";
exports.VERSION = "version";
//# sourceMappingURL=template-constants.js.map

/***/ }),

/***/ 389:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateValidationError = exports.TemplateValidationErrors = exports.TemplateContext = void 0;
/**
 * Context object that is flowed through while loading and evaluating object templates
 */
class TemplateContext {
    constructor(errors, memory, schema, trace) {
        this._fileIds = {};
        this._fileNames = [];
        /**
         * Available functions within expression contexts
         */
        this.expressionFunctions = [];
        /**
         * Available values within expression contexts
         */
        this.expressionNamedContexts = [];
        this.state = {};
        this.errors = errors;
        this.memory = memory;
        this.schema = schema;
        this.trace = trace;
    }
    error(tokenOrFileId, err) {
        var _a, _b, _c;
        const token = tokenOrFileId;
        const prefix = this.getErrorPrefix((_a = token === null || token === void 0 ? void 0 : token.file) !== null && _a !== void 0 ? _a : tokenOrFileId, token === null || token === void 0 ? void 0 : token.line, token === null || token === void 0 ? void 0 : token.col);
        let message = (_c = (_b = err) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : `${err}`;
        if (prefix) {
            message = `${prefix} ${message}`;
        }
        this.errors.addFromMessage(message);
        this.trace.error(message);
    }
    /**
     * Gets or adds the file ID
     */
    getFileId(file) {
        const key = file.toUpperCase();
        let id = this._fileIds[key];
        if (id === undefined) {
            id = this._fileNames.length + 1;
            this._fileIds[key] = id;
            this._fileNames.push(file);
            this.memory.addString(file);
        }
        return id;
    }
    /**
     * Looks up a file name by ID. Returns undefined if not found.
     */
    getFileName(fileId) {
        return this._fileNames.length >= fileId
            ? this._fileNames[fileId - 1]
            : undefined;
    }
    /**
     * Gets a copy of the file table
     */
    getFileTable() {
        return this._fileNames.slice();
    }
    getErrorPrefix(fileId, line, column) {
        const fileName = fileId !== undefined ? this.getFileName(fileId) : undefined;
        if (fileName) {
            if (line !== undefined && column !== undefined) {
                return `${fileName} (Line: ${line}, Col: ${column})`;
            }
            else {
                return fileName;
            }
        }
        else if (line !== undefined && column !== undefined) {
            return `(Line: ${line}, Col: ${column})`;
        }
        else {
            return "";
        }
    }
}
exports.TemplateContext = TemplateContext;
/**
 * Provides information about errors which occurred during validation
 */
class TemplateValidationErrors {
    constructor(maxErrors, maxMessageLength) {
        this._errors = [];
        this._maxErrors = maxErrors !== null && maxErrors !== void 0 ? maxErrors : 0;
        this._maxMessageLength = maxMessageLength !== null && maxMessageLength !== void 0 ? maxMessageLength : 0;
    }
    get count() {
        return this._errors.length;
    }
    addFromMessage(message) {
        this.add(new TemplateValidationError(message));
    }
    addFromError(err, messagePrefix) {
        var _a;
        let message = ((_a = err) === null || _a === void 0 ? void 0 : _a.message) || `${err}`;
        if (messagePrefix) {
            message = `${messagePrefix} ${message}`;
        }
        this.add(new TemplateValidationError(message));
    }
    add(err) {
        const errs = Object.prototype.hasOwnProperty.call(err, "length")
            ? err
            : [err];
        for (let e of errs) {
            // Check max errors
            if (this._maxErrors <= 0 || this._errors.length < this._maxErrors) {
                // Check max message length
                if (this._maxMessageLength > 0 &&
                    e.message.length > this._maxMessageLength) {
                    e = new TemplateValidationError(e.message.substr(0, this._maxMessageLength) + "[...]", e.code);
                }
                this._errors.push(e);
            }
        }
    }
    /**
     * Throws if any errors
     * @param prefix The error message prefix
     */
    check(prefix) {
        if (this._errors.length <= 0) {
            return;
        }
        if (!prefix) {
            prefix = "The template is not valid.";
        }
        throw new Error(`${prefix} ${this._errors.map((x) => x.message).join(",")}`);
    }
    clear() {
        this._errors = [];
    }
    getErrors() {
        return this._errors.slice();
    }
}
exports.TemplateValidationErrors = TemplateValidationErrors;
/**
 * Provides information about an error which occurred during validation
 */
class TemplateValidationError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}
exports.TemplateValidationError = TemplateValidationError;
//# sourceMappingURL=template-context.js.map

/***/ }),

/***/ 8828:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// called at runtime. expands expressions and re-validates the schema result after expansion
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateTemplate = void 0;
const schema_1 = __nccwpck_require__(3032);
const template_constants_1 = __nccwpck_require__(5029);
const template_unraveler_1 = __nccwpck_require__(1531);
const tokens_1 = __nccwpck_require__(7603);
function evaluateTemplate(context, type, template, removeBytes, fileId) {
    let result;
    const evaluator = new TemplateEvaluator(context, template, removeBytes);
    try {
        const definitionInfo = new DefinitionInfo(context, type);
        result = evaluator.evaluate(definitionInfo);
        if (result) {
            evaluator.unraveler.readEnd();
        }
    }
    catch (err) {
        context.error(fileId, err);
        result = undefined;
    }
    return result;
}
exports.evaluateTemplate = evaluateTemplate;
class TemplateEvaluator {
    constructor(context, template, removeBytes) {
        this.context = context;
        this.schema = context.schema;
        this.unraveler = new template_unraveler_1.TemplateUnraveler(context, template, removeBytes);
    }
    evaluate(definition) {
        // Scalar
        const scalar = this.unraveler.allowScalar(definition.expand);
        if (scalar) {
            if (scalar.isLiteral) {
                return this.validate(scalar, definition);
            }
            else {
                return scalar;
            }
        }
        // Sequence
        const sequence = this.unraveler.allowSequenceStart(definition.expand);
        if (sequence) {
            const sequenceDefinition = definition.getDefinitionsOfType(schema_1.DefinitionType.Sequence)[0];
            // Legal
            if (sequenceDefinition) {
                const itemDefinition = new DefinitionInfo(definition, sequenceDefinition.itemType);
                // Add each item
                while (!this.unraveler.allowSequenceEnd(definition.expand)) {
                    const item = this.evaluate(itemDefinition);
                    sequence.add(item);
                }
            }
            // Illegal
            else {
                // Error
                this.context.error(sequence, "A sequence was not expected");
                // Skip each item
                while (!this.unraveler.allowSequenceEnd(false)) {
                    this.unraveler.skipSequenceItem();
                }
            }
            return sequence;
        }
        // Mapping
        const mapping = this.unraveler.allowMappingStart(definition.expand);
        if (mapping) {
            const mappingDefinitions = definition.getDefinitionsOfType(schema_1.DefinitionType.Mapping);
            // Legal
            if (mappingDefinitions.length > 0) {
                if (mappingDefinitions.length > 1 ||
                    Object.keys(mappingDefinitions[0].properties).length > 0 ||
                    !mappingDefinitions[0].looseKeyType) {
                    this.handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping);
                }
                else {
                    const keyDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseKeyType);
                    const valueDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseValueType);
                    this.handleMappingWithAllLooseProperties(definition, keyDefinition, valueDefinition, mapping);
                }
            }
            // Illegal
            else {
                this.context.error(mapping, "A mapping was not expected");
                while (!this.unraveler.allowMappingEnd(false)) {
                    this.unraveler.skipMappingKey();
                    this.unraveler.skipMappingValue();
                }
            }
            return mapping;
        }
        throw new Error("Expected a scalar value, a sequence, or a mapping");
    }
    handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping) {
        var _a;
        // Check if loose properties are allowed
        let looseKeyType;
        let looseValueType;
        let looseKeyDefinition;
        let looseValueDefinition;
        if (mappingDefinitions[0].looseKeyType) {
            looseKeyType = mappingDefinitions[0].looseKeyType;
            looseValueType = mappingDefinitions[0].looseValueType;
        }
        const upperKeys = {};
        let hasExpressionKey = false;
        let nextKeyScalar;
        while ((nextKeyScalar = this.unraveler.allowScalar(definition.expand))) {
            // Expression
            if (nextKeyScalar.isExpression) {
                hasExpressionKey = true;
                const anyDefinition = new DefinitionInfo(definition, template_constants_1.ANY);
                mapping.add(nextKeyScalar, this.evaluate(anyDefinition));
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this.context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.unraveler.skipMappingValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Well known
            const nextValueType = this.schema.matchPropertyAndFilter(mappingDefinitions, nextKey.value);
            if (nextValueType) {
                const nextValueDefinition = new DefinitionInfo(definition, nextValueType);
                const nextValue = this.evaluate(nextValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Loose
            if (looseKeyType) {
                if (!looseKeyDefinition) {
                    looseKeyDefinition = new DefinitionInfo(definition, looseKeyType);
                    looseValueDefinition = new DefinitionInfo(definition, looseValueType);
                }
                this.validate(nextKey, looseKeyDefinition);
                const nextValue = this.evaluate(looseValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Error
            this.context.error(nextKey, `Unexpected value '${nextKey.value}'`);
            this.unraveler.skipMappingValue();
        }
        // Unable to filter to one definition
        if (mappingDefinitions.length > 1) {
            const hitCount = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const key of Object.keys(mappingDefinition.properties)) {
                    hitCount[key] = ((_a = hitCount[key]) !== null && _a !== void 0 ? _a : 0) + 1;
                }
            }
            const nonDuplicates = [];
            for (const key of Object.keys(hitCount)) {
                if (hitCount[key] === 1) {
                    nonDuplicates.push(key);
                }
            }
            this.context.error(mapping, `There's not enough info to determine what you meant. Add one of these properties: ${nonDuplicates
                .sort()
                .join(", ")}`);
        }
        // Check required properties
        else if (mappingDefinitions.length === 1 && !hasExpressionKey) {
            for (const propertyName of Object.keys(mappingDefinitions[0].properties)) {
                const propertyValue = mappingDefinitions[0].properties[propertyName];
                if (propertyValue.required && !upperKeys[propertyName.toUpperCase()]) {
                    this.context.error(mapping, `Required property is missing: ${propertyName}`);
                }
            }
        }
        this.unraveler.readMappingEnd();
    }
    handleMappingWithAllLooseProperties(mappingDefinition, keyDefinition, valueDefinition, mapping) {
        const upperKeys = {};
        let nextKeyScalar;
        while ((nextKeyScalar = this.unraveler.allowScalar(mappingDefinition.expand))) {
            // Expression
            if (nextKeyScalar.isExpression) {
                if (nextKeyScalar.templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
                    mapping.add(nextKeyScalar, this.evaluate(valueDefinition));
                }
                else {
                    const anyDefinition = new DefinitionInfo(mappingDefinition, template_constants_1.ANY);
                    mapping.add(nextKeyScalar, this.evaluate(anyDefinition));
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this.context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.unraveler.skipMappingValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Validate
            this.validate(nextKey, keyDefinition);
            // Add the pair
            const nextValue = this.evaluate(valueDefinition);
            mapping.add(nextKey, nextValue);
        }
        this.unraveler.readMappingEnd();
    }
    validate(literal, definition) {
        // Legal
        const scalarDefinitions = definition.getScalarDefinitions();
        if (scalarDefinitions.some((x) => x.isMatch(literal))) {
            return literal;
        }
        // Not a string, convert
        if (literal.templateTokenType !== tokens_1.STRING_TYPE) {
            const stringLiteral = new tokens_1.StringToken(literal.file, literal.line, literal.col, literal.toString());
            // Legal
            if (scalarDefinitions.some((x) => x.isMatch(stringLiteral))) {
                return stringLiteral;
            }
        }
        // Illegal
        this.context.error(literal, `Unexpected value '${literal.toString()}'`);
        return literal;
    }
}
class DefinitionInfo {
    constructor(contextOrParent, name) {
        var _a, _b, _c, _d;
        this.isDefinitionInfo = true;
        // "parent" overload
        let parent;
        if (((_a = contextOrParent) === null || _a === void 0 ? void 0 : _a.isDefinitionInfo) === true) {
            parent = contextOrParent;
            this._schema = parent._schema;
            this._upperAvailable = parent._upperAvailable;
        }
        // "context" overload
        else {
            const context = contextOrParent;
            this._schema = context.schema;
            this._upperAvailable = {};
            for (const namedContext of context.expressionNamedContexts) {
                this._upperAvailable[namedContext.name.toUpperCase()] = true;
            }
            for (const func of context.expressionFunctions) {
                this._upperAvailable[`${func.name}()`.toUpperCase()] = true;
            }
        }
        // Lookup the definition
        this.definition = this._schema.getDefinition(name);
        // Record allowed context
        if (this.definition.evaluatorContext.length > 0) {
            this._allowed = [];
            this.expand = true;
            // Copy parent allowed context
            const upperSeen = {};
            for (const context of (_b = parent === null || parent === void 0 ? void 0 : parent._allowed) !== null && _b !== void 0 ? _b : []) {
                this._allowed.push(context);
                const upper = context.toUpperCase();
                upperSeen[upper] = true;
                if (!this._upperAvailable[upper]) {
                    this.expand = false;
                }
            }
            // Append context if unseen
            for (const context of this.definition.evaluatorContext) {
                const upper = context.toUpperCase();
                if (!upperSeen[upper]) {
                    this._allowed.push(context);
                    upperSeen[upper] = true;
                    if (!this._upperAvailable[upper])
                        [(this.expand = false)];
                }
            }
        }
        else {
            this._allowed = (_c = parent === null || parent === void 0 ? void 0 : parent._allowed) !== null && _c !== void 0 ? _c : [];
            this.expand = (_d = parent === null || parent === void 0 ? void 0 : parent.expand) !== null && _d !== void 0 ? _d : false;
        }
    }
    getScalarDefinitions() {
        return this._schema.getScalarDefinitions(this.definition);
    }
    getDefinitionsOfType(type) {
        return this._schema.getDefinitionsOfType(this.definition, type);
    }
}
//# sourceMappingURL=template-evaluator.js.map

/***/ }),

/***/ 2220:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateMemory = void 0;
const nodes_1 = __nccwpck_require__(1137);
const tokens_1 = __nccwpck_require__(7603);
/**
 * Tracks characteristics about the current memory usage (CPU, stack, size)
 */
class TemplateMemory {
    constructor(maxDepth, maxBytes) {
        this._currentDepth = 0;
        this._memoryCounter = new nodes_1.MemoryCounter(undefined, maxBytes);
        this.maxDepth = maxDepth;
        this.maxBytes = maxBytes;
    }
    get currentBytes() {
        return this._memoryCounter.currentBytes;
    }
    addAmount(bytes) {
        this._memoryCounter.addAmount(bytes);
    }
    addString(value) {
        this._memoryCounter.addString(value);
    }
    addToken(value, traverse) {
        this._memoryCounter.addAmount(TemplateMemory.calculateTokenBytes(value, traverse));
    }
    subtractAmount(bytes) {
        this._memoryCounter.subtractAmount(bytes);
    }
    subtractToken(value, traverse) {
        this._memoryCounter.subtractAmount(TemplateMemory.calculateTokenBytes(value, traverse));
    }
    incrementDepth() {
        if (this._currentDepth + 1 > this.maxDepth) {
            throw new Error("Maximum object depth exceeded");
        }
        this._currentDepth++;
    }
    decrementDepth() {
        if (this._currentDepth === 0) {
            throw new Error("Depth may not be decremented below zero");
        }
        this._currentDepth--;
    }
    static calculateTokenBytes(value, traverse) {
        let result = 0;
        for (const item of tokens_1.TemplateToken.traverse(value, traverse)) {
            // This measurement doesn't have to be perfect
            // https://codeblog.jonskeet.uk/2011/04/05/of-memory-and-strings/
            switch (item.templateTokenType) {
                case tokens_1.NULL_TYPE:
                case tokens_1.BOOLEAN_TYPE:
                case tokens_1.NUMBER_TYPE:
                    result += nodes_1.MemoryCounter.MIN_OBJECT_SIZE;
                    break;
                case tokens_1.STRING_TYPE: {
                    const stringToken = item;
                    result +=
                        nodes_1.MemoryCounter.MIN_OBJECT_SIZE +
                            nodes_1.MemoryCounter.calculateStringBytes(stringToken.value);
                    break;
                }
                case tokens_1.SEQUENCE_TYPE:
                case tokens_1.MAPPING_TYPE:
                case tokens_1.INSERT_EXPRESSION_TYPE:
                    // Min object size is good enough. Allows for base + a few fields.
                    result += nodes_1.MemoryCounter.MIN_OBJECT_SIZE;
                    break;
                case tokens_1.BASIC_EXPRESSION_TYPE: {
                    const basicExpression = item;
                    result +=
                        nodes_1.MemoryCounter.MIN_OBJECT_SIZE +
                            nodes_1.MemoryCounter.calculateStringBytes(basicExpression.expression);
                    break;
                }
                default:
                    throw new Error(`Unexpected template type '${item.templateTokenType}`);
            }
        }
        return result;
    }
}
exports.TemplateMemory = TemplateMemory;
//# sourceMappingURL=template-memory.js.map

/***/ }),

/***/ 6938:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// template-reader *just* does schema validation
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readTemplate = void 0;
const schema_1 = __nccwpck_require__(3032);
const template_constants_1 = __nccwpck_require__(5029);
const tokens_1 = __nccwpck_require__(7603);
const expressionUtility = __importStar(__nccwpck_require__(8548));
const WHITESPACE_PATTERN = /\s/;
function readTemplate(context, type, objectReader, fileId) {
    const reader = new TemplateReader(context, objectReader, fileId);
    const originalBytes = context.memory.currentBytes;
    let value;
    try {
        objectReader.validateStart();
        const definition = new DefinitionInfo(context.schema, type);
        value = reader.readValue(definition);
        objectReader.validateEnd();
    }
    catch (err) {
        context.error(fileId, err);
    }
    return {
        value: value,
        bytes: context.memory.currentBytes - originalBytes,
    };
}
exports.readTemplate = readTemplate;
class TemplateReader {
    constructor(context, objectReader, fileId) {
        this._context = context;
        this._schema = context.schema;
        this._memory = context.memory;
        this._objectReader = objectReader;
        this._fileId = fileId;
    }
    readValue(definition) {
        // Scalar
        const literal = this._objectReader.allowLiteral();
        if (literal) {
            let scalar = this.parseScalar(literal, definition.allowedContext);
            scalar = this.validate(scalar, definition);
            this._memory.addToken(scalar, false);
            return scalar;
        }
        // Sequence
        const sequence = this._objectReader.allowSequenceStart();
        if (sequence) {
            this._memory.incrementDepth();
            this._memory.addToken(sequence, false);
            const sequenceDefinition = definition.getDefinitionsOfType(schema_1.DefinitionType.Sequence)[0];
            // Legal
            if (sequenceDefinition) {
                const itemDefinition = new DefinitionInfo(definition, sequenceDefinition.itemType);
                // Add each item
                while (!this._objectReader.allowSequenceEnd()) {
                    const item = this.readValue(itemDefinition);
                    sequence.add(item);
                }
            }
            // Illegal
            else {
                // Error
                this._context.error(sequence, "A sequence was not expected");
                // Skip each item
                while (!this._objectReader.allowSequenceEnd()) {
                    this.skipValue();
                }
            }
            this._memory.decrementDepth();
            return sequence;
        }
        // Mapping
        const mapping = this._objectReader.allowMappingStart();
        if (mapping) {
            this._memory.incrementDepth();
            this._memory.addToken(mapping, false);
            const mappingDefinitions = definition.getDefinitionsOfType(schema_1.DefinitionType.Mapping);
            // Legal
            if (mappingDefinitions.length > 0) {
                if (mappingDefinitions.length > 1 ||
                    Object.keys(mappingDefinitions[0].properties).length > 0 ||
                    !mappingDefinitions[0].looseKeyType) {
                    this.handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping);
                }
                else {
                    const keyDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseKeyType);
                    const valueDefinition = new DefinitionInfo(definition, mappingDefinitions[0].looseValueType);
                    this.handleMappingWithAllLooseProperties(definition, keyDefinition, valueDefinition, mapping);
                }
            }
            // Illegal
            else {
                this._context.error(mapping, "A mapping was not expected");
                while (this._objectReader.allowMappingEnd()) {
                    this.skipValue();
                    this.skipValue();
                }
            }
            this._memory.decrementDepth();
            return mapping;
        }
        throw new Error("Expected a scalar value, a sequence, or a mapping");
    }
    handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping) {
        var _a;
        // Check if loose properties are allowed
        let looseKeyType;
        let looseValueType;
        let looseKeyDefinition;
        let looseValueDefinition;
        if (mappingDefinitions[0].looseKeyType) {
            looseKeyType = mappingDefinitions[0].looseKeyType;
            looseValueType = mappingDefinitions[0].looseValueType;
        }
        const upperKeys = {};
        let hasExpressionKey = false;
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, definition.allowedContext);
            // Expression
            if (nextKeyScalar.isExpression) {
                hasExpressionKey = true;
                // Legal
                if (definition.allowedContext.length > 0) {
                    this._memory.addToken(nextKeyScalar, false);
                    const anyDefinition = new DefinitionInfo(definition, template_constants_1.ANY);
                    mapping.add(nextKeyScalar, this.readValue(anyDefinition));
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.skipValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Well known
            const nextValueType = this._schema.matchPropertyAndFilter(mappingDefinitions, nextKey.value);
            if (nextValueType) {
                this._memory.addToken(nextKey, false);
                const nextValueDefinition = new DefinitionInfo(definition, nextValueType);
                const nextValue = this.readValue(nextValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Loose
            if (looseKeyType) {
                if (!looseKeyDefinition) {
                    looseKeyDefinition = new DefinitionInfo(definition, looseKeyType);
                    looseValueDefinition = new DefinitionInfo(definition, looseValueType);
                }
                this.validate(nextKey, looseKeyDefinition);
                this._memory.addToken(nextKey, false);
                const nextValue = this.readValue(looseValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Error
            this._context.error(nextKey, `Unexpected value '${nextKey.value}'`);
            this.skipValue();
        }
        // Unable to filter to one definition
        if (mappingDefinitions.length > 1) {
            const hitCount = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const key of Object.keys(mappingDefinition.properties)) {
                    hitCount[key] = ((_a = hitCount[key]) !== null && _a !== void 0 ? _a : 0) + 1;
                }
            }
            const nonDuplicates = [];
            for (const key of Object.keys(hitCount)) {
                if (hitCount[key] === 1) {
                    nonDuplicates.push(key);
                }
            }
            this._context.error(mapping, `There's not enough info to determine what you meant. Add one of these properties: ${nonDuplicates
                .sort()
                .join(", ")}`);
        }
        // Check required properties
        else if (mappingDefinitions.length === 1 && !hasExpressionKey) {
            for (const propertyName of Object.keys(mappingDefinitions[0].properties)) {
                const propertyValue = mappingDefinitions[0].properties[propertyName];
                if (propertyValue.required && !upperKeys[propertyName.toUpperCase()]) {
                    this._context.error(mapping, `Required property is missing: ${propertyName}`);
                }
            }
        }
        this.expectMappingEnd();
    }
    handleMappingWithAllLooseProperties(mappingDefinition, keyDefinition, valueDefinition, mapping) {
        let nextValue;
        const upperKeys = {};
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, mappingDefinition.allowedContext);
            // Expression
            if (nextKeyScalar.isExpression) {
                // Legal
                if (mappingDefinition.allowedContext.length > 0) {
                    this._memory.addToken(nextKeyScalar, false);
                    nextValue = this.readValue(valueDefinition);
                    mapping.add(nextKeyScalar, nextValue);
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === tokens_1.STRING_TYPE
                ? nextKeyScalar
                : new tokens_1.StringToken(nextKeyScalar.file, nextKeyScalar.line, nextKeyScalar.col, nextKeyScalar.toString());
            // Duplicate
            const upperKey = nextKey.value.toUpperCase();
            if (upperKeys[upperKey]) {
                this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                this.skipValue();
                continue;
            }
            upperKeys[upperKey] = true;
            // Validate
            this.validate(nextKey, keyDefinition);
            this._memory.addToken(nextKey, false);
            // Add the pair
            nextValue = this.readValue(valueDefinition);
            mapping.add(nextKey, nextValue);
        }
        this.expectMappingEnd();
    }
    expectMappingEnd() {
        if (!this._objectReader.allowMappingEnd()) {
            throw new Error("Expected mapping end"); // Should never happen
        }
    }
    skipValue() {
        // Scalar
        if (this._objectReader.allowLiteral()) {
            // Intentionally empty
        }
        // Sequence
        else if (this._objectReader.allowSequenceStart()) {
            this._memory.incrementDepth();
            while (!this._objectReader.allowSequenceEnd()) {
                this.skipValue();
            }
            this._memory.decrementDepth();
        }
        // Mapping
        else if (this._objectReader.allowMappingStart()) {
            this._memory.incrementDepth();
            while (!this._objectReader.allowMappingEnd()) {
                this.skipValue();
                this.skipValue();
            }
            this._memory.decrementDepth();
        }
        // Unexpected
        else {
            throw new Error("Expected a scalar value, a sequence, or a mapping");
        }
    }
    validate(scalar, definition) {
        switch (scalar.templateTokenType) {
            case tokens_1.NULL_TYPE:
            case tokens_1.BOOLEAN_TYPE:
            case tokens_1.NUMBER_TYPE:
            case tokens_1.STRING_TYPE: {
                const literal = scalar;
                // Legal
                const scalarDefinitions = definition.getScalarDefinitions();
                if (scalarDefinitions.some((x) => x.isMatch(literal))) {
                    return scalar;
                }
                // Not a string, convert
                if (literal.templateTokenType !== tokens_1.STRING_TYPE) {
                    const stringLiteral = new tokens_1.StringToken(literal.file, literal.line, literal.col, literal.toString());
                    // Legal
                    if (scalarDefinitions.some((x) => x.isMatch(stringLiteral))) {
                        return stringLiteral;
                    }
                }
                // Illegal
                this._context.error(literal, `Unexpected value '${literal.toString()}'`);
                return scalar;
            }
            case tokens_1.BASIC_EXPRESSION_TYPE:
                // Illegal
                if (definition.allowedContext.length === 0) {
                    this._context.error(scalar, "A template expression is not allowed in this context");
                }
                return scalar;
            default:
                this._context.error(scalar, `Unexpected value '${scalar.toString()}'`);
                return scalar;
        }
    }
    parseScalar(token, allowedContext) {
        // Not a string
        if (token.templateTokenType !== tokens_1.STRING_TYPE) {
            return token;
        }
        // Check if the value is definitely a literal
        const raw = token.toString();
        let startExpression = raw.indexOf(template_constants_1.OPEN_EXPRESSION);
        if (startExpression < 0) {
            // Doesn't contain "${{"
            return token;
        }
        // Break the value into segments of LiteralToken and ExpressionToken
        const segments = [];
        let i = 0;
        while (i < raw.length) {
            // An expression starts here
            if (i === startExpression) {
                // Find the end of the expression - i.e. "}}"
                startExpression = i;
                let endExpression = -1;
                let inString = false;
                for (i += template_constants_1.OPEN_EXPRESSION.length; i < raw.length; i++) {
                    if (raw[i] === "'") {
                        inString = !inString; // Note, this handles escaped single quotes gracefully. E.x. 'foo''bar'
                    }
                    else if (!inString && raw[i] === "}" && raw[i - 1] === "}") {
                        endExpression = i;
                        i++;
                        break;
                    }
                }
                // Check if not closed
                if (endExpression < startExpression) {
                    this._context.error(token, "The expression is not closed. An unescaped ${{ sequence was found, but the closing }} sequence was not found.");
                    return token;
                }
                // Parse the expression
                const rawExpression = raw.substr(startExpression + template_constants_1.OPEN_EXPRESSION.length, endExpression -
                    startExpression +
                    1 -
                    template_constants_1.OPEN_EXPRESSION.length -
                    template_constants_1.CLOSE_EXPRESSION.length);
                const parseExpressionResult = this.parseExpression(token.line, token.col, rawExpression, allowedContext);
                // Check for error
                if (parseExpressionResult.error) {
                    this._context.error(token, parseExpressionResult.error);
                    return token;
                }
                // Check if a directive was used when not allowed
                const expression = parseExpressionResult.expression;
                if (expression.directive && (startExpression !== 0 || i < raw.length)) {
                    this._context.error(token, `The directive '${expression.directive}' is not allowed in this context. Directives are not supported for expressions that are embedded within a string. Directives are only supported when the entire value is an expression.`);
                    return token;
                }
                // Add the segment
                segments.push(expression);
                // Look for the next expression
                startExpression = raw.indexOf(template_constants_1.OPEN_EXPRESSION, i);
            }
            // The next expression is further ahead
            else if (i < startExpression) {
                // Append the segment
                this.addString(segments, token.line, token.col, raw.substr(i, startExpression - i));
                // Adjust the position
                i = startExpression;
            }
            // No remaining expressions
            else {
                this.addString(segments, token.line, token.col, raw.substr(i));
                break;
            }
        }
        // Check if can convert to a literal
        // For example, the escaped expression: ${{ '{{ this is a literal }}' }}
        if (segments.length === 1 &&
            segments[0].templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
            const basicExpression = segments[0];
            const str = this.getExpressionString(basicExpression.expression);
            if (str !== undefined) {
                return new tokens_1.StringToken(this._fileId, token.line, token.col, str);
            }
        }
        // Check if only one segment
        if (segments.length === 1) {
            return segments[0];
        }
        // Build the new expression, using the format function
        const format = [];
        const args = [];
        let argIndex = 0;
        for (const segment of segments) {
            if (segment.templateTokenType === tokens_1.STRING_TYPE) {
                const literal = segment;
                const text = expressionUtility
                    .stringEscape(literal.value) // Escape quotes
                    .replace(/\{/g, "{{") // Escape braces
                    .replace(/\}/g, "}}");
                format.push(text);
            }
            else {
                format.push(`{${argIndex}}`); // Append format arg
                argIndex++;
                const expression = segment;
                args.push(", ");
                args.push(expression.expression);
            }
        }
        return new tokens_1.BasicExpressionToken(this._fileId, token.line, token.col, `format('${format.join("")}'${args.join("")})`);
    }
    parseExpression(line, column, value, allowedContext) {
        const trimmed = value.trim();
        // Check if the value is empty
        if (!trimmed) {
            return {
                error: new Error("An expression was expected"),
            };
        }
        // Try to find a matching directive
        const matchDirectiveResult = this.matchDirective(trimmed, template_constants_1.INSERT_DIRECTIVE, 0);
        if (matchDirectiveResult.isMatch) {
            return {
                expression: new tokens_1.InsertExpressionToken(this._fileId, line, column),
            };
        }
        else if (matchDirectiveResult.error) {
            return {
                error: matchDirectiveResult.error,
            };
        }
        // Check if valid expression
        try {
            tokens_1.ExpressionToken.validateExpression(trimmed, allowedContext);
        }
        catch (err) {
            return {
                error: err,
            };
        }
        // Return the expression
        return {
            expression: new tokens_1.BasicExpressionToken(this._fileId, line, column, trimmed),
            error: undefined,
        };
    }
    addString(segments, line, column, value) {
        // If the last segment was a LiteralToken, then append to the last segment
        if (segments.length > 0 &&
            segments[segments.length - 1].templateTokenType === tokens_1.STRING_TYPE) {
            const lastSegment = segments[segments.length - 1];
            segments[segments.length - 1] = new tokens_1.StringToken(this._fileId, line, column, `${lastSegment.value}${value}`);
        }
        // Otherwise add a new LiteralToken
        else {
            segments.push(new tokens_1.StringToken(this._fileId, line, column, value));
        }
    }
    matchDirective(trimmed, directive, expectedParameters) {
        const parameters = [];
        if (trimmed.startsWith(directive) &&
            (trimmed.length === directive.length ||
                WHITESPACE_PATTERN.test(trimmed[directive.length]))) {
            let startIndex = directive.length;
            let inString = false;
            let parens = 0;
            for (let i = startIndex; i < trimmed.length; i++) {
                const c = trimmed[i];
                if (WHITESPACE_PATTERN.test(c) && !inString && parens == 0) {
                    if (startIndex < 1) {
                        parameters.push(trimmed.substr(startIndex, i - startIndex));
                    }
                    startIndex = i + 1;
                }
                else if (c === "'") {
                    inString = !inString;
                }
                else if (c === "(" && !inString) {
                    parens++;
                }
                else if (c === ")" && !inString) {
                    parens--;
                }
            }
            if (startIndex < trimmed.length) {
                parameters.push(trimmed.substr(startIndex));
            }
            if (expectedParameters != parameters.length) {
                return {
                    isMatch: false,
                    parameters: [],
                    error: new Error(`Exactly ${expectedParameters} parameter(s) were expected following the directive '${directive}'. Actual parameter count: ${parameters.length}`),
                };
            }
            return {
                isMatch: true,
                parameters: parameters,
            };
        }
        return {
            isMatch: false,
            parameters: parameters,
        };
    }
    getExpressionString(trimmed) {
        const result = [];
        let inString = false;
        for (let i = 0; i < trimmed.length; i++) {
            const c = trimmed[i];
            if (c === "'") {
                inString = !inString;
                if (inString && i !== 0) {
                    result.push(c);
                }
            }
            else if (!inString) {
                return undefined;
            }
            else {
                result.push(c);
            }
        }
        return result.join("");
    }
}
class DefinitionInfo {
    constructor(schemaOrParent, name) {
        var _a, _b, _c;
        this.isDefinitionInfo = true;
        const parent = ((_a = schemaOrParent) === null || _a === void 0 ? void 0 : _a.isDefinitionInfo) === true
            ? schemaOrParent
            : undefined;
        this._schema =
            parent === undefined ? schemaOrParent : parent._schema;
        // Lookup the definition
        this.definition = this._schema.getDefinition(name);
        // Record allowed context
        if (this.definition.readerContext.length > 0) {
            this.allowedContext = [];
            // Copy parent allowed context
            const upperSeen = {};
            for (const context of (_b = parent === null || parent === void 0 ? void 0 : parent.allowedContext) !== null && _b !== void 0 ? _b : []) {
                this.allowedContext.push(context);
                upperSeen[context.toUpperCase()] = true;
            }
            // Append context if unseen
            for (const context of this.definition.readerContext) {
                const upper = context.toUpperCase();
                if (!upperSeen[upper]) {
                    this.allowedContext.push(context);
                    upperSeen[upper] = true;
                }
            }
        }
        else {
            this.allowedContext = (_c = parent === null || parent === void 0 ? void 0 : parent.allowedContext) !== null && _c !== void 0 ? _c : [];
        }
    }
    getScalarDefinitions() {
        return this._schema.getScalarDefinitions(this.definition);
    }
    getDefinitionsOfType(type) {
        return this._schema.getDefinitionsOfType(this.definition, type);
    }
}
//# sourceMappingURL=template-reader.js.map

/***/ }),

/***/ 1531:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// Does just-in-time expression expansion
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateUnraveler = void 0;
const template_constants_1 = __nccwpck_require__(5029);
const tokens_1 = __nccwpck_require__(7603);
/**
 * This class allows callers to easily traverse a template object.
 * This class hides the details of expression expansion, depth tracking,
 * and memory tracking.
 */
class TemplateUnraveler {
    constructor(context, template, removeBytes) {
        this._expanded = false;
        this._context = context;
        this._memory = context.memory;
        // Initialize the reader state
        this.moveFirst(template, removeBytes);
    }
    allowScalar(expand) {
        var _a;
        if (expand) {
            this.unravel(true);
        }
        if ((_a = this._current) === null || _a === void 0 ? void 0 : _a.value.isScalar) {
            const scalar = this._current.value;
            // Add bytes before they are emitted to the caller (so the caller doesn't have to track bytes)
            this._memory.addToken(scalar, false);
            this.moveNext();
            return scalar;
        }
        return undefined;
    }
    allowSequenceStart(expand) {
        var _a;
        if (expand) {
            this.unravel(true);
        }
        if (((_a = this._current) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.SEQUENCE_TYPE &&
            this._current.isStart) {
            const sequence = new tokens_1.SequenceToken(this._current.value.file, this._current.value.line, this._current.value.col);
            // Add bytes before they are emitted to the caller (so the caller doesn't have to track bytes)
            this._memory.addToken(sequence, false);
            this.moveNext();
            return sequence;
        }
        return undefined;
    }
    allowSequenceEnd(expand) {
        var _a;
        if (expand) {
            this.unravel(true);
        }
        if (((_a = this._current) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.SEQUENCE_TYPE &&
            this._current.isEnd) {
            this.moveNext();
            return true;
        }
        return false;
    }
    allowMappingStart(expand) {
        var _a;
        if (expand) {
            this.unravel(true);
        }
        if (((_a = this._current) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.MAPPING_TYPE &&
            this._current.isStart) {
            const mapping = new tokens_1.MappingToken(this._current.value.file, this._current.value.line, this._current.value.col);
            // Add bytes before they are emitted to the caller (so the caller doesn't have to track bytes)
            this._memory.addToken(mapping, false);
            this.moveNext();
            return mapping;
        }
        return undefined;
    }
    allowMappingEnd(expand) {
        var _a;
        if (expand) {
            this.unravel(true);
        }
        if (((_a = this._current) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.MAPPING_TYPE &&
            this._current.isEnd) {
            this.moveNext();
            return true;
        }
        return false;
    }
    readEnd() {
        if (this._current !== undefined) {
            throw new Error(`Expected end of template object. ${this.dumpState("readEnd")}`);
        }
    }
    readMappingEnd() {
        if (!this.allowMappingEnd(false)) {
            throw new Error(`Unexpected state while attempting to read the mapping end. ${this.dumpState("readMappingEnd")}`);
        }
    }
    skipSequenceItem() {
        var _a, _b;
        if (((_b = (_a = this._current) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.value.templateTokenType) !== tokens_1.SEQUENCE_TYPE) {
            throw new Error(`Unexpected state while attempting to skip the current sequence item. ${this.dumpState("skipSequenceItem")}`);
        }
        this.moveNext(true);
    }
    skipMappingKey() {
        var _a, _b;
        if (((_b = (_a = this._current) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.value.templateTokenType) !== tokens_1.MAPPING_TYPE ||
            !this._current.parent.isKey) {
            throw new Error(`Unexpected state while attempting to skip the current mapping key. ${this.dumpState("skipMappingKey")}`);
        }
        this.moveNext(true);
    }
    skipMappingValue() {
        var _a, _b;
        if (((_b = (_a = this._current) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.value.templateTokenType) !== tokens_1.MAPPING_TYPE ||
            this._current.parent.isKey) {
            throw new Error(`Unexpected state while attempting to skip the current mapping value. ${this.dumpState("skipMappingValue")}`);
        }
        this.moveNext(true);
    }
    dumpState(operation) {
        const result = [];
        if (operation) {
            result.push(`Operation: ${operation}`);
        }
        if (this._current === undefined) {
            result.push(`State: (null)`);
        }
        else {
            result.push(`State:`);
            result.push("");
            // Push state hierarchy
            const stack = [];
            let curr = this._current;
            while (curr) {
                result.push(curr.toString());
                curr = curr.parent;
            }
        }
        return result.join("\n");
    }
    moveFirst(value, removeBytes) {
        switch (value.templateTokenType) {
            case tokens_1.NULL_TYPE:
            case tokens_1.BOOLEAN_TYPE:
            case tokens_1.NUMBER_TYPE:
            case tokens_1.STRING_TYPE:
            case tokens_1.SEQUENCE_TYPE:
            case tokens_1.MAPPING_TYPE:
            case tokens_1.BASIC_EXPRESSION_TYPE:
                break;
            default:
                throw new Error(`Unexpected type '${value.templateTokenType}' when initializing object reader state`);
        }
        this._current = ReaderState.createState(undefined, value, this._context, removeBytes);
    }
    moveNext(skipNestedEvents) {
        var _a, _b;
        if (this._current === undefined) {
            return;
        }
        // Sequence start
        if (this._current.value.templateTokenType === tokens_1.SEQUENCE_TYPE &&
            this._current.isStart &&
            !skipNestedEvents) {
            // Move to the first item or sequence end
            const sequenceState = this._current;
            this._current = sequenceState.next();
        }
        // Mapping state
        else if (this._current.value.templateTokenType === tokens_1.MAPPING_TYPE &&
            this._current.isStart &&
            !skipNestedEvents) {
            // Move to the first item key or mapping end
            const mappingState = this._current;
            this._current = mappingState.next();
        }
        // Parent is a sequence
        else if (((_a = this._current.parent) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.SEQUENCE_TYPE) {
            // Move to the next item or sequence end
            const parentSequenceState = this._current.parent;
            this._current.remove();
            this._current = parentSequenceState.next();
        }
        // Parent is a mapping
        else if (((_b = this._current.parent) === null || _b === void 0 ? void 0 : _b.value.templateTokenType) === tokens_1.MAPPING_TYPE) {
            // Move to the next item value, item key, or mapping end
            const parentMappingState = this._current.parent;
            this._current.remove();
            this._current = parentMappingState.next();
        }
        // Parent is an expression end
        else if (this._current.parent !== undefined) {
            this._current.remove();
            this._current = this._current.parent;
        }
        // Parent is undefined
        else {
            this._current.remove();
            this._current = undefined;
        }
        this._expanded = false;
        this.unravel(false);
    }
    unravel(expand) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (this._expanded) {
            return;
        }
        for (;;) {
            if (this._current === undefined) {
                break;
            }
            // Literal
            else if (this._current.value.isLiteral) {
                break;
            }
            // Basic expression
            else if (this._current.value.templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
                const basicExpressionState = this._current;
                // Sequence item is a basic expression start
                // For example:
                //   steps:
                //     - script: credscan
                //     - ${{ parameters.preBuild }}
                //     - script: build
                if (basicExpressionState.isStart &&
                    ((_a = this._current.parent) === null || _a === void 0 ? void 0 : _a.value.templateTokenType) === tokens_1.SEQUENCE_TYPE) {
                    if (expand) {
                        this.sequenceItemBasicExpression();
                    }
                    else {
                        break;
                    }
                }
                // Mapping key is a basic expression start
                // For example:
                //   steps:
                //     - ${{ parameters.scriptHost }}: echo hi
                else if (basicExpressionState.isStart &&
                    ((_b = this._current.parent) === null || _b === void 0 ? void 0 : _b.value.templateTokenType) === tokens_1.MAPPING_TYPE &&
                    this._current.parent.isKey) {
                    if (expand) {
                        this.mappingKeyBasicExpression();
                    }
                    else {
                        break;
                    }
                }
                // Mapping value is a basic expression start
                // For example:
                //   steps:
                //     - script: credscan
                //     - script: ${{ parameters.tool }}
                else if (basicExpressionState.isStart &&
                    ((_c = this._current.parent) === null || _c === void 0 ? void 0 : _c.value.templateTokenType) === tokens_1.MAPPING_TYPE &&
                    !this._current.parent.isKey) {
                    if (expand) {
                        this.mappingValueBasicExpression();
                    }
                    else {
                        break;
                    }
                }
                // Root basic expression start
                else if (basicExpressionState.isStart &&
                    this._current.parent === undefined) {
                    if (expand) {
                        this.rootBasicExpression();
                    }
                    else {
                        break;
                    }
                }
                // Basic expression end
                else if (basicExpressionState.isEnd) {
                    this.endExpression();
                }
                else {
                    this.unexpectedState("unravel basic expression");
                }
            }
            // Mapping
            else if (this._current.value.templateTokenType === tokens_1.MAPPING_TYPE) {
                const mappingState = this._current;
                // Mapping end, closing an "insert" mapping insertion
                if (mappingState.isEnd &&
                    ((_d = this._current.parent) === null || _d === void 0 ? void 0 : _d.value.templateTokenType) ===
                        tokens_1.INSERT_EXPRESSION_TYPE) {
                    this._current.remove();
                    this._current = this._current.parent; // Skip to the expression end
                }
                // Normal mapping start
                else if (mappingState.isStart) {
                    break;
                }
                // Normal mapping end
                else if (mappingState.isEnd) {
                    break;
                }
                else {
                    this.unexpectedState("unravel mapping");
                }
            }
            // Sequence
            else if (this._current.value.templateTokenType === tokens_1.SEQUENCE_TYPE) {
                const sequenceState = this._current;
                // Sequence end, closing a sequence insertion
                if (sequenceState.isEnd &&
                    ((_e = this._current.parent) === null || _e === void 0 ? void 0 : _e.value.templateTokenType) ===
                        tokens_1.BASIC_EXPRESSION_TYPE &&
                    ((_f = this._current.parent.parent) === null || _f === void 0 ? void 0 : _f.value.templateTokenType) === tokens_1.SEQUENCE_TYPE) {
                    this._current.remove();
                    this._current = this._current.parent; // Skip to the expression end
                }
                // Normal sequence start
                else if (sequenceState.isStart) {
                    break;
                }
                // Normal sequence end
                else if (sequenceState.isEnd) {
                    break;
                }
                else {
                    this.unexpectedState("unravel sequence");
                }
            }
            // Insert expression
            else if (this._current.value.templateTokenType === tokens_1.INSERT_EXPRESSION_TYPE) {
                const insertExpressionState = this._current;
                // Mapping key, beginning an "insert" mapping insertion
                // For example:
                //   - job: a
                //     variables:
                //       ${{ insert }}: ${{ parameters.jobVariables }}
                if (insertExpressionState.isStart &&
                    ((_g = this._current.parent) === null || _g === void 0 ? void 0 : _g.value.templateTokenType) === tokens_1.MAPPING_TYPE &&
                    this._current.parent.isKey) {
                    if (expand) {
                        this.startMappingInsertion();
                    }
                    else {
                        break;
                    }
                }
                // Expression end
                else if (insertExpressionState.isEnd) {
                    this.endExpression();
                }
                // Not allowed
                else if (insertExpressionState.isStart) {
                    this._context.error(insertExpressionState.value, `The expression directive '${insertExpressionState.expression.directive}' is not supported in this context`);
                    this._current.remove();
                    this._current = insertExpressionState.toStringToken();
                }
                else {
                    this.unexpectedState("unravel insert expression");
                }
            }
            else {
                this.unexpectedState("unravel");
            }
        }
        this._expanded = expand;
    }
    sequenceItemBasicExpression() {
        // The template looks like:
        //
        //   steps:
        //   - ${{ parameters.preSteps }}
        //   - script: build
        //
        // The current state looks like:
        //
        //   MappingState   // The document starts with a mapping
        //
        //   SequenceState  // The "steps" sequence
        //
        //   BasicExpressionState   // m_current
        const expressionState = this._current;
        const expression = expressionState.value;
        let value;
        let removeBytes = 0;
        try {
            const result = expression.evaluateTemplateToken(expressionState.context);
            value = result.value;
            removeBytes = result.bytes;
        }
        catch (err) {
            this._context.error(expression, err);
        }
        // Move to the nested sequence, skip the sequence start
        if ((value === null || value === void 0 ? void 0 : value.templateTokenType) === tokens_1.SEQUENCE_TYPE) {
            this._current = expressionState.next(value, true, removeBytes);
        }
        // Move to the new value
        else if (value !== undefined) {
            this._current = expressionState.next(value, false, removeBytes);
        }
        // Move to the expression end
        else if (value === undefined) {
            expressionState.end();
        }
    }
    mappingKeyBasicExpression() {
        // The template looks like:
        //
        //   steps:
        //   - ${{ parameters.scriptHost }}: echo hi
        //
        // The current state looks like:
        //
        //   MappingState   // The document starts with a mapping
        //
        //   SequenceState  // The "steps" sequence
        //
        //   MappingState   // The step mapping
        //
        //   BasicExpressionState   // m_current
        // The expression should evaluate to a string
        const expressionState = this._current;
        const expression = expressionState.value;
        let stringToken;
        let removeBytes = 0;
        try {
            const result = expression.evaluateStringToken(expressionState.context);
            stringToken = result.value;
            removeBytes = result.bytes;
        }
        catch (err) {
            this._context.error(expression, err);
        }
        // Move to the stringToken
        if (stringToken !== undefined) {
            this._current = expressionState.next(stringToken, false, removeBytes);
        }
        // Move to the next key or mapping end
        else {
            this._current.remove();
            const parentMappingState = this._current.parent;
            parentMappingState.next().remove(); // Skip the value
            this._current = parentMappingState.next(); // Next key or mapping end
        }
    }
    mappingValueBasicExpression() {
        // The template looks like:
        //
        //   steps:
        //   - script: credScan
        //   - script: ${{ parameters.tool }}
        //
        // The current state looks like:
        //
        //   MappingState   // The document starts with a mapping
        //
        //   SequenceState  // The "steps" sequence
        //
        //   MappingState   // The step mapping
        //
        //   BasicExpressionState   // m_current
        const expressionState = this._current;
        const expression = expressionState.value;
        let value;
        let removeBytes = 0;
        try {
            const result = expression.evaluateTemplateToken(expressionState.context);
            value = result.value;
            removeBytes = result.bytes;
        }
        catch (err) {
            this._context.error(expression, err);
            value = new tokens_1.StringToken(expression.file, expression.line, expression.col, "");
        }
        // Move to the new value
        this._current = expressionState.next(value, false, removeBytes);
    }
    rootBasicExpression() {
        // The template looks like:
        //
        //   ${{ parameters.tool }}
        //
        // The current state looks like:
        //
        //   BasicExpressionState   // m_current
        const expressionState = this._current;
        const expression = expressionState.value;
        let value;
        let removeBytes = 0;
        try {
            const result = expression.evaluateTemplateToken(expressionState.context);
            value = result.value;
            removeBytes = result.bytes;
        }
        catch (err) {
            this._context.error(expression, err);
            value = new tokens_1.StringToken(expression.file, expression.line, expression.col, "");
        }
        // Move to the new value
        this._current = expressionState.next(value, false, removeBytes);
    }
    startMappingInsertion() {
        // The template looks like:
        //
        //   jobs:
        //   - job: a
        //     variables:
        //       ${{ insert }}: ${{ parameters.jobVariables }}
        //
        // The current state looks like:
        //
        //   MappingState       // The document starts with a mapping
        //
        //   SequenceState      // The "jobs" sequence
        //
        //   MappingState       // The "job" mapping
        //
        //   MappingState       // The "variables" mapping
        //
        //   InsertExpressionState  // m_current
        var _a;
        const expressionState = this._current;
        const parentMappingState = expressionState.parent;
        const nestedValue = parentMappingState.mapping.get(parentMappingState.index).value;
        let nestedMapping;
        let removeBytes = 0;
        if (nestedValue.templateTokenType === tokens_1.MAPPING_TYPE) {
            nestedMapping = nestedValue;
        }
        else if (nestedValue.templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
            const basicExpression = nestedValue;
            // The expression should evaluate to a mapping
            try {
                const result = basicExpression.evaluateMappingToken(expressionState.context);
                nestedMapping = result.value;
                removeBytes = result.bytes;
            }
            catch (err) {
                this._context.error(basicExpression, err);
            }
        }
        else {
            this._context.error(nestedValue, "Expected a mapping");
        }
        // Move to the nested first key
        if (((_a = nestedMapping === null || nestedMapping === void 0 ? void 0 : nestedMapping.count) !== null && _a !== void 0 ? _a : 0) > 0) {
            this._current = expressionState.next(nestedMapping, removeBytes);
        }
        // Move to the expression end
        else {
            if (removeBytes > 0) {
                this._memory.subtractAmount(removeBytes);
            }
            expressionState.end();
        }
    }
    endExpression() {
        if (!this._current) {
            throw new Error("_current should not be null");
        }
        // End of document
        if (this._current.parent === undefined) {
            this._current.remove();
            this._current = undefined;
        }
        // End basic expression
        else if (this._current.value.templateTokenType === tokens_1.BASIC_EXPRESSION_TYPE) {
            // Move to the next item or sequence end
            if (this._current.parent.value.templateTokenType === tokens_1.SEQUENCE_TYPE) {
                const parentSequenceState = this._current.parent;
                this._current.remove();
                this._current = parentSequenceState.next();
            }
            // Move to the next key, next value, or mapping end
            else {
                this._current.remove();
                const parentMappingState = this._current.parent;
                this._current = parentMappingState.next();
            }
        }
        // End "insert" mapping insertion
        else {
            // Move to the next key or mapping end
            this._current.remove();
            const parentMappingState = this._current.parent;
            parentMappingState.next().remove(); // Skip the value
            this._current = parentMappingState.next();
        }
    }
    unexpectedState(operation) {
        throw new Error(`Unexpected state while unraveling expressions. ${this.dumpState(operation)}`);
    }
}
exports.TemplateUnraveler = TemplateUnraveler;
class ReaderState {
    constructor(parent, value, context) {
        this.parent = parent;
        this.value = value;
        this.context = context;
    }
    static createState(parent, value, context, removeBytes) {
        switch (value.templateTokenType) {
            case tokens_1.NULL_TYPE:
            case tokens_1.BOOLEAN_TYPE:
            case tokens_1.NUMBER_TYPE:
            case tokens_1.STRING_TYPE:
                return new LiteralState(parent, value, context, removeBytes);
            case tokens_1.SEQUENCE_TYPE:
                return new SequenceState(parent, value, context, removeBytes);
            case tokens_1.MAPPING_TYPE:
                return new MappingState(parent, value, context, removeBytes);
            case tokens_1.BASIC_EXPRESSION_TYPE:
                return new BasicExpressionState(parent, value, context, removeBytes);
            case tokens_1.INSERT_EXPRESSION_TYPE:
                if (removeBytes > 0) {
                    throw new Error(`Unexpected removeBytes when creating insert expression state`);
                }
                return new InsertExpressionState(parent, value, context);
            default:
                throw new Error(`Unexpected type '${value.templateTokenType}' when constructing reader state`);
        }
    }
}
class LiteralState extends ReaderState {
    constructor(parent, literal, context, removeBytes) {
        super(parent, literal, context);
        context.memory.addToken(literal, false);
        context.memory.incrementDepth();
        this._removeBytes = removeBytes;
    }
    remove() {
        this.context.memory.subtractToken(this.value, false);
        this.context.memory.decrementDepth();
        // Subtract the memory overhead of the template token.
        // We are now done traversing it and pointers to it no longer need to exist.
        if (this._removeBytes > 0) {
            this.context.memory.subtractAmount(this._removeBytes);
        }
    }
    toString() {
        const result = [];
        result.push("LiteralState");
        return `${result.join("\n")}\n`;
    }
}
class SequenceState extends ReaderState {
    constructor(parent, sequence, context, removeBytes) {
        super(parent, sequence, context);
        this._isStart = true;
        this._index = 0;
        context.memory.addToken(sequence, false);
        context.memory.incrementDepth();
        this._removeBytes = removeBytes;
    }
    /**
     * Indicates whether the state represents the sequence-start event
     */
    get isStart() {
        return this._isStart;
    }
    /**
     * The current index within the sequence
     */
    get index() {
        return this._index;
    }
    /**
     * Indicates whether the state represents the sequence-end event
     */
    get isEnd() {
        return !this.isStart && this.index >= this.sequence.count;
    }
    get sequence() {
        return this.value;
    }
    next() {
        // Adjust the state
        if (this._isStart) {
            this._isStart = false;
        }
        else {
            this._index++;
        }
        // Return the next event
        if (!this.isEnd) {
            return ReaderState.createState(this, this.sequence.get(this._index), this.context, 0);
        }
        else {
            return this;
        }
    }
    remove() {
        this.context.memory.subtractToken(this.value, false);
        this.context.memory.decrementDepth();
        // Subtract the memory overhead of the template token.
        // We are now done traversing it and pointers to it no longer need to exist.
        if (this._removeBytes > 0) {
            this.context.memory.subtractAmount(this._removeBytes);
        }
    }
    toString() {
        const result = [];
        result.push("SequenceState:");
        result.push(`  isStart: ${this._isStart}`);
        result.push(`  index: ${this._index}`);
        result.push(`  isEnd: ${this.isEnd}`);
        return `${result.join("\n")}\n`;
    }
}
class MappingState extends ReaderState {
    constructor(parent, mapping, context, removeBytes) {
        super(parent, mapping, context);
        this._isStart = true;
        this._index = 0;
        this._isKey = false;
        this.context.memory.addToken(mapping, false);
        this.context.memory.incrementDepth();
        this._removeBytes = removeBytes;
    }
    /**
     * Indicates whether the state represents the mapping-start event
     */
    get isStart() {
        return this._isStart;
    }
    /**
     * The current index within the mapping
     */
    get index() {
        return this._index;
    }
    /**
     * Indicates whether the state represents a mapping-key position
     */
    get isKey() {
        return this._isKey;
    }
    /**
     * Indicates whether the state represents the mapping-end event
     */
    get isEnd() {
        return !this._isStart && this._index >= this.mapping.count;
    }
    get mapping() {
        return this.value;
    }
    next() {
        // Adjust the state
        if (this._isStart) {
            this._isStart = false;
            this._isKey = true;
        }
        else if (this._isKey) {
            this._isKey = false;
        }
        else {
            this._index++;
            this._isKey = true;
        }
        // Return the next event
        if (!this.isEnd) {
            if (this._isKey) {
                return ReaderState.createState(this, this.mapping.get(this._index).key, this.context, 0);
            }
            else {
                return ReaderState.createState(this, this.mapping.get(this._index).value, this.context, 0);
            }
        }
        else {
            return this;
        }
    }
    remove() {
        this.context.memory.subtractToken(this.value, false);
        this.context.memory.decrementDepth();
        // Subtract the memory overhead of the template token.
        // We are now done traversing it and pointers to it no longer need to exist.
        if (this._removeBytes > 0) {
            this.context.memory.subtractAmount(this._removeBytes);
        }
    }
    toString() {
        const result = [];
        result.push("MappingState:");
        result.push(`  isStart: ${this._isStart}`);
        result.push(`  index: ${this._index}`);
        result.push(`  isKey: ${this._isKey}`);
        result.push(`  isEnd: ${this.isEnd}`);
        return `${result.join("\n")}\n`;
    }
}
class BasicExpressionState extends ReaderState {
    constructor(parent, expression, context, removeBytes) {
        super(parent, expression, context);
        this._isStart = true;
        this.context.memory.addToken(expression, false);
        this.context.memory.incrementDepth();
        this._removeBytes = removeBytes;
    }
    /**
     * Indicates whether entering the expression
     */
    get isStart() {
        return this._isStart;
    }
    /**
     * Indicates whether leaving the expression
     */
    get isEnd() {
        return !this._isStart;
    }
    next(value, isSequenceInsertion, removeBytes) {
        // Adjust the state
        this._isStart = false;
        // Create the nested state
        const nestedState = ReaderState.createState(this, value, this.context, removeBytes);
        if (isSequenceInsertion) {
            const nestedSequenceState = nestedState;
            return nestedSequenceState.next(); // Skip the sequence start
        }
        else {
            return nestedState;
        }
    }
    end() {
        this._isStart = false;
        return this;
    }
    remove() {
        this.context.memory.subtractToken(this.value, false);
        this.context.memory.decrementDepth();
        // Subtract the memory overhead of the template token.
        // We are now done traversing it and pointers to it no longer need to exist.
        if (this._removeBytes > 0) {
            this.context.memory.subtractAmount(this._removeBytes);
        }
    }
    toString() {
        const result = [];
        result.push("BasicExpressionState:");
        result.push(`  isStart: ${this._isStart}`);
        return `${result.join("\n")}\n`;
    }
}
class InsertExpressionState extends ReaderState {
    constructor(parent, expression, context) {
        super(parent, expression, context);
        this._isStart = true;
        this.context.memory.addToken(expression, false);
        this.context.memory.incrementDepth();
    }
    /**
     * Indicates whether entering or leaving the expression
     */
    get isStart() {
        return this._isStart;
    }
    /**
     * Indicates whether leaving the expression
     */
    get isEnd() {
        return !this._isStart;
    }
    get expression() {
        return this.value;
    }
    next(value, removeBytes) {
        // Adjust the state
        this._isStart = false;
        // Create the nested state
        const nestedState = ReaderState.createState(this, value, this.context, removeBytes);
        return nestedState.next(); // Skip the mapping start
    }
    end() {
        this._isStart = false;
        return this;
    }
    /**
     * This happens when the expression is not allowed
     */
    toStringToken() {
        const literal = new tokens_1.StringToken(this.value.file, this.value.line, this.value.col, `${template_constants_1.OPEN_EXPRESSION} ${this.expression.directive} ${template_constants_1.CLOSE_EXPRESSION}`);
        return ReaderState.createState(this.parent, literal, this.context, 0);
    }
    remove() {
        this.context.memory.subtractToken(this.value, false);
        this.context.memory.decrementDepth();
    }
    toString() {
        const result = [];
        result.push("InsertExpressionState:");
        result.push(`  isStart: ${this._isStart}`);
        return `${result.join("\n")}\n`;
    }
}
//# sourceMappingURL=template-unraveler.js.map

/***/ }),

/***/ 7603:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyValuePair = exports.EvaluateTokenResult = exports.InsertExpressionToken = exports.BasicExpressionToken = exports.MappingToken = exports.SequenceToken = exports.ExpressionToken = exports.StringToken = exports.NumberToken = exports.BooleanToken = exports.NullToken = exports.LiteralToken = exports.ScalarToken = exports.TemplateToken = exports.NULL_TYPE = exports.NUMBER_TYPE = exports.BOOLEAN_TYPE = exports.INSERT_EXPRESSION_TYPE = exports.BASIC_EXPRESSION_TYPE = exports.MAPPING_TYPE = exports.SEQUENCE_TYPE = exports.STRING_TYPE = void 0;
const parser_1 = __nccwpck_require__(6325);
const nodes_1 = __nccwpck_require__(1137);
const format_1 = __nccwpck_require__(5529);
const template_constants_1 = __nccwpck_require__(5029);
const expression_constants_1 = __nccwpck_require__(1295);
exports.STRING_TYPE = 0;
exports.SEQUENCE_TYPE = 1;
exports.MAPPING_TYPE = 2;
exports.BASIC_EXPRESSION_TYPE = 3;
exports.INSERT_EXPRESSION_TYPE = 4;
exports.BOOLEAN_TYPE = 5;
exports.NUMBER_TYPE = 6;
exports.NULL_TYPE = 7;
class TemplateToken {
    /**
     * Base class for all template tokens
     */
    constructor(type, file, line, col) {
        this.type = type;
        this.file = file;
        this.line = line;
        this.col = col;
    }
    get templateTokenType() {
        return this.type;
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNull(objectDescription) {
        if (this.type === exports.NULL_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.NULL_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertBoolean(objectDescription) {
        if (this.type === exports.BOOLEAN_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.BOOLEAN_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNumber(objectDescription) {
        if (this.type === exports.NUMBER_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.NUMBER_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertString(objectDescription) {
        if (this.type === exports.STRING_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.STRING_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertScalar(objectDescription) {
        var _a;
        if (((_a = this) === null || _a === void 0 ? void 0 : _a.isScalar) === true) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. A scalar type was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertSequence(objectDescription) {
        if (this.type === exports.SEQUENCE_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.SEQUENCE_TYPE}' was expected.`);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertMapping(objectDescription) {
        if (this.type === exports.MAPPING_TYPE) {
            return this;
        }
        throw new Error(`Unexpected type '${this.type}' encountered while reading '${objectDescription}'. The type '${exports.MAPPING_TYPE}' was expected.`);
    }
    /**
     * Converts to TemplateToken from serialized Template that has already been JSON-parsed into regular JavaScript objects.
     */
    static fromDeserializedTemplateToken(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (typeof object) {
            case "boolean":
                return new BooleanToken(undefined, undefined, undefined, object);
            case "number":
                return new NumberToken(undefined, undefined, undefined, object);
            case "string":
                return new StringToken(undefined, undefined, undefined, object);
            case "object": {
                if (object === null) {
                    return new NullToken(undefined, undefined, undefined);
                }
                const type = (_a = object.type) !== null && _a !== void 0 ? _a : exports.STRING_TYPE;
                const file = object.file;
                const line = object.line;
                const col = object.col;
                switch (type) {
                    case exports.NULL_TYPE:
                        return new NullToken(file, line, col);
                    case exports.BOOLEAN_TYPE: {
                        return new BooleanToken(file, line, col, (_b = object.bool) !== null && _b !== void 0 ? _b : false);
                    }
                    case exports.NUMBER_TYPE: {
                        return new NumberToken(file, line, col, (_c = object.num) !== null && _c !== void 0 ? _c : 0);
                    }
                    case exports.STRING_TYPE: {
                        return new StringToken(file, line, col, (_d = object.lit) !== null && _d !== void 0 ? _d : "");
                    }
                    case exports.SEQUENCE_TYPE: {
                        const sequence = new SequenceToken(file, line, col);
                        for (const item of (_e = object.seq) !== null && _e !== void 0 ? _e : []) {
                            sequence.add(TemplateToken.fromDeserializedTemplateToken(item));
                        }
                        return sequence;
                    }
                    case exports.MAPPING_TYPE: {
                        const mapping = new MappingToken(file, line, col);
                        for (const pair of (_f = object.map) !== null && _f !== void 0 ? _f : []) {
                            mapping.add(TemplateToken.fromDeserializedTemplateToken(pair.key), TemplateToken.fromDeserializedTemplateToken(pair.value));
                        }
                        return mapping;
                    }
                    case exports.BASIC_EXPRESSION_TYPE:
                        return new BasicExpressionToken(file, line, col, (_g = object.expr) !== null && _g !== void 0 ? _g : "");
                    case exports.INSERT_EXPRESSION_TYPE:
                        return new InsertExpressionToken(file, line, col);
                    default:
                        throw new Error(`Unexpected type '${type}' when converting deserialized template token to template token`);
                }
            }
            default:
                throw new Error(`Unexpected type '${typeof object}' when converting deserialized template token to template token`);
        }
    }
    /**
     * Returns all tokens (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit mapping keys
     */
    static *traverse(value, omitKeys) {
        yield value;
        switch (value.templateTokenType) {
            case exports.SEQUENCE_TYPE:
            case exports.MAPPING_TYPE: {
                let state = new TraversalState(undefined, value);
                while (state) {
                    if (state.moveNext(omitKeys !== null && omitKeys !== void 0 ? omitKeys : false)) {
                        value = state.current;
                        yield value;
                        switch (value.type) {
                            case exports.SEQUENCE_TYPE:
                            case exports.MAPPING_TYPE:
                                state = new TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
}
exports.TemplateToken = TemplateToken;
/**
 * Base class for everything that is not a mapping or sequence
 */
class ScalarToken extends TemplateToken {
    constructor(type, file, line, col) {
        super(type, file, line, col);
    }
    get isScalar() {
        return true;
    }
    static trimDisplayString(displayString) {
        let firstLine = displayString.trimStart();
        const firstNewLine = firstLine.indexOf("\n");
        const firstCarriageReturn = firstLine.indexOf("\r");
        if (firstNewLine >= 0 || firstCarriageReturn >= 0) {
            firstLine = firstLine.substr(0, Math.min(firstNewLine >= 0 ? firstNewLine : Number.MAX_VALUE, firstCarriageReturn >= 0 ? firstCarriageReturn : Number.MAX_VALUE));
        }
        return firstLine;
    }
}
exports.ScalarToken = ScalarToken;
class LiteralToken extends ScalarToken {
    constructor(type, file, line, col) {
        super(type, file, line, col);
    }
    get isLiteral() {
        return true;
    }
    get isExpression() {
        return false;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
    /**
     * Throws a good debug message when an unexpected literal value is encountered
     */
    assertUnexpectedValue(objectDescription) {
        throw new Error(`Error while reading '${objectDescription}'. Unexpected value '${this.toString()}'`);
    }
}
exports.LiteralToken = LiteralToken;
class NullToken extends LiteralToken {
    constructor(file, line, col) {
        super(exports.NULL_TYPE, file, line, col);
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Null;
    }
    clone(omitSource) {
        return omitSource
            ? new NullToken(undefined, undefined, undefined)
            : new NullToken(this.file, this.line, this.col);
    }
    toString() {
        return "";
    }
}
exports.NullToken = NullToken;
class BooleanToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.BOOLEAN_TYPE, file, line, col);
        this.bool = value;
    }
    get value() {
        return this.bool;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Boolean;
    }
    clone(omitSource) {
        return omitSource
            ? new BooleanToken(undefined, undefined, undefined, this.bool)
            : new BooleanToken(this.file, this.line, this.col, this.bool);
    }
    toString() {
        return this.bool ? "true" : "false";
    }
    /**
     * Required for interface BooleanCompatible
     */
    getBoolean() {
        return this.bool;
    }
}
exports.BooleanToken = BooleanToken;
class NumberToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.NUMBER_TYPE, file, line, col);
        this.num = value;
    }
    get value() {
        return this.num;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.Number;
    }
    clone(omitSource) {
        return omitSource
            ? new NumberToken(undefined, undefined, undefined, this.num)
            : new NumberToken(this.file, this.line, this.col, this.num);
    }
    toString() {
        return `${this.num}`;
    }
    /**
     * Required for interface NumberCompatible
     */
    getNumber() {
        return this.num;
    }
}
exports.NumberToken = NumberToken;
class StringToken extends LiteralToken {
    constructor(file, line, col, value) {
        super(exports.STRING_TYPE, file, line, col);
        this.lit = value;
    }
    get value() {
        return this.lit;
    }
    get compatibleValueKind() {
        return nodes_1.ValueKind.String;
    }
    clone(omitSource) {
        return omitSource
            ? new StringToken(undefined, undefined, undefined, this.lit)
            : new StringToken(this.file, this.line, this.col, this.lit);
    }
    toString() {
        return this.lit;
    }
    /**
     * Required for interface StringCompatible
     */
    getString() {
        return this.lit;
    }
}
exports.StringToken = StringToken;
class ExpressionToken extends ScalarToken {
    constructor(type, file, line, col, directive) {
        super(type, file, line, col);
        this.directive = directive;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return true;
    }
    static validateExpression(expression, allowedContext) {
        // Create dummy named contexts and functions
        const namedContexts = [];
        const functions = [];
        if (allowedContext.length > 0) {
            for (const contextItem of allowedContext) {
                const match = contextItem.match(ExpressionToken.FUNCTION_REGEXP);
                if (match) {
                    const functionName = match[1];
                    const minParameters = Number.parseInt(match[2]);
                    const maxParametersRaw = match[3];
                    const maxParameters = maxParametersRaw === template_constants_1.MAX_CONSTANT
                        ? Number.MAX_SAFE_INTEGER
                        : Number.parseInt(maxParametersRaw);
                    functions.push({
                        name: functionName,
                        minParameters: minParameters,
                        maxParameters: maxParameters,
                        createNode: () => new DummyFunction(),
                    });
                }
                else {
                    namedContexts.push({
                        name: contextItem,
                        createNode: () => new nodes_1.SimpleNamedContextNode(undefined),
                    });
                }
            }
        }
        // Parse
        (0, parser_1.createExpressionTree)(expression, undefined, namedContexts, functions);
    }
}
exports.ExpressionToken = ExpressionToken;
ExpressionToken.FUNCTION_REGEXP = /^([a-zA-Z0-9_]+)\(([0-9]+),([0-9]+|MAX)\)$/;
class SequenceToken extends TemplateToken {
    constructor(file, line, col) {
        super(exports.SEQUENCE_TYPE, file, line, col);
        this.seq = [];
    }
    get count() {
        return this.seq.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    get compatibleValueKind() {
        return nodes_1.ValueKind.Array;
    }
    add(value) {
        this.seq.push(value);
    }
    get(index) {
        return this.seq[index];
    }
    clone(omitSource) {
        const result = omitSource
            ? new SequenceToken(undefined, undefined, undefined)
            : new SequenceToken(this.file, this.line, this.col);
        for (const item of this.seq) {
            result.add(item.clone(omitSource));
        }
        return result;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getArrayLength() {
        return this.seq.length;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getArrayItem(index) {
        return this.seq[index];
    }
}
exports.SequenceToken = SequenceToken;
class MappingToken extends TemplateToken {
    constructor(file, line, col) {
        super(exports.MAPPING_TYPE, file, line, col);
        this.map = [];
        this._getHiddenProperty = (propertyName, createDefaultValue) => {
            const func = this._getHiddenProperty;
            if (!Object.prototype.hasOwnProperty.call(func, propertyName)) {
                func[propertyName] = createDefaultValue();
            }
            return func[propertyName];
        };
        this._setHiddenProperty = (propertyName, value) => {
            const func = this._setHiddenProperty;
            func[propertyName] = value;
        };
    }
    get count() {
        return this.map.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    get compatibleValueKind() {
        return nodes_1.ValueKind.Object;
    }
    add(key, value) {
        this.map.push(new KeyValuePair(key, value));
        this.clearDictionary();
    }
    get(index) {
        return this.map[index];
    }
    remove(index) {
        this.map.splice(index, 1);
        this.clearDictionary();
    }
    clone(omitSource) {
        const result = omitSource
            ? new MappingToken(undefined, undefined, undefined)
            : new MappingToken(this.file, this.line, this.col);
        for (const item of this.map) {
            result.add(item.key.clone(omitSource), item.value.clone(omitSource));
        }
        return result;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    hasObjectKey(key) {
        this.initializeDictionary();
        const upperKey = key.toUpperCase();
        return Object.prototype.hasOwnProperty.call(this.getDictionaryIndexLookup(), upperKey);
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectKeys() {
        this.initializeDictionary();
        return this.getDictionaryPairs().map((x) => x.key);
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectKeyCount() {
        this.initializeDictionary();
        return this.getDictionaryPairs().length;
    }
    /**
     * Required for interface ReadOnlyObjectCompatible
     */
    getObjectValue(key) {
        this.initializeDictionary();
        const upperKey = key.toUpperCase();
        const index = this.getDictionaryIndexLookup()[upperKey];
        if (index === undefined) {
            return undefined;
        }
        else {
            return this.getDictionaryPairs()[index].value;
        }
    }
    /**
     * Clears the dictionary used for the expressions interface ReadOnlyObjectCompatible
     */
    clearDictionary() {
        this._setHiddenProperty("dictionaryPairs", []);
        this._setHiddenProperty("dictionaryIndexLookup", {});
    }
    /**
     * Gets the key value pairs used for the interface ReadOnlyObjectCompatible
     */
    getDictionaryPairs() {
        return this._getHiddenProperty("dictionaryPairs", () => {
            return [];
        });
    }
    /**
     * Gets the index lookup used for the interface ReadOnlyObjectCompatible
     */
    getDictionaryIndexLookup() {
        return this._getHiddenProperty("dictionaryIndexLookup", () => {
            return {};
        });
    }
    /**
     * Initializes the dictionary used for the expressions interface ReadOnlyObjectCompatible
     */
    initializeDictionary() {
        // Case insensitive dictionary already built?
        const pairs = this.getDictionaryPairs();
        if (pairs.length > 0) {
            return;
        }
        // Build a case insensitive dictionary
        const indexLookup = this.getDictionaryIndexLookup();
        for (const pair of this.map) {
            if (pair.key.templateTokenType === exports.STRING_TYPE) {
                const key = pair.key.value;
                const upperKey = key.toUpperCase();
                if (indexLookup[upperKey] === undefined) {
                    indexLookup[upperKey] = pairs.length;
                    pairs.push(new StringKeyValuePair(key, pair.value));
                }
            }
        }
    }
}
exports.MappingToken = MappingToken;
class BasicExpressionToken extends ExpressionToken {
    constructor(file, line, col, expression) {
        super(exports.BASIC_EXPRESSION_TYPE, file, line, col, undefined);
        this.expr = expression;
    }
    get expression() {
        return this.expr;
    }
    clone(omitSource) {
        return omitSource
            ? new BasicExpressionToken(undefined, undefined, undefined, this.expr)
            : new BasicExpressionToken(this.file, this.line, this.col, this.expr);
    }
    toString() {
        return `${template_constants_1.OPEN_EXPRESSION} ${this.expr} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        let displayString = "";
        const expressionNode = (0, parser_1.validateExpressionSyntax)(this.expr, undefined);
        if (expressionNode.nodeType === nodes_1.NodeType.Container &&
            expressionNode.name.toUpperCase() === "FORMAT") {
            // Make sure the first parameter is a literal string so we can format it
            const formatNode = expressionNode;
            if (formatNode.parameters.length > 1 &&
                formatNode.parameters[0].nodeType === nodes_1.NodeType.Literal &&
                formatNode.parameters[0].kind === nodes_1.ValueKind.String) {
                // Get the format args
                const formatArgs = formatNode.parameters
                    .slice(1)
                    .map((x) => BasicExpressionToken.convertToFormatArg(x));
                const memoryCounter = new nodes_1.MemoryCounter(undefined, 1048576); // 1mb
                try {
                    displayString = format_1.Format.format(memoryCounter, formatNode.parameters[0].value, formatArgs);
                }
                catch (_a) {
                    // Intentionally empty.
                    // If this operation fails, then revert to default display name.
                }
            }
        }
        return ScalarToken.trimDisplayString(displayString || this.toString());
    }
    evaluateStringToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        if (result.isPrimitive) {
            value = this.createStringToken(context, result.convertToString());
        }
        else {
            context.error(this, "Expected a string");
            value = this.createStringToken(context, this.expr);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateSequenceToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        value = this.convertToTemplateToken(context, result);
        if (value.templateTokenType !== exports.SEQUENCE_TYPE) {
            context.error(this, "Expected a sequence");
            value = this.createSequenceToken(context);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateMappingToken(context) {
        const originalBytes = context.memory.currentBytes;
        let value;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        value = this.convertToTemplateToken(context, result);
        if (value.templateTokenType !== exports.MAPPING_TYPE) {
            context.error(this, "Expected a mapping");
            value = this.createMappingToken(context);
        }
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    evaluateTemplateToken(context) {
        const originalBytes = context.memory.currentBytes;
        const tree = (0, parser_1.createExpressionTree)(this.expr, undefined, context.expressionNamedContexts, context.expressionFunctions);
        if (!tree) {
            throw new Error("Unexpected empty expression");
        }
        const options = new nodes_1.EvaluationOptions();
        options.maxMemory = context.memory.maxBytes;
        const result = tree.evaluateTree(context.trace, context, options);
        const value = this.convertToTemplateToken(context, result);
        return new EvaluateTokenResult(value, context.memory.currentBytes - originalBytes);
    }
    convertToTemplateToken(context, result) {
        var _a;
        // Literal
        const literal = this.convertToLiteralToken(context, result);
        if (literal) {
            return literal;
        }
        // Known raw types
        else if (result.raw !== null) {
            const type = (_a = result.raw) === null || _a === void 0 ? void 0 : _a.templateTokenType;
            switch (type) {
                case exports.SEQUENCE_TYPE:
                case exports.MAPPING_TYPE: {
                    const token = result.raw;
                    context.memory.addToken(token, true);
                    return token;
                }
            }
        }
        // Leverage the expression SDK to traverse the object
        const collection = result.getCollectionInterface();
        switch (collection === null || collection === void 0 ? void 0 : collection.compatibleValueKind) {
            case nodes_1.ValueKind.Object: {
                const mapping = this.createMappingToken(context);
                const object = collection;
                for (const key of object.getObjectKeys()) {
                    const keyToken = this.createStringToken(context, key);
                    const valueResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(object.getObjectValue(key)));
                    const valueToken = this.convertToTemplateToken(context, valueResult);
                    mapping.add(keyToken, valueToken);
                }
                return mapping;
            }
            case nodes_1.ValueKind.Array: {
                const sequence = this.createSequenceToken(context);
                const array = collection;
                const length = array.getArrayLength();
                for (let i = 0; i < length; i++) {
                    const itemResult = new nodes_1.EvaluationResult(new nodes_1.CanonicalValue(array.getArrayItem(i)));
                    const itemToken = this.convertToTemplateToken(context, itemResult);
                    sequence.add(itemToken);
                }
                return sequence;
            }
            default:
                throw new Error("Unable to convert the object to a template token");
        }
    }
    convertToLiteralToken(context, result) {
        let literal;
        switch (result.kind) {
            case nodes_1.ValueKind.Null:
                literal = new NullToken(this.file, this.line, this.col);
                break;
            case nodes_1.ValueKind.Boolean:
                literal = new BooleanToken(this.file, this.line, this.col, result.value);
                break;
            case nodes_1.ValueKind.Number:
                literal = new NumberToken(this.file, this.line, this.col, result.value);
                break;
            case nodes_1.ValueKind.String:
                literal = new StringToken(this.file, this.line, this.col, result.value);
                break;
        }
        if (literal) {
            context.memory.addToken(literal, false);
        }
        return literal;
    }
    createStringToken(context, value) {
        const result = new StringToken(this.file, this.line, this.col, value);
        context.memory.addToken(result, false);
        return result;
    }
    createSequenceToken(context) {
        const result = new SequenceToken(this.file, this.line, this.col);
        context.memory.addToken(result, false);
        return result;
    }
    createMappingToken(context) {
        const result = new MappingToken(this.file, this.line, this.col);
        context.memory.addToken(result, false);
        return result;
    }
    static convertToFormatArg(node) {
        let nodeString = node.convertToExpression();
        // If the node is a container, see if it starts with '(' and ends with ')' so we can simplify the string
        // Should only simplify if only one '(' or ')' exists in the string
        // We are trying to simplify the case (a || b) to a || b
        // But we should avoid simplifying ( a && b
        if (node.nodeType === nodes_1.NodeType.Container &&
            nodeString.length > 2 &&
            nodeString[0] === expression_constants_1.START_PARAMETER &&
            nodeString[nodeString.length - 1] === expression_constants_1.END_PARAMETER &&
            nodeString.lastIndexOf(expression_constants_1.START_PARAMETER) === 0 &&
            nodeString.indexOf(expression_constants_1.END_PARAMETER) === nodeString.length - 1) {
            nodeString = nodeString.substr(1, nodeString.length - 2);
        }
        return `${template_constants_1.OPEN_EXPRESSION} ${nodeString} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
}
exports.BasicExpressionToken = BasicExpressionToken;
class InsertExpressionToken extends ExpressionToken {
    constructor(file, line, col) {
        super(exports.INSERT_EXPRESSION_TYPE, file, line, col, template_constants_1.INSERT_DIRECTIVE);
    }
    clone(omitSource) {
        return omitSource
            ? new InsertExpressionToken(undefined, undefined, undefined)
            : new InsertExpressionToken(this.file, this.line, this.col);
    }
    toString() {
        return `${template_constants_1.OPEN_EXPRESSION} ${template_constants_1.INSERT_DIRECTIVE} ${template_constants_1.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        return ScalarToken.trimDisplayString(this.toString());
    }
}
exports.InsertExpressionToken = InsertExpressionToken;
class EvaluateTokenResult {
    constructor(value, bytes) {
        this.value = value;
        this.bytes = bytes;
    }
}
exports.EvaluateTokenResult = EvaluateTokenResult;
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.KeyValuePair = KeyValuePair;
class StringKeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class DummyFunction extends nodes_1.FunctionNode {
    evaluateCore(context) {
        return {
            value: undefined,
            memory: undefined,
        };
    }
}
class TraversalState {
    constructor(parent, token) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._token = token;
    }
    moveNext(omitKeys) {
        switch (this._token.templateTokenType) {
            case exports.SEQUENCE_TYPE: {
                const sequence = this._token;
                if (++this.index < sequence.count) {
                    this.current = sequence.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case exports.MAPPING_TYPE: {
                const mapping = this._token;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.current = mapping.get(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < mapping.count) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.current = mapping.get(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.current = mapping.get(this.index).key;
                    return true;
                }
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected token type '${this._token.templateTokenType}' when traversing state`);
        }
    }
}
//# sourceMappingURL=tokens.js.map

/***/ }),

/***/ 2544:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOperationTraceWriter = void 0;
class NoOperationTraceWriter {
    error(message) { }
    info(message) { }
    verbose(message) { }
}
exports.NoOperationTraceWriter = NoOperationTraceWriter;
//# sourceMappingURL=trace-writer.js.map

/***/ }),

/***/ 2912:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const workflow_parser_1 = __nccwpck_require__(823);
const yargs_1 = __importDefault(__nccwpck_require__(6492));
const workflow_evaluator_1 = __nccwpck_require__(8832);
const context_data_1 = __nccwpck_require__(468);
const tokens_1 = __nccwpck_require__(7603);
const template_context_1 = __nccwpck_require__(389);
const args = (0, yargs_1.default)(process.argv.slice(2))
    .usage(`Usage: node dist/workflows/cli.js [options]\n\n`)
    .example("$0 --pretty >out.json <test/workflow-parser-input.json", "")
    .options({
    pretty: {
        type: "boolean",
        default: false,
        description: "output formatted json to stdout",
    },
})
    .strict()
    .parseSync();
const pretty = args.pretty;
let buffer = "";
const delimiterPattern = /(^|\r?\n)---(\r?\n)/; // Might be more data
const lastDelimiterPattern = /(^|\r?\n)---(\r?\n|$)/; // No more data, trailing newline option
function execute(input) {
    var _a, _b;
    const log = [];
    const trace = {
        info: (x) => log.push(x),
        verbose: (x) => { },
        error: (x) => log.push(x),
    };
    let value = undefined;
    let errors;
    try {
        switch (input.command) {
            case "parse-workflow": {
                const parseWorkflowInput = input;
                const result = (0, workflow_parser_1.parseWorkflow)(parseWorkflowInput.entryFileName, parseWorkflowInput.files, trace);
                value = result.value;
                errors = result.errors;
                break;
            }
            case "evaluate-strategy": {
                const evaluateStrategyInput = input;
                const result = (0, workflow_evaluator_1.evaluateStrategy)(evaluateStrategyInput.fileTable, context_data_1.ContextData.fromDeserializedContextData(evaluateStrategyInput.context), tokens_1.TemplateToken.fromDeserializedTemplateToken(evaluateStrategyInput.token), trace);
                value = result.value;
                errors = result.errors;
                break;
            }
            default:
                throw new Error(`Unsupported command '${input.command}'`);
        }
    }
    catch (err) {
        const message = (_a = err.message) !== null && _a !== void 0 ? _a : `${err}`;
        const code = err.code;
        const stack = `${err.stack}`;
        const error = new template_context_1.TemplateValidationError(message, code);
        error.stack = stack;
        errors = [error];
    }
    const output = {
        batchId: (_b = input.batchId) !== null && _b !== void 0 ? _b : undefined,
        log: log.join("\n"),
        value: value,
        errors: errors,
    };
    console.log(JSON.stringify(output, undefined, pretty ? "  " : undefined));
    console.log("---");
}
function processBuffer(last) {
    for (;;) {
        // Match delimiter
        const match = buffer.match(last ? lastDelimiterPattern : delimiterPattern);
        // No delimiter
        if (!match) {
            break;
        }
        // Adjust buffer
        const inputString = buffer.substr(0, match.index);
        buffer = buffer.substr(match.index + match[0].length);
        // Evaluate
        if (inputString.trim()) {
            const input = JSON.parse(inputString);
            execute(input);
        }
    }
}
process.stdin.on("data", (data) => {
    buffer += data.toString();
    processBuffer(false);
});
process.stdin.on("end", () => {
    processBuffer(true);
    _resolve(undefined);
});
let _resolve;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            _resolve = resolve;
        });
    });
}
run();
//# sourceMappingURL=cli.js.map

/***/ }),

/***/ 9010:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STRATEGY = exports.WORKFLOW_ROOT = void 0;
exports.WORKFLOW_ROOT = "workflow-root";
exports.STRATEGY = "strategy";
//# sourceMappingURL=workflow-constants.js.map

/***/ }),

/***/ 8832:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateStrategy = void 0;
const templateEvaluator = __importStar(__nccwpck_require__(8828));
const workflow_constants_1 = __nccwpck_require__(9010);
const template_context_1 = __nccwpck_require__(389);
const template_memory_1 = __nccwpck_require__(2220);
const workflow_schema_1 = __nccwpck_require__(7504);
const nodes_1 = __nccwpck_require__(1137);
function evaluateStrategy(fileTable, context, token, trace) {
    const templateContext = new template_context_1.TemplateContext(new template_context_1.TemplateValidationErrors(), new template_memory_1.TemplateMemory(50, 1048576), (0, workflow_schema_1.getWorkflowSchema)(), trace);
    // Add each file name
    for (const fileName of fileTable) {
        templateContext.getFileId(fileName);
    }
    // Add expression named contexts
    for (let i = 0; i < context.keyCount; i++) {
        templateContext.expressionNamedContexts.push({
            name: context.getPair(i).key,
            createNode: () => new nodes_1.SimpleNamedContextNode(context.getPair(i).value),
        });
    }
    const value = templateEvaluator.evaluateTemplate(templateContext, workflow_constants_1.STRATEGY, token, 0, undefined);
    return {
        value: value,
        errors: templateContext.errors.getErrors(),
    };
}
exports.evaluateStrategy = evaluateStrategy;
//# sourceMappingURL=workflow-evaluator.js.map

/***/ }),

/***/ 823:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseWorkflow = void 0;
const templateReader = __importStar(__nccwpck_require__(6938));
const workflow_constants_1 = __nccwpck_require__(9010);
const yaml_object_reader_1 = __nccwpck_require__(755);
const template_context_1 = __nccwpck_require__(389);
const template_memory_1 = __nccwpck_require__(2220);
const workflow_schema_1 = __nccwpck_require__(7504);
function parseWorkflow(entryFileName, files, trace) {
    const context = new template_context_1.TemplateContext(new template_context_1.TemplateValidationErrors(), new template_memory_1.TemplateMemory(50, 1048576), (0, workflow_schema_1.getWorkflowSchema)(), trace);
    files.forEach((x) => context.getFileId(x.name));
    const fileId = context.getFileId(entryFileName);
    const fileContent = files[fileId - 1].content;
    const result = templateReader.readTemplate(context, workflow_constants_1.WORKFLOW_ROOT, new yaml_object_reader_1.YamlObjectReader(fileId, fileContent), fileId);
    return {
        value: result.value,
        errors: context.errors.getErrors(),
    };
}
exports.parseWorkflow = parseWorkflow;
//# sourceMappingURL=workflow-parser.js.map

/***/ }),

/***/ 7504:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkflowSchema = void 0;
const json_object_reader_1 = __nccwpck_require__(6374);
const schema_1 = __nccwpck_require__(3032);
const fs = __importStar(__nccwpck_require__(5747));
const path = __importStar(__nccwpck_require__(5622));
let schema;
function getWorkflowSchema() {
    if (schema === undefined) {
        const json = fs
            .readFileSync(path.join(__dirname, "workflow-schema.json"))
            .toString();
        schema = schema_1.TemplateSchema.load(new json_object_reader_1.JSONObjectReader(undefined, json));
    }
    return schema;
}
exports.getWorkflowSchema = getWorkflowSchema;
//# sourceMappingURL=workflow-schema.js.map

/***/ }),

/***/ 755:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.YamlObjectReader = void 0;
const yaml_1 = __nccwpck_require__(9500);
const tokens_1 = __nccwpck_require__(7603);
const parse_event_1 = __nccwpck_require__(7704);
class YamlObjectReader {
    constructor(fileId, content) {
        this.lineCounter = new yaml_1.LineCounter();
        this._generator = this.getNodes((0, yaml_1.parseDocument)(content.trim(), { lineCounter: this.lineCounter }));
        this.fileId = fileId;
    }
    *getNodes(node) {
        let { line, col } = this.getLinePos(node);
        if ((0, yaml_1.isDocument)(node)) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentStart);
            for (const item of this.getNodes(node.contents)) {
                yield item;
            }
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.DocumentEnd);
        }
        if ((0, yaml_1.isCollection)(node)) {
            if ((0, yaml_1.isSeq)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceStart, new tokens_1.SequenceToken(this.fileId, line, col));
            }
            else if ((0, yaml_1.isMap)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingStart, new tokens_1.MappingToken(this.fileId, line, col));
            }
            for (const item of node.items) {
                for (const child of this.getNodes(item)) {
                    yield child;
                }
            }
            if ((0, yaml_1.isSeq)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.SequenceEnd);
            }
            else if ((0, yaml_1.isMap)(node)) {
                yield new parse_event_1.ParseEvent(parse_event_1.EventType.MappingEnd);
            }
        }
        if ((0, yaml_1.isScalar)(node)) {
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, YamlObjectReader.getLiteralToken(this.fileId, line, col, node));
        }
        if ((0, yaml_1.isPair)(node)) {
            const scalarKey = node.key;
            ({ line, col } = this.getLinePos(scalarKey));
            const key = scalarKey.value;
            yield new parse_event_1.ParseEvent(parse_event_1.EventType.Literal, new tokens_1.StringToken(this.fileId, line, col, key));
            for (const child of this.getNodes(node.value)) {
                yield child;
            }
        }
    }
    getLinePos(node) {
        var _a;
        const range = (_a = node === null || node === void 0 ? void 0 : node.range) !== null && _a !== void 0 ? _a : [];
        const startPos = range[0];
        return startPos !== undefined
            ? this.lineCounter.linePos(startPos)
            : { line: undefined, col: undefined };
    }
    static getLiteralToken(fileId, line, col, token) {
        const value = token.value;
        if (!value) {
            return new tokens_1.NullToken(fileId, line, col);
        }
        switch (typeof value) {
            case "number":
                return new tokens_1.NumberToken(fileId, line, col, value);
            case "boolean":
                return new tokens_1.BooleanToken(fileId, line, col, value);
            case "string":
                return new tokens_1.StringToken(fileId, line, col, value);
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.Literal) {
                this._current = this._generator.next();
                // console.log("ParseEvent=Literal")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.SequenceEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=SequenceEnd")
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingStart")
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.MappingEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=MappingEnd")
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentEnd) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentEnd")
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current) {
            this._current = this._generator.next();
        }
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === parse_event_1.EventType.DocumentStart) {
                this._current = this._generator.next();
                // console.log("ParseEvent=DocumentStart")
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
}
exports.YamlObjectReader = YamlObjectReader;
//# sourceMappingURL=yaml-object-reader.js.map

/***/ }),

/***/ 2792:
/***/ ((module) => {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 2013:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* module decorator */ module = __nccwpck_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __nccwpck_require__(8675);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 374:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __nccwpck_require__(5071);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 8675:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(374);
const route = __nccwpck_require__(979);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 979:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const conversions = __nccwpck_require__(374);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 5071:
/***/ ((module) => {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 1414:
/***/ ((module) => {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 4823:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { dirname, resolve } = __nccwpck_require__(5622);
const { readdirSync, statSync } = __nccwpck_require__(5747);

module.exports = function (start, callback) {
	let dir = resolve('.', start);
	let tmp, stats = statSync(dir);

	if (!stats.isDirectory()) {
		dir = dirname(dir);
	}

	while (true) {
		tmp = callback(dir, readdirSync(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}


/***/ }),

/***/ 5275:
/***/ ((module) => {

"use strict";

// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489
module.exports = function getCallerFile(position) {
    if (position === void 0) { position = 2; }
    if (position >= Error.stackTraceLimit) {
        throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
    }
    var oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    if (stack !== null && typeof stack === 'object') {
        // stack[0] holds this file
        // stack[1] holds where this function was called
        // stack[2] holds the file we're interested in
        return stack[position] ? stack[position].getFileName() : undefined;
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 709:
/***/ ((module) => {

"use strict";
/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports.default = isFullwidthCodePoint;


/***/ }),

/***/ 9348:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(5747),
  join = __nccwpck_require__(5622).join,
  resolve = __nccwpck_require__(5622).resolve,
  dirname = __nccwpck_require__(5622).dirname,
  defaultOptions = {
    extensions: ['js', 'json', 'coffee'],
    recurse: true,
    rename: function (name) {
      return name;
    },
    visit: function (obj) {
      return obj;
    }
  };

function checkFileInclusion(path, filename, options) {
  return (
    // verify file has valid extension
    (new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename)) &&

    // if options.include is a RegExp, evaluate it and make sure the path passes
    !(options.include && options.include instanceof RegExp && !options.include.test(path)) &&

    // if options.include is a function, evaluate it and make sure the path passes
    !(options.include && typeof options.include === 'function' && !options.include(path, filename)) &&

    // if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
    !(options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) &&

    // if options.exclude is a function, evaluate it and make sure the path doesn't pass
    !(options.exclude && typeof options.exclude === 'function' && options.exclude(path, filename))
  );
}

function requireDirectory(m, path, options) {
  var retval = {};

  // path is optional
  if (path && !options && typeof path !== 'string') {
    options = path;
    path = null;
  }

  // default options
  options = options || {};
  for (var prop in defaultOptions) {
    if (typeof options[prop] === 'undefined') {
      options[prop] = defaultOptions[prop];
    }
  }

  // if no path was passed in, assume the equivelant of __dirname from caller
  // otherwise, resolve path relative to the equivalent of __dirname
  path = !path ? dirname(m.filename) : resolve(dirname(m.filename), path);

  // get the path of each file in specified directory, append to current tree node, recurse
  fs.readdirSync(path).forEach(function (filename) {
    var joined = join(path, filename),
      files,
      key,
      obj;

    if (fs.statSync(joined).isDirectory() && options.recurse) {
      // this node is a directory; recurse
      files = requireDirectory(m, joined, options);
      // exclude empty directories
      if (Object.keys(files).length) {
        retval[options.rename(filename, joined, filename)] = files;
      }
    } else {
      if (joined !== m.filename && checkFileInclusion(joined, filename, options)) {
        // hash node key shouldn't include file extension
        key = filename.substring(0, filename.lastIndexOf('.'));
        obj = m.require(joined);
        retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
      }
    }
  });

  return retval;
}

module.exports = requireDirectory;
module.exports.defaults = defaultOptions;


/***/ }),

/***/ 3175:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stripAnsi = __nccwpck_require__(6973);
const isFullwidthCodePoint = __nccwpck_require__(709);
const emojiRegex = __nccwpck_require__(1414);

const stringWidth = string => {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex(), '  ');

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports.default = stringWidth;


/***/ }),

/***/ 6973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const ansiRegex = __nccwpck_require__(2792);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 1563:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stringWidth = __nccwpck_require__(3175);
const stripAnsi = __nccwpck_require__(6973);
const ansiStyles = __nccwpck_require__(2013);

const ESCAPES = new Set([
	'\u001B',
	'\u009B'
]);

const END_CODE = 39;

const ANSI_ESCAPE_BELL = '\u0007';
const ANSI_CSI = '[';
const ANSI_OSC = ']';
const ANSI_SGR_TERMINATOR = 'm';
const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;

const wrapAnsi = code => `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
const wrapAnsiHyperlink = uri => `${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${uri}${ANSI_ESCAPE_BELL}`;

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = string => string.split(' ').map(character => stringWidth(character));

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let isInsideEscape = false;
	let isInsideLinkEscape = false;
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character;
		} else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true;
			isInsideLinkEscape = characters.slice(index + 1).join('').startsWith(ANSI_ESCAPE_LINK);
		}

		if (isInsideEscape) {
			if (isInsideLinkEscape) {
				if (character === ANSI_ESCAPE_BELL) {
					isInsideEscape = false;
					isInsideLinkEscape = false;
				}
			} else if (character === ANSI_SGR_TERMINATOR) {
				isInsideEscape = false;
			}

			continue;
		}

		visible += characterLength;

		if (visible === columns && index < characters.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
};

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = string => {
	const words = string.split(' ');
	let last = words.length;

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break;
		}

		last--;
	}

	if (last === words.length) {
		return string;
	}

	return words.slice(0, last).join(' ') + words.slice(last).join('');
};

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') {
		return '';
	}

	let returnValue = '';
	let escapeCode;
	let escapeUrl;

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimStart();
		}

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = (columns - rowLength);
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push('');
			}

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			continue;
		}

		rows[rows.length - 1] += word;
	}

	if (options.trim !== false) {
		rows = rows.map(stringVisibleTrimSpacesRight);
	}

	const pre = [...rows.join('\n')];

	for (const [index, character] of pre.entries()) {
		returnValue += character;

		if (ESCAPES.has(character)) {
			const {groups} = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`).exec(pre.slice(index).join('')) || {groups: {}};
			if (groups.code !== undefined) {
				const code = Number.parseFloat(groups.code);
				escapeCode = code === END_CODE ? undefined : code;
			} else if (groups.uri !== undefined) {
				escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
			}
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (pre[index + 1] === '\n') {
			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink('');
			}

			if (escapeCode && code) {
				returnValue += wrapAnsi(code);
			}
		} else if (character === '\n') {
			if (escapeCode && code) {
				returnValue += wrapAnsi(escapeCode);
			}

			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink(escapeUrl);
			}
		}
	}

	return returnValue;
};

// For each newline, invoke the method separately
module.exports = (string, columns, options) => {
	return String(string)
		.normalize()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');
};


/***/ }),

/***/ 6123:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);
var resolveBlockMap = __nccwpck_require__(8500);
var resolveBlockSeq = __nccwpck_require__(3371);
var resolveFlowCollection = __nccwpck_require__(4517);

function composeCollection(CN, ctx, token, tagToken, onError) {
    let coll;
    switch (token.type) {
        case 'block-map': {
            coll = resolveBlockMap.resolveBlockMap(CN, ctx, token, onError);
            break;
        }
        case 'block-seq': {
            coll = resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError);
            break;
        }
        case 'flow-collection': {
            coll = resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError);
            break;
        }
    }
    if (!tagToken)
        return coll;
    const tagName = ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg));
    if (!tagName)
        return coll;
    // Cast needed due to: https://github.com/Microsoft/TypeScript/issues/3841
    const Coll = coll.constructor;
    if (tagName === '!' || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
    }
    const expType = Node.isMap(coll) ? 'map' : 'seq';
    let tag = ctx.schema.tags.find(t => t.collection === expType && t.tag === tagName);
    if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt && kt.collection === expType) {
            ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
            tag = kt;
        }
        else {
            onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, true);
            coll.tag = tagName;
            return coll;
        }
    }
    const res = tag.resolve(coll, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg), ctx.options);
    const node = Node.isNode(res)
        ? res
        : new Scalar.Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag === null || tag === void 0 ? void 0 : tag.format)
        node.format = tag.format;
    return node;
}

exports.composeCollection = composeCollection;


/***/ }),

/***/ 6373:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Document = __nccwpck_require__(4810);
var composeNode = __nccwpck_require__(5346);
var resolveEnd = __nccwpck_require__(3731);
var resolveProps = __nccwpck_require__(6682);

function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ directives }, options);
    const doc = new Document.Document(undefined, opts);
    const ctx = {
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
    };
    const props = resolveProps.resolveProps(start, {
        indicator: 'doc-start',
        next: value || (end === null || end === void 0 ? void 0 : end[0]),
        offset,
        onError,
        startOnNewline: true
    });
    if (props.found) {
        doc.directives.marker = true;
        if (value &&
            (value.type === 'block-map' || value.type === 'block-seq') &&
            !props.hasNewline)
            onError(props.end, 'MISSING_CHAR', 'Block collection cannot start on same line with directives-end marker');
    }
    doc.contents = value
        ? composeNode.composeNode(ctx, value, props, onError)
        : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
        doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
}

exports.composeDoc = composeDoc;


/***/ }),

/***/ 5346:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(8572);
var composeCollection = __nccwpck_require__(6123);
var composeScalar = __nccwpck_require__(7414);
var resolveEnd = __nccwpck_require__(3731);
var utilEmptyScalarPosition = __nccwpck_require__(2581);

const CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    switch (token.type) {
        case 'alias':
            node = composeAlias(ctx, token, onError);
            if (anchor || tag)
                onError(token, 'ALIAS_PROPS', 'An alias node must not specify any properties');
            break;
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'block-scalar':
            node = composeScalar.composeScalar(ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        case 'block-map':
        case 'block-seq':
        case 'flow-collection':
            node = composeCollection.composeCollection(CN, ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        default:
            console.log(token);
            throw new Error(`Unsupporten token type: ${token.type}`);
    }
    if (anchor && node.anchor === '')
        onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment) {
        if (token.type === 'scalar' && token.source === '')
            node.comment = comment;
        else
            node.commentBefore = comment;
    }
    return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag }, onError) {
    const token = {
        type: 'scalar',
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ''
    };
    const node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === '')
            onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    }
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment)
        node.comment = comment;
    return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias.Alias(source.substring(1));
    if (alias.source === '')
        onError(offset, 'BAD_ALIAS', 'Alias cannot be an empty string');
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
        alias.comment = re.comment;
    return alias;
}

exports.composeEmptyNode = composeEmptyNode;
exports.composeNode = composeNode;


/***/ }),

/***/ 7414:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);
var resolveBlockScalar = __nccwpck_require__(1989);
var resolveFlowScalar = __nccwpck_require__(4518);

function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === 'block-scalar'
        ? resolveBlockScalar.resolveBlockScalar(token, ctx.options.strict, onError)
        : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken
        ? ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg))
        : null;
    const tag = tagToken && tagName
        ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError)
        : findScalarTagByTest(ctx.schema, value, token.type === 'scalar');
    let scalar;
    try {
        const res = tag.resolve(value, msg => onError(tagToken || token, 'TAG_RESOLVE_FAILED', msg), ctx.options);
        scalar = Node.isScalar(res) ? res : new Scalar.Scalar(res);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken || token, 'TAG_RESOLVE_FAILED', msg);
        scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
        scalar.type = type;
    if (tagName)
        scalar.tag = tagName;
    if (tag.format)
        scalar.format = tag.format;
    if (comment)
        scalar.comment = comment;
    return scalar;
}
function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    var _a;
    if (tagName === '!')
        return schema[Node.SCALAR]; // non-specific tag
    const matchWithTest = [];
    for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
            if (tag.default && tag.test)
                matchWithTest.push(tag);
            else
                return tag;
        }
    }
    for (const tag of matchWithTest)
        if ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value))
            return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
        // Ensure that the known tag is available for stringifying,
        // but does not get used by default.
        schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
        return kt;
    }
    onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, tagName !== 'tag:yaml.org,2002:str');
    return schema[Node.SCALAR];
}
function findScalarTagByTest(schema, value, apply) {
    var _a;
    if (apply) {
        for (const tag of schema.tags) {
            if (tag.default && ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(value)))
                return tag;
        }
    }
    return schema[Node.SCALAR];
}

exports.composeScalar = composeScalar;


/***/ }),

/***/ 3059:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var directives = __nccwpck_require__(3599);
var Document = __nccwpck_require__(4810);
var errors = __nccwpck_require__(3363);
var Node = __nccwpck_require__(6713);
var options = __nccwpck_require__(8603);
var composeDoc = __nccwpck_require__(6373);
var resolveEnd = __nccwpck_require__(3731);

function getErrorPos(src) {
    if (typeof src === 'number')
        return [src, src + 1];
    if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === 'string' ? source.length : 1)];
}
function parsePrelude(prelude) {
    var _a;
    let comment = '';
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
            case '#':
                comment +=
                    (comment === '' ? '' : afterEmptyLine ? '\n\n' : '\n') +
                        (source.substring(1) || ' ');
                atComment = true;
                afterEmptyLine = false;
                break;
            case '%':
                if (((_a = prelude[i + 1]) === null || _a === void 0 ? void 0 : _a[0]) !== '#')
                    i += 1;
                atComment = false;
                break;
            default:
                // This may be wrong after doc-end, but in that case it doesn't matter
                if (!atComment)
                    afterEmptyLine = true;
                atComment = false;
        }
    }
    return { comment, afterEmptyLine };
}
/**
 * Compose a stream of CST nodes into a stream of YAML Documents.
 *
 * ```ts
 * import { Composer, Parser } from 'yaml'
 *
 * const src: string = ...
 * const tokens = new Parser().parse(src)
 * const docs = new Composer().compose(tokens)
 * ```
 */
class Composer {
    constructor(options$1 = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
            const pos = getErrorPos(source);
            if (warning)
                this.warnings.push(new errors.YAMLWarning(pos, code, message));
            else
                this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({
            version: options$1.version || options.defaultOptions.version
        });
        this.options = options$1;
    }
    decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        //console.log({ dc: doc.comment, prelude, comment })
        if (comment) {
            const dc = doc.contents;
            if (afterDoc) {
                doc.comment = doc.comment ? `${doc.comment}\n${comment}` : comment;
            }
            else if (afterEmptyLine || doc.directives.marker || !dc) {
                doc.commentBefore = comment;
            }
            else if (Node.isCollection(dc) && !dc.flow && dc.items.length > 0) {
                let it = dc.items[0];
                if (Node.isPair(it))
                    it = it.key;
                const cb = it.commentBefore;
                it.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
            else {
                const cb = dc.commentBefore;
                dc.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
        }
        if (afterDoc) {
            Array.prototype.push.apply(doc.errors, this.errors);
            Array.prototype.push.apply(doc.warnings, this.warnings);
        }
        else {
            doc.errors = this.errors;
            doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
    }
    /**
     * Current stream status information.
     *
     * Mostly useful at the end of input for an empty stream.
     */
    streamInfo() {
        return {
            comment: parsePrelude(this.prelude).comment,
            directives: this.directives,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    /**
     * Compose tokens into documents.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
            yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
    }
    /** Advance the composer by one CST token. */
    *next(token) {
        if (process.env.LOG_STREAM)
            console.dir(token, { depth: null });
        switch (token.type) {
            case 'directive':
                this.directives.add(token.source, (offset, message, warning) => {
                    const pos = getErrorPos(token);
                    pos[0] += offset;
                    this.onError(pos, 'BAD_DIRECTIVE', message, warning);
                });
                this.prelude.push(token.source);
                this.atDirectives = true;
                break;
            case 'document': {
                const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
                if (this.atDirectives && !doc.directives.marker)
                    this.onError(token, 'MISSING_CHAR', 'Missing directives-end indicator line');
                this.decorate(doc, false);
                if (this.doc)
                    yield this.doc;
                this.doc = doc;
                this.atDirectives = false;
                break;
            }
            case 'byte-order-mark':
            case 'space':
                break;
            case 'comment':
            case 'newline':
                this.prelude.push(token.source);
                break;
            case 'error': {
                const msg = token.source
                    ? `${token.message}: ${JSON.stringify(token.source)}`
                    : token.message;
                const error = new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg);
                if (this.atDirectives || !this.doc)
                    this.errors.push(error);
                else
                    this.doc.errors.push(error);
                break;
            }
            case 'doc-end': {
                if (!this.doc) {
                    const msg = 'Unexpected doc-end without preceding document';
                    this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg));
                    break;
                }
                const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
                this.decorate(this.doc, true);
                if (end.comment) {
                    const dc = this.doc.comment;
                    this.doc.comment = dc ? `${dc}\n${end.comment}` : end.comment;
                }
                this.doc.range[2] = end.offset;
                break;
            }
            default:
                this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', `Unsupported token ${token.type}`));
        }
    }
    /**
     * Call at end of input to yield any remaining document.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
            this.decorate(this.doc, true);
            yield this.doc;
            this.doc = null;
        }
        else if (forceDoc) {
            const opts = Object.assign({ directives: this.directives }, this.options);
            const doc = new Document.Document(undefined, opts);
            if (this.atDirectives)
                this.onError(endOffset, 'MISSING_CHAR', 'Missing directives-end indicator line');
            doc.range = [0, endOffset, endOffset];
            this.decorate(doc, false);
            yield doc;
        }
    }
}

exports.Composer = Composer;


/***/ }),

/***/ 8500:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Pair = __nccwpck_require__(8078);
var YAMLMap = __nccwpck_require__(4536);
var resolveProps = __nccwpck_require__(6682);
var utilContainsNewline = __nccwpck_require__(6576);
var utilMapIncludes = __nccwpck_require__(2097);

const startColMsg = 'All mapping items must start at the same column';
function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError) {
    var _a;
    const map = new YAMLMap.YAMLMap(ctx.schema);
    let offset = bm.offset;
    for (const { start, key, sep, value } of bm.items) {
        // key properties
        const keyProps = resolveProps.resolveProps(start, {
            indicator: 'explicit-key-ind',
            next: key || (sep === null || sep === void 0 ? void 0 : sep[0]),
            offset,
            onError,
            startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
            if (key) {
                if (key.type === 'block-seq')
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'A block sequence may not be used as an implicit map key');
                else if ('indent' in key && key.indent !== bm.indent)
                    onError(offset, 'BAD_INDENT', startColMsg);
            }
            if (!keyProps.anchor && !keyProps.tag && !sep) {
                // TODO: assert being at last item?
                if (keyProps.comment) {
                    if (map.comment)
                        map.comment += '\n' + keyProps.comment;
                    else
                        map.comment = keyProps.comment;
                }
                continue;
            }
        }
        else if (((_a = keyProps.found) === null || _a === void 0 ? void 0 : _a.indent) !== bm.indent)
            onError(offset, 'BAD_INDENT', startColMsg);
        if (implicitKey && utilContainsNewline.containsNewline(key))
            onError(key, // checked by containsNewline()
            'MULTILINE_IMPLICIT_KEY', 'Implicit keys need to be on a single line');
        // key value
        const keyStart = keyProps.end;
        const keyNode = key
            ? composeNode(ctx, key, keyProps, onError)
            : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
            onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
        // value properties
        const valueProps = resolveProps.resolveProps(sep || [], {
            indicator: 'map-value-ind',
            next: value,
            offset: keyNode.range[2],
            onError,
            startOnNewline: !key || key.type === 'block-scalar'
        });
        offset = valueProps.end;
        if (valueProps.found) {
            if (implicitKey) {
                if ((value === null || value === void 0 ? void 0 : value.type) === 'block-map' && !valueProps.hasNewline)
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'Nested mappings are not allowed in compact mappings');
                if (ctx.options.strict &&
                    keyProps.start < valueProps.found.offset - 1024)
                    onError(keyNode.range, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit block mapping key');
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
            offset = valueNode.range[2];
            map.items.push(new Pair.Pair(keyNode, valueNode));
        }
        else {
            // key with no value
            if (implicitKey)
                onError(keyNode.range, 'MISSING_CHAR', 'Implicit map keys need to be followed by map values');
            if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            map.items.push(new Pair.Pair(keyNode));
        }
    }
    map.range = [bm.offset, offset, offset];
    return map;
}

exports.resolveBlockMap = resolveBlockMap;


/***/ }),

/***/ 1989:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);

function resolveBlockScalar(scalar, strict, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, strict, onError);
    if (!header)
        return { value: '', type: null, comment: '', range: [start, start, start] };
    const type = header.mode === '>' ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    // determine the end of content & start of chomping
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === '' || content === '\r')
            chompStart = i;
        else
            break;
    }
    // shortcut for empty contents
    if (!scalar.source || chompStart === 0) {
        const value = header.chomp === '+' ? lines.map(line => line[0]).join('\n') : '';
        let end = start + header.length;
        if (scalar.source)
            end += scalar.source.length;
        return { value, type, comment: header.comment, range: [start, end, end] };
    }
    // find the indentation level to trim from start
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === '' || content === '\r') {
            if (header.indent === 0 && indent.length > trimIndent)
                trimIndent = indent.length;
        }
        else {
            if (indent.length < trimIndent) {
                const message = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
                onError(offset + indent.length, 'MISSING_CHAR', message);
            }
            if (header.indent === 0)
                trimIndent = indent.length;
            contentStart = i;
            break;
        }
        offset += indent.length + content.length + 1;
    }
    let value = '';
    let sep = '';
    let prevMoreIndented = false;
    // leading whitespace is kept intact
    for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + '\n';
    for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === '\r';
        if (crlf)
            content = content.slice(0, -1);
        /* istanbul ignore if already caught in lexer */
        if (content && indent.length < trimIndent) {
            const src = header.indent
                ? 'explicit indentation indicator'
                : 'first line';
            const message = `Block scalar lines must not be less indented than their ${src}`;
            onError(offset - content.length - (crlf ? 2 : 1), 'BAD_INDENT', message);
            indent = '';
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
        }
        else if (indent.length > trimIndent || content[0] === '\t') {
            // more-indented content within a folded block
            if (sep === ' ')
                sep = '\n';
            else if (!prevMoreIndented && sep === '\n')
                sep = '\n\n';
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
            prevMoreIndented = true;
        }
        else if (content === '') {
            // empty line
            if (sep === '\n')
                value += '\n';
            else
                sep = '\n';
        }
        else {
            value += sep + content;
            sep = ' ';
            prevMoreIndented = false;
        }
    }
    switch (header.chomp) {
        case '-':
            break;
        case '+':
            for (let i = chompStart; i < lines.length; ++i)
                value += '\n' + lines[i][0].slice(trimIndent);
            if (value[value.length - 1] !== '\n')
                value += '\n';
            break;
        default:
            value += '\n';
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
    /* istanbul ignore if should not happen */
    if (props[0].type !== 'block-scalar-header') {
        onError(props[0], 'IMPOSSIBLE', 'Block scalar header not found');
        return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = '';
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === '-' || ch === '+'))
            chomp = ch;
        else {
            const n = Number(ch);
            if (!indent && n)
                indent = n;
            else if (error === -1)
                error = offset + i;
        }
    }
    if (error !== -1)
        onError(error, 'UNEXPECTED_TOKEN', `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = '';
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
            case 'space':
                hasSpace = true;
            // fallthrough
            case 'newline':
                length += token.source.length;
                break;
            case 'comment':
                if (strict && !hasSpace) {
                    const message = 'Comments must be separated from other tokens by white space characters';
                    onError(token, 'MISSING_CHAR', message);
                }
                length += token.source.length;
                comment = token.source.substring(1);
                break;
            case 'error':
                onError(token, 'UNEXPECTED_TOKEN', token.message);
                length += token.source.length;
                break;
            /* istanbul ignore next should not happen */
            default: {
                const message = `Unexpected token in block scalar header: ${token.type}`;
                onError(token, 'UNEXPECTED_TOKEN', message);
                const ts = token.source;
                if (ts && typeof ts === 'string')
                    length += ts.length;
            }
        }
    }
    return { mode, indent, chomp, comment, length };
}
/** @returns Array of lines split up as `[indent, content]` */
function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m && m[1] ? [m[1], first.slice(m[1].length)] : ['', first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
    return lines;
}

exports.resolveBlockScalar = resolveBlockScalar;


/***/ }),

/***/ 3371:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var YAMLSeq = __nccwpck_require__(2515);
var resolveProps = __nccwpck_require__(6682);

function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError) {
    const seq = new YAMLSeq.YAMLSeq(ctx.schema);
    let offset = bs.offset;
    for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
            indicator: 'seq-item-ind',
            next: value,
            offset,
            onError,
            startOnNewline: true
        });
        offset = props.end;
        if (!props.found) {
            if (props.anchor || props.tag || value) {
                if (value && value.type === 'block-seq')
                    onError(offset, 'BAD_INDENT', 'All sequence items must start at the same column');
                else
                    onError(offset, 'MISSING_CHAR', 'Sequence item without - indicator');
            }
            else {
                // TODO: assert being at last item?
                if (props.comment)
                    seq.comment = props.comment;
                continue;
            }
        }
        const node = value
            ? composeNode(ctx, value, props, onError)
            : composeEmptyNode(ctx, offset, start, null, props, onError);
        offset = node.range[2];
        seq.items.push(node);
    }
    seq.range = [bs.offset, offset, offset];
    return seq;
}

exports.resolveBlockSeq = resolveBlockSeq;


/***/ }),

/***/ 3731:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveEnd(end, offset, reqSpace, onError) {
    let comment = '';
    if (end) {
        let hasSpace = false;
        let sep = '';
        for (const token of end) {
            const { source, type } = token;
            switch (type) {
                case 'space':
                    hasSpace = true;
                    break;
                case 'comment': {
                    if (reqSpace && !hasSpace)
                        onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                    const cb = source.substring(1) || ' ';
                    if (!comment)
                        comment = cb;
                    else
                        comment += sep + cb;
                    sep = '';
                    break;
                }
                case 'newline':
                    if (comment)
                        sep += source;
                    hasSpace = true;
                    break;
                default:
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${type} at node end`);
            }
            offset += source.length;
        }
    }
    return { comment, offset };
}

exports.resolveEnd = resolveEnd;


/***/ }),

/***/ 4517:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var YAMLMap = __nccwpck_require__(4536);
var YAMLSeq = __nccwpck_require__(2515);
var resolveEnd = __nccwpck_require__(3731);
var resolveProps = __nccwpck_require__(6682);
var utilContainsNewline = __nccwpck_require__(6576);
var utilMapIncludes = __nccwpck_require__(2097);

const blockMsg = 'Block collections are not allowed within flow collections';
const isBlock = (token) => token && (token.type === 'block-map' || token.type === 'block-seq');
function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError) {
    const isMap = fc.start.source === '{';
    const fcName = isMap ? 'flow map' : 'flow sequence';
    const coll = isMap
        ? new YAMLMap.YAMLMap(ctx.schema)
        : new YAMLSeq.YAMLSeq(ctx.schema);
    coll.flow = true;
    let offset = fc.offset;
    for (let i = 0; i < fc.items.length; ++i) {
        const { start, key, sep, value } = fc.items[i];
        const props = resolveProps.resolveProps(start, {
            flow: fcName,
            indicator: 'explicit-key-ind',
            next: key || (sep === null || sep === void 0 ? void 0 : sep[0]),
            offset,
            onError,
            startOnNewline: false
        });
        if (!props.found) {
            if (!props.anchor && !props.tag && !sep && !value) {
                if (i === 0 && props.comma)
                    onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
                else if (i < fc.items.length - 1)
                    onError(props.start, 'UNEXPECTED_TOKEN', `Unexpected empty item in ${fcName}`);
                if (props.comment) {
                    if (coll.comment)
                        coll.comment += '\n' + props.comment;
                    else
                        coll.comment = props.comment;
                }
                continue;
            }
            if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
                onError(key, // checked by containsNewline()
                'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
        }
        if (i === 0) {
            if (props.comma)
                onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
        }
        else {
            if (!props.comma)
                onError(props.start, 'MISSING_CHAR', `Missing , between ${fcName} items`);
            if (props.comment) {
                let prevItemComment = '';
                loop: for (const st of start) {
                    switch (st.type) {
                        case 'comma':
                        case 'space':
                            break;
                        case 'comment':
                            prevItemComment = st.source.substring(1);
                            break loop;
                        default:
                            break loop;
                    }
                }
                if (prevItemComment) {
                    let prev = coll.items[coll.items.length - 1];
                    if (Node.isPair(prev))
                        prev = prev.value || prev.key;
                    if (prev.comment)
                        prev.comment += '\n' + prevItemComment;
                    else
                        prev.comment = prevItemComment;
                    props.comment = props.comment.substring(prevItemComment.length + 1);
                }
            }
        }
        if (!isMap && !sep && !props.found) {
            // item is a value in a seq
            // → key & sep are empty, start does not include ? or :
            const valueNode = value
                ? composeNode(ctx, value, props, onError)
                : composeEmptyNode(ctx, props.end, sep, null, props, onError);
            coll.items.push(valueNode);
            offset = valueNode.range[2];
            if (isBlock(value))
                onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
        }
        else {
            // item is a key+value pair
            // key value
            const keyStart = props.end;
            const keyNode = key
                ? composeNode(ctx, key, props, onError)
                : composeEmptyNode(ctx, keyStart, start, null, props, onError);
            if (isBlock(key))
                onError(keyNode.range, 'BLOCK_IN_FLOW', blockMsg);
            // value properties
            const valueProps = resolveProps.resolveProps(sep || [], {
                flow: fcName,
                indicator: 'map-value-ind',
                next: value,
                offset: keyNode.range[2],
                onError,
                startOnNewline: false
            });
            if (valueProps.found) {
                if (!isMap && !props.found && ctx.options.strict) {
                    if (sep)
                        for (const st of sep) {
                            if (st === valueProps.found)
                                break;
                            if (st.type === 'newline') {
                                onError(st, 'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
                                break;
                            }
                        }
                    if (props.start < valueProps.found.offset - 1024)
                        onError(valueProps.found, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit flow sequence key');
                }
            }
            else if (value) {
                if ('source' in value && value.source && value.source[0] === ':')
                    onError(value, 'MISSING_CHAR', `Missing space after : in ${fcName}`);
                else
                    onError(valueProps.start, 'MISSING_CHAR', `Missing , or : between ${fcName} items`);
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : valueProps.found
                    ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError)
                    : null;
            if (valueNode) {
                if (isBlock(value))
                    onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
            }
            else if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            const pair = new Pair.Pair(keyNode, valueNode);
            if (isMap) {
                const map = coll;
                if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
                    onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
                map.items.push(pair);
            }
            else {
                const map = new YAMLMap.YAMLMap(ctx.schema);
                map.flow = true;
                map.items.push(pair);
                coll.items.push(map);
            }
            offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
    }
    const expectedEnd = isMap ? '}' : ']';
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce && ce.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
    else {
        onError(offset + 1, 'MISSING_CHAR', `Expected ${fcName} to end with ${expectedEnd}`);
        if (ce && ce.source.length !== 1)
            ee.unshift(ce);
    }
    if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
            if (coll.comment)
                coll.comment += '\n' + end.comment;
            else
                coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
    }
    else {
        coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
}

exports.resolveFlowCollection = resolveFlowCollection;


/***/ }),

/***/ 4518:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var resolveEnd = __nccwpck_require__(3731);

function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
        case 'scalar':
            _type = Scalar.Scalar.PLAIN;
            value = plainValue(source, _onError);
            break;
        case 'single-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_SINGLE;
            value = singleQuotedValue(source, _onError);
            break;
        case 'double-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_DOUBLE;
            value = doubleQuotedValue(source, _onError);
            break;
        /* istanbul ignore next should not happen */
        default:
            onError(scalar, 'UNEXPECTED_TOKEN', `Expected a flow scalar value, but found: ${type}`);
            return {
                value: '',
                type: null,
                comment: '',
                range: [offset, offset + source.length, offset + source.length]
            };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
    };
}
function plainValue(source, onError) {
    let badChar = '';
    switch (source[0]) {
        /* istanbul ignore next should not happen */
        case '\t':
            badChar = 'a tab character';
            break;
        case ',':
            badChar = 'flow indicator character ,';
            break;
        case '%':
            badChar = 'directive indicator character %';
            break;
        case '|':
        case '>': {
            badChar = `block scalar indicator ${source[0]}`;
            break;
        }
        case '@':
        case '`': {
            badChar = `reserved character ${source[0]}`;
            break;
        }
    }
    if (badChar)
        onError(0, 'BAD_SCALAR_START', `Plain value cannot start with ${badChar}`);
    return foldLines(source);
}
function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, 'MISSING_CHAR', "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
    /**
     * The negative lookbehind here and in the `re` RegExp is to
     * prevent causing a polynomial search time in certain cases.
     *
     * The try-catch is for Safari, which doesn't support this yet:
     * https://caniuse.com/js-regexp-lookbehind
     */
    let first, line;
    try {
        first = new RegExp('(.*?)(?<![ \t])[ \t]*\r?\n', 'sy');
        line = new RegExp('[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n', 'sy');
    }
    catch (_) {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
        return source;
    let res = match[1];
    let sep = ' ';
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while ((match = line.exec(source))) {
        if (match[1] === '') {
            if (sep === '\n')
                res += sep;
            else
                sep = '\n';
        }
        else {
            res += sep + match[1];
            sep = ' ';
        }
        pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + ((match && match[1]) || '');
}
function doubleQuotedValue(source, onError) {
    let res = '';
    for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === '\r' && source[i + 1] === '\n')
            continue;
        if (ch === '\n') {
            const { fold, offset } = foldNewline(source, i);
            res += fold;
            i = offset;
        }
        else if (ch === '\\') {
            let next = source[++i];
            const cc = escapeCodes[next];
            if (cc)
                res += cc;
            else if (next === '\n') {
                // skip escaped newlines, but still trim the following line
                next = source[i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === '\r' && source[i + 1] === '\n') {
                // skip escaped CRLF newlines, but still trim the following line
                next = source[++i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === 'x' || next === 'u' || next === 'U') {
                const length = { x: 2, u: 4, U: 8 }[next];
                res += parseCharCode(source, i + 1, length, onError);
                i += length;
            }
            else {
                const raw = source.substr(i - 1, 2);
                onError(i - 1, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
                res += raw;
            }
        }
        else if (ch === ' ' || ch === '\t') {
            // trim trailing whitespace
            const wsStart = i;
            let next = source[i + 1];
            while (next === ' ' || next === '\t')
                next = source[++i + 1];
            if (next !== '\n' && !(next === '\r' && source[i + 2] === '\n'))
                res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        }
        else {
            res += ch;
        }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, 'MISSING_CHAR', 'Missing closing "quote');
    return res;
}
/**
 * Fold a single newline into a space, multiple newlines to N - 1 newlines.
 * Presumes `source[offset] === '\n'`
 */
function foldNewline(source, offset) {
    let fold = '';
    let ch = source[offset + 1];
    while (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        if (ch === '\r' && source[offset + 2] !== '\n')
            break;
        if (ch === '\n')
            fold += '\n';
        offset += 1;
        ch = source[offset + 1];
    }
    if (!fold)
        fold = ' ';
    return { fold, offset };
}
const escapeCodes = {
    '0': '\0',
    a: '\x07',
    b: '\b',
    e: '\x1b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    N: '\u0085',
    _: '\u00a0',
    L: '\u2028',
    P: '\u2029',
    ' ': ' ',
    '"': '"',
    '/': '/',
    '\\': '\\',
    '\t': '\t'
};
function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
        return raw;
    }
    return String.fromCodePoint(code);
}

exports.resolveFlowScalar = resolveFlowScalar;


/***/ }),

/***/ 6682:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveProps(tokens, { flow, indicator, next, offset, onError, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = '';
    let commentSep = '';
    let hasNewline = false;
    let reqSpace = false;
    let anchor = null;
    let tag = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
        if (reqSpace) {
            if (token.type !== 'space' &&
                token.type !== 'newline' &&
                token.type !== 'comma')
                onError(token.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
            reqSpace = false;
        }
        switch (token.type) {
            case 'space':
                // At the doc level, tabs at line start may be parsed
                // as leading white space rather than indentation.
                // In a flow collection, only the parser handles indent.
                if (!flow &&
                    atNewline &&
                    indicator !== 'doc-start' &&
                    token.source[0] === '\t')
                    onError(token, 'TAB_AS_INDENT', 'Tabs are not allowed as indentation');
                hasSpace = true;
                break;
            case 'comment': {
                if (!hasSpace)
                    onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                const cb = token.source.substring(1) || ' ';
                if (!comment)
                    comment = cb;
                else
                    comment += commentSep + cb;
                commentSep = '';
                atNewline = false;
                break;
            }
            case 'newline':
                if (atNewline) {
                    if (comment)
                        comment += token.source;
                    else
                        spaceBefore = true;
                }
                else
                    commentSep += token.source;
                atNewline = true;
                hasNewline = true;
                hasSpace = true;
                break;
            case 'anchor':
                if (anchor)
                    onError(token, 'MULTIPLE_ANCHORS', 'A node can have at most one anchor');
                anchor = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            case 'tag': {
                if (tag)
                    onError(token, 'MULTIPLE_TAGS', 'A node can have at most one tag');
                tag = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            }
            case indicator:
                // Could here handle preceding comments differently
                if (anchor || tag)
                    onError(token, 'BAD_PROP_ORDER', `Anchors and tags must be after the ${token.source} indicator`);
                found = token;
                atNewline = false;
                hasSpace = false;
                break;
            case 'comma':
                if (flow) {
                    if (comma)
                        onError(token, 'UNEXPECTED_TOKEN', `Unexpected , in ${flow}`);
                    comma = token;
                    atNewline = false;
                    hasSpace = false;
                    break;
                }
            // else fallthrough
            default:
                onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.type} token`);
                atNewline = false;
                hasSpace = false;
        }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace &&
        next &&
        next.type !== 'space' &&
        next.type !== 'newline' &&
        next.type !== 'comma' &&
        (next.type !== 'scalar' || next.source !== ''))
        onError(next.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
    return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        end,
        start: start !== null && start !== void 0 ? start : end
    };
}

exports.resolveProps = resolveProps;


/***/ }),

/***/ 6576:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function containsNewline(key) {
    if (!key)
        return null;
    switch (key.type) {
        case 'alias':
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            if (key.source.includes('\n'))
                return true;
            if (key.end)
                for (const st of key.end)
                    if (st.type === 'newline')
                        return true;
            return false;
        case 'flow-collection':
            for (const it of key.items) {
                for (const st of it.start)
                    if (st.type === 'newline')
                        return true;
                if (it.sep)
                    for (const st of it.sep)
                        if (st.type === 'newline')
                            return true;
                if (containsNewline(it.key) || containsNewline(it.value))
                    return true;
            }
            return false;
        default:
            return true;
    }
}

exports.containsNewline = containsNewline;


/***/ }),

/***/ 2581:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function emptyScalarPosition(offset, before, pos) {
    if (before) {
        if (pos === null)
            pos = before.length;
        for (let i = pos - 1; i >= 0; --i) {
            let st = before[i];
            switch (st.type) {
                case 'space':
                case 'comment':
                case 'newline':
                    offset -= st.source.length;
                    continue;
            }
            // Technically, an empty scalar is immediately after the last non-empty
            // node, but it's more useful to place it after any whitespace.
            st = before[++i];
            while ((st === null || st === void 0 ? void 0 : st.type) === 'space') {
                offset += st.source.length;
                st = before[++i];
            }
            break;
        }
    }
    return offset;
}

exports.emptyScalarPosition = emptyScalarPosition;


/***/ }),

/***/ 2097:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);

function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
        return false;
    const isEqual = typeof uniqueKeys === 'function'
        ? uniqueKeys
        : (a, b) => a === b ||
            (Node.isScalar(a) &&
                Node.isScalar(b) &&
                a.value === b.value &&
                !(a.value === '<<' && ctx.schema.merge));
    return items.some(pair => isEqual(pair.key, search));
}

exports.mapIncludes = mapIncludes;


/***/ }),

/***/ 4810:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(8572);
var Collection = __nccwpck_require__(6842);
var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var toJS = __nccwpck_require__(2273);
var options = __nccwpck_require__(8603);
var Schema = __nccwpck_require__(9885);
var stringify = __nccwpck_require__(1530);
var stringifyDocument = __nccwpck_require__(6253);
var anchors = __nccwpck_require__(5987);
var applyReviver = __nccwpck_require__(5873);
var createNode = __nccwpck_require__(2237);
var directives = __nccwpck_require__(3599);

class Document {
    constructor(value, replacer, options$1) {
        /** A comment before this Document */
        this.commentBefore = null;
        /** A comment immediately after this Document */
        this.comment = null;
        /** Errors encountered during parsing. */
        this.errors = [];
        /** Warnings encountered during parsing. */
        this.warnings = [];
        Object.defineProperty(this, Node.NODE_TYPE, { value: Node.DOC });
        let _replacer = null;
        if (typeof replacer === 'function' || Array.isArray(replacer)) {
            _replacer = replacer;
        }
        else if (options$1 === undefined && replacer) {
            options$1 = replacer;
            replacer = undefined;
        }
        const opt = Object.assign({}, options.defaultOptions, options$1);
        this.options = opt;
        let { version } = opt;
        if (options$1 === null || options$1 === void 0 ? void 0 : options$1.directives) {
            this.directives = options$1.directives.atDocument();
            if (this.directives.yaml.explicit)
                version = this.directives.yaml.version;
        }
        else
            this.directives = new directives.Directives({ version });
        this.setSchema(version, options$1);
        if (value === undefined)
            this.contents = null;
        else {
            this.contents = this.createNode(value, _replacer, options$1);
        }
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
        const copy = Object.create(Document.prototype, {
            [Node.NODE_TYPE]: { value: Node.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = Node.isNode(this.contents)
            ? this.contents.clone(copy.schema)
            : this.contents;
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /** Adds a value to the document. */
    add(value) {
        if (assertCollection(this.contents))
            this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path, value) {
        if (assertCollection(this.contents))
            this.contents.addIn(path, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node, name) {
        if (!node.anchor) {
            const prev = anchors.anchorNames(this);
            node.anchor =
                !name || prev.has(name) ? anchors.findNewAnchor(name || 'a', prev) : name;
        }
        return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
        let _replacer = undefined;
        if (typeof replacer === 'function') {
            value = replacer.call({ '': value }, '', value);
            _replacer = replacer;
        }
        else if (Array.isArray(replacer)) {
            const keyToStr = (v) => typeof v === 'number' || v instanceof String || v instanceof Number;
            const asStr = replacer.filter(keyToStr).map(String);
            if (asStr.length > 0)
                replacer = replacer.concat(asStr);
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options || {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || 'a');
        const ctx = {
            aliasDuplicateObjects: aliasDuplicateObjects !== null && aliasDuplicateObjects !== void 0 ? aliasDuplicateObjects : true,
            keepUndefined: keepUndefined !== null && keepUndefined !== void 0 ? keepUndefined : false,
            onAnchor,
            onTagObj,
            replacer: _replacer,
            schema: this.schema,
            sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && Node.isCollection(node))
            node.flow = true;
        setAnchors();
        return node;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
            if (this.contents == null)
                return false;
            this.contents = null;
            return true;
        }
        return assertCollection(this.contents)
            ? this.contents.deleteIn(path)
            : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key, keepScalar) {
        return Node.isCollection(this.contents)
            ? this.contents.get(key, keepScalar)
            : undefined;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
            return !keepScalar && Node.isScalar(this.contents)
                ? this.contents.value
                : this.contents;
        return Node.isCollection(this.contents)
            ? this.contents.getIn(path, keepScalar)
            : undefined;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key) {
        return Node.isCollection(this.contents) ? this.contents.has(key) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path) {
        if (Collection.isEmptyPath(path))
            return this.contents !== undefined;
        return Node.isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key, value) {
        if (this.contents == null) {
            this.contents = Collection.collectionFromPath(this.schema, [key], value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.set(key, value);
        }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        if (Collection.isEmptyPath(path))
            this.contents = value;
        else if (this.contents == null) {
            this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.setIn(path, value);
        }
    }
    /**
     * Change the YAML version and schema used by the document.
     *
     * Overrides all previously set schema options
     */
    setSchema(version, options) {
        let _options;
        switch (String(version)) {
            case '1.1':
                this.directives.yaml.version = '1.1';
                _options = Object.assign({ merge: true, resolveKnownTags: false, schema: 'yaml-1.1' }, options);
                break;
            case '1.2':
                this.directives.yaml.version = '1.2';
                _options = Object.assign({ merge: false, resolveKnownTags: true, schema: 'core' }, options);
                break;
            default: {
                const sv = JSON.stringify(version);
                throw new Error(`Expected '1.1' or '1.2' as version, but found: ${sv}`);
            }
        }
        this.schema = new Schema.Schema(_options);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
            anchors: new Map(),
            doc: this,
            keep: !json,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100,
            stringify: stringify.stringify
        };
        const res = toJS.toJS(this.contents, jsonArg || '', ctx);
        if (typeof onAnchor === 'function')
            for (const { count, res } of ctx.anchors.values())
                onAnchor(res, count);
        return typeof reviver === 'function'
            ? applyReviver.applyReviver(reviver, { '': res }, '', res)
            : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
        if (this.errors.length > 0)
            throw new Error('Document with errors cannot be stringified');
        if ('indent' in options &&
            (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
            const s = JSON.stringify(options.indent);
            throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
    }
}
function assertCollection(contents) {
    if (Node.isCollection(contents))
        return true;
    throw new Error('Expected a YAML collection as document contents');
}

exports.Document = Document;


/***/ }),

/***/ 5987:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var visit = __nccwpck_require__(5966);

/**
 * Verify that the input string is a valid anchor.
 *
 * Will throw on errors.
 */
function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
    }
    return true;
}
function anchorNames(root) {
    const anchors = new Set();
    visit.visit(root, {
        Value(_key, node) {
            if (node.anchor)
                anchors.add(node.anchor);
        }
    });
    return anchors;
}
/** Find a new anchor name with the given `prefix` and a one-indexed suffix. */
function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
            return name;
    }
}
function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = new Map();
    let prevAnchors = null;
    return {
        onAnchor(source) {
            aliasObjects.push(source);
            if (!prevAnchors)
                prevAnchors = anchorNames(doc);
            const anchor = findNewAnchor(prefix, prevAnchors);
            prevAnchors.add(anchor);
            return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors() {
            for (const source of aliasObjects) {
                const ref = sourceObjects.get(source);
                if (typeof ref === 'object' &&
                    ref.anchor &&
                    (Node.isScalar(ref.node) || Node.isCollection(ref.node))) {
                    ref.node.anchor = ref.anchor;
                }
                else {
                    const error = new Error('Failed to resolve repeated object (this should not happen)');
                    error.source = source;
                    throw error;
                }
            }
        },
        sourceObjects
    };
}

exports.anchorIsValid = anchorIsValid;
exports.anchorNames = anchorNames;
exports.createNodeAnchors = createNodeAnchors;
exports.findNewAnchor = findNewAnchor;


/***/ }),

/***/ 5873:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
 * in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
 * 2021 edition: https://tc39.es/ecma262/#sec-json.parse
 *
 * Includes extensions for handling Map and Set objects.
 */
function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === 'object') {
        if (Array.isArray(val)) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const v0 = val[i];
                const v1 = applyReviver(reviver, val, String(i), v0);
                if (v1 === undefined)
                    delete val[i];
                else if (v1 !== v0)
                    val[i] = v1;
            }
        }
        else if (val instanceof Map) {
            for (const k of Array.from(val.keys())) {
                const v0 = val.get(k);
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    val.delete(k);
                else if (v1 !== v0)
                    val.set(k, v1);
            }
        }
        else if (val instanceof Set) {
            for (const v0 of Array.from(val)) {
                const v1 = applyReviver(reviver, val, v0, v0);
                if (v1 === undefined)
                    val.delete(v0);
                else if (v1 !== v0) {
                    val.delete(v0);
                    val.add(v1);
                }
            }
        }
        else {
            for (const [k, v0] of Object.entries(val)) {
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    delete val[k];
                else if (v1 !== v0)
                    val[k] = v1;
            }
        }
    }
    return reviver.call(obj, key, val);
}

exports.applyReviver = applyReviver;


/***/ }),

/***/ 2237:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Alias = __nccwpck_require__(8572);
var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);

const defaultTagPrefix = 'tag:yaml.org,2002:';
function findTagObject(value, tagName, tags) {
    if (tagName) {
        const match = tags.filter(t => t.tag === tagName);
        const tagObj = match.find(t => !t.format) || match[0];
        if (!tagObj)
            throw new Error(`Tag ${tagName} not found`);
        return tagObj;
    }
    return tags.find(t => t.identify && t.identify(value) && !t.format);
}
function createNode(value, tagName, ctx) {
    var _a, _b;
    if (Node.isDocument(value))
        value = value.contents;
    if (Node.isNode(value))
        return value;
    if (Node.isPair(value)) {
        const map = (_b = (_a = ctx.schema[Node.MAP]).createNode) === null || _b === void 0 ? void 0 : _b.call(_a, ctx.schema, null, ctx);
        map.items.push(value);
        return map;
    }
    if (value instanceof String ||
        value instanceof Number ||
        value instanceof Boolean ||
        (typeof BigInt === 'function' && value instanceof BigInt) // not supported everywhere
    ) {
        // https://tc39.es/ecma262/#sec-serializejsonproperty
        value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
    // Detect duplicate references to the same object & use Alias nodes for all
    // after first. The `ref` wrapper allows for circular references to resolve.
    let ref = undefined;
    if (aliasDuplicateObjects && value && typeof value === 'object') {
        ref = sourceObjects.get(value);
        if (ref) {
            if (!ref.anchor)
                ref.anchor = onAnchor(value);
            return new Alias.Alias(ref.anchor);
        }
        else {
            ref = { anchor: null, node: null };
            sourceObjects.set(value, ref);
        }
    }
    if (tagName && tagName.startsWith('!!'))
        tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
        if (value && typeof value.toJSON === 'function')
            value = value.toJSON();
        if (!value || typeof value !== 'object') {
            const node = new Scalar.Scalar(value);
            if (ref)
                ref.node = node;
            return node;
        }
        tagObj =
            value instanceof Map
                ? schema[Node.MAP]
                : Symbol.iterator in Object(value)
                    ? schema[Node.SEQ]
                    : schema[Node.MAP];
    }
    if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
    }
    const node = (tagObj === null || tagObj === void 0 ? void 0 : tagObj.createNode)
        ? tagObj.createNode(ctx.schema, value, ctx)
        : new Scalar.Scalar(value);
    if (tagName)
        node.tag = tagName;
    if (ref)
        ref.node = node;
    return node;
}

exports.createNode = createNode;


/***/ }),

/***/ 3599:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var visit = __nccwpck_require__(5966);

const escapeChars = {
    '!': '%21',
    ',': '%2C',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D'
};
const escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, ch => escapeChars[ch]);
class Directives {
    constructor(yaml, tags) {
        /**
         * The directives-end/doc-start marker `---`. If `null`, a marker may still be
         * included in the document's stringified representation.
         */
        this.marker = null;
        this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
        const copy = new Directives(this.yaml, this.tags);
        copy.marker = this.marker;
        return copy;
    }
    /**
     * During parsing, get a Directives instance for the current document and
     * update the stream state according to the current version's spec.
     */
    atDocument() {
        const res = new Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
            case '1.1':
                this.atNextDocument = true;
                break;
            case '1.2':
                this.atNextDocument = false;
                this.yaml = {
                    explicit: Directives.defaultYaml.explicit,
                    version: '1.2'
                };
                this.tags = Object.assign({}, Directives.defaultTags);
                break;
        }
        return res;
    }
    /**
     * @param onError - May be called even if the action was successful
     * @returns `true` on success
     */
    add(line, onError) {
        if (this.atNextDocument) {
            this.yaml = { explicit: Directives.defaultYaml.explicit, version: '1.1' };
            this.tags = Object.assign({}, Directives.defaultTags);
            this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
            case '%TAG': {
                if (parts.length !== 2) {
                    onError(0, '%TAG directive should contain exactly two parts');
                    if (parts.length < 2)
                        return false;
                }
                const [handle, prefix] = parts;
                this.tags[handle] = prefix;
                return true;
            }
            case '%YAML': {
                this.yaml.explicit = true;
                if (parts.length < 1) {
                    onError(0, '%YAML directive should contain exactly one part');
                    return false;
                }
                const [version] = parts;
                if (version === '1.1' || version === '1.2') {
                    this.yaml.version = version;
                    return true;
                }
                else {
                    onError(6, `Unsupported YAML version ${version}`, true);
                    return false;
                }
            }
            default:
                onError(0, `Unknown directive ${name}`, true);
                return false;
        }
    }
    /**
     * Resolves a tag, matching handles to those defined in %TAG directives.
     *
     * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
     *   `'!local'` tag, or `null` if unresolvable.
     */
    tagName(source, onError) {
        if (source === '!')
            return '!'; // non-specific tag
        if (source[0] !== '!') {
            onError(`Not a valid tag: ${source}`);
            return null;
        }
        if (source[1] === '<') {
            const verbatim = source.slice(2, -1);
            if (verbatim === '!' || verbatim === '!!') {
                onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
                return null;
            }
            if (source[source.length - 1] !== '>')
                onError('Verbatim tags must end with a >');
            return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/);
        if (!suffix)
            onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix)
            return prefix + decodeURIComponent(suffix);
        if (handle === '!')
            return source; // local tag
        onError(`Could not resolve tag: ${source}`);
        return null;
    }
    /**
     * Given a fully resolved tag, returns its printable string form,
     * taking into account current tag prefixes and defaults.
     */
    tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
            if (tag.startsWith(prefix))
                return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === '!' ? tag : `!<${tag}>`;
    }
    toString(doc) {
        const lines = this.yaml.explicit
            ? [`%YAML ${this.yaml.version || '1.2'}`]
            : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && Node.isNode(doc.contents)) {
            const tags = {};
            visit.visit(doc.contents, (_key, node) => {
                if (Node.isNode(node) && node.tag)
                    tags[node.tag] = true;
            });
            tagNames = Object.keys(tags);
        }
        else
            tagNames = [];
        for (const [handle, prefix] of tagEntries) {
            if (handle === '!!' && prefix === 'tag:yaml.org,2002:')
                continue;
            if (!doc || tagNames.some(tn => tn.startsWith(prefix)))
                lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join('\n');
    }
}
Directives.defaultYaml = { explicit: false, version: '1.2' };
Directives.defaultTags = { '!!': 'tag:yaml.org,2002:' };

exports.Directives = Directives;


/***/ }),

/***/ 3363:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


class YAMLError extends Error {
    constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
    }
}
class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLParseError', pos, code, message);
    }
}
class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLWarning', pos, code, message);
    }
}
const prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
        return;
    error.linePos = error.pos.map(pos => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src
        .substring(lc.lineStarts[line - 1], lc.lineStarts[line])
        .replace(/[\n\r]+$/, '');
    // Trim to max 80 chars, keeping col position near the middle
    if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = '…' + lineStr.substring(trimStart);
        ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + '…';
    // Include previous line in context if pointing at line start
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        // Regexp won't match if start is trimmed
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
            prev = prev.substring(0, 79) + '…\n';
        lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end && end.line === line && end.col > col) {
            count = Math.min(end.col - col, 80 - ci);
        }
        const pointer = ' '.repeat(ci) + '^'.repeat(count);
        error.message += `:\n\n${lineStr}\n${pointer}\n`;
    }
};

exports.YAMLError = YAMLError;
exports.YAMLParseError = YAMLParseError;
exports.YAMLWarning = YAMLWarning;
exports.prettifyError = prettifyError;


/***/ }),

/***/ 9500:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var composer = __nccwpck_require__(3059);
var Document = __nccwpck_require__(4810);
var Schema = __nccwpck_require__(9885);
var errors = __nccwpck_require__(3363);
var Alias = __nccwpck_require__(8572);
var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var Scalar = __nccwpck_require__(835);
var YAMLMap = __nccwpck_require__(4536);
var YAMLSeq = __nccwpck_require__(2515);
var options = __nccwpck_require__(8603);
var cst = __nccwpck_require__(3803);
var lexer = __nccwpck_require__(6766);
var lineCounter = __nccwpck_require__(7495);
var parser = __nccwpck_require__(4089);
var publicApi = __nccwpck_require__(330);
var visit = __nccwpck_require__(5966);



exports.Composer = composer.Composer;
exports.Document = Document.Document;
exports.Schema = Schema.Schema;
exports.YAMLError = errors.YAMLError;
exports.YAMLParseError = errors.YAMLParseError;
exports.YAMLWarning = errors.YAMLWarning;
exports.Alias = Alias.Alias;
exports.isAlias = Node.isAlias;
exports.isCollection = Node.isCollection;
exports.isDocument = Node.isDocument;
exports.isMap = Node.isMap;
exports.isNode = Node.isNode;
exports.isPair = Node.isPair;
exports.isScalar = Node.isScalar;
exports.isSeq = Node.isSeq;
exports.Pair = Pair.Pair;
exports.Scalar = Scalar.Scalar;
exports.YAMLMap = YAMLMap.YAMLMap;
exports.YAMLSeq = YAMLSeq.YAMLSeq;
exports.defaultOptions = options.defaultOptions;
exports.CST = cst;
exports.Lexer = lexer.Lexer;
exports.LineCounter = lineCounter.LineCounter;
exports.Parser = parser.Parser;
exports.parse = publicApi.parse;
exports.parseAllDocuments = publicApi.parseAllDocuments;
exports.parseDocument = publicApi.parseDocument;
exports.stringify = publicApi.stringify;
exports.visit = visit.visit;


/***/ }),

/***/ 3613:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function debug(logLevel, ...messages) {
    if (logLevel === 'debug')
        console.log(...messages);
}
function warn(logLevel, warning) {
    if (logLevel === 'debug' || logLevel === 'warn') {
        if (typeof process !== 'undefined' && process.emitWarning)
            process.emitWarning(warning);
        else
            console.warn(warning);
    }
}

exports.debug = debug;
exports.warn = warn;


/***/ }),

/***/ 8572:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var anchors = __nccwpck_require__(5987);
var visit = __nccwpck_require__(5966);
var Node = __nccwpck_require__(6713);

class Alias extends Node.NodeBase {
    constructor(source) {
        super(Node.ALIAS);
        this.source = source;
        Object.defineProperty(this, 'tag', {
            set() {
                throw new Error('Alias nodes cannot have tags');
            }
        });
    }
    /**
     * Resolve the value of this alias within `doc`, finding the last
     * instance of the `source` anchor before this node.
     */
    resolve(doc) {
        let found = undefined;
        visit.visit(doc, {
            Node: (_key, node) => {
                if (node === this)
                    return visit.visit.BREAK;
                if (node.anchor === this.source)
                    found = node;
            }
        });
        return found;
    }
    toJSON(_arg, ctx) {
        if (!ctx)
            return { source: this.source };
        const { anchors, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc);
        if (!source) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new ReferenceError(msg);
        }
        const data = anchors.get(source);
        /* istanbul ignore if */
        if (!data || data.res === undefined) {
            const msg = 'This should not happen: Alias anchor was not resolved?';
            throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
                data.aliasCount = getAliasCount(doc, source, anchors);
            if (data.count * data.aliasCount > maxAliasCount) {
                const msg = 'Excessive alias count indicates a resource exhaustion attack';
                throw new ReferenceError(msg);
            }
        }
        return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
            anchors.anchorIsValid(this.source);
            if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
                const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw new Error(msg);
            }
            if (ctx.implicitKey)
                return `${src} `;
        }
        return src;
    }
}
function getAliasCount(doc, node, anchors) {
    if (Node.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors && source && anchors.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
    }
    else if (Node.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
            const c = getAliasCount(doc, item, anchors);
            if (c > count)
                count = c;
        }
        return count;
    }
    else if (Node.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors);
        const vc = getAliasCount(doc, node.value, anchors);
        return Math.max(kc, vc);
    }
    return 1;
}

exports.Alias = Alias;


/***/ }),

/***/ 6842:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(2237);
var Node = __nccwpck_require__(6713);

function collectionFromPath(schema, path, value) {
    let v = value;
    for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === 'number' && Number.isInteger(k) && k >= 0) {
            const a = [];
            a[k] = v;
            v = a;
        }
        else {
            v = new Map([[k, v]]);
        }
    }
    return createNode.createNode(v, undefined, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
            throw new Error('This should not happen, please report a bug.');
        },
        schema,
        sourceObjects: new Map()
    });
}
// null, undefined, or an empty non-string iterable (e.g. [])
const isEmptyPath = (path) => path == null ||
    (typeof path === 'object' && !!path[Symbol.iterator]().next().done);
class Collection extends Node.NodeBase {
    constructor(type, schema) {
        super(type);
        Object.defineProperty(this, 'schema', {
            value: schema,
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
    /**
     * Create a copy of this collection.
     *
     * @param schema - If defined, overwrites the original's schema
     */
    clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
            copy.schema = schema;
        copy.items = copy.items.map(it => Node.isNode(it) || Node.isPair(it) ? it.clone(schema) : it);
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /**
     * Adds a value to the collection. For `!!map` and `!!omap` the value must
     * be a Pair instance or a `{ key, value }` object, which may not have a key
     * that already exists in the map.
     */
    addIn(path, value) {
        if (isEmptyPath(path))
            this.add(value);
        else {
            const [key, ...rest] = path;
            const node = this.get(key, true);
            if (Node.isCollection(node))
                node.addIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
    /**
     * Removes a value from the collection.
     * @returns `true` if the item was found and removed.
     */
    deleteIn([key, ...rest]) {
        if (rest.length === 0)
            return this.delete(key);
        const node = this.get(key, true);
        if (Node.isCollection(node))
            return node.deleteIn(rest);
        else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn([key, ...rest], keepScalar) {
        const node = this.get(key, true);
        if (rest.length === 0)
            return !keepScalar && Node.isScalar(node) ? node.value : node;
        else
            return Node.isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
    }
    hasAllNullValues(allowScalar) {
        return this.items.every(node => {
            if (!Node.isPair(node))
                return false;
            const n = node.value;
            return (n == null ||
                (allowScalar &&
                    Node.isScalar(n) &&
                    n.value == null &&
                    !n.commentBefore &&
                    !n.comment &&
                    !n.tag));
        });
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     */
    hasIn([key, ...rest]) {
        if (rest.length === 0)
            return this.has(key);
        const node = this.get(key, true);
        return Node.isCollection(node) ? node.hasIn(rest) : false;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn([key, ...rest], value) {
        if (rest.length === 0) {
            this.set(key, value);
        }
        else {
            const node = this.get(key, true);
            if (Node.isCollection(node))
                node.setIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
}
Collection.maxFlowStringSingleLineLength = 60;

exports.Collection = Collection;
exports.collectionFromPath = collectionFromPath;
exports.isEmptyPath = isEmptyPath;


/***/ }),

/***/ 6713:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const ALIAS = Symbol.for('yaml.alias');
const DOC = Symbol.for('yaml.document');
const MAP = Symbol.for('yaml.map');
const PAIR = Symbol.for('yaml.pair');
const SCALAR = Symbol.for('yaml.scalar');
const SEQ = Symbol.for('yaml.seq');
const NODE_TYPE = Symbol.for('yaml.node.type');
const isAlias = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === ALIAS;
const isDocument = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === DOC;
const isMap = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === MAP;
const isPair = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === PAIR;
const isScalar = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SCALAR;
const isSeq = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SEQ;
function isCollection(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case MAP:
            case SEQ:
                return true;
        }
    return false;
}
function isNode(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case ALIAS:
            case MAP:
            case SCALAR:
            case SEQ:
                return true;
        }
    return false;
}
const hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
class NodeBase {
    constructor(type) {
        Object.defineProperty(this, NODE_TYPE, { value: type });
    }
    /** Create a copy of this node.  */
    clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
}

exports.ALIAS = ALIAS;
exports.DOC = DOC;
exports.MAP = MAP;
exports.NODE_TYPE = NODE_TYPE;
exports.NodeBase = NodeBase;
exports.PAIR = PAIR;
exports.SCALAR = SCALAR;
exports.SEQ = SEQ;
exports.hasAnchor = hasAnchor;
exports.isAlias = isAlias;
exports.isCollection = isCollection;
exports.isDocument = isDocument;
exports.isMap = isMap;
exports.isNode = isNode;
exports.isPair = isPair;
exports.isScalar = isScalar;
exports.isSeq = isSeq;


/***/ }),

/***/ 8078:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(2237);
var stringifyPair = __nccwpck_require__(2869);
var addPairToJSMap = __nccwpck_require__(3441);
var Node = __nccwpck_require__(6713);

function createPair(key, value, ctx) {
    const k = createNode.createNode(key, undefined, ctx);
    const v = createNode.createNode(value, undefined, ctx);
    return new Pair(k, v);
}
class Pair {
    constructor(key, value = null) {
        Object.defineProperty(this, Node.NODE_TYPE, { value: Node.PAIR });
        this.key = key;
        this.value = value;
    }
    clone(schema) {
        let { key, value } = this;
        if (Node.isNode(key))
            key = key.clone(schema);
        if (Node.isNode(value))
            value = value.clone(schema);
        return new Pair(key, value);
    }
    toJSON(_, ctx) {
        const pair = ctx && ctx.mapAsMap ? new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
        return ctx && ctx.doc
            ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep)
            : JSON.stringify(this);
    }
}

exports.Pair = Pair;
exports.createPair = createPair;


/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var toJS = __nccwpck_require__(2273);

const isScalarValue = (value) => !value || (typeof value !== 'function' && typeof value !== 'object');
class Scalar extends Node.NodeBase {
    constructor(value) {
        super(Node.SCALAR);
        this.value = value;
    }
    toJSON(arg, ctx) {
        return ctx && ctx.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
        return String(this.value);
    }
}
Scalar.BLOCK_FOLDED = 'BLOCK_FOLDED';
Scalar.BLOCK_LITERAL = 'BLOCK_LITERAL';
Scalar.PLAIN = 'PLAIN';
Scalar.QUOTE_DOUBLE = 'QUOTE_DOUBLE';
Scalar.QUOTE_SINGLE = 'QUOTE_SINGLE';

exports.Scalar = Scalar;
exports.isScalarValue = isScalarValue;


/***/ }),

/***/ 4536:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyCollection = __nccwpck_require__(1537);
var addPairToJSMap = __nccwpck_require__(3441);
var Collection = __nccwpck_require__(6842);
var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var Scalar = __nccwpck_require__(835);

function findPair(items, key) {
    const k = Node.isScalar(key) ? key.value : key;
    for (const it of items) {
        if (Node.isPair(it)) {
            if (it.key === key || it.key === k)
                return it;
            if (Node.isScalar(it.key) && it.key.value === k)
                return it;
        }
    }
    return undefined;
}
class YAMLMap extends Collection.Collection {
    constructor(schema) {
        super(Node.MAP, schema);
        this.items = [];
    }
    static get tagName() {
        return 'tag:yaml.org,2002:map';
    }
    /**
     * Adds a value to the collection.
     *
     * @param overwrite - If not set `true`, using a key that is already in the
     *   collection will throw. Otherwise, overwrites the previous value.
     */
    add(pair, overwrite) {
        let _pair;
        if (Node.isPair(pair))
            _pair = pair;
        else if (!pair || typeof pair !== 'object' || !('key' in pair)) {
            // In TypeScript, this never happens.
            _pair = new Pair.Pair(pair, pair.value);
        }
        else
            _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema && this.schema.sortMapEntries;
        if (prev) {
            if (!overwrite)
                throw new Error(`Key ${_pair.key} already set`);
            // For scalars, keep the old node & its comments and anchors
            if (Node.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
                prev.value.value = _pair.value;
            else
                prev.value = _pair.value;
        }
        else if (sortEntries) {
            const i = this.items.findIndex(item => sortEntries(_pair, item) < 0);
            if (i === -1)
                this.items.push(_pair);
            else
                this.items.splice(i, 0, _pair);
        }
        else {
            this.items.push(_pair);
        }
    }
    delete(key) {
        const it = findPair(this.items, key);
        if (!it)
            return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
    }
    get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it && it.value;
        return !keepScalar && Node.isScalar(node) ? node.value : node;
    }
    has(key) {
        return !!findPair(this.items, key);
    }
    set(key, value) {
        this.add(new Pair.Pair(key, value), true);
    }
    /**
     * @param ctx - Conversion context, originally set in Document#toJS()
     * @param {Class} Type - If set, forces the returned collection type
     * @returns Instance of Type, Map, or Object
     */
    toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
        if (ctx && ctx.onCreate)
            ctx.onCreate(map);
        for (const item of this.items)
            addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        for (const item of this.items) {
            if (!Node.isPair(item))
                throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
            ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItem: n => n.str,
            flowChars: { start: '{', end: '}' },
            itemIndent: ctx.indent || '',
            onChompKeep,
            onComment
        });
    }
}

exports.YAMLMap = YAMLMap;
exports.findPair = findPair;


/***/ }),

/***/ 2515:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyCollection = __nccwpck_require__(1537);
var Collection = __nccwpck_require__(6842);
var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);
var toJS = __nccwpck_require__(2273);

class YAMLSeq extends Collection.Collection {
    constructor(schema) {
        super(Node.SEQ, schema);
        this.items = [];
    }
    static get tagName() {
        return 'tag:yaml.org,2002:seq';
    }
    add(value) {
        this.items.push(value);
    }
    /**
     * Removes a value from the collection.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     *
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return undefined;
        const it = this.items[idx];
        return !keepScalar && Node.isScalar(it) ? it.value : it;
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    has(key) {
        const idx = asItemIndex(key);
        return typeof idx === 'number' && idx < this.items.length;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     *
     * If `key` does not contain a representation of an integer, this will throw.
     * It may be wrapped in a `Scalar`.
     */
    set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (Node.isScalar(prev) && Scalar.isScalarValue(value))
            prev.value = value;
        else
            this.items[idx] = value;
    }
    toJSON(_, ctx) {
        const seq = [];
        if (ctx && ctx.onCreate)
            ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
            seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItem: n => (n.comment ? n.str : `- ${n.str}`),
            flowChars: { start: '[', end: ']' },
            itemIndent: (ctx.indent || '') + '  ',
            onChompKeep,
            onComment
        });
    }
}
function asItemIndex(key) {
    let idx = Node.isScalar(key) ? key.value : key;
    if (idx && typeof idx === 'string')
        idx = Number(idx);
    return typeof idx === 'number' && Number.isInteger(idx) && idx >= 0
        ? idx
        : null;
}

exports.YAMLSeq = YAMLSeq;


/***/ }),

/***/ 3441:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var log = __nccwpck_require__(3613);
var stringify = __nccwpck_require__(1530);
var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);
var toJS = __nccwpck_require__(2273);

const MERGE_KEY = '<<';
function addPairToJSMap(ctx, map, { key, value }) {
    if (ctx && ctx.doc.schema.merge && isMergeKey(key)) {
        if (Node.isSeq(value))
            for (const it of value.items)
                mergeToJSMap(ctx, map, it);
        else if (Array.isArray(value))
            for (const it of value)
                mergeToJSMap(ctx, map, it);
        else
            mergeToJSMap(ctx, map, value);
    }
    else {
        const jsKey = toJS.toJS(key, '', ctx);
        if (map instanceof Map) {
            map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        }
        else if (map instanceof Set) {
            map.add(jsKey);
        }
        else {
            const stringKey = stringifyKey(key, jsKey, ctx);
            const jsValue = toJS.toJS(value, stringKey, ctx);
            if (stringKey in map)
                Object.defineProperty(map, stringKey, {
                    value: jsValue,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            else
                map[stringKey] = jsValue;
        }
    }
    return map;
}
const isMergeKey = (key) => key === MERGE_KEY ||
    (Node.isScalar(key) &&
        key.value === MERGE_KEY &&
        (!key.type || key.type === Scalar.Scalar.PLAIN));
// If the value associated with a merge key is a single mapping node, each of
// its key/value pairs is inserted into the current mapping, unless the key
// already exists in it. If the value associated with the merge key is a
// sequence, then this sequence is expected to contain mapping nodes and each
// of these nodes is merged in turn according to its order in the sequence.
// Keys in mapping nodes earlier in the sequence override keys specified in
// later mapping nodes. -- http://yaml.org/type/merge.html
function mergeToJSMap(ctx, map, value) {
    const source = ctx && Node.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!Node.isMap(source))
        throw new Error('Merge sources must be maps or map aliases');
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value] of srcMap) {
        if (map instanceof Map) {
            if (!map.has(key))
                map.set(key, value);
        }
        else if (map instanceof Set) {
            map.add(key);
        }
        else if (!Object.prototype.hasOwnProperty.call(map, key)) {
            Object.defineProperty(map, key, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }
    return map;
}
function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
        return '';
    if (typeof jsKey !== 'object')
        return String(jsKey);
    if (Node.isNode(key) && ctx && ctx.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = new Set();
        for (const node of ctx.anchors.keys())
            strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
            let jsonStr = JSON.stringify(strKey);
            if (jsonStr.length > 40)
                jsonStr = jsonStr.substring(0, 36) + '..."';
            log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
            ctx.mapKeyWarned = true;
        }
        return strKey;
    }
    return JSON.stringify(jsKey);
}

exports.addPairToJSMap = addPairToJSMap;


/***/ }),

/***/ 2273:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);

/**
 * Recursively convert any node or its contents to native JavaScript
 *
 * @param value - The input value
 * @param arg - If `value` defines a `toJSON()` method, use this
 *   as its first argument
 * @param ctx - Conversion context, originally set in Document#toJS(). If
 *   `{ keep: true }` is not set, output should be suitable for JSON
 *   stringification.
 */
function toJS(value, arg, ctx) {
    if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === 'function') {
        if (!ctx || !Node.hasAnchor(value))
            return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: undefined };
        ctx.anchors.set(value, data);
        ctx.onCreate = res => {
            data.res = res;
            delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
            ctx.onCreate(res);
        return res;
    }
    if (typeof value === 'bigint' && !(ctx && ctx.keep))
        return Number(value);
    return value;
}

exports.toJS = toJS;


/***/ }),

/***/ 8603:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * `yaml` defines document-specific options in three places: as an argument of
 * parse, create and stringify calls, in the values of `YAML.defaultOptions`,
 * and in the version-dependent `YAML.Document.defaults` object. Values set in
 * `YAML.defaultOptions` override version-dependent defaults, and argument
 * options override both.
 */
const defaultOptions = {
    intAsBigInt: false,
    logLevel: 'warn',
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
    version: '1.2'
};

exports.defaultOptions = defaultOptions;


/***/ }),

/***/ 4424:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var resolveBlockScalar = __nccwpck_require__(1989);
var resolveFlowScalar = __nccwpck_require__(4518);
var errors = __nccwpck_require__(3363);
var stringifyString = __nccwpck_require__(3976);

/**
 * If `token` is a CST flow or block scalar, determine its string value and a few other attributes.
 * Otherwise, return `null`.
 */
function resolveAsScalar(token, strict = true, onError) {
    if (token) {
        const _onError = (pos, code, message) => {
            const offset = typeof pos === 'number' ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
            if (onError)
                onError(offset, code, message);
            else
                throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
            case 'block-scalar':
                return resolveBlockScalar.resolveBlockScalar(token, strict, _onError);
        }
    }
    return null;
}
/**
 * Create a new scalar token with `value`
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.end Comments and whitespace after the end of the value, or after the block scalar header. If undefined, a newline will be added.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.indent The indent level of the token.
 * @param context.inFlow Is this scalar within a flow collection? This may affect the resolved type of the token's value.
 * @param context.offset The offset position of the token.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function createScalarToken(value, context) {
    var _a;
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = 'PLAIN' } = context;
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { lineWidth: -1 }
    });
    const end = (_a = context.end) !== null && _a !== void 0 ? _a : [
        { type: 'newline', offset: -1, indent, source: '\n' }
    ];
    switch (source[0]) {
        case '|':
        case '>': {
            const he = source.indexOf('\n');
            const head = source.substring(0, he);
            const body = source.substring(he + 1) + '\n';
            const props = [
                { type: 'block-scalar-header', offset, indent, source: head }
            ];
            if (!addEndtoBlockProps(props, end))
                props.push({ type: 'newline', offset: -1, indent, source: '\n' });
            return { type: 'block-scalar', offset, indent, props, source: body };
        }
        case '"':
            return { type: 'double-quoted-scalar', offset, indent, source, end };
        case "'":
            return { type: 'single-quoted-scalar', offset, indent, source, end };
        default:
            return { type: 'scalar', offset, indent, source, end };
    }
}
/**
 * Set the value of `token` to the given string `value`, overwriting any previous contents and type that it may have.
 *
 * Best efforts are made to retain any comments previously associated with the `token`,
 * though all contents within a collection's `items` will be overwritten.
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param token Any token. If it does not include an `indent` value, the value will be stringified as if it were an implicit key.
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.afterKey In most cases, values after a key should have an additional level of indentation.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.inFlow Being within a flow collection may affect the resolved type of the token's value.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = 'indent' in token ? token.indent : null;
    if (afterKey && typeof indent === 'number')
        indent += 2;
    if (!type)
        switch (token.type) {
            case 'single-quoted-scalar':
                type = 'QUOTE_SINGLE';
                break;
            case 'double-quoted-scalar':
                type = 'QUOTE_DOUBLE';
                break;
            case 'block-scalar': {
                const header = token.props[0];
                if (header.type !== 'block-scalar-header')
                    throw new Error('Invalid block scalar header');
                type = header.source[0] === '>' ? 'BLOCK_FOLDED' : 'BLOCK_LITERAL';
                break;
            }
            default:
                type = 'PLAIN';
        }
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { lineWidth: -1 }
    });
    switch (source[0]) {
        case '|':
        case '>':
            setBlockScalarValue(token, source);
            break;
        case '"':
            setFlowScalarValue(token, source, 'double-quoted-scalar');
            break;
        case "'":
            setFlowScalarValue(token, source, 'single-quoted-scalar');
            break;
        default:
            setFlowScalarValue(token, source, 'scalar');
    }
}
function setBlockScalarValue(token, source) {
    const he = source.indexOf('\n');
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + '\n';
    if (token.type === 'block-scalar') {
        const header = token.props[0];
        if (header.type !== 'block-scalar-header')
            throw new Error('Invalid block scalar header');
        header.source = head;
        token.source = body;
    }
    else {
        const { offset } = token;
        const indent = 'indent' in token ? token.indent : -1;
        const props = [
            { type: 'block-scalar-header', offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, 'end' in token ? token.end : undefined))
            props.push({ type: 'newline', offset: -1, indent, source: '\n' });
        for (const key of Object.keys(token))
            if (key !== 'type' && key !== 'offset')
                delete token[key];
        Object.assign(token, { type: 'block-scalar', indent, props, source: body });
    }
}
/** @returns `true` if last token is a newline */
function addEndtoBlockProps(props, end) {
    if (end)
        for (const st of end)
            switch (st.type) {
                case 'space':
                case 'comment':
                    props.push(st);
                    break;
                case 'newline':
                    props.push(st);
                    return true;
            }
    return false;
}
function setFlowScalarValue(token, source, type) {
    switch (token.type) {
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            token.type = type;
            token.source = source;
            break;
        case 'block-scalar': {
            const end = token.props.slice(1);
            let oa = source.length;
            if (token.props[0].type === 'block-scalar-header')
                oa -= token.props[0].source.length;
            for (const tok of end)
                tok.offset += oa;
            delete token.props;
            Object.assign(token, { type, source, end });
            break;
        }
        case 'block-map':
        case 'block-seq': {
            const offset = token.offset + source.length;
            const nl = { type: 'newline', offset, indent: token.indent, source: '\n' };
            delete token.items;
            Object.assign(token, { type, source, end: [nl] });
            break;
        }
        default: {
            const indent = 'indent' in token ? token.indent : -1;
            const end = 'end' in token && Array.isArray(token.end)
                ? token.end.filter(st => st.type === 'space' ||
                    st.type === 'comment' ||
                    st.type === 'newline')
                : [];
            for (const key of Object.keys(token))
                if (key !== 'type' && key !== 'offset')
                    delete token[key];
            Object.assign(token, { type, indent, source, end });
        }
    }
}

exports.createScalarToken = createScalarToken;
exports.resolveAsScalar = resolveAsScalar;
exports.setScalarValue = setScalarValue;


/***/ }),

/***/ 4890:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Stringify a CST document, token, or collection item
 *
 * Fair warning: This applies no validation whatsoever, and
 * simply concatenates the sources in their logical order.
 */
const stringify = (cst) => 'type' in cst ? stringifyToken(cst) : stringifyItem(cst);
function stringifyToken(token) {
    switch (token.type) {
        case 'block-scalar': {
            let res = '';
            for (const tok of token.props)
                res += stringifyToken(tok);
            return res + token.source;
        }
        case 'block-map':
        case 'block-seq': {
            let res = '';
            for (const item of token.items)
                res += stringifyItem(item);
            return res;
        }
        case 'flow-collection': {
            let res = token.start.source;
            for (const item of token.items)
                res += stringifyItem(item);
            for (const st of token.end)
                res += st.source;
            return res;
        }
        case 'document': {
            let res = stringifyItem(token);
            if (token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
        default: {
            let res = token.source;
            if ('end' in token && token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
    }
}
function stringifyItem({ start, key, sep, value }) {
    let res = '';
    for (const st of start)
        res += st.source;
    if (key)
        res += stringifyToken(key);
    if (sep)
        for (const st of sep)
            res += st.source;
    if (value)
        res += stringifyToken(value);
    return res;
}

exports.stringify = stringify;


/***/ }),

/***/ 83:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove item');
/**
 * Apply a visitor to a CST document or item.
 *
 * Walks through the tree (depth-first) starting from the root, calling a
 * `visitor` function with two arguments when entering each item:
 *   - `item`: The current item, which included the following members:
 *     - `start: SourceToken[]` – Source tokens before the key or value,
 *       possibly including its anchor or tag.
 *     - `key?: Token | null` – Set for pair values. May then be `null`, if
 *       the key before the `:` separator is empty.
 *     - `sep?: SourceToken[]` – Source tokens between the key and the value,
 *       which should include the `:` map value indicator if `value` is set.
 *     - `value?: Token` – The value of a sequence item, or of a map pair.
 *   - `path`: The steps from the root to the current node, as an array of
 *     `['key' | 'value', number]` tuples.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this token, continue with
 *      next sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current item, then continue with the next one
 *   - `number`: Set the index of the next step. This is useful especially if
 *     the index of the current token has changed.
 *   - `function`: Define the next visitor for this item. After the original
 *     visitor is called on item entry, next visitors are called after handling
 *     a non-empty `key` and when exiting the item.
 */
function visit(cst, visitor) {
    if ('type' in cst && cst.type === 'document')
        cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current item */
visit.SKIP = SKIP;
/** Remove the current item */
visit.REMOVE = REMOVE;
/** Find the item at `path` from `cst` as the root */
visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
        const tok = item && item[field];
        if (tok && 'items' in tok) {
            item = tok.items[index];
        }
        else
            return undefined;
    }
    return item;
};
/**
 * Get the immediate parent collection of the item at `path` from `cst` as the root.
 *
 * Throws an error if the collection is not found, which should never happen if the item itself exists.
 */
visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent && parent[field];
    if (coll && 'items' in coll)
        return coll;
    throw new Error('Parent collection not found');
};
function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === 'symbol')
        return ctrl;
    for (const field of ['key', 'value']) {
        const token = item[field];
        if (token && 'items' in token) {
            for (let i = 0; i < token.items.length; ++i) {
                const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    token.items.splice(i, 1);
                    i -= 1;
                }
            }
            if (typeof ctrl === 'function' && field === 'key')
                ctrl = ctrl(item, path);
        }
    }
    return typeof ctrl === 'function' ? ctrl(item, path) : ctrl;
}

exports.visit = visit;


/***/ }),

/***/ 3803:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cstScalar = __nccwpck_require__(4424);
var cstStringify = __nccwpck_require__(4890);
var cstVisit = __nccwpck_require__(83);

/** The byte order mark */
const BOM = '\u{FEFF}';
/** Start of doc-mode */
const DOCUMENT = '\x02'; // C0: Start of Text
/** Unexpected end of flow-mode */
const FLOW_END = '\x18'; // C0: Cancel
/** Next token is a scalar value */
const SCALAR = '\x1f'; // C0: Unit Separator
/** @returns `true` if `token` is a flow or block collection */
const isCollection = (token) => !!token && 'items' in token;
/** @returns `true` if `token` is a flow or block scalar; not an alias */
const isScalar = (token) => !!token &&
    (token.type === 'scalar' ||
        token.type === 'single-quoted-scalar' ||
        token.type === 'double-quoted-scalar' ||
        token.type === 'block-scalar');
/* istanbul ignore next */
/** Get a printable representation of a lexer token */
function prettyToken(token) {
    switch (token) {
        case BOM:
            return '<BOM>';
        case DOCUMENT:
            return '<DOC>';
        case FLOW_END:
            return '<FLOW_END>';
        case SCALAR:
            return '<SCALAR>';
        default:
            return JSON.stringify(token);
    }
}
/** Identify the type of a lexer token. May return `null` for unknown tokens. */
function tokenType(source) {
    switch (source) {
        case BOM:
            return 'byte-order-mark';
        case DOCUMENT:
            return 'doc-mode';
        case FLOW_END:
            return 'flow-error-end';
        case SCALAR:
            return 'scalar';
        case '---':
            return 'doc-start';
        case '...':
            return 'doc-end';
        case '':
        case '\n':
        case '\r\n':
            return 'newline';
        case '-':
            return 'seq-item-ind';
        case '?':
            return 'explicit-key-ind';
        case ':':
            return 'map-value-ind';
        case '{':
            return 'flow-map-start';
        case '}':
            return 'flow-map-end';
        case '[':
            return 'flow-seq-start';
        case ']':
            return 'flow-seq-end';
        case ',':
            return 'comma';
    }
    switch (source[0]) {
        case ' ':
        case '\t':
            return 'space';
        case '#':
            return 'comment';
        case '%':
            return 'directive-line';
        case '*':
            return 'alias';
        case '&':
            return 'anchor';
        case '!':
            return 'tag';
        case "'":
            return 'single-quoted-scalar';
        case '"':
            return 'double-quoted-scalar';
        case '|':
        case '>':
            return 'block-scalar-header';
    }
    return null;
}

exports.createScalarToken = cstScalar.createScalarToken;
exports.resolveAsScalar = cstScalar.resolveAsScalar;
exports.setScalarValue = cstScalar.setScalarValue;
exports.stringify = cstStringify.stringify;
exports.visit = cstVisit.visit;
exports.BOM = BOM;
exports.DOCUMENT = DOCUMENT;
exports.FLOW_END = FLOW_END;
exports.SCALAR = SCALAR;
exports.isCollection = isCollection;
exports.isScalar = isScalar;
exports.prettyToken = prettyToken;
exports.tokenType = tokenType;


/***/ }),

/***/ 6766:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cst = __nccwpck_require__(3803);

/*
START -> stream

stream
  directive -> line-end -> stream
  indent + line-end -> stream
  [else] -> line-start

line-end
  comment -> line-end
  newline -> .
  input-end -> END

line-start
  doc-start -> doc
  doc-end -> stream
  [else] -> indent -> block-start

block-start
  seq-item-start -> block-start
  explicit-key-start -> block-start
  map-value-start -> block-start
  [else] -> doc

doc
  line-end -> line-start
  spaces -> doc
  anchor -> doc
  tag -> doc
  flow-start -> flow -> doc
  flow-end -> error -> doc
  seq-item-start -> error -> doc
  explicit-key-start -> error -> doc
  map-value-start -> doc
  alias -> doc
  quote-start -> quoted-scalar -> doc
  block-scalar-header -> line-end -> block-scalar(min) -> line-start
  [else] -> plain-scalar(false, min) -> doc

flow
  line-end -> flow
  spaces -> flow
  anchor -> flow
  tag -> flow
  flow-start -> flow -> flow
  flow-end -> .
  seq-item-start -> error -> flow
  explicit-key-start -> flow
  map-value-start -> flow
  alias -> flow
  quote-start -> quoted-scalar -> flow
  comma -> flow
  [else] -> plain-scalar(true, 0) -> flow

quoted-scalar
  quote-end -> .
  [else] -> quoted-scalar

block-scalar(min)
  newline + peek(indent < min) -> .
  [else] -> block-scalar(min)

plain-scalar(is-flow, min)
  scalar-end(is-flow) -> .
  peek(newline + (indent < min)) -> .
  [else] -> plain-scalar(min)
*/
function isEmpty(ch) {
    switch (ch) {
        case undefined:
        case ' ':
        case '\n':
        case '\r':
        case '\t':
            return true;
        default:
            return false;
    }
}
const hexDigits = '0123456789ABCDEFabcdef'.split('');
const tagChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split('');
const invalidFlowScalarChars = ',[]{}'.split('');
const invalidAnchorChars = ' ,[]{}\n\r\t'.split('');
const isNotAnchorChar = (ch) => !ch || invalidAnchorChars.includes(ch);
/**
 * Splits an input string into lexical tokens, i.e. smaller strings that are
 * easily identifiable by `tokens.tokenType()`.
 *
 * Lexing starts always in a "stream" context. Incomplete input may be buffered
 * until a complete token can be emitted.
 *
 * In addition to slices of the original input, the following control characters
 * may also be emitted:
 *
 * - `\x02` (Start of Text): A document starts with the next token
 * - `\x18` (Cancel): Unexpected end of flow-mode (indicates an error)
 * - `\x1f` (Unit Separator): Next token is a scalar value
 * - `\u{FEFF}` (Byte order mark): Emitted separately outside documents
 */
class Lexer {
    constructor() {
        /**
         * Flag indicating whether the end of the current buffer marks the end of
         * all input
         */
        this.atEnd = false;
        /**
         * Explicit indent set in block scalar header, as an offset from the current
         * minimum indent, so e.g. set to 1 from a header `|2+`. Set to -1 if not
         * explicitly set.
         */
        this.blockScalarIndent = -1;
        /**
         * Block scalars that include a + (keep) chomping indicator in their header
         * include trailing empty lines, which are otherwise excluded from the
         * scalar's contents.
         */
        this.blockScalarKeep = false;
        /** Current input */
        this.buffer = '';
        /**
         * Flag noting whether the map value indicator : can immediately follow this
         * node within a flow context.
         */
        this.flowKey = false;
        /** Count of surrounding flow collection levels. */
        this.flowLevel = 0;
        /**
         * Minimum level of indentation required for next lines to be parsed as a
         * part of the current scalar value.
         */
        this.indentNext = 0;
        /** Indentation level of the current line. */
        this.indentValue = 0;
        /** Position of the next \n character. */
        this.lineEndPos = null;
        /** Stores the state of the lexer if reaching the end of incpomplete input */
        this.next = null;
        /** A pointer to `buffer`; the current position of the lexer. */
        this.pos = 0;
    }
    /**
     * Generate YAML tokens from the `source` string. If `incomplete`,
     * a part of the last line may be left as a buffer for the next call.
     *
     * @returns A generator of lexical tokens
     */
    *lex(source, incomplete = false) {
        if (source) {
            this.buffer = this.buffer ? this.buffer + source : source;
            this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next || 'stream';
        while (next && (incomplete || this.hasChars(1)))
            next = yield* this.parseNext(next);
    }
    atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === ' ' || ch === '\t')
            ch = this.buffer[++i];
        if (!ch || ch === '#' || ch === '\n')
            return true;
        if (ch === '\r')
            return this.buffer[i + 1] === '\n';
        return false;
    }
    charAt(n) {
        return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
            let indent = 0;
            while (ch === ' ')
                ch = this.buffer[++indent + offset];
            if (ch === '\r') {
                const next = this.buffer[indent + offset + 1];
                if (next === '\n' || (!next && !this.atEnd))
                    return offset + indent + 1;
            }
            return ch === '\n' || indent >= this.indentNext || (!ch && !this.atEnd)
                ? offset + indent
                : -1;
        }
        if (ch === '-' || ch === '.') {
            const dt = this.buffer.substr(offset, 3);
            if ((dt === '---' || dt === '...') && isEmpty(this.buffer[offset + 3]))
                return -1;
        }
        return offset;
    }
    getLine() {
        let end = this.lineEndPos;
        if (typeof end !== 'number' || (end !== -1 && end < this.pos)) {
            end = this.buffer.indexOf('\n', this.pos);
            this.lineEndPos = end;
        }
        if (end === -1)
            return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === '\r')
            end -= 1;
        return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
        return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
    }
    peek(n) {
        return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
        switch (next) {
            case 'stream':
                return yield* this.parseStream();
            case 'line-start':
                return yield* this.parseLineStart();
            case 'block-start':
                return yield* this.parseBlockStart();
            case 'doc':
                return yield* this.parseDocument();
            case 'flow':
                return yield* this.parseFlowCollection();
            case 'quoted-scalar':
                return yield* this.parseQuotedScalar();
            case 'block-scalar':
                return yield* this.parseBlockScalar();
            case 'plain-scalar':
                return yield* this.parsePlainScalar();
        }
    }
    *parseStream() {
        let line = this.getLine();
        if (line === null)
            return this.setNext('stream');
        if (line[0] === cst.BOM) {
            yield* this.pushCount(1);
            line = line.substring(1);
        }
        if (line[0] === '%') {
            let dirEnd = line.length;
            const cs = line.indexOf('#');
            if (cs !== -1) {
                const ch = line[cs - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd = cs - 1;
            }
            while (true) {
                const ch = line[dirEnd - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd -= 1;
                else
                    break;
            }
            const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
            yield* this.pushCount(line.length - n); // possible comment
            this.pushNewline();
            return 'stream';
        }
        if (this.atLineEnd()) {
            const sp = yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - sp);
            yield* this.pushNewline();
            return 'stream';
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
    }
    *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
            return this.setNext('line-start');
        if (ch === '-' || ch === '.') {
            if (!this.atEnd && !this.hasChars(4))
                return this.setNext('line-start');
            const s = this.peek(3);
            if (s === '---' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                this.indentValue = 0;
                this.indentNext = 0;
                return 'doc';
            }
            else if (s === '...' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                return 'stream';
            }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
            this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
            return this.setNext('block-start');
        if ((ch0 === '-' || ch0 === '?' || ch0 === ':') && isEmpty(ch1)) {
            const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
            this.indentNext = this.indentValue + 1;
            this.indentValue += n;
            return yield* this.parseBlockStart();
        }
        return 'doc';
    }
    *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
            return this.setNext('doc');
        let n = yield* this.pushIndicators();
        switch (line[n]) {
            case '#':
                yield* this.pushCount(line.length - n);
            // fallthrough
            case undefined:
                yield* this.pushNewline();
                return yield* this.parseLineStart();
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel = 1;
                return 'flow';
            case '}':
            case ']':
                // this is an error
                yield* this.pushCount(1);
                return 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'doc';
            case '"':
            case "'":
                return yield* this.parseQuotedScalar();
            case '|':
            case '>':
                n += yield* this.parseBlockScalarHeader();
                n += yield* this.pushSpaces(true);
                yield* this.pushCount(line.length - n);
                yield* this.pushNewline();
                return yield* this.parseBlockScalar();
            default:
                return yield* this.parsePlainScalar();
        }
    }
    *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
            nl = yield* this.pushNewline();
            sp = yield* this.pushSpaces(true);
            if (nl > 0)
                this.indentValue = indent = sp;
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
            return this.setNext('flow');
        if ((indent !== -1 && indent < this.indentNext) ||
            (indent === 0 &&
                (line.startsWith('---') || line.startsWith('...')) &&
                isEmpty(line[3]))) {
            // Allowing for the terminal ] or } at the same (rather than greater)
            // indent level as the initial [ or { is technically invalid, but
            // failing here would be surprising to users.
            const atFlowEndMarker = indent === this.indentNext - 1 &&
                this.flowLevel === 1 &&
                (line[0] === ']' || line[0] === '}');
            if (!atFlowEndMarker) {
                // this is an error
                this.flowLevel = 0;
                yield cst.FLOW_END;
                return yield* this.parseLineStart();
            }
        }
        let n = 0;
        while (line[n] === ',')
            n += (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
        n += yield* this.pushIndicators();
        switch (line[n]) {
            case undefined:
                return 'flow';
            case '#':
                yield* this.pushCount(line.length - n);
                return 'flow';
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel += 1;
                return 'flow';
            case '}':
            case ']':
                yield* this.pushCount(1);
                this.flowKey = true;
                this.flowLevel -= 1;
                return this.flowLevel ? 'flow' : 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'flow';
            case '"':
            case "'":
                this.flowKey = true;
                return yield* this.parseQuotedScalar();
            case ':': {
                const next = this.charAt(1);
                if (this.flowKey || isEmpty(next) || next === ',') {
                    yield* this.pushCount(1);
                    yield* this.pushSpaces(true);
                    return 'flow';
                }
            }
            // fallthrough
            default:
                this.flowKey = false;
                return yield* this.parsePlainScalar();
        }
    }
    *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
            while (end !== -1 && this.buffer[end + 1] === "'")
                end = this.buffer.indexOf("'", end + 2);
        }
        else {
            // double-quote
            while (end !== -1) {
                let n = 0;
                while (this.buffer[end - 1 - n] === '\\')
                    n += 1;
                if (n % 2 === 0)
                    break;
                end = this.buffer.indexOf('"', end + 1);
            }
        }
        // Only looking for newlines within the quotes
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf('\n', this.pos);
        if (nl !== -1) {
            while (nl !== -1) {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = qb.indexOf('\n', cs);
            }
            if (nl !== -1) {
                // this is an error caused by an unexpected unindent
                end = nl - (qb[nl - 1] === '\r' ? 2 : 1);
            }
        }
        if (end === -1) {
            if (!this.atEnd)
                return this.setNext('quoted-scalar');
            end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? 'flow' : 'doc';
    }
    *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
            const ch = this.buffer[++i];
            if (ch === '+')
                this.blockScalarKeep = true;
            else if (ch > '0' && ch <= '9')
                this.blockScalarIndent = Number(ch) - 1;
            else if (ch !== '-')
                break;
        }
        return yield* this.pushUntil(ch => isEmpty(ch) || ch === '#');
    }
    *parseBlockScalar() {
        let nl = this.pos - 1; // may be -1 if this.pos === 0
        let indent = 0;
        let ch;
        loop: for (let i = this.pos; (ch = this.buffer[i]); ++i) {
            switch (ch) {
                case ' ':
                    indent += 1;
                    break;
                case '\n':
                    nl = i;
                    indent = 0;
                    break;
                case '\r': {
                    const next = this.buffer[i + 1];
                    if (!next && !this.atEnd)
                        return this.setNext('block-scalar');
                    if (next === '\n')
                        break;
                } // fallthrough
                default:
                    break loop;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('block-scalar');
        if (indent >= this.indentNext) {
            if (this.blockScalarIndent === -1)
                this.indentNext = indent;
            else
                this.indentNext += this.blockScalarIndent;
            do {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = this.buffer.indexOf('\n', cs);
            } while (nl !== -1);
            if (nl === -1) {
                if (!this.atEnd)
                    return this.setNext('block-scalar');
                nl = this.buffer.length;
            }
        }
        if (!this.blockScalarKeep) {
            do {
                let i = nl - 1;
                let ch = this.buffer[i];
                if (ch === '\r')
                    ch = this.buffer[--i];
                while (ch === ' ' || ch === '\t')
                    ch = this.buffer[--i];
                if (ch === '\n' && i >= this.pos)
                    nl = i;
                else
                    break;
            } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while ((ch = this.buffer[++i])) {
            if (ch === ':') {
                const next = this.buffer[i + 1];
                if (isEmpty(next) || (inFlow && next === ','))
                    break;
                end = i;
            }
            else if (isEmpty(ch)) {
                let next = this.buffer[i + 1];
                if (ch === '\r') {
                    if (next === '\n') {
                        i += 1;
                        ch = '\n';
                        next = this.buffer[i + 1];
                    }
                    else
                        end = i;
                }
                if (next === '#' || (inFlow && invalidFlowScalarChars.includes(next)))
                    break;
                if (ch === '\n') {
                    const cs = this.continueScalar(i + 1);
                    if (cs === -1)
                        break;
                    i = Math.max(i, cs - 2); // to advance, but still account for ' #'
                }
            }
            else {
                if (inFlow && invalidFlowScalarChars.includes(ch))
                    break;
                end = i;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('plain-scalar');
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? 'flow' : 'doc';
    }
    *pushCount(n) {
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos += n;
            return n;
        }
        return 0;
    }
    *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
            yield s;
            this.pos += s.length;
            return s.length;
        }
        else if (allowEmpty)
            yield '';
        return 0;
    }
    *pushIndicators() {
        switch (this.charAt(0)) {
            case '!':
                return ((yield* this.pushTag()) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case '&':
                return ((yield* this.pushUntil(isNotAnchorChar)) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case ':':
            case '?': // this is an error outside flow collections
            case '-': // this is an error
                if (isEmpty(this.charAt(1))) {
                    if (this.flowLevel === 0)
                        this.indentNext = this.indentValue + 1;
                    return ((yield* this.pushCount(1)) +
                        (yield* this.pushSpaces(true)) +
                        (yield* this.pushIndicators()));
                }
        }
        return 0;
    }
    *pushTag() {
        if (this.charAt(1) === '<') {
            let i = this.pos + 2;
            let ch = this.buffer[i];
            while (!isEmpty(ch) && ch !== '>')
                ch = this.buffer[++i];
            return yield* this.pushToIndex(ch === '>' ? i + 1 : i, false);
        }
        else {
            let i = this.pos + 1;
            let ch = this.buffer[i];
            while (ch) {
                if (tagChars.includes(ch))
                    ch = this.buffer[++i];
                else if (ch === '%' &&
                    hexDigits.includes(this.buffer[i + 1]) &&
                    hexDigits.includes(this.buffer[i + 2])) {
                    ch = this.buffer[(i += 3)];
                }
                else
                    break;
            }
            return yield* this.pushToIndex(i, false);
        }
    }
    *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === '\n')
            return yield* this.pushCount(1);
        else if (ch === '\r' && this.charAt(1) === '\n')
            return yield* this.pushCount(2);
        else
            return 0;
    }
    *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
            ch = this.buffer[++i];
        } while (ch === ' ' || (allowTabs && ch === '\t'));
        const n = i - this.pos;
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos = i;
        }
        return n;
    }
    *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
            ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
    }
}

exports.Lexer = Lexer;


/***/ }),

/***/ 7495:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Tracks newlines during parsing in order to provide an efficient API for
 * determining the one-indexed `{ line, col }` position for any offset
 * within the input.
 */
class LineCounter {
    constructor() {
        this.lineStarts = [];
        /**
         * Should be called in ascending order. Otherwise, call
         * `lineCounter.lineStarts.sort()` before calling `linePos()`.
         */
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        /**
         * Performs a binary search and returns the 1-indexed { line, col }
         * position of `offset`. If `line === 0`, `addNewLine` has never been
         * called or `offset` is before the first known newline.
         */
        this.linePos = (offset) => {
            let low = 0;
            let high = this.lineStarts.length;
            while (low < high) {
                const mid = (low + high) >> 1; // Math.floor((low + high) / 2)
                if (this.lineStarts[mid] < offset)
                    low = mid + 1;
                else
                    high = mid;
            }
            if (this.lineStarts[low] === offset)
                return { line: low + 1, col: 1 };
            if (low === 0)
                return { line: 0, col: offset };
            const start = this.lineStarts[low - 1];
            return { line: low, col: offset - start + 1 };
        };
    }
}

exports.LineCounter = LineCounter;


/***/ }),

/***/ 4089:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var cst = __nccwpck_require__(3803);
var lexer = __nccwpck_require__(6766);

function includesToken(list, type) {
    for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
            return true;
    return false;
}
function includesNonEmpty(list) {
    for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
            case 'space':
            case 'comment':
            case 'newline':
                break;
            default:
                return true;
        }
    }
    return false;
}
function isFlowToken(token) {
    switch (token === null || token === void 0 ? void 0 : token.type) {
        case 'alias':
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'flow-collection':
            return true;
        default:
            return false;
    }
}
function getPrevProps(parent) {
    switch (parent.type) {
        case 'document':
            return parent.start;
        case 'block-map': {
            const it = parent.items[parent.items.length - 1];
            return it.sep || it.start;
        }
        case 'block-seq':
            return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
            return [];
    }
}
/** Note: May modify input array */
function getFirstKeyStartProps(prev) {
    var _a;
    if (prev.length === 0)
        return [];
    let i = prev.length;
    loop: while (--i >= 0) {
        switch (prev[i].type) {
            case 'doc-start':
            case 'explicit-key-ind':
            case 'map-value-ind':
            case 'seq-item-ind':
            case 'newline':
                break loop;
        }
    }
    while (((_a = prev[++i]) === null || _a === void 0 ? void 0 : _a.type) === 'space') {
        /* loop */
    }
    return prev.splice(i, prev.length);
}
function fixFlowSeqItems(fc) {
    if (fc.start.type === 'flow-seq-start') {
        for (const it of fc.items) {
            if (it.sep &&
                !it.value &&
                !includesToken(it.start, 'explicit-key-ind') &&
                !includesToken(it.sep, 'map-value-ind')) {
                if (it.key)
                    it.value = it.key;
                delete it.key;
                if (isFlowToken(it.value)) {
                    if (it.value.end)
                        Array.prototype.push.apply(it.value.end, it.sep);
                    else
                        it.value.end = it.sep;
                }
                else
                    Array.prototype.push.apply(it.start, it.sep);
                delete it.sep;
            }
        }
    }
}
/**
 * A YAML concrete syntax tree (CST) parser
 *
 * ```ts
 * const src: string = ...
 * for (const token of new Parser().parse(src)) {
 *   // token: Token
 * }
 * ```
 *
 * To use the parser with a user-provided lexer:
 *
 * ```ts
 * function* parse(source: string, lexer: Lexer) {
 *   const parser = new Parser()
 *   for (const lexeme of lexer.lex(source))
 *     yield* parser.next(lexeme)
 *   yield* parser.end()
 * }
 *
 * const src: string = ...
 * const lexer = new Lexer()
 * for (const token of parse(src, lexer)) {
 *   // token: Token
 * }
 * ```
 */
class Parser {
    /**
     * @param onNewLine - If defined, called separately with the start position of
     *   each new line (in `parse()`, including the start of input).
     */
    constructor(onNewLine) {
        /** If true, space and sequence indicators count as indentation */
        this.atNewLine = true;
        /** If true, next token is a scalar value */
        this.atScalar = false;
        /** Current indentation level */
        this.indent = 0;
        /** Current offset since the start of parsing */
        this.offset = 0;
        /** On the same line with a block map key */
        this.onKeyLine = false;
        /** Top indicates the node that's currently being built */
        this.stack = [];
        /** The source of the current token, set in parse() */
        this.source = '';
        /** The type of the current token, set in parse() */
        this.type = '';
        // Must be defined after `next()`
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
    }
    /**
     * Parse `source` as a YAML stream.
     * If `incomplete`, a part of the last line may be left as a buffer for the next call.
     *
     * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
     *
     * @returns A generator of tokens representing each directive, document, and other structure.
     */
    *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
            this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
            yield* this.next(lexeme);
        if (!incomplete)
            yield* this.end();
    }
    /**
     * Advance the parser by the `source` of one lexical token.
     */
    *next(source) {
        this.source = source;
        if (process.env.LOG_TOKENS)
            console.log('|', cst.prettyToken(source));
        if (this.atScalar) {
            this.atScalar = false;
            yield* this.step();
            this.offset += source.length;
            return;
        }
        const type = cst.tokenType(source);
        if (!type) {
            const message = `Not a YAML token: ${source}`;
            yield* this.pop({ type: 'error', offset: this.offset, message, source });
            this.offset += source.length;
        }
        else if (type === 'scalar') {
            this.atNewLine = false;
            this.atScalar = true;
            this.type = 'scalar';
        }
        else {
            this.type = type;
            yield* this.step();
            switch (type) {
                case 'newline':
                    this.atNewLine = true;
                    this.indent = 0;
                    if (this.onNewLine)
                        this.onNewLine(this.offset + source.length);
                    break;
                case 'space':
                    if (this.atNewLine && source[0] === ' ')
                        this.indent += source.length;
                    break;
                case 'explicit-key-ind':
                case 'map-value-ind':
                case 'seq-item-ind':
                    if (this.atNewLine)
                        this.indent += source.length;
                    break;
                case 'doc-mode':
                    return;
                default:
                    this.atNewLine = false;
            }
            this.offset += source.length;
        }
    }
    /** Call at end of input to push out any remaining constructions */
    *end() {
        while (this.stack.length > 0)
            yield* this.pop();
    }
    get sourceToken() {
        const st = {
            type: this.type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
        return st;
    }
    *step() {
        const top = this.peek(1);
        if (this.type === 'doc-end' && (!top || top.type !== 'doc-end')) {
            while (this.stack.length > 0)
                yield* this.pop();
            this.stack.push({
                type: 'doc-end',
                offset: this.offset,
                source: this.source
            });
            return;
        }
        if (!top)
            return yield* this.stream();
        switch (top.type) {
            case 'document':
                return yield* this.document(top);
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return yield* this.scalar(top);
            case 'block-scalar':
                return yield* this.blockScalar(top);
            case 'block-map':
                return yield* this.blockMap(top);
            case 'block-seq':
                return yield* this.blockSequence(top);
            case 'flow-collection':
                return yield* this.flowCollection(top);
            case 'doc-end':
                return yield* this.documentEnd(top);
        }
        /* istanbul ignore next should not happen */
        yield* this.pop();
    }
    peek(n) {
        return this.stack[this.stack.length - n];
    }
    *pop(error) {
        const token = error || this.stack.pop();
        /* istanbul ignore if should not happen */
        if (!token) {
            const message = 'Tried to pop an empty stack';
            yield { type: 'error', offset: this.offset, source: '', message };
        }
        else if (this.stack.length === 0) {
            yield token;
        }
        else {
            const top = this.peek(1);
            // For these, parent indent is needed instead of own
            if (token.type === 'block-scalar' || token.type === 'flow-collection')
                token.indent = 'indent' in top ? top.indent : -1;
            if (token.type === 'flow-collection')
                fixFlowSeqItems(token);
            switch (top.type) {
                case 'document':
                    top.value = token;
                    break;
                case 'block-scalar':
                    top.props.push(token); // error
                    break;
                case 'block-map': {
                    const it = top.items[top.items.length - 1];
                    if (it.value) {
                        top.items.push({ start: [], key: token, sep: [] });
                        this.onKeyLine = true;
                        return;
                    }
                    else if (it.sep) {
                        it.value = token;
                    }
                    else {
                        Object.assign(it, { key: token, sep: [] });
                        this.onKeyLine = !includesToken(it.start, 'explicit-key-ind');
                        return;
                    }
                    break;
                }
                case 'block-seq': {
                    const it = top.items[top.items.length - 1];
                    if (it.value)
                        top.items.push({ start: [], value: token });
                    else
                        it.value = token;
                    break;
                }
                case 'flow-collection': {
                    const it = top.items[top.items.length - 1];
                    if (!it || it.value)
                        top.items.push({ start: [], key: token, sep: [] });
                    else if (it.sep)
                        it.value = token;
                    else
                        Object.assign(it, { key: token, sep: [] });
                    return;
                }
                /* istanbul ignore next should not happen */
                default:
                    yield* this.pop();
                    yield* this.pop(token);
            }
            if ((top.type === 'document' ||
                top.type === 'block-map' ||
                top.type === 'block-seq') &&
                (token.type === 'block-map' || token.type === 'block-seq')) {
                const last = token.items[token.items.length - 1];
                if (last &&
                    !last.sep &&
                    !last.value &&
                    last.start.length > 0 &&
                    !includesNonEmpty(last.start) &&
                    (token.indent === 0 ||
                        last.start.every(st => st.type !== 'comment' || st.indent < token.indent))) {
                    if (top.type === 'document')
                        top.end = last.start;
                    else
                        top.items.push({ start: last.start });
                    token.items.splice(-1, 1);
                }
            }
        }
    }
    *stream() {
        switch (this.type) {
            case 'directive-line':
                yield { type: 'directive', offset: this.offset, source: this.source };
                return;
            case 'byte-order-mark':
            case 'space':
            case 'comment':
            case 'newline':
                yield this.sourceToken;
                return;
            case 'doc-mode':
            case 'doc-start': {
                const doc = {
                    type: 'document',
                    offset: this.offset,
                    start: []
                };
                if (this.type === 'doc-start')
                    doc.start.push(this.sourceToken);
                this.stack.push(doc);
                return;
            }
        }
        yield {
            type: 'error',
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML stream`,
            source: this.source
        };
    }
    *document(doc) {
        if (doc.value)
            return yield* this.lineEnd(doc);
        switch (this.type) {
            case 'doc-start': {
                if (includesNonEmpty(doc.start)) {
                    yield* this.pop();
                    yield* this.step();
                }
                else
                    doc.start.push(this.sourceToken);
                return;
            }
            case 'anchor':
            case 'tag':
            case 'space':
            case 'comment':
            case 'newline':
                doc.start.push(this.sourceToken);
                return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
            this.stack.push(bv);
        else {
            yield {
                type: 'error',
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML document`,
                source: this.source
            };
        }
    }
    *scalar(scalar) {
        if (this.type === 'map-value-ind') {
            const prev = getPrevProps(this.peek(2));
            const start = getFirstKeyStartProps(prev);
            let sep;
            if (scalar.end) {
                sep = scalar.end;
                sep.push(this.sourceToken);
                delete scalar.end;
            }
            else
                sep = [this.sourceToken];
            const map = {
                type: 'block-map',
                offset: scalar.offset,
                indent: scalar.indent,
                items: [{ start, key: scalar, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
        }
        else
            yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
        switch (this.type) {
            case 'space':
            case 'comment':
            case 'newline':
                scalar.props.push(this.sourceToken);
                return;
            case 'scalar':
                scalar.source = this.source;
                // block-scalar source includes trailing newline
                this.atNewLine = true;
                this.indent = 0;
                if (this.onNewLine) {
                    let nl = this.source.indexOf('\n') + 1;
                    while (nl !== 0) {
                        this.onNewLine(this.offset + nl);
                        nl = this.source.indexOf('\n', nl) + 1;
                    }
                }
                yield* this.pop();
                break;
            /* istanbul ignore next should not happen */
            default:
                yield* this.pop();
                yield* this.step();
        }
    }
    *blockMap(map) {
        var _a;
        const it = map.items[map.items.length - 1];
        // it.sep is true-ish if pair already has key or : separator
        switch (this.type) {
            case 'newline':
                this.onKeyLine = false;
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if ((last === null || last === void 0 ? void 0 : last.type) === 'comment')
                        end === null || end === void 0 ? void 0 : end.push(this.sourceToken);
                    else
                        map.items.push({ start: [this.sourceToken] });
                }
                else if (it.sep)
                    it.sep.push(this.sourceToken);
                else
                    it.start.push(this.sourceToken);
                return;
            case 'space':
            case 'comment':
                if (it.value)
                    map.items.push({ start: [this.sourceToken] });
                else if (it.sep)
                    it.sep.push(this.sourceToken);
                else {
                    if (this.atIndentedComment(it.start, map.indent)) {
                        const prev = map.items[map.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            map.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
        }
        if (this.indent >= map.indent) {
            const atNextItem = !this.onKeyLine &&
                this.indent === map.indent &&
                (it.sep || includesNonEmpty(it.start));
            switch (this.type) {
                case 'anchor':
                case 'tag':
                    if (atNextItem || it.value) {
                        map.items.push({ start: [this.sourceToken] });
                        this.onKeyLine = true;
                    }
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'explicit-key-ind':
                    if (!it.sep && !includesToken(it.start, 'explicit-key-ind'))
                        it.start.push(this.sourceToken);
                    else if (atNextItem || it.value)
                        map.items.push({ start: [this.sourceToken] });
                    else
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start: [this.sourceToken] }]
                        });
                    this.onKeyLine = true;
                    return;
                case 'map-value-ind':
                    if (!it.sep)
                        Object.assign(it, { key: null, sep: [this.sourceToken] });
                    else if (it.value ||
                        (atNextItem && !includesToken(it.start, 'explicit-key-ind')))
                        map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                    else if (includesToken(it.sep, 'map-value-ind'))
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start: [], key: null, sep: [this.sourceToken] }]
                        });
                    else if (includesToken(it.start, 'explicit-key-ind') &&
                        isFlowToken(it.key) &&
                        !includesToken(it.sep, 'newline')) {
                        const start = getFirstKeyStartProps(it.start);
                        const key = it.key;
                        const sep = it.sep;
                        sep.push(this.sourceToken);
                        // @ts-ignore type guard is wrong here
                        delete it.key, delete it.sep;
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start, key, sep }]
                        });
                    }
                    else
                        it.sep.push(this.sourceToken);
                    this.onKeyLine = true;
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (atNextItem || it.value) {
                        map.items.push({ start: [], key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    else if (it.sep) {
                        this.stack.push(fs);
                    }
                    else {
                        Object.assign(it, { key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    return;
                }
                default: {
                    const bv = this.startBlockValue(map);
                    if (bv) {
                        if (atNextItem &&
                            bv.type !== 'block-seq' &&
                            includesToken(it.start, 'explicit-key-ind'))
                            map.items.push({ start: [] });
                        this.stack.push(bv);
                        return;
                    }
                }
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *blockSequence(seq) {
        var _a;
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
            case 'newline':
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if ((last === null || last === void 0 ? void 0 : last.type) === 'comment')
                        end === null || end === void 0 ? void 0 : end.push(this.sourceToken);
                    else
                        seq.items.push({ start: [this.sourceToken] });
                }
                else
                    it.start.push(this.sourceToken);
                return;
            case 'space':
            case 'comment':
                if (it.value)
                    seq.items.push({ start: [this.sourceToken] });
                else {
                    if (this.atIndentedComment(it.start, seq.indent)) {
                        const prev = seq.items[seq.items.length - 2];
                        const end = (_a = prev === null || prev === void 0 ? void 0 : prev.value) === null || _a === void 0 ? void 0 : _a.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            seq.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
            case 'anchor':
            case 'tag':
                if (it.value || this.indent <= seq.indent)
                    break;
                it.start.push(this.sourceToken);
                return;
            case 'seq-item-ind':
                if (this.indent !== seq.indent)
                    break;
                if (it.value || includesToken(it.start, 'seq-item-ind'))
                    seq.items.push({ start: [this.sourceToken] });
                else
                    it.start.push(this.sourceToken);
                return;
        }
        if (this.indent > seq.indent) {
            const bv = this.startBlockValue(seq);
            if (bv) {
                this.stack.push(bv);
                return;
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === 'flow-error-end') {
            let top;
            do {
                yield* this.pop();
                top = this.peek(1);
            } while (top && top.type === 'flow-collection');
        }
        else if (fc.end.length === 0) {
            switch (this.type) {
                case 'comma':
                case 'explicit-key-ind':
                    if (!it || it.sep)
                        fc.items.push({ start: [this.sourceToken] });
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'map-value-ind':
                    if (!it || it.value)
                        fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        Object.assign(it, { key: null, sep: [this.sourceToken] });
                    return;
                case 'space':
                case 'comment':
                case 'newline':
                case 'anchor':
                case 'tag':
                    if (!it || it.value)
                        fc.items.push({ start: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (!it || it.value)
                        fc.items.push({ start: [], key: fs, sep: [] });
                    else if (it.sep)
                        this.stack.push(fs);
                    else
                        Object.assign(it, { key: fs, sep: [] });
                    return;
                }
                case 'flow-map-end':
                case 'flow-seq-end':
                    fc.end.push(this.sourceToken);
                    return;
            }
            const bv = this.startBlockValue(fc);
            /* istanbul ignore else should not happen */
            if (bv)
                this.stack.push(bv);
            else {
                yield* this.pop();
                yield* this.step();
            }
        }
        else {
            const parent = this.peek(2);
            if (parent.type === 'block-map' &&
                (this.type === 'map-value-ind' ||
                    (this.type === 'newline' &&
                        !parent.items[parent.items.length - 1].sep))) {
                yield* this.pop();
                yield* this.step();
            }
            else if (this.type === 'map-value-ind' &&
                parent.type !== 'flow-collection') {
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                fixFlowSeqItems(fc);
                const sep = fc.end.splice(1, fc.end.length);
                sep.push(this.sourceToken);
                const map = {
                    type: 'block-map',
                    offset: fc.offset,
                    indent: fc.indent,
                    items: [{ start, key: fc, sep }]
                };
                this.onKeyLine = true;
                this.stack[this.stack.length - 1] = map;
            }
            else {
                yield* this.lineEnd(fc);
            }
        }
    }
    flowScalar(type) {
        if (this.onNewLine) {
            let nl = this.source.indexOf('\n') + 1;
            while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf('\n', nl) + 1;
            }
        }
        return {
            type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
    }
    startBlockValue(parent) {
        switch (this.type) {
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return this.flowScalar(this.type);
            case 'block-scalar-header':
                return {
                    type: 'block-scalar',
                    offset: this.offset,
                    indent: this.indent,
                    props: [this.sourceToken],
                    source: ''
                };
            case 'flow-map-start':
            case 'flow-seq-start':
                return {
                    type: 'flow-collection',
                    offset: this.offset,
                    indent: this.indent,
                    start: this.sourceToken,
                    items: [],
                    end: []
                };
            case 'seq-item-ind':
                return {
                    type: 'block-seq',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken] }]
                };
            case 'explicit-key-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                start.push(this.sourceToken);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start }]
                };
            }
            case 'map-value-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                };
            }
        }
        return null;
    }
    atIndentedComment(start, indent) {
        if (this.type !== 'comment')
            return false;
        if (this.indent <= indent)
            return false;
        return start.every(st => st.type === 'newline' || st.type === 'space');
    }
    *documentEnd(docEnd) {
        if (this.type !== 'doc-mode') {
            if (docEnd.end)
                docEnd.end.push(this.sourceToken);
            else
                docEnd.end = [this.sourceToken];
            if (this.type === 'newline')
                yield* this.pop();
        }
    }
    *lineEnd(token) {
        switch (this.type) {
            case 'comma':
            case 'doc-start':
            case 'doc-end':
            case 'flow-seq-end':
            case 'flow-map-end':
            case 'map-value-ind':
                yield* this.pop();
                yield* this.step();
                break;
            case 'newline':
                this.onKeyLine = false;
            // fallthrough
            case 'space':
            case 'comment':
            default:
                // all other values are errors
                if (token.end)
                    token.end.push(this.sourceToken);
                else
                    token.end = [this.sourceToken];
                if (this.type === 'newline')
                    yield* this.pop();
        }
    }
}

exports.Parser = Parser;


/***/ }),

/***/ 330:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var composer = __nccwpck_require__(3059);
var Document = __nccwpck_require__(4810);
var errors = __nccwpck_require__(3363);
var log = __nccwpck_require__(3613);
var lineCounter = __nccwpck_require__(7495);
var parser = __nccwpck_require__(4089);

function parseOptions(options) {
    const prettyErrors = !options || options.prettyErrors !== false;
    const lineCounter$1 = (options && options.lineCounter) ||
        (prettyErrors && new lineCounter.LineCounter()) ||
        null;
    return { lineCounter: lineCounter$1, prettyErrors };
}
/**
 * Parse the input as a stream of YAML documents.
 *
 * Documents should be separated from each other by `...` or `---` marker lines.
 *
 * @returns If an empty `docs` array is returned, it will be of type
 *   EmptyStream and contain additional stream information. In
 *   TypeScript, you should use `'empty' in docs` as a type guard for it.
 */
function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter === null || lineCounter === void 0 ? void 0 : lineCounter.addNewLine);
    const composer$1 = new composer.Composer(options);
    const docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter)
        for (const doc of docs) {
            doc.errors.forEach(errors.prettifyError(source, lineCounter));
            doc.warnings.forEach(errors.prettifyError(source, lineCounter));
        }
    if (docs.length > 0)
        return docs;
    return Object.assign([], { empty: true }, composer$1.streamInfo());
}
/** Parse an input string into a single YAML.Document */
function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter === null || lineCounter === void 0 ? void 0 : lineCounter.addNewLine);
    const composer$1 = new composer.Composer(options);
    // `doc` is always set by compose.end(true) at the very latest
    let doc = null;
    for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
            doc = _doc;
        else if (doc.options.logLevel !== 'silent') {
            doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), 'MULTIPLE_DOCS', 'Source contains multiple documents; please use YAML.parseAllDocuments()'));
            break;
        }
    }
    if (prettyErrors && lineCounter) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter));
    }
    return doc;
}
function parse(src, reviver, options) {
    let _reviver = undefined;
    if (typeof reviver === 'function') {
        _reviver = reviver;
    }
    else if (options === undefined && reviver && typeof reviver === 'object') {
        options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
        return null;
    doc.warnings.forEach(warning => log.warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
        if (doc.options.logLevel !== 'silent')
            throw doc.errors[0];
        else
            doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
}
function stringify(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === 'function' || Array.isArray(replacer)) {
        _replacer = replacer;
    }
    else if (options === undefined && replacer) {
        options = replacer;
    }
    if (typeof options === 'string')
        options = options.length;
    if (typeof options === 'number') {
        const indent = Math.round(options);
        options = indent < 1 ? undefined : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === undefined) {
        const { keepUndefined } = options || replacer || {};
        if (!keepUndefined)
            return undefined;
    }
    return new Document.Document(value, _replacer, options).toString(options);
}

exports.parse = parse;
exports.parseAllDocuments = parseAllDocuments;
exports.parseDocument = parseDocument;
exports.stringify = stringify;


/***/ }),

/***/ 9885:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var map = __nccwpck_require__(9744);
var seq = __nccwpck_require__(3064);
var string = __nccwpck_require__(7688);
var tags = __nccwpck_require__(4108);

const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
class Schema {
    constructor({ customTags, merge, resolveKnownTags, schema, sortMapEntries }) {
        this.merge = !!merge;
        this.name = schema || 'core';
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name);
        Object.defineProperty(this, Node.MAP, { value: map.map });
        Object.defineProperty(this, Node.SCALAR, { value: string.string });
        Object.defineProperty(this, Node.SEQ, { value: seq.seq });
        // Used by createMap()
        this.sortMapEntries =
            sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
    }
    clone() {
        const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
    }
}

exports.Schema = Schema;


/***/ }),

/***/ 9744:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var YAMLMap = __nccwpck_require__(4536);

function createMap(schema, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map = new YAMLMap.YAMLMap(schema);
    const add = (key, value) => {
        if (typeof replacer === 'function')
            value = replacer.call(obj, key, value);
        else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
        if (value !== undefined || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
        for (const [key, value] of obj)
            add(key, value);
    }
    else if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj))
            add(key, obj[key]);
    }
    if (typeof schema.sortMapEntries === 'function') {
        map.items.sort(schema.sortMapEntries);
    }
    return map;
}
const map = {
    collection: 'map',
    createNode: createMap,
    default: true,
    nodeClass: YAMLMap.YAMLMap,
    tag: 'tag:yaml.org,2002:map',
    resolve(map, onError) {
        if (!Node.isMap(map))
            onError('Expected a mapping for this tag');
        return map;
    }
};

exports.map = map;


/***/ }),

/***/ 3413:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);

const nullTag = {
    identify: value => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => source && nullTag.test.test(source) ? source : ctx.options.nullStr
};

exports.nullTag = nullTag;


/***/ }),

/***/ 3064:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var createNode = __nccwpck_require__(2237);
var Node = __nccwpck_require__(6713);
var YAMLSeq = __nccwpck_require__(2515);

function createSeq(schema, obj, ctx) {
    const { replacer } = ctx;
    const seq = new YAMLSeq.YAMLSeq(schema);
    if (obj && Symbol.iterator in Object(obj)) {
        let i = 0;
        for (let it of obj) {
            if (typeof replacer === 'function') {
                const key = obj instanceof Set ? it : String(i++);
                it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, undefined, ctx));
        }
    }
    return seq;
}
const seq = {
    collection: 'seq',
    createNode: createSeq,
    default: true,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: 'tag:yaml.org,2002:seq',
    resolve(seq, onError) {
        if (!Node.isSeq(seq))
            onError('Expected a sequence for this tag');
        return seq;
    }
};

exports.seq = seq;


/***/ }),

/***/ 7688:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyString = __nccwpck_require__(3976);

const string = {
    identify: value => typeof value === 'string',
    default: true,
    tag: 'tag:yaml.org,2002:str',
    resolve: str => str,
    stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
};

exports.string = string;


/***/ }),

/***/ 1800:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);

const boolTag = {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: str => new Scalar.Scalar(str[0] === 't' || str[0] === 'T'),
    stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
            const sv = source[0] === 't' || source[0] === 'T';
            if (value === sv)
                return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
};

exports.boolTag = boolTag;


/***/ }),

/***/ 1301:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var stringifyNumber = __nccwpck_require__(8917);

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,
    resolve: str => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str),
    stringify: ({ value }) => Number(value).toExponential()
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf('.');
        if (dot !== -1 && str[str.length - 1] === '0')
            node.minFractionDigits = str.length - dot - 1;
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ 84:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(8917);

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
const intResolve = (str, offset, radix, { intAsBigInt }) => (intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix));
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
}
const intOct = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: node => intStringify(node, 8, '0o')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ 580:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(9744);
var _null = __nccwpck_require__(3413);
var seq = __nccwpck_require__(3064);
var string = __nccwpck_require__(7688);
var bool = __nccwpck_require__(1800);
var float = __nccwpck_require__(1301);
var int = __nccwpck_require__(84);

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.boolTag,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
];

exports.schema = schema;


/***/ }),

/***/ 503:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var map = __nccwpck_require__(9744);
var seq = __nccwpck_require__(3064);

function intIdentify(value) {
    return typeof value === 'bigint' || Number.isInteger(value);
}
const stringifyJSON = ({ value }) => JSON.stringify(value);
const jsonScalars = [
    {
        identify: value => typeof value === 'string',
        default: true,
        tag: 'tag:yaml.org,2002:str',
        resolve: str => str,
        stringify: stringifyJSON
    },
    {
        identify: value => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: 'tag:yaml.org,2002:null',
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
    },
    {
        identify: value => typeof value === 'boolean',
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^true|false$/,
        resolve: str => str === 'true',
        stringify: stringifyJSON
    },
    {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: str => parseFloat(str),
        stringify: stringifyJSON
    }
];
const jsonError = {
    default: true,
    tag: '',
    test: /^/,
    resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
    }
};
const schema = [map.map, seq.seq].concat(jsonScalars, jsonError);

exports.schema = schema;


/***/ }),

/***/ 4108:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(9744);
var _null = __nccwpck_require__(3413);
var seq = __nccwpck_require__(3064);
var string = __nccwpck_require__(7688);
var bool = __nccwpck_require__(1800);
var float = __nccwpck_require__(1301);
var int = __nccwpck_require__(84);
var schema = __nccwpck_require__(580);
var schema$1 = __nccwpck_require__(503);
var binary = __nccwpck_require__(5866);
var omap = __nccwpck_require__(6709);
var pairs = __nccwpck_require__(3466);
var schema$2 = __nccwpck_require__(3337);
var set = __nccwpck_require__(3230);
var timestamp = __nccwpck_require__(7261);

const schemas = {
    core: schema.schema,
    failsafe: [map.map, seq.seq, string.string],
    json: schema$1.schema,
    yaml11: schema$2.schema,
    'yaml-1.1': schema$2.schema
};
const tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int.int,
    intHex: int.intHex,
    intOct: int.intOct,
    intTime: timestamp.intTime,
    map: map.map,
    null: _null.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set.set,
    timestamp: timestamp.timestamp
};
const coreKnownTags = {
    'tag:yaml.org,2002:binary': binary.binary,
    'tag:yaml.org,2002:omap': omap.omap,
    'tag:yaml.org,2002:pairs': pairs.pairs,
    'tag:yaml.org,2002:set': set.set,
    'tag:yaml.org,2002:timestamp': timestamp.timestamp
};
function getTags(customTags, schemaName) {
    let tags = schemas[schemaName];
    if (!tags) {
        const keys = Object.keys(schemas)
            .filter(key => key !== 'yaml11')
            .map(key => JSON.stringify(key))
            .join(', ');
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys}`);
    }
    if (Array.isArray(customTags)) {
        for (const tag of customTags)
            tags = tags.concat(tag);
    }
    else if (typeof customTags === 'function') {
        tags = customTags(tags.slice());
    }
    return tags.map(tag => {
        if (typeof tag !== 'string')
            return tag;
        const tagObj = tagsByName[tag];
        if (tagObj)
            return tagObj;
        const keys = Object.keys(tagsByName)
            .map(key => JSON.stringify(key))
            .join(', ');
        throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
    });
}

exports.coreKnownTags = coreKnownTags;
exports.getTags = getTags;


/***/ }),

/***/ 5866:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var stringifyString = __nccwpck_require__(3976);

const binary = {
    identify: value => value instanceof Uint8Array,
    default: false,
    tag: 'tag:yaml.org,2002:binary',
    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve(src, onError) {
        if (typeof Buffer === 'function') {
            return Buffer.from(src, 'base64');
        }
        else if (typeof atob === 'function') {
            // On IE 11, atob() can't handle newlines
            const str = atob(src.replace(/[\n\r]/g, ''));
            const buffer = new Uint8Array(str.length);
            for (let i = 0; i < str.length; ++i)
                buffer[i] = str.charCodeAt(i);
            return buffer;
        }
        else {
            onError('This environment does not support reading binary tags; either Buffer or atob is required');
            return src;
        }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        const buf = value; // checked earlier by binary.identify()
        let str;
        if (typeof Buffer === 'function') {
            str =
                buf instanceof Buffer
                    ? buf.toString('base64')
                    : Buffer.from(buf.buffer).toString('base64');
        }
        else if (typeof btoa === 'function') {
            let s = '';
            for (let i = 0; i < buf.length; ++i)
                s += String.fromCharCode(buf[i]);
            str = btoa(s);
        }
        else {
            throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
        }
        if (!type)
            type = Scalar.Scalar.BLOCK_LITERAL;
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
            const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
            const n = Math.ceil(str.length / lineWidth);
            const lines = new Array(n);
            for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
                lines[i] = str.substr(o, lineWidth);
            }
            str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? '\n' : ' ');
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
};

exports.binary = binary;


/***/ }),

/***/ 3869:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);

function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
        return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
}
const trueTag = {
    identify: value => value === true,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(true),
    stringify: boolStringify
};
const falseTag = {
    identify: value => value === false,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => new Scalar.Scalar(false),
    stringify: boolStringify
};

exports.falseTag = falseTag;
exports.trueTag = trueTag;


/***/ }),

/***/ 1910:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var stringifyNumber = __nccwpck_require__(8917);

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, '')),
    stringify: ({ value }) => Number(value).toExponential()
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, '')));
        const dot = str.indexOf('.');
        if (dot !== -1) {
            const f = str.substring(dot + 1).replace(/_/g, '');
            if (f[f.length - 1] === '0')
                node.minFractionDigits = f.length;
        }
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ 873:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(8917);

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
function intResolve(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === '-' || sign === '+')
        offset += 1;
    str = str.substring(offset).replace(/_/g, '');
    if (intAsBigInt) {
        switch (radix) {
            case 2:
                str = `0b${str}`;
                break;
            case 8:
                str = `0o${str}`;
                break;
            case 16:
                str = `0x${str}`;
                break;
        }
        const n = BigInt(str);
        return sign === '-' ? BigInt(-1) * n : n;
    }
    const n = parseInt(str, radix);
    return sign === '-' ? -1 * n : n;
}
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
}
const intBin = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'BIN',
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: node => intStringify(node, 2, '0b')
};
const intOct = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: node => intStringify(node, 8, '0')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intBin = intBin;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ 6709:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var YAMLSeq = __nccwpck_require__(2515);
var toJS = __nccwpck_require__(2273);
var Node = __nccwpck_require__(6713);
var YAMLMap = __nccwpck_require__(4536);
var pairs = __nccwpck_require__(3466);

class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = YAMLOMap.tag;
    }
    /**
     * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
     * but TypeScript won't allow widening the signature of a child method.
     */
    toJSON(_, ctx) {
        if (!ctx)
            return super.toJSON(_);
        const map = new Map();
        if (ctx && ctx.onCreate)
            ctx.onCreate(map);
        for (const pair of this.items) {
            let key, value;
            if (Node.isPair(pair)) {
                key = toJS.toJS(pair.key, '', ctx);
                value = toJS.toJS(pair.value, key, ctx);
            }
            else {
                key = toJS.toJS(pair, '', ctx);
            }
            if (map.has(key))
                throw new Error('Ordered maps must not include duplicate keys');
            map.set(key, value);
        }
        return map;
    }
}
YAMLOMap.tag = 'tag:yaml.org,2002:omap';
const omap = {
    collection: 'seq',
    identify: value => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: 'tag:yaml.org,2002:omap',
    resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
            if (Node.isScalar(key)) {
                if (seenKeys.includes(key.value)) {
                    onError(`Ordered maps must not include duplicate keys: ${key.value}`);
                }
                else {
                    seenKeys.push(key.value);
                }
            }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
    },
    createNode(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap = new YAMLOMap();
        omap.items = pairs$1.items;
        return omap;
    }
};

exports.YAMLOMap = YAMLOMap;
exports.omap = omap;


/***/ }),

/***/ 3466:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var Scalar = __nccwpck_require__(835);
var YAMLSeq = __nccwpck_require__(2515);

function resolvePairs(seq, onError) {
    if (Node.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
            let item = seq.items[i];
            if (Node.isPair(item))
                continue;
            else if (Node.isMap(item)) {
                if (item.items.length > 1)
                    onError('Each pair must have its own sequence indicator');
                const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
                if (item.commentBefore)
                    pair.key.commentBefore = pair.key.commentBefore
                        ? `${item.commentBefore}\n${pair.key.commentBefore}`
                        : item.commentBefore;
                if (item.comment) {
                    const cn = pair.value || pair.key;
                    cn.comment = cn.comment
                        ? `${item.comment}\n${cn.comment}`
                        : item.comment;
                }
                item = pair;
            }
            seq.items[i] = Node.isPair(item) ? item : new Pair.Pair(item);
        }
    }
    else
        onError('Expected a sequence for this tag');
    return seq;
}
function createPairs(schema, iterable, ctx) {
    const { replacer } = ctx;
    const pairs = new YAMLSeq.YAMLSeq(schema);
    pairs.tag = 'tag:yaml.org,2002:pairs';
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
            if (typeof replacer === 'function')
                it = replacer.call(iterable, String(i++), it);
            let key, value;
            if (Array.isArray(it)) {
                if (it.length === 2) {
                    key = it[0];
                    value = it[1];
                }
                else
                    throw new TypeError(`Expected [key, value] tuple: ${it}`);
            }
            else if (it && it instanceof Object) {
                const keys = Object.keys(it);
                if (keys.length === 1) {
                    key = keys[0];
                    value = it[key];
                }
                else
                    throw new TypeError(`Expected { key: value } tuple: ${it}`);
            }
            else {
                key = it;
            }
            pairs.items.push(Pair.createPair(key, value, ctx));
        }
    return pairs;
}
const pairs = {
    collection: 'seq',
    default: false,
    tag: 'tag:yaml.org,2002:pairs',
    resolve: resolvePairs,
    createNode: createPairs
};

exports.createPairs = createPairs;
exports.pairs = pairs;
exports.resolvePairs = resolvePairs;


/***/ }),

/***/ 3337:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var map = __nccwpck_require__(9744);
var _null = __nccwpck_require__(3413);
var seq = __nccwpck_require__(3064);
var string = __nccwpck_require__(7688);
var binary = __nccwpck_require__(5866);
var bool = __nccwpck_require__(3869);
var float = __nccwpck_require__(1910);
var int = __nccwpck_require__(873);
var omap = __nccwpck_require__(6709);
var pairs = __nccwpck_require__(3466);
var set = __nccwpck_require__(3230);
var timestamp = __nccwpck_require__(7261);

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.trueTag,
    bool.falseTag,
    int.intBin,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    omap.omap,
    pairs.pairs,
    set.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
];

exports.schema = schema;


/***/ }),

/***/ 3230:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Pair = __nccwpck_require__(8078);
var YAMLMap = __nccwpck_require__(4536);

class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema) {
        super(schema);
        this.tag = YAMLSet.tag;
    }
    add(key) {
        let pair;
        if (Node.isPair(key))
            pair = key;
        else if (typeof key === 'object' &&
            'key' in key &&
            'value' in key &&
            key.value === null)
            pair = new Pair.Pair(key.key, null);
        else
            pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
            this.items.push(pair);
    }
    get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && Node.isPair(pair)
            ? Node.isScalar(pair.key)
                ? pair.key.value
                : pair.key
            : pair;
    }
    set(key, value) {
        if (typeof value !== 'boolean')
            throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
            this.items.splice(this.items.indexOf(prev), 1);
        }
        else if (!prev && value) {
            this.items.push(new Pair.Pair(key));
        }
    }
    toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        if (this.hasAllNullValues(true))
            return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
            throw new Error('Set items must all have null values');
    }
}
YAMLSet.tag = 'tag:yaml.org,2002:set';
const set = {
    collection: 'map',
    identify: value => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: 'tag:yaml.org,2002:set',
    resolve(map, onError) {
        if (Node.isMap(map)) {
            if (map.hasAllNullValues(true))
                return Object.assign(new YAMLSet(), map);
            else
                onError('Set items must all have null values');
        }
        else
            onError('Expected a mapping for this tag');
        return map;
    },
    createNode(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set = new YAMLSet(schema);
        if (iterable && Symbol.iterator in Object(iterable))
            for (let value of iterable) {
                if (typeof replacer === 'function')
                    value = replacer.call(iterable, value, value);
                set.items.push(Pair.createPair(value, null, ctx));
            }
        return set;
    }
};

exports.YAMLSet = YAMLSet;
exports.set = set;


/***/ }),

/***/ 7261:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var stringifyNumber = __nccwpck_require__(8917);

/** Internal types handle bigint as number, because TS can't figure it out. */
function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === '-' || sign === '+' ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts
        .replace(/_/g, '')
        .split(':')
        .reduce((res, p) => res * num(60) + num(p), num(0));
    return (sign === '-' ? num(-1) * res : res);
}
/**
 * hhhh:mm:ss.sss
 *
 * Internal types handle bigint as number, because TS can't figure it out.
 */
function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === 'bigint')
        num = n => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
    let sign = '';
    if (value < 0) {
        sign = '-';
        value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60]; // seconds, including ms
    if (value < 60) {
        parts.unshift(0); // at least one : is required
    }
    else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60); // minutes
        if (value >= 60) {
            value = (value - parts[0]) / _60;
            parts.unshift(value); // hours
        }
    }
    return (sign +
        parts
            .map(n => (n < 10 ? '0' + String(n) : String(n)))
            .join(':')
            .replace(/000000\d*$/, '') // % 60 may introduce error
    );
}
const intTime = {
    identify: value => typeof value === 'bigint' || Number.isInteger(value),
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
};
const floatTime = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: str => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
};
const timestamp = {
    identify: value => value instanceof Date,
    default: true,
    tag: 'tag:yaml.org,2002:timestamp',
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp('^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
        '(?:' + // time is optional
        '(?:t|T|[ \\t]+)' + // t | T | whitespace
        '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
        '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
        ')?$'),
    resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
            throw new Error('!!timestamp expects a date, starting with yyyy-mm-dd');
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + '00').substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== 'Z') {
            let d = parseSexagesimal(tz, false);
            if (Math.abs(d) < 30)
                d *= 60;
            date -= 60000 * d;
        }
        return new Date(date);
    },
    stringify: ({ value }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};

exports.floatTime = floatTime;
exports.intTime = intTime;
exports.timestamp = timestamp;


/***/ }),

/***/ 2472:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const FOLD_FLOW = 'flow';
const FOLD_BLOCK = 'block';
const FOLD_QUOTED = 'quoted';
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 */
function foldFlowLines(text, indent, mode = 'flow', { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
        return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
        return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === 'number') {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
            folds.push(0);
        else
            end = lineWidth - indentAtStart;
    }
    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i);
        if (i !== -1)
            end = i + endStep;
    }
    for (let ch; (ch = text[(i += 1)]);) {
        if (mode === FOLD_QUOTED && ch === '\\') {
            escStart = i;
            switch (text[i + 1]) {
                case 'x':
                    i += 3;
                    break;
                case 'u':
                    i += 5;
                    break;
                case 'U':
                    i += 9;
                    break;
                default:
                    i += 1;
            }
            escEnd = i;
        }
        if (ch === '\n') {
            if (mode === FOLD_BLOCK)
                i = consumeMoreIndentedLines(text, i);
            end = i + endStep;
            split = undefined;
        }
        else {
            if (ch === ' ' &&
                prev &&
                prev !== ' ' &&
                prev !== '\n' &&
                prev !== '\t') {
                // space surrounded by non-space can be replaced with newline + indent
                const next = text[i + 1];
                if (next && next !== ' ' && next !== '\n' && next !== '\t')
                    split = i;
            }
            if (i >= end) {
                if (split) {
                    folds.push(split);
                    end = split + endStep;
                    split = undefined;
                }
                else if (mode === FOLD_QUOTED) {
                    // white-space collected at end may stretch past lineWidth
                    while (prev === ' ' || prev === '\t') {
                        prev = ch;
                        ch = text[(i += 1)];
                        overflow = true;
                    }
                    // Account for newline escape, but don't break preceding escape
                    const j = i > escEnd + 1 ? i - 2 : escStart - 1;
                    // Bail out if lineWidth & minContentWidth are shorter than an escape string
                    if (escapedFolds[j])
                        return text;
                    folds.push(j);
                    escapedFolds[j] = true;
                    end = j + endStep;
                    split = undefined;
                }
                else {
                    overflow = true;
                }
            }
        }
        prev = ch;
    }
    if (overflow && onOverflow)
        onOverflow();
    if (folds.length === 0)
        return text;
    if (onFold)
        onFold();
    let res = text.slice(0, folds[0]);
    for (let i = 0; i < folds.length; ++i) {
        const fold = folds[i];
        const end = folds[i + 1] || text.length;
        if (fold === 0)
            res = `\n${indent}${text.slice(0, end)}`;
        else {
            if (mode === FOLD_QUOTED && escapedFolds[fold])
                res += `${text[fold]}\\`;
            res += `\n${indent}${text.slice(fold + 1, end)}`;
        }
    }
    return res;
}
/**
 * Presumes `i + 1` is at the start of a line
 * @returns index of last newline in more-indented block
 */
function consumeMoreIndentedLines(text, i) {
    let ch = text[i + 1];
    while (ch === ' ' || ch === '\t') {
        do {
            ch = text[(i += 1)];
        } while (ch && ch !== '\n');
        ch = text[i + 1];
    }
    return i;
}

exports.FOLD_BLOCK = FOLD_BLOCK;
exports.FOLD_FLOW = FOLD_FLOW;
exports.FOLD_QUOTED = FOLD_QUOTED;
exports.foldFlowLines = foldFlowLines;


/***/ }),

/***/ 1530:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var anchors = __nccwpck_require__(5987);
var Node = __nccwpck_require__(6713);
var stringifyString = __nccwpck_require__(3976);

const createStringifyContext = (doc, options) => ({
    anchors: new Set(),
    doc,
    indent: '',
    indentStep: typeof options.indent === 'number' ? ' '.repeat(options.indent) : '  ',
    options: Object.assign({
        defaultKeyType: null,
        defaultStringType: 'PLAIN',
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: 'false',
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: 'null',
        simpleKeys: false,
        singleQuote: false,
        trueStr: 'true',
        verifyAliasOrder: true
    }, options)
});
function getTagObject(tags, item) {
    if (item.tag) {
        const match = tags.filter(t => t.tag === item.tag);
        if (match.length > 0)
            return match.find(t => t.format === item.format) || match[0];
    }
    let tagObj = undefined;
    let obj;
    if (Node.isScalar(item)) {
        obj = item.value;
        const match = tags.filter(t => t.identify && t.identify(obj));
        tagObj =
            match.find(t => t.format === item.format) || match.find(t => !t.format);
    }
    else {
        obj = item;
        tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
        // @ts-ignore
        const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
        throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
}
// needs to be called before value stringifier to allow for circular anchor refs
function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
    const props = [];
    const anchor = (Node.isScalar(node) || Node.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
    }
    if (node.tag) {
        props.push(doc.directives.tagString(node.tag));
    }
    else if (!tagObj.default) {
        props.push(doc.directives.tagString(tagObj.tag));
    }
    return props.join(' ');
}
function stringify(item, ctx, onComment, onChompKeep) {
    if (Node.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
    if (Node.isAlias(item))
        return item.toString(ctx);
    let tagObj = undefined;
    const node = Node.isNode(item)
        ? item
        : ctx.doc.createNode(item, { onTagObj: o => (tagObj = o) });
    if (!tagObj)
        tagObj = getTagObject(ctx.doc.schema.tags, node);
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
    const str = typeof tagObj.stringify === 'function'
        ? tagObj.stringify(node, ctx, onComment, onChompKeep)
        : Node.isScalar(node)
            ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep)
            : node.toString(ctx, onComment, onChompKeep);
    if (!props)
        return str;
    return Node.isScalar(node) || str[0] === '{' || str[0] === '['
        ? `${props} ${str}`
        : `${props}\n${ctx.indent}${str}`;
}

exports.createStringifyContext = createStringifyContext;
exports.stringify = stringify;


/***/ }),

/***/ 1537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Collection = __nccwpck_require__(6842);
var Node = __nccwpck_require__(6713);
var stringify = __nccwpck_require__(1530);
var stringifyComment = __nccwpck_require__(6628);

function stringifyCollection({ comment, flow, items }, ctx, { blockItem, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, indentStep } = ctx;
    const inFlow = flow || ctx.inFlow;
    if (inFlow)
        itemIndent += indentStep;
    ctx = Object.assign({}, ctx, { indent: itemIndent, inFlow, type: null });
    let singleLineOutput = true;
    let chompKeep = false; // flag for the preceding node's status
    const nodes = items.reduce((nodes, item, i) => {
        let comment = null;
        if (Node.isNode(item)) {
            if (!chompKeep && item.spaceBefore)
                nodes.push({ comment: true, str: '' });
            let cb = item.commentBefore;
            if (cb && chompKeep)
                cb = cb.replace(/^\n+/, '');
            if (cb) {
                if (/^\n+$/.test(cb))
                    cb = cb.substring(1);
                // This match will always succeed on a non-empty string
                for (const line of cb.match(/^.*$/gm)) {
                    const str = line === ' ' ? '#' : line ? `#${line}` : '';
                    nodes.push({ comment: true, str });
                }
            }
            if (item.comment) {
                comment = item.comment;
                singleLineOutput = false;
            }
        }
        else if (Node.isPair(item)) {
            const ik = Node.isNode(item.key) ? item.key : null;
            if (ik) {
                if (!chompKeep && ik.spaceBefore)
                    nodes.push({ comment: true, str: '' });
                let cb = ik.commentBefore;
                if (cb && chompKeep)
                    cb = cb.replace(/^\n+/, '');
                if (cb) {
                    if (/^\n+$/.test(cb))
                        cb = cb.substring(1);
                    // This match will always succeed on a non-empty string
                    for (const line of cb.match(/^.*$/gm)) {
                        const str = line === ' ' ? '#' : line ? `#${line}` : '';
                        nodes.push({ comment: true, str });
                    }
                }
                if (ik.comment)
                    singleLineOutput = false;
            }
            if (inFlow) {
                const iv = Node.isNode(item.value) ? item.value : null;
                if (iv) {
                    if (iv.comment)
                        comment = iv.comment;
                    if (iv.comment || iv.commentBefore)
                        singleLineOutput = false;
                }
                else if (item.value == null && ik && ik.comment) {
                    comment = ik.comment;
                }
            }
        }
        chompKeep = false;
        let str = stringify.stringify(item, ctx, () => (comment = null), () => (chompKeep = true));
        if (inFlow && i < items.length - 1)
            str += ',';
        str = stringifyComment.addComment(str, itemIndent, comment);
        if (chompKeep && (comment || inFlow))
            chompKeep = false;
        nodes.push({ comment: false, str });
        return nodes;
    }, []);
    let str;
    if (nodes.length === 0) {
        str = flowChars.start + flowChars.end;
    }
    else if (inFlow) {
        const { start, end } = flowChars;
        const strings = nodes.map(n => n.str);
        let singleLineLength = 2;
        for (const node of nodes) {
            if (node.comment || node.str.includes('\n')) {
                singleLineOutput = false;
                break;
            }
            singleLineLength += node.str.length + 2;
        }
        if (!singleLineOutput ||
            singleLineLength > Collection.Collection.maxFlowStringSingleLineLength) {
            str = start;
            for (const s of strings) {
                str += s ? `\n${indentStep}${indent}${s}` : '\n';
            }
            str += `\n${indent}${end}`;
        }
        else {
            str = `${start} ${strings.join(' ')} ${end}`;
        }
    }
    else {
        const strings = nodes.map(blockItem);
        str = strings.shift() || '';
        for (const s of strings)
            str += s ? `\n${indent}${s}` : '\n';
    }
    if (comment) {
        str += '\n' + stringifyComment.stringifyComment(comment, indent);
        if (onComment)
            onComment();
    }
    else if (chompKeep && onChompKeep)
        onChompKeep();
    return str;
}

exports.stringifyCollection = stringifyCollection;


/***/ }),

/***/ 6628:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const stringifyComment = (comment, indent) => /^\n+$/.test(comment)
    ? comment.substring(1)
    : comment.replace(/^(?!$)(?: $)?/gm, `${indent}#`);
function addComment(str, indent, comment) {
    return !comment
        ? str
        : comment.includes('\n')
            ? `${str}\n` + stringifyComment(comment, indent)
            : str.endsWith(' ')
                ? `${str}#${comment}`
                : `${str} #${comment}`;
}

exports.addComment = addComment;
exports.stringifyComment = stringifyComment;


/***/ }),

/***/ 6253:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var stringify = __nccwpck_require__(1530);
var stringifyComment = __nccwpck_require__(6628);

function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false) {
        const dir = doc.directives.toString(doc);
        if (dir) {
            lines.push(dir);
            hasDirectives = true;
        }
        else if (doc.directives.marker)
            hasDirectives = true;
    }
    if (hasDirectives)
        lines.push('---');
    if (doc.commentBefore) {
        if (lines.length !== 1)
            lines.unshift('');
        lines.unshift(stringifyComment.stringifyComment(doc.commentBefore, ''));
    }
    const ctx = stringify.createStringifyContext(doc, options);
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
        if (Node.isNode(doc.contents)) {
            if (doc.contents.spaceBefore && hasDirectives)
                lines.push('');
            if (doc.contents.commentBefore)
                lines.push(stringifyComment.stringifyComment(doc.contents.commentBefore, ''));
            // top-level block scalars need to be indented if followed by a comment
            ctx.forceBlockIndent = !!doc.comment;
            contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? undefined : () => (chompKeep = true);
        let body = stringify.stringify(doc.contents, ctx, () => (contentComment = null), onChompKeep);
        if (contentComment)
            body = stringifyComment.addComment(body, '', contentComment);
        if ((body[0] === '|' || body[0] === '>') &&
            lines[lines.length - 1] === '---') {
            // Top-level block scalars with a preceding doc marker ought to use the
            // same line for their header.
            lines[lines.length - 1] = `--- ${body}`;
        }
        else
            lines.push(body);
    }
    else {
        lines.push(stringify.stringify(doc.contents, ctx));
    }
    let dc = doc.comment;
    if (dc && chompKeep)
        dc = dc.replace(/^\n+/, '');
    if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '')
            lines.push('');
        lines.push(stringifyComment.stringifyComment(dc, ''));
    }
    return lines.join('\n') + '\n';
}

exports.stringifyDocument = stringifyDocument;


/***/ }),

/***/ 8917:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === 'bigint')
        return String(value);
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num))
        return isNaN(num) ? '.nan' : num < 0 ? '-.inf' : '.inf';
    let n = JSON.stringify(value);
    if (!format &&
        minFractionDigits &&
        (!tag || tag === 'tag:yaml.org,2002:float') &&
        /^\d/.test(n)) {
        let i = n.indexOf('.');
        if (i < 0) {
            i = n.length;
            n += '.';
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
            n += '0';
    }
    return n;
}

exports.stringifyNumber = stringifyNumber;


/***/ }),

/***/ 2869:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);
var Scalar = __nccwpck_require__(835);
var stringify = __nccwpck_require__(1530);
var stringifyComment = __nccwpck_require__(6628);

function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { indentSeq, simpleKeys } } = ctx;
    let keyComment = (Node.isNode(key) && key.comment) || null;
    if (simpleKeys) {
        if (keyComment) {
            throw new Error('With simple keys, key nodes cannot have comments');
        }
        if (Node.isCollection(key)) {
            const msg = 'With simple keys, collection cannot be used as a key value';
            throw new Error(msg);
        }
    }
    let explicitKey = !simpleKeys &&
        (!key ||
            (keyComment && value == null && !ctx.inFlow) ||
            Node.isCollection(key) ||
            (Node.isScalar(key)
                ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL
                : typeof key === 'object'));
    ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify.stringify(key, ctx, () => (keyCommentDone = true), () => (chompKeep = true));
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
            throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
        explicitKey = true;
    }
    if (ctx.inFlow) {
        if (allNullValues || value == null) {
            if (keyCommentDone && onComment)
                onComment();
            return explicitKey ? `? ${str}` : str;
        }
    }
    else if ((allNullValues && !simpleKeys) || (value == null && explicitKey)) {
        if (keyCommentDone)
            keyComment = null;
        if (chompKeep && !keyComment && onChompKeep)
            onChompKeep();
        return stringifyComment.addComment(`? ${str}`, ctx.indent, keyComment);
    }
    if (keyCommentDone)
        keyComment = null;
    str = explicitKey
        ? `? ${stringifyComment.addComment(str, ctx.indent, keyComment)}\n${indent}:`
        : stringifyComment.addComment(`${str}:`, ctx.indent, keyComment);
    let vcb = '';
    let valueComment = null;
    if (Node.isNode(value)) {
        if (value.spaceBefore)
            vcb = '\n';
        if (value.commentBefore)
            vcb += `\n${stringifyComment.stringifyComment(value.commentBefore, ctx.indent)}`;
        valueComment = value.comment;
    }
    else if (value && typeof value === 'object') {
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && Node.isScalar(value))
        ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq &&
        indentStep.length >= 2 &&
        !ctx.inFlow &&
        !explicitKey &&
        Node.isSeq(value) &&
        !value.flow &&
        !value.tag &&
        !value.anchor) {
        // If indentSeq === false, consider '- ' as part of indentation where possible
        ctx.indent = ctx.indent.substr(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify.stringify(value, ctx, () => (valueCommentDone = true), () => (chompKeep = true));
    let ws = ' ';
    if (vcb || keyComment) {
        ws = `${vcb}\n${ctx.indent}`;
    }
    else if (!explicitKey && Node.isCollection(value)) {
        const flow = valueStr[0] === '[' || valueStr[0] === '{';
        if (!flow || valueStr.includes('\n'))
            ws = `\n${ctx.indent}`;
    }
    else if (valueStr[0] === '\n')
        ws = '';
    if (ctx.inFlow) {
        if (valueCommentDone && onComment)
            onComment();
        return str + ws + valueStr;
    }
    else {
        if (valueCommentDone)
            valueComment = null;
        if (chompKeep && !valueComment && onChompKeep)
            onChompKeep();
        return stringifyComment.addComment(str + ws + valueStr, ctx.indent, valueComment);
    }
}

exports.stringifyPair = stringifyPair;


/***/ }),

/***/ 3976:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Scalar = __nccwpck_require__(835);
var foldFlowLines = __nccwpck_require__(2472);

const getFoldOptions = (ctx) => ({
    indentAtStart: ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
});
// Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.
const containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
        return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
        return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === '\n') {
            if (i - start > limit)
                return true;
            start = i + 1;
            if (strLen - start <= limit)
                return false;
        }
    }
    return true;
}
function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
        return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    let str = '';
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
            // space before newline needs to be escaped to not be folded
            str += json.slice(start, i) + '\\ ';
            i += 1;
            start = i;
            ch = '\\';
        }
        if (ch === '\\')
            switch (json[i + 1]) {
                case 'u':
                    {
                        str += json.slice(start, i);
                        const code = json.substr(i + 2, 4);
                        switch (code) {
                            case '0000':
                                str += '\\0';
                                break;
                            case '0007':
                                str += '\\a';
                                break;
                            case '000b':
                                str += '\\v';
                                break;
                            case '001b':
                                str += '\\e';
                                break;
                            case '0085':
                                str += '\\N';
                                break;
                            case '00a0':
                                str += '\\_';
                                break;
                            case '2028':
                                str += '\\L';
                                break;
                            case '2029':
                                str += '\\P';
                                break;
                            default:
                                if (code.substr(0, 2) === '00')
                                    str += '\\x' + code.substr(2);
                                else
                                    str += json.substr(i, 6);
                        }
                        i += 5;
                        start = i + 1;
                    }
                    break;
                case 'n':
                    if (implicitKey ||
                        json[i + 2] === '"' ||
                        json.length < minMultiLineLength) {
                        i += 1;
                    }
                    else {
                        // folding will eat first newline
                        str += json.slice(start, i) + '\n\n';
                        while (json[i + 2] === '\\' &&
                            json[i + 3] === 'n' &&
                            json[i + 4] !== '"') {
                            str += '\n';
                            i += 2;
                        }
                        str += indent;
                        // space after newline needs to be escaped to not be folded
                        if (json[i + 2] === ' ')
                            str += '\\';
                        i += 1;
                        start = i + 1;
                    }
                    break;
                default:
                    i += 1;
            }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx));
}
function singleQuotedString(value, ctx) {
    if (ctx.implicitKey) {
        if (/\n/.test(value))
            return doubleQuotedString(value, ctx);
    }
    else {
        // single quoted string can't have leading or trailing whitespace around newline
        if (/[ \t]\n|\n[ \t]/.test(value))
            return doubleQuotedString(value, ctx);
    }
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
    return ctx.implicitKey
        ? res
        : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    // 1. Block can't end in whitespace unless the last line is non-empty.
    // 2. Strings consisting of only whitespace are best rendered explicitly.
    if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
        return doubleQuotedString(value, ctx);
    }
    const indent = ctx.indent ||
        (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
    const literal = type === Scalar.Scalar.BLOCK_FOLDED
        ? false
        : type === Scalar.Scalar.BLOCK_LITERAL
            ? true
            : !lineLengthOverLimit(value, ctx.options.lineWidth, indent.length);
    if (!value)
        return literal ? '|\n' : '>\n';
    // determine chomping from whitespace at value end
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== '\n' && ch !== '\t' && ch !== ' ')
            break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf('\n');
    if (endNlPos === -1) {
        chomp = '-'; // strip
    }
    else if (value === end || endNlPos !== end.length - 1) {
        chomp = '+'; // keep
        if (onChompKeep)
            onChompKeep();
    }
    else {
        chomp = ''; // clip
    }
    if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === '\n')
            end = end.slice(0, -1);
        end = end.replace(/\n+(?!\n|$)/g, `$&${indent}`);
    }
    // determine indent indicator from whitespace at value start
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === ' ')
            startWithSpace = true;
        else if (ch === '\n')
            startNlPos = startEnd;
        else
            break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? '2' : '1'; // root is at -1
    let header = (literal ? '|' : '>') + (startWithSpace ? indentSize : '') + chomp;
    if (comment) {
        header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
        if (onComment)
            onComment();
    }
    if (literal) {
        value = value.replace(/\n+/g, `$&${indent}`);
        return `${header}\n${indent}${start}${value}${end}`;
    }
    value = value
        .replace(/\n+/g, '\n$&')
        .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
        //                ^ more-ind. ^ empty     ^ capture next empty lines only at end of indent
        .replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines.foldFlowLines(`${start}${value}${end}`, indent, foldFlowLines.FOLD_BLOCK, getFoldOptions(ctx));
    return `${header}\n${indent}${body}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
    var _a;
    const { type, value } = item;
    const { actualString, implicitKey, indent, inFlow } = ctx;
    if ((implicitKey && /[\n[\]{},]/.test(value)) ||
        (inFlow && /[[\]{},]/.test(value))) {
        return doubleQuotedString(value, ctx);
    }
    if (!value ||
        /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        const hasDouble = value.indexOf('"') !== -1;
        const hasSingle = value.indexOf("'") !== -1;
        let quotedString;
        if (hasDouble && !hasSingle) {
            quotedString = singleQuotedString;
        }
        else if (hasSingle && !hasDouble) {
            quotedString = doubleQuotedString;
        }
        else if (ctx.options.singleQuote) {
            quotedString = singleQuotedString;
        }
        else {
            quotedString = doubleQuotedString;
        }
        // not allowed:
        // - empty string, '-' or '?'
        // - start with an indicator character (except [?:-]) or /[?-] /
        // - '\n ', ': ' or ' \n' anywhere
        // - '#' not preceded by a non-space char
        // - end with ' ' or ':'
        return implicitKey || inFlow || value.indexOf('\n') === -1
            ? quotedString(value, ctx)
            : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey &&
        !inFlow &&
        type !== Scalar.Scalar.PLAIN &&
        value.indexOf('\n') !== -1) {
        // Where allowed & type not set explicitly, prefer block style for multiline strings
        return blockString(item, ctx, onComment, onChompKeep);
    }
    if (indent === '' && containsDocumentMarker(value)) {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
    }
    const str = value.replace(/\n+/g, `$&\n${indent}`);
    // Verify that output will be parsed as a string, as e.g. plain numbers and
    // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
    // and others in v1.1.
    if (actualString) {
        for (const tag of ctx.doc.schema.tags) {
            if (tag.default &&
                tag.tag !== 'tag:yaml.org,2002:str' &&
                ((_a = tag.test) === null || _a === void 0 ? void 0 : _a.test(str)))
                return doubleQuotedString(value, ctx);
        }
    }
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === 'string'
        ? item
        : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        // force double quotes on control characters & unpaired surrogates
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
            type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
        switch (_type) {
            case Scalar.Scalar.BLOCK_FOLDED:
            case Scalar.Scalar.BLOCK_LITERAL:
                return implicitKey || inFlow
                    ? doubleQuotedString(ss.value, ctx) // blocks are not valid inside flow containers
                    : blockString(ss, ctx, onComment, onChompKeep);
            case Scalar.Scalar.QUOTE_DOUBLE:
                return doubleQuotedString(ss.value, ctx);
            case Scalar.Scalar.QUOTE_SINGLE:
                return singleQuotedString(ss.value, ctx);
            case Scalar.Scalar.PLAIN:
                return plainString(ss, ctx, onComment, onChompKeep);
            default:
                return null;
        }
    };
    let res = _stringify(type);
    if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = (implicitKey && defaultKeyType) || defaultStringType;
        res = _stringify(t);
        if (res === null)
            throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
}

exports.stringifyString = stringifyString;


/***/ }),

/***/ 5966:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var Node = __nccwpck_require__(6713);

const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove node');
/**
 * Apply a visitor to an AST node or document.
 *
 * Walks through the tree (depth-first) starting from `node`, calling a
 * `visitor` function with three arguments:
 *   - `key`: For sequence values and map `Pair`, the node's index in the
 *     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
 *     `null` for the root node.
 *   - `node`: The current node.
 *   - `path`: The ancestry of the current node.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this node, continue with next
 *     sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current node, then continue with the next one
 *   - `Node`: Replace the current node, then continue by visiting it
 *   - `number`: While iterating the items of a sequence or map, set the index
 *     of the next step. This is useful especially if the index of the current
 *     node has changed.
 *
 * If `visitor` is a single function, it will be called with all values
 * encountered in the tree, including e.g. `null` values. Alternatively,
 * separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
 * `Alias` and `Scalar` node. To define the same visitor function for more than
 * one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
 * and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
 * specific defined one will be used for each node.
 */
function visit(node, visitor) {
    if (typeof visitor === 'object' &&
        (visitor.Collection || visitor.Node || visitor.Value)) {
        visitor = Object.assign({
            Alias: visitor.Node,
            Map: visitor.Node,
            Scalar: visitor.Node,
            Seq: visitor.Node
        }, visitor.Value && {
            Map: visitor.Value,
            Scalar: visitor.Value,
            Seq: visitor.Value
        }, visitor.Collection && {
            Map: visitor.Collection,
            Seq: visitor.Collection
        }, visitor);
    }
    if (Node.isDocument(node)) {
        const cd = _visit(null, node.contents, visitor, Object.freeze([node]));
        if (cd === REMOVE)
            node.contents = null;
    }
    else
        _visit(null, node, visitor, Object.freeze([]));
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current node */
visit.SKIP = SKIP;
/** Remove the current node */
visit.REMOVE = REMOVE;
function _visit(key, node, visitor, path) {
    let ctrl = undefined;
    if (typeof visitor === 'function')
        ctrl = visitor(key, node, path);
    else if (Node.isMap(node)) {
        if (visitor.Map)
            ctrl = visitor.Map(key, node, path);
    }
    else if (Node.isSeq(node)) {
        if (visitor.Seq)
            ctrl = visitor.Seq(key, node, path);
    }
    else if (Node.isPair(node)) {
        if (visitor.Pair)
            ctrl = visitor.Pair(key, node, path);
    }
    else if (Node.isScalar(node)) {
        if (visitor.Scalar)
            ctrl = visitor.Scalar(key, node, path);
    }
    else if (Node.isAlias(node)) {
        if (visitor.Alias)
            ctrl = visitor.Alias(key, node, path);
    }
    if (Node.isNode(ctrl) || Node.isPair(ctrl)) {
        const parent = path[path.length - 1];
        if (Node.isCollection(parent)) {
            parent.items[key] = ctrl;
        }
        else if (Node.isPair(parent)) {
            if (key === 'key')
                parent.key = ctrl;
            else
                parent.value = ctrl;
        }
        else if (Node.isDocument(parent)) {
            parent.contents = ctrl;
        }
        else {
            const pt = Node.isAlias(parent) ? 'alias' : 'scalar';
            throw new Error(`Cannot replace node with ${pt} parent`);
        }
        return _visit(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== 'symbol') {
        if (Node.isCollection(node)) {
            path = Object.freeze(path.concat(node));
            for (let i = 0; i < node.items.length; ++i) {
                const ci = _visit(i, node.items[i], visitor, path);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    node.items.splice(i, 1);
                    i -= 1;
                }
            }
        }
        else if (Node.isPair(node)) {
            path = Object.freeze(path.concat(node));
            const ck = _visit('key', node.key, visitor, path);
            if (ck === BREAK)
                return BREAK;
            else if (ck === REMOVE)
                node.key = null;
            const cv = _visit('value', node.value, visitor, path);
            if (cv === BREAK)
                return BREAK;
            else if (cv === REMOVE)
                node.value = null;
        }
    }
    return ctrl;
}

exports.visit = visit;


/***/ }),

/***/ 1340:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const align = {
    right: alignRight,
    center: alignCenter
};
const top = 0;
const right = 1;
const bottom = 2;
const left = 3;
class UI {
    constructor(opts) {
        var _a;
        this.width = opts.width;
        this.wrap = (_a = opts.wrap) !== null && _a !== void 0 ? _a : true;
        this.rows = [];
    }
    span(...args) {
        const cols = this.div(...args);
        cols.span = true;
    }
    resetOutput() {
        this.rows = [];
    }
    div(...args) {
        if (args.length === 0) {
            this.div('');
        }
        if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === 'string') {
            return this.applyLayoutDSL(args[0]);
        }
        const cols = args.map(arg => {
            if (typeof arg === 'string') {
                return this.colFromString(arg);
            }
            return arg;
        });
        this.rows.push(cols);
        return cols;
    }
    shouldApplyLayoutDSL(...args) {
        return args.length === 1 && typeof args[0] === 'string' &&
            /[\t\n]/.test(args[0]);
    }
    applyLayoutDSL(str) {
        const rows = str.split('\n').map(row => row.split('\t'));
        let leftColumnWidth = 0;
        // simple heuristic for layout, make sure the
        // second column lines up along the left-hand.
        // don't allow the first column to take up more
        // than 50% of the screen.
        rows.forEach(columns => {
            if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
                leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
            }
        });
        // generate a table:
        //  replacing ' ' with padding calculations.
        //  using the algorithmically generated width.
        rows.forEach(columns => {
            this.div(...columns.map((r, i) => {
                return {
                    text: r.trim(),
                    padding: this.measurePadding(r),
                    width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
                };
            }));
        });
        return this.rows[this.rows.length - 1];
    }
    colFromString(text) {
        return {
            text,
            padding: this.measurePadding(text)
        };
    }
    measurePadding(str) {
        // measure padding without ansi escape codes
        const noAnsi = mixin.stripAnsi(str);
        return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
    }
    toString() {
        const lines = [];
        this.rows.forEach(row => {
            this.rowToString(row, lines);
        });
        // don't display any lines with the
        // hidden flag set.
        return lines
            .filter(line => !line.hidden)
            .map(line => line.text)
            .join('\n');
    }
    rowToString(row, lines) {
        this.rasterize(row).forEach((rrow, r) => {
            let str = '';
            rrow.forEach((col, c) => {
                const { width } = row[c]; // the width with padding.
                const wrapWidth = this.negatePadding(row[c]); // the width without padding.
                let ts = col; // temporary string used during alignment/padding.
                if (wrapWidth > mixin.stringWidth(col)) {
                    ts += ' '.repeat(wrapWidth - mixin.stringWidth(col));
                }
                // align the string within its column.
                if (row[c].align && row[c].align !== 'left' && this.wrap) {
                    const fn = align[row[c].align];
                    ts = fn(ts, wrapWidth);
                    if (mixin.stringWidth(ts) < wrapWidth) {
                        ts += ' '.repeat((width || 0) - mixin.stringWidth(ts) - 1);
                    }
                }
                // apply border and padding to string.
                const padding = row[c].padding || [0, 0, 0, 0];
                if (padding[left]) {
                    str += ' '.repeat(padding[left]);
                }
                str += addBorder(row[c], ts, '| ');
                str += ts;
                str += addBorder(row[c], ts, ' |');
                if (padding[right]) {
                    str += ' '.repeat(padding[right]);
                }
                // if prior row is span, try to render the
                // current row on the prior line.
                if (r === 0 && lines.length > 0) {
                    str = this.renderInline(str, lines[lines.length - 1]);
                }
            });
            // remove trailing whitespace.
            lines.push({
                text: str.replace(/ +$/, ''),
                span: row.span
            });
        });
        return lines;
    }
    // if the full 'source' can render in
    // the target line, do so.
    renderInline(source, previousLine) {
        const match = source.match(/^ */);
        const leadingWhitespace = match ? match[0].length : 0;
        const target = previousLine.text;
        const targetTextWidth = mixin.stringWidth(target.trimRight());
        if (!previousLine.span) {
            return source;
        }
        // if we're not applying wrapping logic,
        // just always append to the span.
        if (!this.wrap) {
            previousLine.hidden = true;
            return target + source;
        }
        if (leadingWhitespace < targetTextWidth) {
            return source;
        }
        previousLine.hidden = true;
        return target.trimRight() + ' '.repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
    }
    rasterize(row) {
        const rrows = [];
        const widths = this.columnWidths(row);
        let wrapped;
        // word wrap all columns, and create
        // a data-structure that is easy to rasterize.
        row.forEach((col, c) => {
            // leave room for left and right padding.
            col.width = widths[c];
            if (this.wrap) {
                wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split('\n');
            }
            else {
                wrapped = col.text.split('\n');
            }
            if (col.border) {
                wrapped.unshift('.' + '-'.repeat(this.negatePadding(col) + 2) + '.');
                wrapped.push("'" + '-'.repeat(this.negatePadding(col) + 2) + "'");
            }
            // add top and bottom padding.
            if (col.padding) {
                wrapped.unshift(...new Array(col.padding[top] || 0).fill(''));
                wrapped.push(...new Array(col.padding[bottom] || 0).fill(''));
            }
            wrapped.forEach((str, r) => {
                if (!rrows[r]) {
                    rrows.push([]);
                }
                const rrow = rrows[r];
                for (let i = 0; i < c; i++) {
                    if (rrow[i] === undefined) {
                        rrow.push('');
                    }
                }
                rrow.push(str);
            });
        });
        return rrows;
    }
    negatePadding(col) {
        let wrapWidth = col.width || 0;
        if (col.padding) {
            wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
        }
        if (col.border) {
            wrapWidth -= 4;
        }
        return wrapWidth;
    }
    columnWidths(row) {
        if (!this.wrap) {
            return row.map(col => {
                return col.width || mixin.stringWidth(col.text);
            });
        }
        let unset = row.length;
        let remainingWidth = this.width;
        // column widths can be set in config.
        const widths = row.map(col => {
            if (col.width) {
                unset--;
                remainingWidth -= col.width;
                return col.width;
            }
            return undefined;
        });
        // any unset widths should be calculated.
        const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
        return widths.map((w, i) => {
            if (w === undefined) {
                return Math.max(unsetWidth, _minWidth(row[i]));
            }
            return w;
        });
    }
}
function addBorder(col, ts, style) {
    if (col.border) {
        if (/[.']-+[.']/.test(ts)) {
            return '';
        }
        if (ts.trim().length !== 0) {
            return style;
        }
        return '  ';
    }
    return '';
}
// calculates the minimum width of
// a column, based on padding preferences.
function _minWidth(col) {
    const padding = col.padding || [];
    const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
    if (col.border) {
        return minWidth + 4;
    }
    return minWidth;
}
function getWindowWidth() {
    /* istanbul ignore next: depends on terminal */
    if (typeof process === 'object' && process.stdout && process.stdout.columns) {
        return process.stdout.columns;
    }
    return 80;
}
function alignRight(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    if (strWidth < width) {
        return ' '.repeat(width - strWidth) + str;
    }
    return str;
}
function alignCenter(str, width) {
    str = str.trim();
    const strWidth = mixin.stringWidth(str);
    /* istanbul ignore next */
    if (strWidth >= width) {
        return str;
    }
    return ' '.repeat((width - strWidth) >> 1) + str;
}
let mixin;
function cliui(opts, _mixin) {
    mixin = _mixin;
    return new UI({
        width: (opts === null || opts === void 0 ? void 0 : opts.width) || getWindowWidth(),
        wrap: opts === null || opts === void 0 ? void 0 : opts.wrap
    });
}

// Bootstrap cliui with CommonJS dependencies:
const stringWidth = __nccwpck_require__(3175);
const stripAnsi = __nccwpck_require__(6973);
const wrap = __nccwpck_require__(1563);
function ui(opts) {
    return cliui(opts, {
        stringWidth,
        stripAnsi,
        wrap
    });
}

module.exports = ui;


/***/ }),

/***/ 9880:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(5747);
var util = __nccwpck_require__(1669);
var path = __nccwpck_require__(5622);

let shim;
class Y18N {
    constructor(opts) {
        // configurable options.
        opts = opts || {};
        this.directory = opts.directory || './locales';
        this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true;
        this.locale = opts.locale || 'en';
        this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true;
        // internal stuff.
        this.cache = Object.create(null);
        this.writeQueue = [];
    }
    __(...args) {
        if (typeof arguments[0] !== 'string') {
            return this._taggedLiteral(arguments[0], ...arguments);
        }
        const str = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        cb = cb || function () { }; // noop.
        if (!this.cache[this.locale])
            this._readLocaleFile();
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][str] && this.updateFiles) {
            this.cache[this.locale][str] = str;
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
    }
    __n() {
        const args = Array.prototype.slice.call(arguments);
        const singular = args.shift();
        const plural = args.shift();
        const quantity = args.shift();
        let cb = function () { }; // start with noop.
        if (typeof args[args.length - 1] === 'function')
            cb = args.pop();
        if (!this.cache[this.locale])
            this._readLocaleFile();
        let str = quantity === 1 ? singular : plural;
        if (this.cache[this.locale][singular]) {
            const entry = this.cache[this.locale][singular];
            str = entry[quantity === 1 ? 'one' : 'other'];
        }
        // we've observed a new string, update the language file.
        if (!this.cache[this.locale][singular] && this.updateFiles) {
            this.cache[this.locale][singular] = {
                one: singular,
                other: plural
            };
            // include the current directory and locale,
            // since these values could change before the
            // write is performed.
            this._enqueueWrite({
                directory: this.directory,
                locale: this.locale,
                cb
            });
        }
        else {
            cb();
        }
        // if a %d placeholder is provided, add quantity
        // to the arguments expanded by util.format.
        const values = [str];
        if (~str.indexOf('%d'))
            values.push(quantity);
        return shim.format.apply(shim.format, values.concat(args));
    }
    setLocale(locale) {
        this.locale = locale;
    }
    getLocale() {
        return this.locale;
    }
    updateLocale(obj) {
        if (!this.cache[this.locale])
            this._readLocaleFile();
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                this.cache[this.locale][key] = obj[key];
            }
        }
    }
    _taggedLiteral(parts, ...args) {
        let str = '';
        parts.forEach(function (part, i) {
            const arg = args[i + 1];
            str += part;
            if (typeof arg !== 'undefined') {
                str += '%s';
            }
        });
        return this.__.apply(this, [str].concat([].slice.call(args, 1)));
    }
    _enqueueWrite(work) {
        this.writeQueue.push(work);
        if (this.writeQueue.length === 1)
            this._processWriteQueue();
    }
    _processWriteQueue() {
        const _this = this;
        const work = this.writeQueue[0];
        // destructure the enqueued work.
        const directory = work.directory;
        const locale = work.locale;
        const cb = work.cb;
        const languageFile = this._resolveLocaleFile(directory, locale);
        const serializedLocale = JSON.stringify(this.cache[locale], null, 2);
        shim.fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
            _this.writeQueue.shift();
            if (_this.writeQueue.length > 0)
                _this._processWriteQueue();
            cb(err);
        });
    }
    _readLocaleFile() {
        let localeLookup = {};
        const languageFile = this._resolveLocaleFile(this.directory, this.locale);
        try {
            // When using a bundler such as webpack, readFileSync may not be defined:
            if (shim.fs.readFileSync) {
                localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, 'utf-8'));
            }
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                err.message = 'syntax error in ' + languageFile;
            }
            if (err.code === 'ENOENT')
                localeLookup = {};
            else
                throw err;
        }
        this.cache[this.locale] = localeLookup;
    }
    _resolveLocaleFile(directory, locale) {
        let file = shim.resolve(directory, './', locale + '.json');
        if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
            // attempt fallback to language only
            const languageFile = shim.resolve(directory, './', locale.split('_')[0] + '.json');
            if (this._fileExistsSync(languageFile))
                file = languageFile;
        }
        return file;
    }
    _fileExistsSync(file) {
        return shim.exists(file);
    }
}
function y18n$1(opts, _shim) {
    shim = _shim;
    const y18n = new Y18N(opts);
    return {
        __: y18n.__.bind(y18n),
        __n: y18n.__n.bind(y18n),
        setLocale: y18n.setLocale.bind(y18n),
        getLocale: y18n.getLocale.bind(y18n),
        updateLocale: y18n.updateLocale.bind(y18n),
        locale: y18n.locale
    };
}

var nodePlatformShim = {
    fs: {
        readFileSync: fs.readFileSync,
        writeFile: fs.writeFile
    },
    format: util.format,
    resolve: path.resolve,
    exists: (file) => {
        try {
            return fs.statSync(file).isFile();
        }
        catch (err) {
            return false;
        }
    }
};

const y18n = (opts) => {
    return y18n$1(opts, nodePlatformShim);
};

module.exports = y18n;


/***/ }),

/***/ 5876:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var util = __nccwpck_require__(1669);
var fs = __nccwpck_require__(5747);
var path = __nccwpck_require__(5622);

function camelCase(str) {
    const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
    if (!isCamelCase) {
        str = str.toLowerCase();
    }
    if (str.indexOf('-') === -1 && str.indexOf('_') === -1) {
        return str;
    }
    else {
        let camelcase = '';
        let nextChrUpper = false;
        const leadingHyphens = str.match(/^-+/);
        for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
            let chr = str.charAt(i);
            if (nextChrUpper) {
                nextChrUpper = false;
                chr = chr.toUpperCase();
            }
            if (i !== 0 && (chr === '-' || chr === '_')) {
                nextChrUpper = true;
            }
            else if (chr !== '-' && chr !== '_') {
                camelcase += chr;
            }
        }
        return camelcase;
    }
}
function decamelize(str, joinString) {
    const lowercase = str.toLowerCase();
    joinString = joinString || '-';
    let notCamelcase = '';
    for (let i = 0; i < str.length; i++) {
        const chrLower = lowercase.charAt(i);
        const chrString = str.charAt(i);
        if (chrLower !== chrString && i > 0) {
            notCamelcase += `${joinString}${lowercase.charAt(i)}`;
        }
        else {
            notCamelcase += chrString;
        }
    }
    return notCamelcase;
}
function looksLikeNumber(x) {
    if (x === null || x === undefined)
        return false;
    if (typeof x === 'number')
        return true;
    if (/^0x[0-9a-f]+$/i.test(x))
        return true;
    if (/^0[^.]/.test(x))
        return false;
    return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

function tokenizeArgString(argString) {
    if (Array.isArray(argString)) {
        return argString.map(e => typeof e !== 'string' ? e + '' : e);
    }
    argString = argString.trim();
    let i = 0;
    let prevC = null;
    let c = null;
    let opening = null;
    const args = [];
    for (let ii = 0; ii < argString.length; ii++) {
        prevC = c;
        c = argString.charAt(ii);
        if (c === ' ' && !opening) {
            if (!(prevC === ' ')) {
                i++;
            }
            continue;
        }
        if (c === opening) {
            opening = null;
        }
        else if ((c === "'" || c === '"') && !opening) {
            opening = c;
        }
        if (!args[i])
            args[i] = '';
        args[i] += c;
    }
    return args;
}

var DefaultValuesForTypeKey;
(function (DefaultValuesForTypeKey) {
    DefaultValuesForTypeKey["BOOLEAN"] = "boolean";
    DefaultValuesForTypeKey["STRING"] = "string";
    DefaultValuesForTypeKey["NUMBER"] = "number";
    DefaultValuesForTypeKey["ARRAY"] = "array";
})(DefaultValuesForTypeKey || (DefaultValuesForTypeKey = {}));

let mixin;
class YargsParser {
    constructor(_mixin) {
        mixin = _mixin;
    }
    parse(argsInput, options) {
        const opts = Object.assign({
            alias: undefined,
            array: undefined,
            boolean: undefined,
            config: undefined,
            configObjects: undefined,
            configuration: undefined,
            coerce: undefined,
            count: undefined,
            default: undefined,
            envPrefix: undefined,
            narg: undefined,
            normalize: undefined,
            string: undefined,
            number: undefined,
            __: undefined,
            key: undefined
        }, options);
        const args = tokenizeArgString(argsInput);
        const aliases = combineAliases(Object.assign(Object.create(null), opts.alias));
        const configuration = Object.assign({
            'boolean-negation': true,
            'camel-case-expansion': true,
            'combine-arrays': false,
            'dot-notation': true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays': true,
            'greedy-arrays': true,
            'halt-at-non-option': false,
            'nargs-eats-options': false,
            'negation-prefix': 'no-',
            'parse-numbers': true,
            'parse-positional-numbers': true,
            'populate--': false,
            'set-placeholder-key': false,
            'short-option-groups': true,
            'strip-aliased': false,
            'strip-dashed': false,
            'unknown-options-as-args': false
        }, opts.configuration);
        const defaults = Object.assign(Object.create(null), opts.default);
        const configObjects = opts.configObjects || [];
        const envPrefix = opts.envPrefix;
        const notFlagsOption = configuration['populate--'];
        const notFlagsArgv = notFlagsOption ? '--' : '_';
        const newAliases = Object.create(null);
        const defaulted = Object.create(null);
        const __ = opts.__ || mixin.format;
        const flags = {
            aliases: Object.create(null),
            arrays: Object.create(null),
            bools: Object.create(null),
            strings: Object.create(null),
            numbers: Object.create(null),
            counts: Object.create(null),
            normalize: Object.create(null),
            configs: Object.create(null),
            nargs: Object.create(null),
            coercions: Object.create(null),
            keys: []
        };
        const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
        const negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)');
        [].concat(opts.array || []).filter(Boolean).forEach(function (opt) {
            const key = typeof opt === 'object' ? opt.key : opt;
            const assignment = Object.keys(opt).map(function (key) {
                const arrayFlagKeys = {
                    boolean: 'bools',
                    string: 'strings',
                    number: 'numbers'
                };
                return arrayFlagKeys[key];
            }).filter(Boolean).pop();
            if (assignment) {
                flags[assignment][key] = true;
            }
            flags.arrays[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.boolean || []).filter(Boolean).forEach(function (key) {
            flags.bools[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.string || []).filter(Boolean).forEach(function (key) {
            flags.strings[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.number || []).filter(Boolean).forEach(function (key) {
            flags.numbers[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.count || []).filter(Boolean).forEach(function (key) {
            flags.counts[key] = true;
            flags.keys.push(key);
        });
        [].concat(opts.normalize || []).filter(Boolean).forEach(function (key) {
            flags.normalize[key] = true;
            flags.keys.push(key);
        });
        if (typeof opts.narg === 'object') {
            Object.entries(opts.narg).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    flags.nargs[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.coerce === 'object') {
            Object.entries(opts.coerce).forEach(([key, value]) => {
                if (typeof value === 'function') {
                    flags.coercions[key] = value;
                    flags.keys.push(key);
                }
            });
        }
        if (typeof opts.config !== 'undefined') {
            if (Array.isArray(opts.config) || typeof opts.config === 'string') {
                [].concat(opts.config).filter(Boolean).forEach(function (key) {
                    flags.configs[key] = true;
                });
            }
            else if (typeof opts.config === 'object') {
                Object.entries(opts.config).forEach(([key, value]) => {
                    if (typeof value === 'boolean' || typeof value === 'function') {
                        flags.configs[key] = value;
                    }
                });
            }
        }
        extendAliases(opts.key, aliases, opts.default, flags.arrays);
        Object.keys(defaults).forEach(function (key) {
            (flags.aliases[key] || []).forEach(function (alias) {
                defaults[alias] = defaults[key];
            });
        });
        let error = null;
        checkConfiguration();
        let notFlags = [];
        const argv = Object.assign(Object.create(null), { _: [] });
        const argvReturn = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const truncatedArg = arg.replace(/^-{3,}/, '---');
            let broken;
            let key;
            let letters;
            let m;
            let next;
            let value;
            if (arg !== '--' && isUnknownOptionAsArg(arg)) {
                pushPositional(arg);
            }
            else if (truncatedArg.match(/---+(=|$)/)) {
                pushPositional(arg);
                continue;
            }
            else if (arg.match(/^--.+=/) || (!configuration['short-option-groups'] && arg.match(/^-.+=/))) {
                m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    if (checkAllAliases(m[1], flags.arrays)) {
                        i = eatArray(i, m[1], args, m[2]);
                    }
                    else if (checkAllAliases(m[1], flags.nargs) !== false) {
                        i = eatNargs(i, m[1], args, m[2]);
                    }
                    else {
                        setArg(m[1], m[2]);
                    }
                }
            }
            else if (arg.match(negatedBoolean) && configuration['boolean-negation']) {
                m = arg.match(negatedBoolean);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
                }
            }
            else if (arg.match(/^--.+/) || (!configuration['short-option-groups'] && arg.match(/^-[^-]+/))) {
                m = arg.match(/^--?(.+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (checkAllAliases(key, flags.arrays)) {
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!next.match(/^-/) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
            }
            else if (arg.match(/^-.\..+=/)) {
                m = arg.match(/^-([^=]+)=([\s\S]*)$/);
                if (m !== null && Array.isArray(m) && m.length >= 3) {
                    setArg(m[1], m[2]);
                }
            }
            else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
                next = args[i + 1];
                m = arg.match(/^-(.\..+)/);
                if (m !== null && Array.isArray(m) && m.length >= 2) {
                    key = m[1];
                    if (next !== undefined && !next.match(/^-/) &&
                        !checkAllAliases(key, flags.bools) &&
                        !checkAllAliases(key, flags.counts)) {
                        setArg(key, next);
                        i++;
                    }
                    else {
                        setArg(key, defaultValue(key));
                    }
                }
            }
            else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
                letters = arg.slice(1, -1).split('');
                broken = false;
                for (let j = 0; j < letters.length; j++) {
                    next = arg.slice(j + 2);
                    if (letters[j + 1] && letters[j + 1] === '=') {
                        value = arg.slice(j + 3);
                        key = letters[j];
                        if (checkAllAliases(key, flags.arrays)) {
                            i = eatArray(i, key, args, value);
                        }
                        else if (checkAllAliases(key, flags.nargs) !== false) {
                            i = eatNargs(i, key, args, value);
                        }
                        else {
                            setArg(key, value);
                        }
                        broken = true;
                        break;
                    }
                    if (next === '-') {
                        setArg(letters[j], next);
                        continue;
                    }
                    if (/[A-Za-z]/.test(letters[j]) &&
                        /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) &&
                        checkAllAliases(next, flags.bools) === false) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                        setArg(letters[j], next);
                        broken = true;
                        break;
                    }
                    else {
                        setArg(letters[j], defaultValue(letters[j]));
                    }
                }
                key = arg.slice(-1)[0];
                if (!broken && key !== '-') {
                    if (checkAllAliases(key, flags.arrays)) {
                        i = eatArray(i, key, args);
                    }
                    else if (checkAllAliases(key, flags.nargs) !== false) {
                        i = eatNargs(i, key, args);
                    }
                    else {
                        next = args[i + 1];
                        if (next !== undefined && (!/^(-|--)[^-]/.test(next) ||
                            next.match(negative)) &&
                            !checkAllAliases(key, flags.bools) &&
                            !checkAllAliases(key, flags.counts)) {
                            setArg(key, next);
                            i++;
                        }
                        else if (/^(true|false)$/.test(next)) {
                            setArg(key, next);
                            i++;
                        }
                        else {
                            setArg(key, defaultValue(key));
                        }
                    }
                }
            }
            else if (arg.match(/^-[0-9]$/) &&
                arg.match(negative) &&
                checkAllAliases(arg.slice(1), flags.bools)) {
                key = arg.slice(1);
                setArg(key, defaultValue(key));
            }
            else if (arg === '--') {
                notFlags = args.slice(i + 1);
                break;
            }
            else if (configuration['halt-at-non-option']) {
                notFlags = args.slice(i);
                break;
            }
            else {
                pushPositional(arg);
            }
        }
        applyEnvVars(argv, true);
        applyEnvVars(argv, false);
        setConfig(argv);
        setConfigObjects();
        applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
        applyCoercions(argv);
        if (configuration['set-placeholder-key'])
            setPlaceholderKeys(argv);
        Object.keys(flags.counts).forEach(function (key) {
            if (!hasKey(argv, key.split('.')))
                setArg(key, 0);
        });
        if (notFlagsOption && notFlags.length)
            argv[notFlagsArgv] = [];
        notFlags.forEach(function (key) {
            argv[notFlagsArgv].push(key);
        });
        if (configuration['camel-case-expansion'] && configuration['strip-dashed']) {
            Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
                delete argv[key];
            });
        }
        if (configuration['strip-aliased']) {
            [].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
                if (configuration['camel-case-expansion'] && alias.includes('-')) {
                    delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')];
                }
                delete argv[alias];
            });
        }
        function pushPositional(arg) {
            const maybeCoercedNumber = maybeCoerceNumber('_', arg);
            if (typeof maybeCoercedNumber === 'string' || typeof maybeCoercedNumber === 'number') {
                argv._.push(maybeCoercedNumber);
            }
        }
        function eatNargs(i, key, args, argAfterEqualSign) {
            let ii;
            let toEat = checkAllAliases(key, flags.nargs);
            toEat = typeof toEat !== 'number' || isNaN(toEat) ? 1 : toEat;
            if (toEat === 0) {
                if (!isUndefined(argAfterEqualSign)) {
                    error = Error(__('Argument unexpected for: %s', key));
                }
                setArg(key, defaultValue(key));
                return i;
            }
            let available = isUndefined(argAfterEqualSign) ? 0 : 1;
            if (configuration['nargs-eats-options']) {
                if (args.length - (i + 1) + available < toEat) {
                    error = Error(__('Not enough arguments following: %s', key));
                }
                available = toEat;
            }
            else {
                for (ii = i + 1; ii < args.length; ii++) {
                    if (!args[ii].match(/^-[^0-9]/) || args[ii].match(negative) || isUnknownOptionAsArg(args[ii]))
                        available++;
                    else
                        break;
                }
                if (available < toEat)
                    error = Error(__('Not enough arguments following: %s', key));
            }
            let consumed = Math.min(available, toEat);
            if (!isUndefined(argAfterEqualSign) && consumed > 0) {
                setArg(key, argAfterEqualSign);
                consumed--;
            }
            for (ii = i + 1; ii < (consumed + i + 1); ii++) {
                setArg(key, args[ii]);
            }
            return (i + consumed);
        }
        function eatArray(i, key, args, argAfterEqualSign) {
            let argsToSet = [];
            let next = argAfterEqualSign || args[i + 1];
            const nargsCount = checkAllAliases(key, flags.nargs);
            if (checkAllAliases(key, flags.bools) && !(/^(true|false)$/.test(next))) {
                argsToSet.push(true);
            }
            else if (isUndefined(next) ||
                (isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))) {
                if (defaults[key] !== undefined) {
                    const defVal = defaults[key];
                    argsToSet = Array.isArray(defVal) ? defVal : [defVal];
                }
            }
            else {
                if (!isUndefined(argAfterEqualSign)) {
                    argsToSet.push(processValue(key, argAfterEqualSign));
                }
                for (let ii = i + 1; ii < args.length; ii++) {
                    if ((!configuration['greedy-arrays'] && argsToSet.length > 0) ||
                        (nargsCount && typeof nargsCount === 'number' && argsToSet.length >= nargsCount))
                        break;
                    next = args[ii];
                    if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
                        break;
                    i = ii;
                    argsToSet.push(processValue(key, next));
                }
            }
            if (typeof nargsCount === 'number' && ((nargsCount && argsToSet.length < nargsCount) ||
                (isNaN(nargsCount) && argsToSet.length === 0))) {
                error = Error(__('Not enough arguments following: %s', key));
            }
            setArg(key, argsToSet);
            return i;
        }
        function setArg(key, val) {
            if (/-/.test(key) && configuration['camel-case-expansion']) {
                const alias = key.split('.').map(function (prop) {
                    return camelCase(prop);
                }).join('.');
                addNewAlias(key, alias);
            }
            const value = processValue(key, val);
            const splitKey = key.split('.');
            setKey(argv, splitKey, value);
            if (flags.aliases[key]) {
                flags.aliases[key].forEach(function (x) {
                    const keyProperties = x.split('.');
                    setKey(argv, keyProperties, value);
                });
            }
            if (splitKey.length > 1 && configuration['dot-notation']) {
                (flags.aliases[splitKey[0]] || []).forEach(function (x) {
                    let keyProperties = x.split('.');
                    const a = [].concat(splitKey);
                    a.shift();
                    keyProperties = keyProperties.concat(a);
                    if (!(flags.aliases[key] || []).includes(keyProperties.join('.'))) {
                        setKey(argv, keyProperties, value);
                    }
                });
            }
            if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
                const keys = [key].concat(flags.aliases[key] || []);
                keys.forEach(function (key) {
                    Object.defineProperty(argvReturn, key, {
                        enumerable: true,
                        get() {
                            return val;
                        },
                        set(value) {
                            val = typeof value === 'string' ? mixin.normalize(value) : value;
                        }
                    });
                });
            }
        }
        function addNewAlias(key, alias) {
            if (!(flags.aliases[key] && flags.aliases[key].length)) {
                flags.aliases[key] = [alias];
                newAliases[alias] = true;
            }
            if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
                addNewAlias(alias, key);
            }
        }
        function processValue(key, val) {
            if (typeof val === 'string' &&
                (val[0] === "'" || val[0] === '"') &&
                val[val.length - 1] === val[0]) {
                val = val.substring(1, val.length - 1);
            }
            if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
                if (typeof val === 'string')
                    val = val === 'true';
            }
            let value = Array.isArray(val)
                ? val.map(function (v) { return maybeCoerceNumber(key, v); })
                : maybeCoerceNumber(key, val);
            if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === 'boolean')) {
                value = increment();
            }
            if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
                if (Array.isArray(val))
                    value = val.map((val) => { return mixin.normalize(val); });
                else
                    value = mixin.normalize(val);
            }
            return value;
        }
        function maybeCoerceNumber(key, value) {
            if (!configuration['parse-positional-numbers'] && key === '_')
                return value;
            if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
                const shouldCoerceNumber = looksLikeNumber(value) && configuration['parse-numbers'] && (Number.isSafeInteger(Math.floor(parseFloat(`${value}`))));
                if (shouldCoerceNumber || (!isUndefined(value) && checkAllAliases(key, flags.numbers))) {
                    value = Number(value);
                }
            }
            return value;
        }
        function setConfig(argv) {
            const configLookup = Object.create(null);
            applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
            Object.keys(flags.configs).forEach(function (configKey) {
                const configPath = argv[configKey] || configLookup[configKey];
                if (configPath) {
                    try {
                        let config = null;
                        const resolvedConfigPath = mixin.resolve(mixin.cwd(), configPath);
                        const resolveConfig = flags.configs[configKey];
                        if (typeof resolveConfig === 'function') {
                            try {
                                config = resolveConfig(resolvedConfigPath);
                            }
                            catch (e) {
                                config = e;
                            }
                            if (config instanceof Error) {
                                error = config;
                                return;
                            }
                        }
                        else {
                            config = mixin.require(resolvedConfigPath);
                        }
                        setConfigObject(config);
                    }
                    catch (ex) {
                        if (ex.name === 'PermissionDenied')
                            error = ex;
                        else if (argv[configKey])
                            error = Error(__('Invalid JSON config file: %s', configPath));
                    }
                }
            });
        }
        function setConfigObject(config, prev) {
            Object.keys(config).forEach(function (key) {
                const value = config[key];
                const fullKey = prev ? prev + '.' + key : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']) {
                    setConfigObject(value, fullKey);
                }
                else {
                    if (!hasKey(argv, fullKey.split('.')) || (checkAllAliases(fullKey, flags.arrays) && configuration['combine-arrays'])) {
                        setArg(fullKey, value);
                    }
                }
            });
        }
        function setConfigObjects() {
            if (typeof configObjects !== 'undefined') {
                configObjects.forEach(function (configObject) {
                    setConfigObject(configObject);
                });
            }
        }
        function applyEnvVars(argv, configOnly) {
            if (typeof envPrefix === 'undefined')
                return;
            const prefix = typeof envPrefix === 'string' ? envPrefix : '';
            const env = mixin.env();
            Object.keys(env).forEach(function (envVar) {
                if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
                    const keys = envVar.split('__').map(function (key, i) {
                        if (i === 0) {
                            key = key.substring(prefix.length);
                        }
                        return camelCase(key);
                    });
                    if (((configOnly && flags.configs[keys.join('.')]) || !configOnly) && !hasKey(argv, keys)) {
                        setArg(keys.join('.'), env[envVar]);
                    }
                }
            });
        }
        function applyCoercions(argv) {
            let coerce;
            const applied = new Set();
            Object.keys(argv).forEach(function (key) {
                if (!applied.has(key)) {
                    coerce = checkAllAliases(key, flags.coercions);
                    if (typeof coerce === 'function') {
                        try {
                            const value = maybeCoerceNumber(key, coerce(argv[key]));
                            ([].concat(flags.aliases[key] || [], key)).forEach(ali => {
                                applied.add(ali);
                                argv[ali] = value;
                            });
                        }
                        catch (err) {
                            error = err;
                        }
                    }
                }
            });
        }
        function setPlaceholderKeys(argv) {
            flags.keys.forEach((key) => {
                if (~key.indexOf('.'))
                    return;
                if (typeof argv[key] === 'undefined')
                    argv[key] = undefined;
            });
            return argv;
        }
        function applyDefaultsAndAliases(obj, aliases, defaults, canLog = false) {
            Object.keys(defaults).forEach(function (key) {
                if (!hasKey(obj, key.split('.'))) {
                    setKey(obj, key.split('.'), defaults[key]);
                    if (canLog)
                        defaulted[key] = true;
                    (aliases[key] || []).forEach(function (x) {
                        if (hasKey(obj, x.split('.')))
                            return;
                        setKey(obj, x.split('.'), defaults[key]);
                    });
                }
            });
        }
        function hasKey(obj, keys) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                o = (o[key] || {});
            });
            const key = keys[keys.length - 1];
            if (typeof o !== 'object')
                return false;
            else
                return key in o;
        }
        function setKey(obj, keys, value) {
            let o = obj;
            if (!configuration['dot-notation'])
                keys = [keys.join('.')];
            keys.slice(0, -1).forEach(function (key) {
                key = sanitizeKey(key);
                if (typeof o === 'object' && o[key] === undefined) {
                    o[key] = {};
                }
                if (typeof o[key] !== 'object' || Array.isArray(o[key])) {
                    if (Array.isArray(o[key])) {
                        o[key].push({});
                    }
                    else {
                        o[key] = [o[key], {}];
                    }
                    o = o[key][o[key].length - 1];
                }
                else {
                    o = o[key];
                }
            });
            const key = sanitizeKey(keys[keys.length - 1]);
            const isTypeArray = checkAllAliases(keys.join('.'), flags.arrays);
            const isValueArray = Array.isArray(value);
            let duplicate = configuration['duplicate-arguments-array'];
            if (!duplicate && checkAllAliases(key, flags.nargs)) {
                duplicate = true;
                if ((!isUndefined(o[key]) && flags.nargs[key] === 1) || (Array.isArray(o[key]) && o[key].length === flags.nargs[key])) {
                    o[key] = undefined;
                }
            }
            if (value === increment()) {
                o[key] = increment(o[key]);
            }
            else if (Array.isArray(o[key])) {
                if (duplicate && isTypeArray && isValueArray) {
                    o[key] = configuration['flatten-duplicate-arrays'] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
                }
                else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
                    o[key] = value;
                }
                else {
                    o[key] = o[key].concat([value]);
                }
            }
            else if (o[key] === undefined && isTypeArray) {
                o[key] = isValueArray ? value : [value];
            }
            else if (duplicate && !(o[key] === undefined ||
                checkAllAliases(key, flags.counts) ||
                checkAllAliases(key, flags.bools))) {
                o[key] = [o[key], value];
            }
            else {
                o[key] = value;
            }
        }
        function extendAliases(...args) {
            args.forEach(function (obj) {
                Object.keys(obj || {}).forEach(function (key) {
                    if (flags.aliases[key])
                        return;
                    flags.aliases[key] = [].concat(aliases[key] || []);
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (/-/.test(x) && configuration['camel-case-expansion']) {
                            const c = camelCase(x);
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].concat(key).forEach(function (x) {
                        if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
                            const c = decamelize(x, '-');
                            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                                flags.aliases[key].push(c);
                                newAliases[c] = true;
                            }
                        }
                    });
                    flags.aliases[key].forEach(function (x) {
                        flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
                            return x !== y;
                        }));
                    });
                });
            });
        }
        function checkAllAliases(key, flag) {
            const toCheck = [].concat(flags.aliases[key] || [], key);
            const keys = Object.keys(flag);
            const setAlias = toCheck.find(key => keys.includes(key));
            return setAlias ? flag[setAlias] : false;
        }
        function hasAnyFlag(key) {
            const flagsKeys = Object.keys(flags);
            const toCheck = [].concat(flagsKeys.map(k => flags[k]));
            return toCheck.some(function (flag) {
                return Array.isArray(flag) ? flag.includes(key) : flag[key];
            });
        }
        function hasFlagsMatching(arg, ...patterns) {
            const toCheck = [].concat(...patterns);
            return toCheck.some(function (pattern) {
                const match = arg.match(pattern);
                return match && hasAnyFlag(match[1]);
            });
        }
        function hasAllShortFlags(arg) {
            if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
                return false;
            }
            let hasAllFlags = true;
            let next;
            const letters = arg.slice(1).split('');
            for (let j = 0; j < letters.length; j++) {
                next = arg.slice(j + 2);
                if (!hasAnyFlag(letters[j])) {
                    hasAllFlags = false;
                    break;
                }
                if ((letters[j + 1] && letters[j + 1] === '=') ||
                    next === '-' ||
                    (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
                    (letters[j + 1] && letters[j + 1].match(/\W/))) {
                    break;
                }
            }
            return hasAllFlags;
        }
        function isUnknownOptionAsArg(arg) {
            return configuration['unknown-options-as-args'] && isUnknownOption(arg);
        }
        function isUnknownOption(arg) {
            arg = arg.replace(/^-{3,}/, '--');
            if (arg.match(negative)) {
                return false;
            }
            if (hasAllShortFlags(arg)) {
                return false;
            }
            const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
            const normalFlag = /^-+([^=]+?)$/;
            const flagEndingInHyphen = /^-+([^=]+?)-$/;
            const flagEndingInDigits = /^-+([^=]+?\d+)$/;
            const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
            return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
        }
        function defaultValue(key) {
            if (!checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts) &&
                `${key}` in defaults) {
                return defaults[key];
            }
            else {
                return defaultForType(guessType(key));
            }
        }
        function defaultForType(type) {
            const def = {
                [DefaultValuesForTypeKey.BOOLEAN]: true,
                [DefaultValuesForTypeKey.STRING]: '',
                [DefaultValuesForTypeKey.NUMBER]: undefined,
                [DefaultValuesForTypeKey.ARRAY]: []
            };
            return def[type];
        }
        function guessType(key) {
            let type = DefaultValuesForTypeKey.BOOLEAN;
            if (checkAllAliases(key, flags.strings))
                type = DefaultValuesForTypeKey.STRING;
            else if (checkAllAliases(key, flags.numbers))
                type = DefaultValuesForTypeKey.NUMBER;
            else if (checkAllAliases(key, flags.bools))
                type = DefaultValuesForTypeKey.BOOLEAN;
            else if (checkAllAliases(key, flags.arrays))
                type = DefaultValuesForTypeKey.ARRAY;
            return type;
        }
        function isUndefined(num) {
            return num === undefined;
        }
        function checkConfiguration() {
            Object.keys(flags.counts).find(key => {
                if (checkAllAliases(key, flags.arrays)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key));
                    return true;
                }
                else if (checkAllAliases(key, flags.nargs)) {
                    error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key));
                    return true;
                }
                return false;
            });
        }
        return {
            aliases: Object.assign({}, flags.aliases),
            argv: Object.assign(argvReturn, argv),
            configuration: configuration,
            defaulted: Object.assign({}, defaulted),
            error: error,
            newAliases: Object.assign({}, newAliases)
        };
    }
}
function combineAliases(aliases) {
    const aliasArrays = [];
    const combined = Object.create(null);
    let change = true;
    Object.keys(aliases).forEach(function (key) {
        aliasArrays.push([].concat(aliases[key], key));
    });
    while (change) {
        change = false;
        for (let i = 0; i < aliasArrays.length; i++) {
            for (let ii = i + 1; ii < aliasArrays.length; ii++) {
                const intersect = aliasArrays[i].filter(function (v) {
                    return aliasArrays[ii].indexOf(v) !== -1;
                });
                if (intersect.length) {
                    aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
                    aliasArrays.splice(ii, 1);
                    change = true;
                    break;
                }
            }
        }
    }
    aliasArrays.forEach(function (aliasArray) {
        aliasArray = aliasArray.filter(function (v, i, self) {
            return self.indexOf(v) === i;
        });
        const lastAlias = aliasArray.pop();
        if (lastAlias !== undefined && typeof lastAlias === 'string') {
            combined[lastAlias] = aliasArray;
        }
    });
    return combined;
}
function increment(orig) {
    return orig !== undefined ? orig + 1 : 1;
}
function sanitizeKey(key) {
    if (key === '__proto__')
        return '___proto___';
    return key;
}

const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
    ? Number(process.env.YARGS_MIN_NODE_VERSION)
    : 10;
if (process && process.version) {
    const major = Number(process.version.match(/v([^.]+)/)[1]);
    if (major < minNodeVersion) {
        throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
    }
}
const env = process ? process.env : {};
const parser = new YargsParser({
    cwd: process.cwd,
    env: () => {
        return env;
    },
    format: util.format,
    normalize: path.normalize,
    resolve: path.resolve,
    require: (path) => {
        if (true) {
            return __nccwpck_require__(9137)(path);
        }
        else {}
    }
});
const yargsParser = function Parser(args, opts) {
    const result = parser.parse(args.slice(), opts);
    return result.argv;
};
yargsParser.detailed = function (args, opts) {
    return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;

module.exports = yargsParser;


/***/ }),

/***/ 6400:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
var t=__nccwpck_require__(2357);class e extends Error{constructor(t){super(t||"yargs error"),this.name="YError",Error.captureStackTrace(this,e)}}let s,i=[];function n(t,o,a,h){s=h;let l={};if(Object.prototype.hasOwnProperty.call(t,"extends")){if("string"!=typeof t.extends)return l;const r=/\.json|\..*rc$/.test(t.extends);let h=null;if(r)h=function(t,e){return s.path.resolve(t,e)}(o,t.extends);else try{h=/*require.resolve*/(__nccwpck_require__(8184).resolve(t.extends))}catch(e){return t}!function(t){if(i.indexOf(t)>-1)throw new e(`Circular extended configurations: '${t}'.`)}(h),i.push(h),l=r?JSON.parse(s.readFileSync(h,"utf8")):__nccwpck_require__(8184)(t.extends),delete t.extends,l=n(l,s.path.dirname(h),a,s)}return i=[],a?r(l,t):Object.assign({},l,t)}function r(t,e){const s={};function i(t){return t&&"object"==typeof t&&!Array.isArray(t)}Object.assign(s,t);for(const n of Object.keys(e))i(e[n])&&i(s[n])?s[n]=r(t[n],e[n]):s[n]=e[n];return s}function o(t){const e=t.replace(/\s{2,}/g," ").split(/\s+(?![^[]*]|[^<]*>)/),s=/\.*[\][<>]/g,i=e.shift();if(!i)throw new Error(`No command found in: ${t}`);const n={cmd:i.replace(s,""),demanded:[],optional:[]};return e.forEach(((t,i)=>{let r=!1;t=t.replace(/\s/g,""),/\.+[\]>]/.test(t)&&i===e.length-1&&(r=!0),/^\[/.test(t)?n.optional.push({cmd:t.replace(s,"").split("|"),variadic:r}):n.demanded.push({cmd:t.replace(s,"").split("|"),variadic:r})})),n}const a=["first","second","third","fourth","fifth","sixth"];function h(t,s,i){try{let n=0;const[r,a,h]="object"==typeof t?[{demanded:[],optional:[]},t,s]:[o(`cmd ${t}`),s,i],f=[].slice.call(a);for(;f.length&&void 0===f[f.length-1];)f.pop();const d=h||f.length;if(d<r.demanded.length)throw new e(`Not enough arguments provided. Expected ${r.demanded.length} but received ${f.length}.`);const u=r.demanded.length+r.optional.length;if(d>u)throw new e(`Too many arguments provided. Expected max ${u} but received ${d}.`);r.demanded.forEach((t=>{const e=l(f.shift());0===t.cmd.filter((t=>t===e||"*"===t)).length&&c(e,t.cmd,n),n+=1})),r.optional.forEach((t=>{if(0===f.length)return;const e=l(f.shift());0===t.cmd.filter((t=>t===e||"*"===t)).length&&c(e,t.cmd,n),n+=1}))}catch(t){console.warn(t.stack)}}function l(t){return Array.isArray(t)?"array":null===t?"null":typeof t}function c(t,s,i){throw new e(`Invalid ${a[i]||"manyith"} argument. Expected ${s.join(" or ")} but received ${t}.`)}function f(t){return!!t&&!!t.then&&"function"==typeof t.then}function d(t,e,s,i){s.assert.notStrictEqual(t,e,i)}function u(t,e){e.assert.strictEqual(typeof t,"string")}function p(t){return Object.keys(t)}function g(t={},e=(()=>!0)){const s={};return p(t).forEach((i=>{e(i,t[i])&&(s[i]=t[i])})),s}function m(){return process.versions.electron&&!process.defaultApp?0:1}function y(){return process.argv[m()]}var b=Object.freeze({__proto__:null,hideBin:function(t){return t.slice(m()+1)},getProcessArgvBin:y});function v(t,e,s,i){if("a"===s&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===s?i:"a"===s?i.call(t):i?i.value:e.get(t)}function O(t,e,s,i,n){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?n.call(t,s):n?n.value=s:e.set(t,s),s}class w{constructor(t){this.globalMiddleware=[],this.frozens=[],this.yargs=t}addMiddleware(t,e,s=!0,i=!1){if(h("<array|function> [boolean] [boolean] [boolean]",[t,e,s],arguments.length),Array.isArray(t)){for(let i=0;i<t.length;i++){if("function"!=typeof t[i])throw Error("middleware must be a function");const n=t[i];n.applyBeforeValidation=e,n.global=s}Array.prototype.push.apply(this.globalMiddleware,t)}else if("function"==typeof t){const n=t;n.applyBeforeValidation=e,n.global=s,n.mutates=i,this.globalMiddleware.push(t)}return this.yargs}addCoerceMiddleware(t,e){const s=this.yargs.getAliases();return this.globalMiddleware=this.globalMiddleware.filter((t=>{const i=[...s[e]||[],e];return!t.option||!i.includes(t.option)})),t.option=e,this.addMiddleware(t,!0,!0,!0)}getMiddleware(){return this.globalMiddleware}freeze(){this.frozens.push([...this.globalMiddleware])}unfreeze(){const t=this.frozens.pop();void 0!==t&&(this.globalMiddleware=t)}reset(){this.globalMiddleware=this.globalMiddleware.filter((t=>t.global))}}function C(t,e,s,i){return s.reduce(((t,s)=>{if(s.applyBeforeValidation!==i)return t;if(s.mutates){if(s.applied)return t;s.applied=!0}if(f(t))return t.then((t=>Promise.all([t,s(t,e)]))).then((([t,e])=>Object.assign(t,e)));{const i=s(t,e);return f(i)?i.then((e=>Object.assign(t,e))):Object.assign(t,i)}}),t)}function j(t,e,s=(t=>{throw t})){try{const s="function"==typeof t?t():t;return f(s)?s.then((t=>e(t))):e(s)}catch(t){return s(t)}}const _=/(^\*)|(^\$0)/;class M{constructor(t,e,s,i){this.requireCache=new Set,this.handlers={},this.aliasMap={},this.frozens=[],this.shim=i,this.usage=t,this.globalMiddleware=s,this.validation=e}addDirectory(t,e,s,i){"boolean"!=typeof(i=i||{}).recurse&&(i.recurse=!1),Array.isArray(i.extensions)||(i.extensions=["js"]);const n="function"==typeof i.visit?i.visit:t=>t;i.visit=(t,e,s)=>{const i=n(t,e,s);if(i){if(this.requireCache.has(e))return i;this.requireCache.add(e),this.addHandler(i)}return i},this.shim.requireDirectory({require:e,filename:s},t,i)}addHandler(t,e,s,i,n,r){let a=[];const h=function(t){return t?t.map((t=>(t.applyBeforeValidation=!1,t))):[]}(n);if(i=i||(()=>{}),Array.isArray(t))if(function(t){return t.every((t=>"string"==typeof t))}(t))[t,...a]=t;else for(const e of t)this.addHandler(e);else{if(function(t){return"object"==typeof t&&!Array.isArray(t)}(t)){let e=Array.isArray(t.command)||"string"==typeof t.command?t.command:this.moduleName(t);return t.aliases&&(e=[].concat(e).concat(t.aliases)),void this.addHandler(e,this.extractDesc(t),t.builder,t.handler,t.middlewares,t.deprecated)}if(k(s))return void this.addHandler([t].concat(a),e,s.builder,s.handler,s.middlewares,s.deprecated)}if("string"==typeof t){const n=o(t);a=a.map((t=>o(t).cmd));let l=!1;const c=[n.cmd].concat(a).filter((t=>!_.test(t)||(l=!0,!1)));0===c.length&&l&&c.push("$0"),l&&(n.cmd=c[0],a=c.slice(1),t=t.replace(_,n.cmd)),a.forEach((t=>{this.aliasMap[t]=n.cmd})),!1!==e&&this.usage.command(t,e,l,a,r),this.handlers[n.cmd]={original:t,description:e,handler:i,builder:s||{},middlewares:h,deprecated:r,demanded:n.demanded,optional:n.optional},l&&(this.defaultCommand=this.handlers[n.cmd])}}getCommandHandlers(){return this.handlers}getCommands(){return Object.keys(this.handlers).concat(Object.keys(this.aliasMap))}hasDefaultCommand(){return!!this.defaultCommand}runCommand(t,e,s,i,n,r){const o=this.handlers[t]||this.handlers[this.aliasMap[t]]||this.defaultCommand,a=e.getInternalMethods().getContext(),h=a.commands.slice(),l=!t;t&&(a.commands.push(t),a.fullCommands.push(o.original));const c=this.applyBuilderUpdateUsageAndParse(l,o,e,s.aliases,h,i,n,r);return f(c)?c.then((t=>this.applyMiddlewareAndGetResult(l,o,t.innerArgv,a,n,t.aliases,e))):this.applyMiddlewareAndGetResult(l,o,c.innerArgv,a,n,c.aliases,e)}applyBuilderUpdateUsageAndParse(t,e,s,i,n,r,o,a){const h=e.builder;let l=s;if(E(h)){const c=h(s.getInternalMethods().reset(i),a);if(f(c))return c.then((i=>{var a;return l=(a=i)&&"function"==typeof a.getInternalMethods?i:s,this.parseAndUpdateUsage(t,e,l,n,r,o)}))}else(function(t){return"object"==typeof t})(h)&&(l=s.getInternalMethods().reset(i),Object.keys(e.builder).forEach((t=>{l.option(t,h[t])})));return this.parseAndUpdateUsage(t,e,l,n,r,o)}parseAndUpdateUsage(t,e,s,i,n,r){t&&s.getInternalMethods().getUsageInstance().unfreeze(),this.shouldUpdateUsage(s)&&s.getInternalMethods().getUsageInstance().usage(this.usageFromParentCommandsCommandHandler(i,e),e.description);const o=s.getInternalMethods().runYargsParserAndExecuteCommands(null,void 0,!0,n,r);return f(o)?o.then((t=>({aliases:s.parsed.aliases,innerArgv:t}))):{aliases:s.parsed.aliases,innerArgv:o}}shouldUpdateUsage(t){return!t.getInternalMethods().getUsageInstance().getUsageDisabled()&&0===t.getInternalMethods().getUsageInstance().getUsage().length}usageFromParentCommandsCommandHandler(t,e){const s=_.test(e.original)?e.original.replace(_,"").trim():e.original,i=t.filter((t=>!_.test(t)));return i.push(s),`$0 ${i.join(" ")}`}applyMiddlewareAndGetResult(t,e,s,i,n,r,o){let a={};if(n)return s;o.getInternalMethods().getHasOutput()||(a=this.populatePositionals(e,s,i,o));const h=this.globalMiddleware.getMiddleware().slice(0).concat(e.middlewares);if(s=C(s,o,h,!0),!o.getInternalMethods().getHasOutput()){const e=o.getInternalMethods().runValidation(r,a,o.parsed.error,t);s=j(s,(t=>(e(t),t)))}if(e.handler&&!o.getInternalMethods().getHasOutput()){o.getInternalMethods().setHasOutput();const i=!!o.getOptions().configuration["populate--"];o.getInternalMethods().postProcess(s,i,!1,!1),s=j(s=C(s,o,h,!1),(t=>{const s=e.handler(t);return f(s)?s.then((()=>t)):t})),t||o.getInternalMethods().getUsageInstance().cacheHelpMessage(),f(s)&&!o.getInternalMethods().hasParseCallback()&&s.catch((t=>{try{o.getInternalMethods().getUsageInstance().fail(null,t)}catch(t){}}))}return t||(i.commands.pop(),i.fullCommands.pop()),s}populatePositionals(t,e,s,i){e._=e._.slice(s.commands.length);const n=t.demanded.slice(0),r=t.optional.slice(0),o={};for(this.validation.positionalCount(n.length,e._.length);n.length;){const t=n.shift();this.populatePositional(t,e,o)}for(;r.length;){const t=r.shift();this.populatePositional(t,e,o)}return e._=s.commands.concat(e._.map((t=>""+t))),this.postProcessPositionals(e,o,this.cmdToParseOptions(t.original),i),o}populatePositional(t,e,s){const i=t.cmd[0];t.variadic?s[i]=e._.splice(0).map(String):e._.length&&(s[i]=[String(e._.shift())])}cmdToParseOptions(t){const e={array:[],default:{},alias:{},demand:{}},s=o(t);return s.demanded.forEach((t=>{const[s,...i]=t.cmd;t.variadic&&(e.array.push(s),e.default[s]=[]),e.alias[s]=i,e.demand[s]=!0})),s.optional.forEach((t=>{const[s,...i]=t.cmd;t.variadic&&(e.array.push(s),e.default[s]=[]),e.alias[s]=i})),e}postProcessPositionals(t,e,s,i){const n=Object.assign({},i.getOptions());n.default=Object.assign(s.default,n.default);for(const t of Object.keys(s.alias))n.alias[t]=(n.alias[t]||[]).concat(s.alias[t]);n.array=n.array.concat(s.array),n.config={};const r=[];if(Object.keys(e).forEach((t=>{e[t].map((e=>{n.configuration["unknown-options-as-args"]&&(n.key[t]=!0),r.push(`--${t}`),r.push(e)}))})),!r.length)return;const o=Object.assign({},n.configuration,{"populate--":!1}),a=this.shim.Parser.detailed(r,Object.assign({},n,{configuration:o}));if(a.error)i.getInternalMethods().getUsageInstance().fail(a.error.message,a.error);else{const s=Object.keys(e);Object.keys(e).forEach((t=>{s.push(...a.aliases[t])}));const n=i.getOptions().default;Object.keys(a.argv).forEach((i=>{s.includes(i)&&(e[i]||(e[i]=a.argv[i]),!Object.prototype.hasOwnProperty.call(n,i)&&Object.prototype.hasOwnProperty.call(t,i)&&Object.prototype.hasOwnProperty.call(a.argv,i)&&(Array.isArray(t[i])||Array.isArray(a.argv[i]))?t[i]=[].concat(t[i],a.argv[i]):t[i]=a.argv[i])}))}}runDefaultBuilderOn(t){if(!this.defaultCommand)return;if(this.shouldUpdateUsage(t)){const e=_.test(this.defaultCommand.original)?this.defaultCommand.original:this.defaultCommand.original.replace(/^[^[\]<>]*/,"$0 ");t.getInternalMethods().getUsageInstance().usage(e,this.defaultCommand.description)}const e=this.defaultCommand.builder;if(E(e))return e(t,!0);k(e)||Object.keys(e).forEach((s=>{t.option(s,e[s])}))}moduleName(t){const e=function(t){if(false){}for(let e,s=0,i=Object.keys(__nccwpck_require__.c);s<i.length;s++)if(e=__nccwpck_require__.c[i[s]],e.exports===t)return e;return null}(t);if(!e)throw new Error(`No command name given for module: ${this.shim.inspect(t)}`);return this.commandFromFilename(e.filename)}commandFromFilename(t){return this.shim.path.basename(t,this.shim.path.extname(t))}extractDesc({describe:t,description:e,desc:s}){for(const i of[t,e,s]){if("string"==typeof i||!1===i)return i;d(i,!0,this.shim)}return!1}freeze(){this.frozens.push({handlers:this.handlers,aliasMap:this.aliasMap,defaultCommand:this.defaultCommand})}unfreeze(){const t=this.frozens.pop();d(t,void 0,this.shim),({handlers:this.handlers,aliasMap:this.aliasMap,defaultCommand:this.defaultCommand}=t)}reset(){return this.handlers={},this.aliasMap={},this.defaultCommand=void 0,this.requireCache=new Set,this}}function k(t){return"object"==typeof t&&!!t.builder&&"function"==typeof t.handler}function E(t){return"function"==typeof t}function x(t){"undefined"!=typeof process&&[process.stdout,process.stderr].forEach((e=>{const s=e;s._handle&&s.isTTY&&"function"==typeof s._handle.setBlocking&&s._handle.setBlocking(t)}))}function A(t){return"boolean"==typeof t}function S(t,s){const i=s.y18n.__,n={},r=[];n.failFn=function(t){r.push(t)};let o=null,a=!0;n.showHelpOnFail=function(t=!0,e){const[s,i]="string"==typeof t?[!0,t]:[t,e];return o=i,a=s,n};let h=!1;n.fail=function(s,i){const l=t.getInternalMethods().getLoggerInstance();if(!r.length){if(t.getExitProcess()&&x(!0),h||(h=!0,a&&(t.showHelp("error"),l.error()),(s||i)&&l.error(s||i),o&&((s||i)&&l.error(""),l.error(o))),i=i||new e(s),t.getExitProcess())return t.exit(1);if(t.getInternalMethods().hasParseCallback())return t.exit(1,i);throw i}for(let t=r.length-1;t>=0;--t){const e=r[t];if(A(e)){if(i)throw i;if(s)throw Error(s)}else e(s,i,n)}};let l=[],c=!1;n.usage=(t,e)=>null===t?(c=!0,l=[],n):(c=!1,l.push([t,e||""]),n),n.getUsage=()=>l,n.getUsageDisabled=()=>c,n.getPositionalGroupName=()=>i("Positionals:");let f=[];n.example=(t,e)=>{f.push([t,e||""])};let d=[];n.command=function(t,e,s,i,n=!1){s&&(d=d.map((t=>(t[2]=!1,t)))),d.push([t,e||"",s,i,n])},n.getCommands=()=>d;let u={};n.describe=function(t,e){Array.isArray(t)?t.forEach((t=>{n.describe(t,e)})):"object"==typeof t?Object.keys(t).forEach((e=>{n.describe(e,t[e])})):u[t]=e},n.getDescriptions=()=>u;let p=[];n.epilog=t=>{p.push(t)};let m,y=!1;function b(){return y||(m=function(){const t=80;return s.process.stdColumns?Math.min(t,s.process.stdColumns):t}(),y=!0),m}n.wrap=t=>{y=!0,m=t};const v="__yargsString__:";function O(t,e,i){let n=0;return Array.isArray(t)||(t=Object.values(t).map((t=>[t]))),t.forEach((t=>{n=Math.max(s.stringWidth(i?`${i} ${I(t[0])}`:I(t[0]))+$(t[0]),n)})),e&&(n=Math.min(n,parseInt((.5*e).toString(),10))),n}let w;function C(e){return t.getOptions().hiddenOptions.indexOf(e)<0||t.parsed.argv[t.getOptions().showHiddenOpt]}function j(t,e){let s=`[${i("default:")} `;if(void 0===t&&!e)return null;if(e)s+=e;else switch(typeof t){case"string":s+=`"${t}"`;break;case"object":s+=JSON.stringify(t);break;default:s+=t}return`${s}]`}n.deferY18nLookup=t=>v+t,n.help=function(){if(w)return w;!function(){const e=t.getDemandedOptions(),s=t.getOptions();(Object.keys(s.alias)||[]).forEach((i=>{s.alias[i].forEach((r=>{u[r]&&n.describe(i,u[r]),r in e&&t.demandOption(i,e[r]),s.boolean.includes(r)&&t.boolean(i),s.count.includes(r)&&t.count(i),s.string.includes(r)&&t.string(i),s.normalize.includes(r)&&t.normalize(i),s.array.includes(r)&&t.array(i),s.number.includes(r)&&t.number(i)}))}))}();const e=t.customScriptName?t.$0:s.path.basename(t.$0),r=t.getDemandedOptions(),o=t.getDemandedCommands(),a=t.getDeprecatedOptions(),h=t.getGroups(),g=t.getOptions();let m=[];m=m.concat(Object.keys(u)),m=m.concat(Object.keys(r)),m=m.concat(Object.keys(o)),m=m.concat(Object.keys(g.default)),m=m.filter(C),m=Object.keys(m.reduce(((t,e)=>("_"!==e&&(t[e]=!0),t)),{}));const y=b(),_=s.cliui({width:y,wrap:!!y});if(!c)if(l.length)l.forEach((t=>{_.div({text:`${t[0].replace(/\$0/g,e)}`}),t[1]&&_.div({text:`${t[1]}`,padding:[1,0,0,0]})})),_.div();else if(d.length){let t=null;t=o._?`${e} <${i("command")}>\n`:`${e} [${i("command")}]\n`,_.div(`${t}`)}if(d.length>1||1===d.length&&!d[0][2]){_.div(i("Commands:"));const s=t.getInternalMethods().getContext(),n=s.commands.length?`${s.commands.join(" ")} `:"";!0===t.getInternalMethods().getParserConfiguration()["sort-commands"]&&(d=d.sort(((t,e)=>t[0].localeCompare(e[0]))));const r=e?`${e} `:"";d.forEach((t=>{const s=`${r}${n}${t[0].replace(/^\$0 ?/,"")}`;_.span({text:s,padding:[0,2,0,2],width:O(d,y,`${e}${n}`)+4},{text:t[1]});const o=[];t[2]&&o.push(`[${i("default")}]`),t[3]&&t[3].length&&o.push(`[${i("aliases:")} ${t[3].join(", ")}]`),t[4]&&("string"==typeof t[4]?o.push(`[${i("deprecated: %s",t[4])}]`):o.push(`[${i("deprecated")}]`)),o.length?_.div({text:o.join(" "),padding:[0,0,0,2],align:"right"}):_.div()})),_.div()}const M=(Object.keys(g.alias)||[]).concat(Object.keys(t.parsed.newAliases)||[]);m=m.filter((e=>!t.parsed.newAliases[e]&&M.every((t=>-1===(g.alias[t]||[]).indexOf(e)))));const k=i("Options:");h[k]||(h[k]=[]),function(t,e,s,i){let n=[],r=null;Object.keys(s).forEach((t=>{n=n.concat(s[t])})),t.forEach((t=>{r=[t].concat(e[t]),r.some((t=>-1!==n.indexOf(t)))||s[i].push(t)}))}(m,g.alias,h,k);const E=t=>/^--/.test(I(t)),x=Object.keys(h).filter((t=>h[t].length>0)).map((t=>({groupName:t,normalizedKeys:h[t].filter(C).map((t=>{if(M.includes(t))return t;for(let e,s=0;void 0!==(e=M[s]);s++)if((g.alias[e]||[]).includes(t))return e;return t}))}))).filter((({normalizedKeys:t})=>t.length>0)).map((({groupName:t,normalizedKeys:e})=>{const s=e.reduce(((e,s)=>(e[s]=[s].concat(g.alias[s]||[]).map((e=>t===n.getPositionalGroupName()?e:(/^[0-9]$/.test(e)?g.boolean.includes(s)?"-":"--":e.length>1?"--":"-")+e)).sort(((t,e)=>E(t)===E(e)?0:E(t)?1:-1)).join(", "),e)),{});return{groupName:t,normalizedKeys:e,switches:s}}));if(x.filter((({groupName:t})=>t!==n.getPositionalGroupName())).some((({normalizedKeys:t,switches:e})=>!t.every((t=>E(e[t])))))&&x.filter((({groupName:t})=>t!==n.getPositionalGroupName())).forEach((({normalizedKeys:t,switches:e})=>{t.forEach((t=>{var s,i;E(e[t])&&(e[t]=(s=e[t],i="-x, ".length,P(s)?{text:s.text,indentation:s.indentation+i}:{text:s,indentation:i}))}))})),x.forEach((({groupName:t,normalizedKeys:e,switches:s})=>{_.div(t),e.forEach((t=>{const e=s[t];let o=u[t]||"",h=null;o.includes(v)&&(o=i(o.substring(v.length))),g.boolean.includes(t)&&(h=`[${i("boolean")}]`),g.count.includes(t)&&(h=`[${i("count")}]`),g.string.includes(t)&&(h=`[${i("string")}]`),g.normalize.includes(t)&&(h=`[${i("string")}]`),g.array.includes(t)&&(h=`[${i("array")}]`),g.number.includes(t)&&(h=`[${i("number")}]`);const l=[t in a?(c=a[t],"string"==typeof c?`[${i("deprecated: %s",c)}]`:`[${i("deprecated")}]`):null,h,t in r?`[${i("required")}]`:null,g.choices&&g.choices[t]?`[${i("choices:")} ${n.stringifiedValues(g.choices[t])}]`:null,j(g.default[t],g.defaultDescription[t])].filter(Boolean).join(" ");var c;_.span({text:I(e),padding:[0,2,0,2+$(e)],width:O(s,y)+4},o),l?_.div({text:l,padding:[0,0,0,2],align:"right"}):_.div()})),_.div()})),f.length&&(_.div(i("Examples:")),f.forEach((t=>{t[0]=t[0].replace(/\$0/g,e)})),f.forEach((t=>{""===t[1]?_.div({text:t[0],padding:[0,2,0,2]}):_.div({text:t[0],padding:[0,2,0,2],width:O(f,y)+4},{text:t[1]})})),_.div()),p.length>0){const t=p.map((t=>t.replace(/\$0/g,e))).join("\n");_.div(`${t}\n`)}return _.toString().replace(/\s*$/,"")},n.cacheHelpMessage=function(){w=this.help()},n.clearCachedHelpMessage=function(){w=void 0},n.hasCachedHelpMessage=function(){return!!w},n.showHelp=e=>{const s=t.getInternalMethods().getLoggerInstance();e||(e="error");("function"==typeof e?e:s[e])(n.help())},n.functionDescription=t=>["(",t.name?s.Parser.decamelize(t.name,"-"):i("generated-value"),")"].join(""),n.stringifiedValues=function(t,e){let s="";const i=e||", ",n=[].concat(t);return t&&n.length?(n.forEach((t=>{s.length&&(s+=i),s+=JSON.stringify(t)})),s):s};let _=null;n.version=t=>{_=t},n.showVersion=e=>{const s=t.getInternalMethods().getLoggerInstance();e||(e="error");("function"==typeof e?e:s[e])(_)},n.reset=function(t){return o=null,h=!1,l=[],c=!1,p=[],f=[],d=[],u=g(u,(e=>!t[e])),n};const M=[];return n.freeze=function(){M.push({failMessage:o,failureOutput:h,usages:l,usageDisabled:c,epilogs:p,examples:f,commands:d,descriptions:u})},n.unfreeze=function(){const t=M.pop();t&&({failMessage:o,failureOutput:h,usages:l,usageDisabled:c,epilogs:p,examples:f,commands:d,descriptions:u}=t)},n}function P(t){return"object"==typeof t}function $(t){return P(t)?t.indentation:0}function I(t){return P(t)?t.text:t}class D{constructor(t,e,s,i){var n,r,o;this.yargs=t,this.usage=e,this.command=s,this.shim=i,this.completionKey="get-yargs-completions",this.aliases=null,this.customCompletionFunction=null,this.zshShell=null!==(o=(null===(n=this.shim.getEnv("SHELL"))||void 0===n?void 0:n.includes("zsh"))||(null===(r=this.shim.getEnv("ZSH_NAME"))||void 0===r?void 0:r.includes("zsh")))&&void 0!==o&&o}defaultCompletion(t,e,s,i){const n=this.command.getCommandHandlers();for(let e=0,s=t.length;e<s;++e)if(n[t[e]]&&n[t[e]].builder){const s=n[t[e]].builder;if(E(s)){const t=this.yargs.getInternalMethods().reset();return s(t,!0),t.argv}}const r=[];this.commandCompletions(r,t,s),this.optionCompletions(r,t,e,s),this.choicesCompletions(r,t,e,s),i(null,r)}commandCompletions(t,e,s){const i=this.yargs.getInternalMethods().getContext().commands;s.match(/^-/)||i[i.length-1]===s||this.previousArgHasChoices(e)||this.usage.getCommands().forEach((s=>{const i=o(s[0]).cmd;if(-1===e.indexOf(i))if(this.zshShell){const e=s[1]||"";t.push(i.replace(/:/g,"\\:")+":"+e)}else t.push(i)}))}optionCompletions(t,e,s,i){if((i.match(/^-/)||""===i&&0===t.length)&&!this.previousArgHasChoices(e)){const n=this.yargs.getOptions(),r=this.yargs.getGroups()[this.usage.getPositionalGroupName()]||[];Object.keys(n.key).forEach((o=>{const a=!!n.configuration["boolean-negation"]&&n.boolean.includes(o);r.includes(o)||this.argsContainKey(e,s,o,a)||(this.completeOptionKey(o,t,i),a&&n.default[o]&&this.completeOptionKey(`no-${o}`,t,i))}))}}choicesCompletions(t,e,s,i){if(this.previousArgHasChoices(e)){const s=this.getPreviousArgChoices(e);s&&s.length>0&&t.push(...s)}}getPreviousArgChoices(t){if(t.length<1)return;let e=t[t.length-1],s="";if(!e.startsWith("--")&&t.length>1&&(s=e,e=t[t.length-2]),!e.startsWith("--"))return;const i=e.replace(/-/g,""),n=this.yargs.getOptions();return Object.keys(n.key).some((t=>t===i))&&Array.isArray(n.choices[i])?n.choices[i].filter((t=>!s||t.startsWith(s))):void 0}previousArgHasChoices(t){const e=this.getPreviousArgChoices(t);return void 0!==e&&e.length>0}argsContainKey(t,e,s,i){if(-1!==t.indexOf(`--${s}`))return!0;if(i&&-1!==t.indexOf(`--no-${s}`))return!0;if(this.aliases)for(const t of this.aliases[s])if(void 0!==e[t])return!0;return!1}completeOptionKey(t,e,s){const i=this.usage.getDescriptions(),n=!/^--/.test(s)&&(t=>/^[^0-9]$/.test(t))(t)?"-":"--";if(this.zshShell){const s=i[t]||"";e.push(n+`${t.replace(/:/g,"\\:")}:${s.replace("__yargsString__:","")}`)}else e.push(n+t)}customCompletion(t,e,s,i){if(d(this.customCompletionFunction,null,this.shim),this.customCompletionFunction.length<3){const t=this.customCompletionFunction(s,e);return f(t)?t.then((t=>{this.shim.process.nextTick((()=>{i(null,t)}))})).catch((t=>{this.shim.process.nextTick((()=>{i(t,void 0)}))})):i(null,t)}return function(t){return t.length>3}(this.customCompletionFunction)?this.customCompletionFunction(s,e,((n=i)=>this.defaultCompletion(t,e,s,n)),(t=>{i(null,t)})):this.customCompletionFunction(s,e,(t=>{i(null,t)}))}getCompletion(t,e){const s=t.length?t[t.length-1]:"",i=this.yargs.parse(t,!0),n=this.customCompletionFunction?i=>this.customCompletion(t,i,s,e):i=>this.defaultCompletion(t,i,s,e);return f(i)?i.then(n):n(i)}generateCompletionScript(t,e){let s=this.zshShell?'#compdef {{app_name}}\n###-begin-{{app_name}}-completions-###\n#\n# yargs command completion script\n#\n# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc\n#    or {{app_path}} {{completion_command}} >> ~/.zsh_profile on OSX.\n#\n_{{app_name}}_yargs_completions()\n{\n  local reply\n  local si=$IFS\n  IFS=$\'\n\' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "${words[@]}"))\n  IFS=$si\n  _describe \'values\' reply\n}\ncompdef _{{app_name}}_yargs_completions {{app_name}}\n###-end-{{app_name}}-completions-###\n':'###-begin-{{app_name}}-completions-###\n#\n# yargs command completion script\n#\n# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc\n#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.\n#\n_{{app_name}}_yargs_completions()\n{\n    local cur_word args type_list\n\n    cur_word="${COMP_WORDS[COMP_CWORD]}"\n    args=("${COMP_WORDS[@]}")\n\n    # ask yargs to generate completions.\n    type_list=$({{app_path}} --get-yargs-completions "${args[@]}")\n\n    COMPREPLY=( $(compgen -W "${type_list}" -- ${cur_word}) )\n\n    # if no match was found, fall back to filename completion\n    if [ ${#COMPREPLY[@]} -eq 0 ]; then\n      COMPREPLY=()\n    fi\n\n    return 0\n}\ncomplete -o default -F _{{app_name}}_yargs_completions {{app_name}}\n###-end-{{app_name}}-completions-###\n';const i=this.shim.path.basename(t);return t.match(/\.js$/)&&(t=`./${t}`),s=s.replace(/{{app_name}}/g,i),s=s.replace(/{{completion_command}}/g,e),s.replace(/{{app_path}}/g,t)}registerFunction(t){this.customCompletionFunction=t}setParsed(t){this.aliases=t.aliases}}function N(t,e){if(0===t.length)return e.length;if(0===e.length)return t.length;const s=[];let i,n;for(i=0;i<=e.length;i++)s[i]=[i];for(n=0;n<=t.length;n++)s[0][n]=n;for(i=1;i<=e.length;i++)for(n=1;n<=t.length;n++)e.charAt(i-1)===t.charAt(n-1)?s[i][n]=s[i-1][n-1]:i>1&&n>1&&e.charAt(i-2)===t.charAt(n-1)&&e.charAt(i-1)===t.charAt(n-2)?s[i][n]=s[i-2][n-2]+1:s[i][n]=Math.min(s[i-1][n-1]+1,Math.min(s[i][n-1]+1,s[i-1][n]+1));return s[e.length][t.length]}const H=["$0","--","_"];var z,q,W,U,F,L,V,T,R,G,K,B,Y,J,Z,X,Q,tt,et,st,it,nt,rt,ot,at,ht,lt,ct,ft,dt,ut,pt,gt;const mt=Symbol("copyDoubleDash"),yt=Symbol("copyDoubleDash"),bt=Symbol("deleteFromParserHintObject"),vt=Symbol("emitWarning"),Ot=Symbol("freeze"),wt=Symbol("getDollarZero"),Ct=Symbol("getParserConfiguration"),jt=Symbol("guessLocale"),_t=Symbol("guessVersion"),Mt=Symbol("parsePositionalNumbers"),kt=Symbol("pkgUp"),Et=Symbol("populateParserHintArray"),xt=Symbol("populateParserHintSingleValueDictionary"),At=Symbol("populateParserHintArrayDictionary"),St=Symbol("populateParserHintDictionary"),Pt=Symbol("sanitizeKey"),$t=Symbol("setKey"),It=Symbol("unfreeze"),Dt=Symbol("validateAsync"),Nt=Symbol("getCommandInstance"),Ht=Symbol("getContext"),zt=Symbol("getHasOutput"),qt=Symbol("getLoggerInstance"),Wt=Symbol("getParseContext"),Ut=Symbol("getUsageInstance"),Ft=Symbol("getValidationInstance"),Lt=Symbol("hasParseCallback"),Vt=Symbol("postProcess"),Tt=Symbol("rebase"),Rt=Symbol("reset"),Gt=Symbol("runYargsParserAndExecuteCommands"),Kt=Symbol("runValidation"),Bt=Symbol("setHasOutput"),Yt=Symbol("kTrackManuallySetKeys");class Jt{constructor(t=[],e,s,i){this.customScriptName=!1,this.parsed=!1,z.set(this,void 0),q.set(this,void 0),W.set(this,{commands:[],fullCommands:[]}),U.set(this,null),F.set(this,null),L.set(this,"show-hidden"),V.set(this,null),T.set(this,!0),R.set(this,{}),G.set(this,!0),K.set(this,[]),B.set(this,void 0),Y.set(this,{}),J.set(this,!1),Z.set(this,null),X.set(this,void 0),Q.set(this,""),tt.set(this,void 0),et.set(this,void 0),st.set(this,{}),it.set(this,null),nt.set(this,null),rt.set(this,{}),ot.set(this,{}),at.set(this,void 0),ht.set(this,!1),lt.set(this,void 0),ct.set(this,!1),ft.set(this,!1),dt.set(this,!1),ut.set(this,void 0),pt.set(this,null),gt.set(this,void 0),O(this,lt,i,"f"),O(this,at,t,"f"),O(this,q,e,"f"),O(this,et,s,"f"),O(this,B,new w(this),"f"),this.$0=this[wt](),this[Rt](),O(this,z,v(this,z,"f"),"f"),O(this,ut,v(this,ut,"f"),"f"),O(this,gt,v(this,gt,"f"),"f"),O(this,tt,v(this,tt,"f"),"f"),v(this,tt,"f").showHiddenOpt=v(this,L,"f"),O(this,X,this[yt](),"f")}addHelpOpt(t,e){return h("[string|boolean] [string]",[t,e],arguments.length),v(this,Z,"f")&&(this[bt](v(this,Z,"f")),O(this,Z,null,"f")),!1===t&&void 0===e||(O(this,Z,"string"==typeof t?t:"help","f"),this.boolean(v(this,Z,"f")),this.describe(v(this,Z,"f"),e||v(this,ut,"f").deferY18nLookup("Show help"))),this}help(t,e){return this.addHelpOpt(t,e)}addShowHiddenOpt(t,e){if(h("[string|boolean] [string]",[t,e],arguments.length),!1===t&&void 0===e)return this;const s="string"==typeof t?t:v(this,L,"f");return this.boolean(s),this.describe(s,e||v(this,ut,"f").deferY18nLookup("Show hidden options")),v(this,tt,"f").showHiddenOpt=s,this}showHidden(t,e){return this.addShowHiddenOpt(t,e)}alias(t,e){return h("<object|string|array> [string|array]",[t,e],arguments.length),this[At](this.alias.bind(this),"alias",t,e),this}array(t){return h("<array|string>",[t],arguments.length),this[Et]("array",t),this[Yt](t),this}boolean(t){return h("<array|string>",[t],arguments.length),this[Et]("boolean",t),this[Yt](t),this}check(t,e){return h("<function> [boolean]",[t,e],arguments.length),this.middleware(((e,s)=>j((()=>t(e)),(s=>(s?("string"==typeof s||s instanceof Error)&&v(this,ut,"f").fail(s.toString(),s):v(this,ut,"f").fail(v(this,lt,"f").y18n.__("Argument check failed: %s",t.toString())),e)),(t=>(v(this,ut,"f").fail(t.message?t.message:t.toString(),t),e)))),!1,e),this}choices(t,e){return h("<object|string|array> [string|array]",[t,e],arguments.length),this[At](this.choices.bind(this),"choices",t,e),this}coerce(t,s){if(h("<object|string|array> [function]",[t,s],arguments.length),Array.isArray(t)){if(!s)throw new e("coerce callback must be provided");for(const e of t)this.coerce(e,s);return this}if("object"==typeof t){for(const e of Object.keys(t))this.coerce(e,t[e]);return this}if(!s)throw new e("coerce callback must be provided");return v(this,tt,"f").key[t]=!0,v(this,B,"f").addCoerceMiddleware(((i,n)=>{let r;return j((()=>(r=n.getAliases(),s(i[t]))),(e=>{if(i[t]=e,r[t])for(const s of r[t])i[s]=e;return i}),(t=>{throw new e(t.message)}))}),t),this}conflicts(t,e){return h("<string|object> [string|array]",[t,e],arguments.length),v(this,gt,"f").conflicts(t,e),this}config(t="config",e,s){return h("[object|string] [string|function] [function]",[t,e,s],arguments.length),"object"!=typeof t||Array.isArray(t)?("function"==typeof e&&(s=e,e=void 0),this.describe(t,e||v(this,ut,"f").deferY18nLookup("Path to JSON config file")),(Array.isArray(t)?t:[t]).forEach((t=>{v(this,tt,"f").config[t]=s||!0})),this):(t=n(t,v(this,q,"f"),this[Ct]()["deep-merge-config"]||!1,v(this,lt,"f")),v(this,tt,"f").configObjects=(v(this,tt,"f").configObjects||[]).concat(t),this)}completion(t,e,s){return h("[string] [string|boolean|function] [function]",[t,e,s],arguments.length),"function"==typeof e&&(s=e,e=void 0),O(this,F,t||v(this,F,"f")||"completion","f"),e||!1===e||(e="generate completion script"),this.command(v(this,F,"f"),e),s&&v(this,U,"f").registerFunction(s),this}command(t,e,s,i,n,r){return h("<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]",[t,e,s,i,n,r],arguments.length),v(this,z,"f").addHandler(t,e,s,i,n,r),this}commands(t,e,s,i,n,r){return this.command(t,e,s,i,n,r)}commandDir(t,e){h("<string> [object]",[t,e],arguments.length);const s=v(this,et,"f")||v(this,lt,"f").require;return v(this,z,"f").addDirectory(t,s,v(this,lt,"f").getCallerFile(),e),this}count(t){return h("<array|string>",[t],arguments.length),this[Et]("count",t),this[Yt](t),this}default(t,e,s){return h("<object|string|array> [*] [string]",[t,e,s],arguments.length),s&&(u(t,v(this,lt,"f")),v(this,tt,"f").defaultDescription[t]=s),"function"==typeof e&&(u(t,v(this,lt,"f")),v(this,tt,"f").defaultDescription[t]||(v(this,tt,"f").defaultDescription[t]=v(this,ut,"f").functionDescription(e)),e=e.call()),this[xt](this.default.bind(this),"default",t,e),this}defaults(t,e,s){return this.default(t,e,s)}demandCommand(t=1,e,s,i){return h("[number] [number|string] [string|null|undefined] [string|null|undefined]",[t,e,s,i],arguments.length),"number"!=typeof e&&(s=e,e=1/0),this.global("_",!1),v(this,tt,"f").demandedCommands._={min:t,max:e,minMsg:s,maxMsg:i},this}demand(t,e,s){return Array.isArray(e)?(e.forEach((t=>{d(s,!0,v(this,lt,"f")),this.demandOption(t,s)})),e=1/0):"number"!=typeof e&&(s=e,e=1/0),"number"==typeof t?(d(s,!0,v(this,lt,"f")),this.demandCommand(t,e,s,s)):Array.isArray(t)?t.forEach((t=>{d(s,!0,v(this,lt,"f")),this.demandOption(t,s)})):"string"==typeof s?this.demandOption(t,s):!0!==s&&void 0!==s||this.demandOption(t),this}demandOption(t,e){return h("<object|string|array> [string]",[t,e],arguments.length),this[xt](this.demandOption.bind(this),"demandedOptions",t,e),this}deprecateOption(t,e){return h("<string> [string|boolean]",[t,e],arguments.length),v(this,tt,"f").deprecatedOptions[t]=e,this}describe(t,e){return h("<object|string|array> [string]",[t,e],arguments.length),this[$t](t,!0),v(this,ut,"f").describe(t,e),this}detectLocale(t){return h("<boolean>",[t],arguments.length),O(this,T,t,"f"),this}env(t){return h("[string|boolean]",[t],arguments.length),!1===t?delete v(this,tt,"f").envPrefix:v(this,tt,"f").envPrefix=t||"",this}epilogue(t){return h("<string>",[t],arguments.length),v(this,ut,"f").epilog(t),this}epilog(t){return this.epilogue(t)}example(t,e){return h("<string|array> [string]",[t,e],arguments.length),Array.isArray(t)?t.forEach((t=>this.example(...t))):v(this,ut,"f").example(t,e),this}exit(t,e){O(this,J,!0,"f"),O(this,V,e,"f"),v(this,G,"f")&&v(this,lt,"f").process.exit(t)}exitProcess(t=!0){return h("[boolean]",[t],arguments.length),O(this,G,t,"f"),this}fail(t){if(h("<function|boolean>",[t],arguments.length),"boolean"==typeof t&&!1!==t)throw new e("Invalid first argument. Expected function or boolean 'false'");return v(this,ut,"f").failFn(t),this}getAliases(){return this.parsed?this.parsed.aliases:{}}async getCompletion(t,e){return h("<array> [function]",[t,e],arguments.length),e?v(this,U,"f").getCompletion(t,e):new Promise(((e,s)=>{v(this,U,"f").getCompletion(t,((t,i)=>{t?s(t):e(i)}))}))}getDemandedOptions(){return h([],0),v(this,tt,"f").demandedOptions}getDemandedCommands(){return h([],0),v(this,tt,"f").demandedCommands}getDeprecatedOptions(){return h([],0),v(this,tt,"f").deprecatedOptions}getDetectLocale(){return v(this,T,"f")}getExitProcess(){return v(this,G,"f")}getGroups(){return Object.assign({},v(this,Y,"f"),v(this,ot,"f"))}getHelp(){if(O(this,J,!0,"f"),!v(this,ut,"f").hasCachedHelpMessage()){if(!this.parsed){const t=this[Gt](v(this,at,"f"),void 0,void 0,0,!0);if(f(t))return t.then((()=>v(this,ut,"f").help()))}const t=v(this,z,"f").runDefaultBuilderOn(this);if(f(t))return t.then((()=>v(this,ut,"f").help()))}return Promise.resolve(v(this,ut,"f").help())}getOptions(){return v(this,tt,"f")}getStrict(){return v(this,ct,"f")}getStrictCommands(){return v(this,ft,"f")}getStrictOptions(){return v(this,dt,"f")}global(t,e){return h("<string|array> [boolean]",[t,e],arguments.length),t=[].concat(t),!1!==e?v(this,tt,"f").local=v(this,tt,"f").local.filter((e=>-1===t.indexOf(e))):t.forEach((t=>{v(this,tt,"f").local.includes(t)||v(this,tt,"f").local.push(t)})),this}group(t,e){h("<string|array> <string>",[t,e],arguments.length);const s=v(this,ot,"f")[e]||v(this,Y,"f")[e];v(this,ot,"f")[e]&&delete v(this,ot,"f")[e];const i={};return v(this,Y,"f")[e]=(s||[]).concat(t).filter((t=>!i[t]&&(i[t]=!0))),this}hide(t){return h("<string>",[t],arguments.length),v(this,tt,"f").hiddenOptions.push(t),this}implies(t,e){return h("<string|object> [number|string|array]",[t,e],arguments.length),v(this,gt,"f").implies(t,e),this}locale(t){return h("[string]",[t],arguments.length),t?(O(this,T,!1,"f"),v(this,lt,"f").y18n.setLocale(t),this):(this[jt](),v(this,lt,"f").y18n.getLocale())}middleware(t,e,s){return v(this,B,"f").addMiddleware(t,!!e,s)}nargs(t,e){return h("<string|object|array> [number]",[t,e],arguments.length),this[xt](this.nargs.bind(this),"narg",t,e),this}normalize(t){return h("<array|string>",[t],arguments.length),this[Et]("normalize",t),this}number(t){return h("<array|string>",[t],arguments.length),this[Et]("number",t),this[Yt](t),this}option(t,e){if(h("<string|object> [object]",[t,e],arguments.length),"object"==typeof t)Object.keys(t).forEach((e=>{this.options(e,t[e])}));else{"object"!=typeof e&&(e={}),this[Yt](t),!v(this,pt,"f")||"version"!==t&&"version"!==(null==e?void 0:e.alias)||this[vt](['"version" is a reserved word.',"Please do one of the following:",'- Disable version with `yargs.version(false)` if using "version" as an option',"- Use the built-in `yargs.version` method instead (if applicable)","- Use a different option key","https://yargs.js.org/docs/#api-reference-version"].join("\n"),void 0,"versionWarning"),v(this,tt,"f").key[t]=!0,e.alias&&this.alias(t,e.alias);const s=e.deprecate||e.deprecated;s&&this.deprecateOption(t,s);const i=e.demand||e.required||e.require;i&&this.demand(t,i),e.demandOption&&this.demandOption(t,"string"==typeof e.demandOption?e.demandOption:void 0),e.conflicts&&this.conflicts(t,e.conflicts),"default"in e&&this.default(t,e.default),void 0!==e.implies&&this.implies(t,e.implies),void 0!==e.nargs&&this.nargs(t,e.nargs),e.config&&this.config(t,e.configParser),e.normalize&&this.normalize(t),e.choices&&this.choices(t,e.choices),e.coerce&&this.coerce(t,e.coerce),e.group&&this.group(t,e.group),(e.boolean||"boolean"===e.type)&&(this.boolean(t),e.alias&&this.boolean(e.alias)),(e.array||"array"===e.type)&&(this.array(t),e.alias&&this.array(e.alias)),(e.number||"number"===e.type)&&(this.number(t),e.alias&&this.number(e.alias)),(e.string||"string"===e.type)&&(this.string(t),e.alias&&this.string(e.alias)),(e.count||"count"===e.type)&&this.count(t),"boolean"==typeof e.global&&this.global(t,e.global),e.defaultDescription&&(v(this,tt,"f").defaultDescription[t]=e.defaultDescription),e.skipValidation&&this.skipValidation(t);const n=e.describe||e.description||e.desc;this.describe(t,n),e.hidden&&this.hide(t),e.requiresArg&&this.requiresArg(t)}return this}options(t,e){return this.option(t,e)}parse(t,e,s){h("[string|array] [function|boolean|object] [function]",[t,e,s],arguments.length),this[Ot](),void 0===t&&(t=v(this,at,"f")),"object"==typeof e&&(O(this,nt,e,"f"),e=s),"function"==typeof e&&(O(this,it,e,"f"),e=!1),e||O(this,at,t,"f"),v(this,it,"f")&&O(this,G,!1,"f");const i=this[Gt](t,!!e),n=this.parsed;return v(this,U,"f").setParsed(this.parsed),f(i)?i.then((t=>(v(this,it,"f")&&v(this,it,"f").call(this,v(this,V,"f"),t,v(this,Q,"f")),t))).catch((t=>{throw v(this,it,"f")&&v(this,it,"f")(t,this.parsed.argv,v(this,Q,"f")),t})).finally((()=>{this[It](),this.parsed=n})):(v(this,it,"f")&&v(this,it,"f").call(this,v(this,V,"f"),i,v(this,Q,"f")),this[It](),this.parsed=n,i)}parseAsync(t,e,s){const i=this.parse(t,e,s);return f(i)?i:Promise.resolve(i)}parseSync(t,s,i){const n=this.parse(t,s,i);if(f(n))throw new e(".parseSync() must not be used with asynchronous builders, handlers, or middleware");return n}parserConfiguration(t){return h("<object>",[t],arguments.length),O(this,st,t,"f"),this}pkgConf(t,e){h("<string> [string]",[t,e],arguments.length);let s=null;const i=this[kt](e||v(this,q,"f"));return i[t]&&"object"==typeof i[t]&&(s=n(i[t],e||v(this,q,"f"),this[Ct]()["deep-merge-config"]||!1,v(this,lt,"f")),v(this,tt,"f").configObjects=(v(this,tt,"f").configObjects||[]).concat(s)),this}positional(t,e){h("<string> <object>",[t,e],arguments.length);const s=["default","defaultDescription","implies","normalize","choices","conflicts","coerce","type","describe","desc","description","alias"];e=g(e,((t,e)=>!("type"===t&&!["string","number","boolean"].includes(e))&&s.includes(t)));const i=v(this,W,"f").fullCommands[v(this,W,"f").fullCommands.length-1],n=i?v(this,z,"f").cmdToParseOptions(i):{array:[],alias:{},default:{},demand:{}};return p(n).forEach((s=>{const i=n[s];Array.isArray(i)?-1!==i.indexOf(t)&&(e[s]=!0):i[t]&&!(s in e)&&(e[s]=i[t])})),this.group(t,v(this,ut,"f").getPositionalGroupName()),this.option(t,e)}recommendCommands(t=!0){return h("[boolean]",[t],arguments.length),O(this,ht,t,"f"),this}required(t,e,s){return this.demand(t,e,s)}require(t,e,s){return this.demand(t,e,s)}requiresArg(t){return h("<array|string|object> [number]",[t],arguments.length),"string"==typeof t&&v(this,tt,"f").narg[t]||this[xt](this.requiresArg.bind(this),"narg",t,NaN),this}showCompletionScript(t,e){return h("[string] [string]",[t,e],arguments.length),t=t||this.$0,v(this,X,"f").log(v(this,U,"f").generateCompletionScript(t,e||v(this,F,"f")||"completion")),this}showHelp(t){if(h("[string|function]",[t],arguments.length),O(this,J,!0,"f"),!v(this,ut,"f").hasCachedHelpMessage()){if(!this.parsed){const e=this[Gt](v(this,at,"f"),void 0,void 0,0,!0);if(f(e))return e.then((()=>{v(this,ut,"f").showHelp(t)})),this}const e=v(this,z,"f").runDefaultBuilderOn(this);if(f(e))return e.then((()=>{v(this,ut,"f").showHelp(t)})),this}return v(this,ut,"f").showHelp(t),this}scriptName(t){return this.customScriptName=!0,this.$0=t,this}showHelpOnFail(t,e){return h("[boolean|string] [string]",[t,e],arguments.length),v(this,ut,"f").showHelpOnFail(t,e),this}showVersion(t){return h("[string|function]",[t],arguments.length),v(this,ut,"f").showVersion(t),this}skipValidation(t){return h("<array|string>",[t],arguments.length),this[Et]("skipValidation",t),this}strict(t){return h("[boolean]",[t],arguments.length),O(this,ct,!1!==t,"f"),this}strictCommands(t){return h("[boolean]",[t],arguments.length),O(this,ft,!1!==t,"f"),this}strictOptions(t){return h("[boolean]",[t],arguments.length),O(this,dt,!1!==t,"f"),this}string(t){return h("<array|string>",[t],arguments.length),this[Et]("string",t),this[Yt](t),this}terminalWidth(){return h([],0),v(this,lt,"f").process.stdColumns}updateLocale(t){return this.updateStrings(t)}updateStrings(t){return h("<object>",[t],arguments.length),O(this,T,!1,"f"),v(this,lt,"f").y18n.updateLocale(t),this}usage(t,s,i,n){if(h("<string|null|undefined> [string|boolean] [function|object] [function]",[t,s,i,n],arguments.length),void 0!==s){if(d(t,null,v(this,lt,"f")),(t||"").match(/^\$0( |$)/))return this.command(t,s,i,n);throw new e(".usage() description must start with $0 if being used as alias for .command()")}return v(this,ut,"f").usage(t),this}version(t,e,s){const i="version";if(h("[boolean|string] [string] [string]",[t,e,s],arguments.length),v(this,pt,"f")&&(this[bt](v(this,pt,"f")),v(this,ut,"f").version(void 0),O(this,pt,null,"f")),0===arguments.length)s=this[_t](),t=i;else if(1===arguments.length){if(!1===t)return this;s=t,t=i}else 2===arguments.length&&(s=e,e=void 0);return O(this,pt,"string"==typeof t?t:i,"f"),e=e||v(this,ut,"f").deferY18nLookup("Show version number"),v(this,ut,"f").version(s||void 0),this.boolean(v(this,pt,"f")),this.describe(v(this,pt,"f"),e),this}wrap(t){return h("<number|null|undefined>",[t],arguments.length),v(this,ut,"f").wrap(t),this}[(z=new WeakMap,q=new WeakMap,W=new WeakMap,U=new WeakMap,F=new WeakMap,L=new WeakMap,V=new WeakMap,T=new WeakMap,R=new WeakMap,G=new WeakMap,K=new WeakMap,B=new WeakMap,Y=new WeakMap,J=new WeakMap,Z=new WeakMap,X=new WeakMap,Q=new WeakMap,tt=new WeakMap,et=new WeakMap,st=new WeakMap,it=new WeakMap,nt=new WeakMap,rt=new WeakMap,ot=new WeakMap,at=new WeakMap,ht=new WeakMap,lt=new WeakMap,ct=new WeakMap,ft=new WeakMap,dt=new WeakMap,ut=new WeakMap,pt=new WeakMap,gt=new WeakMap,mt)](t){if(!t._||!t["--"])return t;t._.push.apply(t._,t["--"]);try{delete t["--"]}catch(t){}return t}[yt](){return{log:(...t)=>{this[Lt]()||console.log(...t),O(this,J,!0,"f"),v(this,Q,"f").length&&O(this,Q,v(this,Q,"f")+"\n","f"),O(this,Q,v(this,Q,"f")+t.join(" "),"f")},error:(...t)=>{this[Lt]()||console.error(...t),O(this,J,!0,"f"),v(this,Q,"f").length&&O(this,Q,v(this,Q,"f")+"\n","f"),O(this,Q,v(this,Q,"f")+t.join(" "),"f")}}}[bt](t){p(v(this,tt,"f")).forEach((e=>{if("configObjects"===e)return;const s=v(this,tt,"f")[e];Array.isArray(s)?s.includes(t)&&s.splice(s.indexOf(t),1):"object"==typeof s&&delete s[t]})),delete v(this,ut,"f").getDescriptions()[t]}[vt](t,e,s){v(this,R,"f")[s]||(v(this,lt,"f").process.emitWarning(t,e),v(this,R,"f")[s]=!0)}[Ot](){v(this,K,"f").push({options:v(this,tt,"f"),configObjects:v(this,tt,"f").configObjects.slice(0),exitProcess:v(this,G,"f"),groups:v(this,Y,"f"),strict:v(this,ct,"f"),strictCommands:v(this,ft,"f"),strictOptions:v(this,dt,"f"),completionCommand:v(this,F,"f"),output:v(this,Q,"f"),exitError:v(this,V,"f"),hasOutput:v(this,J,"f"),parsed:this.parsed,parseFn:v(this,it,"f"),parseContext:v(this,nt,"f")}),v(this,ut,"f").freeze(),v(this,gt,"f").freeze(),v(this,z,"f").freeze(),v(this,B,"f").freeze()}[wt](){let t,e="";return t=/\b(node|iojs|electron)(\.exe)?$/.test(v(this,lt,"f").process.argv()[0])?v(this,lt,"f").process.argv().slice(1,2):v(this,lt,"f").process.argv().slice(0,1),e=t.map((t=>{const e=this[Tt](v(this,q,"f"),t);return t.match(/^(\/|([a-zA-Z]:)?\\)/)&&e.length<t.length?e:t})).join(" ").trim(),v(this,lt,"f").getEnv("_")&&v(this,lt,"f").getProcessArgvBin()===v(this,lt,"f").getEnv("_")&&(e=v(this,lt,"f").getEnv("_").replace(`${v(this,lt,"f").path.dirname(v(this,lt,"f").process.execPath())}/`,"")),e}[Ct](){return v(this,st,"f")}[jt](){if(!v(this,T,"f"))return;const t=v(this,lt,"f").getEnv("LC_ALL")||v(this,lt,"f").getEnv("LC_MESSAGES")||v(this,lt,"f").getEnv("LANG")||v(this,lt,"f").getEnv("LANGUAGE")||"en_US";this.locale(t.replace(/[.:].*/,""))}[_t](){return this[kt]().version||"unknown"}[Mt](t){const e=t["--"]?t["--"]:t._;for(let t,s=0;void 0!==(t=e[s]);s++)v(this,lt,"f").Parser.looksLikeNumber(t)&&Number.isSafeInteger(Math.floor(parseFloat(`${t}`)))&&(e[s]=Number(t));return t}[kt](t){const e=t||"*";if(v(this,rt,"f")[e])return v(this,rt,"f")[e];let s={};try{let e=t||v(this,lt,"f").mainFilename;!t&&v(this,lt,"f").path.extname(e)&&(e=v(this,lt,"f").path.dirname(e));const i=v(this,lt,"f").findUp(e,((t,e)=>e.includes("package.json")?"package.json":void 0));d(i,void 0,v(this,lt,"f")),s=JSON.parse(v(this,lt,"f").readFileSync(i,"utf8"))}catch(t){}return v(this,rt,"f")[e]=s||{},v(this,rt,"f")[e]}[Et](t,e){(e=[].concat(e)).forEach((e=>{e=this[Pt](e),v(this,tt,"f")[t].push(e)}))}[xt](t,e,s,i){this[St](t,e,s,i,((t,e,s)=>{v(this,tt,"f")[t][e]=s}))}[At](t,e,s,i){this[St](t,e,s,i,((t,e,s)=>{v(this,tt,"f")[t][e]=(v(this,tt,"f")[t][e]||[]).concat(s)}))}[St](t,e,s,i,n){if(Array.isArray(s))s.forEach((e=>{t(e,i)}));else if((t=>"object"==typeof t)(s))for(const e of p(s))t(e,s[e]);else n(e,this[Pt](s),i)}[Pt](t){return"__proto__"===t?"___proto___":t}[$t](t,e){return this[xt](this[$t].bind(this),"key",t,e),this}[It](){var t,e,s,i,n,r,o,a,h,l,c,f;const u=v(this,K,"f").pop();let p;d(u,void 0,v(this,lt,"f")),t=this,e=this,s=this,i=this,n=this,r=this,o=this,a=this,h=this,l=this,c=this,f=this,({options:{set value(e){O(t,tt,e,"f")}}.value,configObjects:p,exitProcess:{set value(t){O(e,G,t,"f")}}.value,groups:{set value(t){O(s,Y,t,"f")}}.value,output:{set value(t){O(i,Q,t,"f")}}.value,exitError:{set value(t){O(n,V,t,"f")}}.value,hasOutput:{set value(t){O(r,J,t,"f")}}.value,parsed:this.parsed,strict:{set value(t){O(o,ct,t,"f")}}.value,strictCommands:{set value(t){O(a,ft,t,"f")}}.value,strictOptions:{set value(t){O(h,dt,t,"f")}}.value,completionCommand:{set value(t){O(l,F,t,"f")}}.value,parseFn:{set value(t){O(c,it,t,"f")}}.value,parseContext:{set value(t){O(f,nt,t,"f")}}.value}=u),v(this,tt,"f").configObjects=p,v(this,ut,"f").unfreeze(),v(this,gt,"f").unfreeze(),v(this,z,"f").unfreeze(),v(this,B,"f").unfreeze()}[Dt](t,e){return j(e,(e=>(t(e),e)))}getInternalMethods(){return{getCommandInstance:this[Nt].bind(this),getContext:this[Ht].bind(this),getHasOutput:this[zt].bind(this),getLoggerInstance:this[qt].bind(this),getParseContext:this[Wt].bind(this),getParserConfiguration:this[Ct].bind(this),getUsageInstance:this[Ut].bind(this),getValidationInstance:this[Ft].bind(this),hasParseCallback:this[Lt].bind(this),postProcess:this[Vt].bind(this),reset:this[Rt].bind(this),runValidation:this[Kt].bind(this),runYargsParserAndExecuteCommands:this[Gt].bind(this),setHasOutput:this[Bt].bind(this)}}[Nt](){return v(this,z,"f")}[Ht](){return v(this,W,"f")}[zt](){return v(this,J,"f")}[qt](){return v(this,X,"f")}[Wt](){return v(this,nt,"f")||{}}[Ut](){return v(this,ut,"f")}[Ft](){return v(this,gt,"f")}[Lt](){return!!v(this,it,"f")}[Vt](t,e,s,i){if(s)return t;if(f(t))return t;e||(t=this[mt](t));return(this[Ct]()["parse-positional-numbers"]||void 0===this[Ct]()["parse-positional-numbers"])&&(t=this[Mt](t)),i&&(t=C(t,this,v(this,B,"f").getMiddleware(),!1)),t}[Rt](t={}){O(this,tt,v(this,tt,"f")||{},"f");const e={};e.local=v(this,tt,"f").local||[],e.configObjects=v(this,tt,"f").configObjects||[];const s={};e.local.forEach((e=>{s[e]=!0,(t[e]||[]).forEach((t=>{s[t]=!0}))})),Object.assign(v(this,ot,"f"),Object.keys(v(this,Y,"f")).reduce(((t,e)=>{const i=v(this,Y,"f")[e].filter((t=>!(t in s)));return i.length>0&&(t[e]=i),t}),{})),O(this,Y,{},"f");return["array","boolean","string","skipValidation","count","normalize","number","hiddenOptions"].forEach((t=>{e[t]=(v(this,tt,"f")[t]||[]).filter((t=>!s[t]))})),["narg","key","alias","default","defaultDescription","config","choices","demandedOptions","demandedCommands","deprecatedOptions"].forEach((t=>{e[t]=g(v(this,tt,"f")[t],(t=>!s[t]))})),e.envPrefix=v(this,tt,"f").envPrefix,O(this,tt,e,"f"),O(this,ut,v(this,ut,"f")?v(this,ut,"f").reset(s):S(this,v(this,lt,"f")),"f"),O(this,gt,v(this,gt,"f")?v(this,gt,"f").reset(s):function(t,e,s){const i=s.y18n.__,n=s.y18n.__n,r={nonOptionCount:function(s){const i=t.getDemandedCommands(),r=s._.length+(s["--"]?s["--"].length:0)-t.getInternalMethods().getContext().commands.length;i._&&(r<i._.min||r>i._.max)&&(r<i._.min?void 0!==i._.minMsg?e.fail(i._.minMsg?i._.minMsg.replace(/\$0/g,r.toString()).replace(/\$1/,i._.min.toString()):null):e.fail(n("Not enough non-option arguments: got %s, need at least %s","Not enough non-option arguments: got %s, need at least %s",r,r.toString(),i._.min.toString())):r>i._.max&&(void 0!==i._.maxMsg?e.fail(i._.maxMsg?i._.maxMsg.replace(/\$0/g,r.toString()).replace(/\$1/,i._.max.toString()):null):e.fail(n("Too many non-option arguments: got %s, maximum of %s","Too many non-option arguments: got %s, maximum of %s",r,r.toString(),i._.max.toString()))))},positionalCount:function(t,s){s<t&&e.fail(n("Not enough non-option arguments: got %s, need at least %s","Not enough non-option arguments: got %s, need at least %s",s,s+"",t+""))},requiredArguments:function(t,s){let i=null;for(const e of Object.keys(s))Object.prototype.hasOwnProperty.call(t,e)&&void 0!==t[e]||(i=i||{},i[e]=s[e]);if(i){const t=[];for(const e of Object.keys(i)){const s=i[e];s&&t.indexOf(s)<0&&t.push(s)}const s=t.length?`\n${t.join("\n")}`:"";e.fail(n("Missing required argument: %s","Missing required arguments: %s",Object.keys(i).length,Object.keys(i).join(", ")+s))}},unknownArguments:function(s,i,o,a,h=!0){var l;const c=t.getInternalMethods().getCommandInstance().getCommands(),f=[],d=t.getInternalMethods().getContext();if(Object.keys(s).forEach((e=>{H.includes(e)||Object.prototype.hasOwnProperty.call(o,e)||Object.prototype.hasOwnProperty.call(t.getInternalMethods().getParseContext(),e)||r.isValidAndSomeAliasIsNotNew(e,i)||f.push(e)})),h&&(d.commands.length>0||c.length>0||a)&&s._.slice(d.commands.length).forEach((t=>{c.includes(""+t)||f.push(""+t)})),h){const e=(null===(l=t.getDemandedCommands()._)||void 0===l?void 0:l.max)||0,i=d.commands.length+e;i<s._.length&&s._.slice(i).forEach((t=>{t=String(t),d.commands.includes(t)||f.includes(t)||f.push(t)}))}f.length&&e.fail(n("Unknown argument: %s","Unknown arguments: %s",f.length,f.join(", ")))},unknownCommands:function(s){const i=t.getInternalMethods().getCommandInstance().getCommands(),r=[],o=t.getInternalMethods().getContext();return(o.commands.length>0||i.length>0)&&s._.slice(o.commands.length).forEach((t=>{i.includes(""+t)||r.push(""+t)})),r.length>0&&(e.fail(n("Unknown command: %s","Unknown commands: %s",r.length,r.join(", "))),!0)},isValidAndSomeAliasIsNotNew:function(e,s){if(!Object.prototype.hasOwnProperty.call(s,e))return!1;const i=t.parsed.newAliases;return[e,...s[e]].some((t=>!Object.prototype.hasOwnProperty.call(i,t)||!i[e]))},limitedChoices:function(s){const n=t.getOptions(),r={};if(!Object.keys(n.choices).length)return;Object.keys(s).forEach((t=>{-1===H.indexOf(t)&&Object.prototype.hasOwnProperty.call(n.choices,t)&&[].concat(s[t]).forEach((e=>{-1===n.choices[t].indexOf(e)&&void 0!==e&&(r[t]=(r[t]||[]).concat(e))}))}));const o=Object.keys(r);if(!o.length)return;let a=i("Invalid values:");o.forEach((t=>{a+=`\n  ${i("Argument: %s, Given: %s, Choices: %s",t,e.stringifiedValues(r[t]),e.stringifiedValues(n.choices[t]))}`})),e.fail(a)}};let o={};function a(t,e){const s=Number(e);return"number"==typeof(e=isNaN(s)?e:s)?e=t._.length>=e:e.match(/^--no-.+/)?(e=e.match(/^--no-(.+)/)[1],e=!Object.prototype.hasOwnProperty.call(t,e)):e=Object.prototype.hasOwnProperty.call(t,e),e}r.implies=function(e,i){h("<string|object> [array|number|string]",[e,i],arguments.length),"object"==typeof e?Object.keys(e).forEach((t=>{r.implies(t,e[t])})):(t.global(e),o[e]||(o[e]=[]),Array.isArray(i)?i.forEach((t=>r.implies(e,t))):(d(i,void 0,s),o[e].push(i)))},r.getImplied=function(){return o},r.implications=function(t){const s=[];if(Object.keys(o).forEach((e=>{const i=e;(o[e]||[]).forEach((e=>{let n=i;const r=e;n=a(t,n),e=a(t,e),n&&!e&&s.push(` ${i} -> ${r}`)}))})),s.length){let t=`${i("Implications failed:")}\n`;s.forEach((e=>{t+=e})),e.fail(t)}};let l={};r.conflicts=function(e,s){h("<string|object> [array|string]",[e,s],arguments.length),"object"==typeof e?Object.keys(e).forEach((t=>{r.conflicts(t,e[t])})):(t.global(e),l[e]||(l[e]=[]),Array.isArray(s)?s.forEach((t=>r.conflicts(e,t))):l[e].push(s))},r.getConflicting=()=>l,r.conflicting=function(n){Object.keys(n).forEach((t=>{l[t]&&l[t].forEach((s=>{s&&void 0!==n[t]&&void 0!==n[s]&&e.fail(i("Arguments %s and %s are mutually exclusive",t,s))}))})),t.getInternalMethods().getParserConfiguration()["strip-dashed"]&&Object.keys(l).forEach((t=>{l[t].forEach((r=>{r&&void 0!==n[s.Parser.camelCase(t)]&&void 0!==n[s.Parser.camelCase(r)]&&e.fail(i("Arguments %s and %s are mutually exclusive",t,r))}))}))},r.recommendCommands=function(t,s){s=s.sort(((t,e)=>e.length-t.length));let n=null,r=1/0;for(let e,i=0;void 0!==(e=s[i]);i++){const s=N(t,e);s<=3&&s<r&&(r=s,n=e)}n&&e.fail(i("Did you mean %s?",n))},r.reset=function(t){return o=g(o,(e=>!t[e])),l=g(l,(e=>!t[e])),r};const c=[];return r.freeze=function(){c.push({implied:o,conflicting:l})},r.unfreeze=function(){const t=c.pop();d(t,void 0,s),({implied:o,conflicting:l}=t)},r}(this,v(this,ut,"f"),v(this,lt,"f")),"f"),O(this,z,v(this,z,"f")?v(this,z,"f").reset():function(t,e,s,i){return new M(t,e,s,i)}(v(this,ut,"f"),v(this,gt,"f"),v(this,B,"f"),v(this,lt,"f")),"f"),v(this,U,"f")||O(this,U,function(t,e,s,i){return new D(t,e,s,i)}(this,v(this,ut,"f"),v(this,z,"f"),v(this,lt,"f")),"f"),v(this,B,"f").reset(),O(this,F,null,"f"),O(this,Q,"","f"),O(this,V,null,"f"),O(this,J,!1,"f"),this.parsed=!1,this}[Tt](t,e){return v(this,lt,"f").path.relative(t,e)}[Gt](t,s,i,n=0,r=!1){let o=!!i||r;t=t||v(this,at,"f"),v(this,tt,"f").__=v(this,lt,"f").y18n.__,v(this,tt,"f").configuration=this[Ct]();const a=!!v(this,tt,"f").configuration["populate--"],h=Object.assign({},v(this,tt,"f").configuration,{"populate--":!0}),l=v(this,lt,"f").Parser.detailed(t,Object.assign({},v(this,tt,"f"),{configuration:{"parse-positional-numbers":!1,...h}})),c=Object.assign(l.argv,v(this,nt,"f"));let d;const u=l.aliases;let p=!1,g=!1;Object.keys(c).forEach((t=>{t===v(this,Z,"f")&&c[t]?p=!0:t===v(this,pt,"f")&&c[t]&&(g=!0)})),c.$0=this.$0,this.parsed=l,0===n&&v(this,ut,"f").clearCachedHelpMessage();try{if(this[jt](),s)return this[Vt](c,a,!!i,!1);if(v(this,Z,"f")){[v(this,Z,"f")].concat(u[v(this,Z,"f")]||[]).filter((t=>t.length>1)).includes(""+c._[c._.length-1])&&(c._.pop(),p=!0)}const h=v(this,z,"f").getCommands(),m=v(this,U,"f").completionKey in c,y=p||m||r;if(c._.length){if(h.length){let t;for(let e,s=n||0;void 0!==c._[s];s++){if(e=String(c._[s]),h.includes(e)&&e!==v(this,F,"f")){const t=v(this,z,"f").runCommand(e,this,l,s+1,r,p||g||r);return this[Vt](t,a,!!i,!1)}if(!t&&e!==v(this,F,"f")){t=e;break}}!v(this,z,"f").hasDefaultCommand()&&v(this,ht,"f")&&t&&!y&&v(this,gt,"f").recommendCommands(t,h)}v(this,F,"f")&&c._.includes(v(this,F,"f"))&&!m&&(v(this,G,"f")&&x(!0),this.showCompletionScript(),this.exit(0))}if(v(this,z,"f").hasDefaultCommand()&&!y){const t=v(this,z,"f").runCommand(null,this,l,0,r,p||g||r);return this[Vt](t,a,!!i,!1)}if(m){v(this,G,"f")&&x(!0);const s=(t=[].concat(t)).slice(t.indexOf(`--${v(this,U,"f").completionKey}`)+1);return v(this,U,"f").getCompletion(s,((t,s)=>{if(t)throw new e(t.message);(s||[]).forEach((t=>{v(this,X,"f").log(t)})),this.exit(0)})),this[Vt](c,!a,!!i,!1)}if(v(this,J,"f")||(p?(v(this,G,"f")&&x(!0),o=!0,this.showHelp("log"),this.exit(0)):g&&(v(this,G,"f")&&x(!0),o=!0,v(this,ut,"f").showVersion("log"),this.exit(0))),!o&&v(this,tt,"f").skipValidation.length>0&&(o=Object.keys(c).some((t=>v(this,tt,"f").skipValidation.indexOf(t)>=0&&!0===c[t]))),!o){if(l.error)throw new e(l.error.message);if(!m){const t=this[Kt](u,{},l.error);i||(d=C(c,this,v(this,B,"f").getMiddleware(),!0)),d=this[Dt](t,null!=d?d:c),f(d)&&!i&&(d=d.then((()=>C(c,this,v(this,B,"f").getMiddleware(),!1))))}}}catch(t){if(!(t instanceof e))throw t;v(this,ut,"f").fail(t.message,t)}return this[Vt](null!=d?d:c,a,!!i,!0)}[Kt](t,s,i,n){const r={...this.getDemandedOptions()};return o=>{if(i)throw new e(i.message);v(this,gt,"f").nonOptionCount(o),v(this,gt,"f").requiredArguments(o,r);let a=!1;v(this,ft,"f")&&(a=v(this,gt,"f").unknownCommands(o)),v(this,ct,"f")&&!a?v(this,gt,"f").unknownArguments(o,t,s,!!n):v(this,dt,"f")&&v(this,gt,"f").unknownArguments(o,t,{},!1,!1),v(this,gt,"f").limitedChoices(o),v(this,gt,"f").implications(o),v(this,gt,"f").conflicting(o)}}[Bt](){O(this,J,!0,"f")}[Yt](t){if("string"==typeof t)v(this,tt,"f").key[t]=!0;else for(const e of t)v(this,tt,"f").key[e]=!0}}var Zt,Xt;const{readFileSync:Qt}=__nccwpck_require__(5747),{inspect:te}=__nccwpck_require__(1669),{resolve:ee}=__nccwpck_require__(5622),se=__nccwpck_require__(9880),ie=__nccwpck_require__(5876);var ne,re={assert:{notStrictEqual:t.notStrictEqual,strictEqual:t.strictEqual},cliui:__nccwpck_require__(1340),findUp:__nccwpck_require__(4823),getEnv:t=>process.env[t],getCallerFile:__nccwpck_require__(5275),getProcessArgvBin:y,inspect:te,mainFilename:null!==(Xt=null===(Zt= false||void 0===__nccwpck_require__(8184)?void 0:__nccwpck_require__.c[__nccwpck_require__.s])||void 0===Zt?void 0:Zt.filename)&&void 0!==Xt?Xt:process.cwd(),Parser:ie,path:__nccwpck_require__(5622),process:{argv:()=>process.argv,cwd:process.cwd,emitWarning:(t,e)=>process.emitWarning(t,e),execPath:()=>process.execPath,exit:t=>{process.exit(t)},nextTick:process.nextTick,stdColumns:void 0!==process.stdout.columns?process.stdout.columns:null},readFileSync:Qt,require:__nccwpck_require__(8184),requireDirectory:__nccwpck_require__(9348),stringWidth:__nccwpck_require__(3175),y18n:se({directory:ee(__dirname,"../locales"),updateFiles:!1})};const oe=(null===(ne=null===process||void 0===process?void 0:process.env)||void 0===ne?void 0:ne.YARGS_MIN_NODE_VERSION)?Number(process.env.YARGS_MIN_NODE_VERSION):12;if(process&&process.version){if(Number(process.version.match(/v([^.]+)/)[1])<oe)throw Error(`yargs supports a minimum Node.js version of ${oe}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`)}const ae=__nccwpck_require__(5876);var he,le={applyExtends:n,cjsPlatformShim:re,Yargs:(he=re,(t=[],e=he.process.cwd(),s)=>{const i=new Jt(t,e,s,he);return Object.defineProperty(i,"argv",{get:()=>i.parse(),enumerable:!0}),i.help(),i.version(),i}),argsert:h,isPromise:f,objFilter:g,parseCommand:o,Parser:ae,processArgv:b,YError:e};module.exports=le;


/***/ }),

/***/ 6492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// TODO: consolidate on using a helpers file at some point in the future, which
// is the approach currently used to export Parser and applyExtends for ESM:
const {applyExtends, cjsPlatformShim, Parser, Yargs, processArgv} = __nccwpck_require__(6400)
Yargs.applyExtends = (config, cwd, mergeExtends) => {
  return applyExtends(config, cwd, mergeExtends, cjsPlatformShim)
}
Yargs.hideBin = processArgv.hideBin
Yargs.Parser = Parser
module.exports = Yargs


/***/ }),

/***/ 9137:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 9137;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 8184:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 8184;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__nccwpck_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__nccwpck_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __nccwpck_require__(__nccwpck_require__.s = 2912);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;