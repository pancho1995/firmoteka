const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();
const Chance = require("chance");
const chance = new Chance();

const { USERS_TABLE } = process.env;

exports.handler = async (event) => {
    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
        const user_id = chance.string({
            length: 8,
            casing: "upper",
            alpha: true,
            numeric: true,
        });
        const username = event.userName;
        const full_name = event.request.name;
        const phone_number = event.request.phone_number;
        const email = event.request.email;

        var fullDateArr = new Date().toISOString().split("T");
        const creationTime = fullDateArr[0] + " " + fullDateArr[1].split(".")[0];

        const user = {
            user_id: user_id,
            username: username,
            full_name: full_name,
            phone_number: phone_number,
            email: email,
            created_at: creationTime,
            updated_at: creationTime,
            company_id: 'NULL',
        };

        await DocumentClient.put({
            TableName: USERS_TABLE,
            Item: user,
            ConditionExpression: "attribute_not_exists(id)",
        }).promise();
    }
    return event;
};
