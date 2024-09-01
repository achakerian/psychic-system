import * as amqp from "amqplib";
export class Message {
  connection: amqp.Connection | null = null;
  channel: amqp.Channel | null = null;
  receiveQueue: string;
  sendQueue: string;

  constructor(send: string, receive: string) {
    this.receiveQueue = receive;
    this.sendQueue = send;
  }
  async init() {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.receiveQueue, { durable: false });
      await this.channel.assertQueue(this.sendQueue, { durable: false });
    } catch (error) {
      console.error("Failed to initialize connection or channel:", error);
      // prevent resource leak on error
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    }
  }

  async receive(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.channel?.consume(
        this.receiveQueue,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg) {
            console.log(` [x] Received '${msg.content.toString()}'`);
            this.channel?.ack(msg);
            resolve([msg.content.toString()]);
            //here the process logic needs to apply in the module i.e. aiRabbit, beRabbit
          } else reject(new Error("Received null message"));
        }
      );
    });
  }

  async send(msg: string[]) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(msg));
      console.log(" [x] Sent :", msg);
      this.channel?.sendToQueue(this.sendQueue, messageBuffer);
    } catch (error) {}
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error("Failed to close RabbitMQ connection or channel:", error);
    }
  }
}

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
