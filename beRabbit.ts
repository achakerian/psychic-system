import * as amqp from "amqplib";

//debugging: mock Back End
const debug = true;
if (debug) {
  // sends prompt and UUID to openAIAPI.ts
  console.log("beRabbit debug active");
  console.log(" ");
  
  (async () => {
    try {
      //create a connection
      const connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();
      const sendQueue = "BEtoAI";
      const receiveQueue = "AItoBE";
      await channel.assertQueue(receiveQueue, { durable: false }); //this is the BE mock up so we send it to the receive que
      await channel.assertQueue(sendQueue, { durable: false }); //this is the BE mock up so we send it to the receive que

      //payload
      const UUID = "12234";
      const msg = {
        content: "ask me about my day",
        id: UUID,
      };

      // Convert the object to a JSON string
      const messageBuffer = Buffer.from(JSON.stringify(msg));

      // Send the message buffer to the queue
      channel.sendToQueue(sendQueue, messageBuffer);
      // Receive reply from AI aiRabbit
      channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          console.log(` [x] Received '${msg.content.toString()}'`);
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
}
