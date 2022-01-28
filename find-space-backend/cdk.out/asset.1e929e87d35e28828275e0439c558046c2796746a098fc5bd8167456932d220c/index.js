var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// services/space-table/create.ts
var create_exports = {};
__export(create_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");

// services/shared/inputValidator.ts
var MissingFieldError = class extends Error {
};
function validateAsSpaceEntry(arg) {
  if (!arg.name) {
    throw new MissingFieldError("Value for name is required!");
  }
  if (!arg.location) {
    throw new MissingFieldError("Value for location is required!");
  }
  if (!arg.spaceId) {
    throw new MissingFieldError("Value for space Id is required!");
  }
}

// services/shared/utils.ts
function generateRandomId() {
  return Math.random().toString(36).slice(2);
}
function getEventBody(event) {
  return typeof event.body == "object" ? event.body : JSON.parse(event.body);
}
function addCorsHeader(result) {
  result.headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };
}

// services/space-table/create.ts
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "DB created"
  };
  addCorsHeader(result);
  try {
    const item = getEventBody(event);
    item[PRIMARY_KEY] = generateRandomId();
    validateAsSpaceEntry(item);
    await dbClient.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
    result.body = JSON.stringify({
      spaceid: item[PRIMARY_KEY]
    });
  } catch (err) {
    if (err instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }
    result.body = err.message;
  }
  return result;
}
module.exports = __toCommonJS(create_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
