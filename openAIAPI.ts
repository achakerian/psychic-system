import * as dotenv from "dotenv";
dotenv.config();

import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

// question structure
const Question = z.object({
  question_text: z.string(),
});

// idk copied off Deb
const Category = z.object({
  category_name: z.string(),
  questions: z.array(Question),
});

// zod API response: array of categories
const QuestionResponse = z.object({
  categories: z.array(Category),
});

// env API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function to prompt OpenAI and parse the response using Zod
async function promptUUID(prompt: string, submission: string, uuid: string): Promise<[string, string]> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Use the appropriate model
      messages: [{ role: "user", content: prompt }, { role: "user", content: submission }],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    const responseText = response.choices[0].message.content;
    if (responseText != null) return [responseText, uuid];
    else return ["response error", uuid];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { promptUUID };


// for debugging
const debug = false;
if (debug) {
  (async () => {
    try {
      const response = await promptUUID(
        // student submission , prompt used, UUID
       "Medicine", "please provide three questions to assess my understanding of the text submission", "1324"
      );
      if (response) console.log("The response is: ", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
}

