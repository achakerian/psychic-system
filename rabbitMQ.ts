import * as amqp from "amqplib";
import { promptUUID } from "./openAIAPI";

class Message {
  connection: Promise<amqp.Connection>;
  channel: Promise<amqp.Channel>;
  receiveQueue: string;
  sendQueue: string;

  constructor(send: string, receive: string) {
    this.receiveQueue = receive;
    this.sendQueue = send;
    this.init();
  }
  async init() {
    try {
      const connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();
      await channel.assertQueue(this.receiveQueue, { durable: false });
      await channel.assertQueue(this.sendQueue, { durable: false });
    } catch (error) {
      console.error("Failed to initialize connection or channel:", error);
    }
  }
  async waiting() {
    console.log(
      ` [*] Waiting for messages in '${this.receiveQueue}'. To exit press CTRL+C`
    );
  }
  async receive(){
    await this.channel.consume(this.receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
    });
  }
}
async function receiveProcessRespond() {
  const m = new Message("BEtoAI", "AItoBE");
  try {
    this.channel.consume(this.receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          const response = await promptUUID(
            "can you write ten ",
            msg.content[0].toString(),
            msg.content[1].toString()
          );
          this.channel.sendToQueue(this.sendQueue, Buffer.from(response[0]));
          console.log(` [x] Received '${msg.content.toString()}'`);
          console.log(` [x] Replying to UUID:`, response[1]); // '${reply}'`);
          this.channel.ack(msg);
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}


const debug = 0;
if (debug == 0) {
    console.log("RabbitMQ(debug): check object creation");
    const AI = new Message("AItoBE", "BEtoAI");
    const BE = new Message("BEtoAI", "AItoBE");
    console.log(BE.receive());
    console.log(AI.send("Something, something, something success"));

} else if (debug == 1) {
  // sends prompt and UUID to openAIAPI.ts
  console.log("beRabbit debug active");
  console.log(" ");

  (async () => {
    try {
      const msg = "can you ask me a question";

      console.log("Call OpenAI API", promptUUID("", msg, "12223344"));
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
} else {
  receiveProcessRespond();
}
