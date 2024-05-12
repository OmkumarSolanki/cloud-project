const topicNameOrId = 'my-test-ps';
const data = JSON.stringify({foo: 'bar'});

const {PubSub} = require('@google-cloud/pubsub');
const projectId = process.env.PROJECT_ID;
const pubSubClient = new PubSub({projectId});

async function publishMessage(topicNameOrId, data) {
  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishJSON(data); 
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}
  
module.exports = { publishMessage };


