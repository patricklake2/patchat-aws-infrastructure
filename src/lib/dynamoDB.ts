import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const ddb = new DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

async function deleteItem(tableName: string, key: object): Promise<void> {
  try {
    await ddb.delete({ TableName: tableName, Key: key }).promise();
  } catch (e) {
    console.log('Could not delete item ' + JSON.stringify(e));
  }
}

async function putItem(tableName: string, data: Object): Promise<void> {
  try {
    await ddb
      .put({
        TableName: tableName,
        Item: data,
      })
      .promise();
  } catch (e) {
    console.log('Could not save message to DB ' + JSON.stringify(e));
  }
}

async function queryTable(
  tableName: string,
  reqFields: string[],
  params = {}
): Promise<any[]> {
  const data = await ddb
    .query({
      TableName: tableName,
      ProjectionExpression: reqFields.toString(),
      ...params,
    })
    .promise();
  return data.Items;
}

async function scanTable(
  tableName: string,
  reqFields: string[]
): Promise<any[]> {
  const data = await ddb
    .scan({
      TableName: tableName,
      ProjectionExpression: reqFields.toString(),
    })
    .promise();
  return data.Items;
}

export { deleteItem, putItem, queryTable, scanTable };
