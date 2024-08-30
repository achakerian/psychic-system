import * as amqp from "amqplib";
import { promptUUID } from "./openAIAPI";

async function receiveProcessRespond() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const receiveQueue = "BEtoAI";
    const sendQueue = "AItoBE";

    await channel.assertQueue(receiveQueue, { durable: false });
    await channel.assertQueue(sendQueue, { durable: false });

    console.log(` [*] Waiting for messages in '${receiveQueue}'. To exit press CTRL+C`);
    channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
      if (msg) {
        const response = await promptUUID(
          "can you write ten "
          msg.content[0].toString(),
          msg.content[1].toString()
        );
        channel.sendToQueue(sendQueue, Buffer.from(response[0]));
        console.log(` [x] Received '${msg.content.toString()}'`);
        console.log(` [x] Replying to UUID:`, response[1]); // '${reply}'`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

const debug = true;
if (debug) {
  // sends prompt and UUID to openAIAPI.ts
  console.log("beRabbit debug active");
  console.log(" ");

  (async () => {
    try {
      const msg = "can you ask me a question";
      
      console.log("Call OpenAI API", promptUUID(msg, "12223344"));
  } catch (error) {
    console.error("failed to get response", error);
  }
  })();
}else{
  receiveProcessRespond();
}
