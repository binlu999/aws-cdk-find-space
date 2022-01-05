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

// services/space-table/update.ts
var update_exports = {};
__export(update_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");

// services/shared/utils.ts
function getEventBody(event) {
  return typeof event.body == "object" ? event.body : JSON.parse(event.body);
}

// services/space-table/update.ts
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
async function handler(event, context) {
  var _a;
  const result = {
    statusCode: 200,
    body: "No operation performend"
  };
  try {
    const requestBody = getEventBody(event);
    const spaceId = (_a = event.queryStringParameters) == null ? void 0 : _a[PRIMARY_KEY];
    if (requestBody && spaceId) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];
      const updateResult = await dbClient.update({
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: spaceId
        },
        UpdateExpression: "set #UPDATE_KEY = :UPDATE_VALUE",
        ExpressionAttributeNames: {
          "#UPDATE_KEY": requestBodyKey
        },
        ExpressionAttributeValues: {
          ":UPDATE_VALUE": requestBodyValue
        },
        ReturnValues: "UPDATED_NEW"
      }).promise();
      result.body = JSON.stringify(updateResult);
    }
  } catch (err) {
    result.body = err.message;
  }
  return result;
}
module.exports = __toCommonJS(update_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
