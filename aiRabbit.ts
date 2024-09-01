import { promptUUID } from "./openAIAPI";
import { Message } from "./rabbitMQ";
import { pdfToText } from "./extractPDF";
const m = new Message("AItoBE", "BEtoAI");

async function receiveProcessRespond() {
  const msg = await m.receive();
  if (msg[0].toString() == "error") {
    console.log("aiRabbit: message not received");
    return;
  }
  console.log(` [x] aiRabbit Received '${msg[1].toString()}'`);
  // call openAI API to generate questions
  const response = await promptUUID(
    "can you write ten ",
    msg[0].toString(),
    msg[1].toString()
  );

  console.log(` [x] aiRabbit Replying to UUID:`, response[1]); // '${reply}'`);
  m.send(response);
}

let debug = 2;
if (debug == 1) { //"testOpenAIAPI"
  // sends prompt and UUID to openAIAPI.ts
  console.log("aiRabbit debug active: check openAI API");
  (async () => {
    try {
      const p = "ask me questions to test my knowledge of the following input";
      const s: string = `
Photosynthesis is a fundamental process through which green plants, algae, and some bacteria convert light energy into chemical energy, stored in glucose molecules. This process occurs primarily in the chloroplasts of plant cells, which contain the pigment chlorophyll. Chlorophyll absorbs light energy, usually from the sun, and uses it to drive the chemical reactions that transform carbon dioxide and water into glucose and oxygen. The general equation for photosynthesis is 6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ + 6 O₂, illustrating how carbon dioxide and water are converted into glucose and oxygen through the energy of sunlight.
Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle. In the light-dependent reactions, which occur in the thylakoid membranes of the chloroplasts, sunlight is absorbed by chlorophyll and other pigments. This light energy is used to split water molecules, releasing oxygen and transferring energy to molecules of ATP and NADPH. These energy-rich molecules then enter the Calvin cycle, which takes place in the stroma of the chloroplasts. During the Calvin cycle, ATP and NADPH are used to convert carbon dioxide into glucose through a series of enzymatic reactions.
The efficiency of photosynthesis is crucial for the growth and survival of plants, as it provides the primary source of energy and organic matter. In addition to its role in plant metabolism, photosynthesis has significant implications for the environment. By absorbing carbon dioxide and releasing oxygen, photosynthesis helps regulate atmospheric carbon levels and supports the oxygenation of the Earth's atmosphere. Understanding the mechanisms and efficiency of photosynthesis can contribute to advances in agriculture, bioenergy, and environmental conservation.`;
      const u = "aiRabbit1234";
      const response = await promptUUID(p, s, u);
      console.log("Call OpenAI API", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
} else if (debug == 2) {//"testExtractPDF"
  // sends prompt and UUID to openAIAPI.ts
  console.log("aiRabbit debug active: check ExtractPDF");
  (async () => {
    try {
      const p = "ask me questions to test my knowledge of the following input";
      const s: string = await pdfToText("./PDFs/example.pdf").then();
      const u = "aiRabbit1234";
      const response = await promptUUID(p, s, u);
      console.log("Call OpenAI API", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
} else {
  console.log("no debugger");
}