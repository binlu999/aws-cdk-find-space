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

// services/space-table/read.ts
var read_exports = {};
__export(read_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "No operation performed"
  };
  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters);
      } else {
        result.body = await queryWithSecondaryIndex(event.queryStringParameters);
      }
    } else {
      result.body = await scanTable();
    }
  } catch (err) {
    result.body = err.message;
  }
  return result;
}
async function queryWithPrimaryPartition(queryParams) {
  const keyValue = queryParams[PRIMARY_KEY];
  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: "#Primary_Key_field = :Key_value",
    ExpressionAttributeNames: {
      "#Primary_Key_field": PRIMARY_KEY
    },
    ExpressionAttributeValues: {
      ":Key_value": keyValue
    }
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
async function queryWithSecondaryIndex(queryParams) {
  const queryKey = Object.keys(queryParams)[0];
  const keyValue = queryParams[queryKey];
  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    IndexName: queryKey,
    KeyConditionExpression: "#GSI_Key_field = :Key_value",
    ExpressionAttributeNames: {
      "#GSI_Key_field": queryKey
    },
    ExpressionAttributeValues: {
      ":Key_value": keyValue
    }
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
async function scanTable() {
  const queryResponse = await dbClient.scan({
    TableName: TABLE_NAME
  }).promise();
  return JSON.stringify(queryResponse.Items);
}
module.exports = __toCommonJS(read_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
