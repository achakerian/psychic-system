import * as readline from "readline"; //debugging only
import { Message } from "./rabbitMQ";

let debug = 2;

const be = new Message("BEtoAI", "AItoBE");
const ai = new Message("AItoBE", "BEtoAI");

(async () => {
  await be.init();
  await ai.init();

  if (debug == 1) { 
    console.log("rabbitMQ debug active: check internal messaging system");
    await ai.send(["Hellooo", "ai1234"]);
    const rec = await be.receive(); // Await the promise to get the actual message
    console.log("debug received: ", rec);

  }
  if (debug == 2) {
    console.log("rabbitMQ debug active: check messaging system from BE to AI + response");
    const s: string = `
Nuclear physics is the branch of physics that studies atomic nuclei and their interactions. This field explores the fundamental forces that hold the nucleus together, including the strong nuclear force, which is responsible for binding protons and neutrons within the nucleus. Research in nuclear physics has led to significant advancements in our understanding of matter, energy, and the universe's origins.
One of the key areas of nuclear physics is nuclear reactions, such as fission and fusion. Fission, the splitting of a heavy nucleus into lighter nuclei, is the process behind nuclear power and atomic bombs. Fusion, the combining of light nuclei to form a heavier nucleus, powers the sun and holds potential for future energy sources on Earth. These reactions release vast amounts of energy, making them crucial for both practical applications and theoretical research.
Nuclear physics also plays a vital role in medical applications, such as in nuclear medicine, where radioactive isotopes are used for imaging and treatment. Additionally, it contributes to our understanding of stellar processes and the formation of elements in the universe. Through experiments and technologies like particle accelerators, nuclear physics continues to deepen our knowledge of the fundamental components of matter and the forces that govern their interactions.`;
    await be.send([s, "be9834"]);
    await be.receive();  
  }
  if (debug == 3) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // CLI input function
    const askQuestion = (query: string): Promise<string> => {
      return new Promise((resolve) => rl.question(query, resolve));
    };

    (async () => {
      try {
        const question = await askQuestion(`Hello, what would you like to say to BE?`);
        await ai.send([question]);
        await be.receive();

      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        // Close the readline interface
        rl.close();
      }
    })();
  }

})();