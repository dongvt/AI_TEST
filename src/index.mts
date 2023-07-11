import * as fs from "fs";
import * as dotenv from "dotenv";

import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  organization: "org-TS1DDlLGqDlOaf1fIQWiKicb",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function readDocument(path: string): Promise<string> {
  const data = fs.readFileSync(path, "utf-8");
  return data;
}

async function queryAI(prompt: string): Promise<any> {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 200,
  });

  return {
    message: response.data.choices[0].text!.trim(),
    prompt_tokens: response.data.usage!.prompt_tokens,
    completion_tokens: response.data.usage!.completion_tokens,
    total_tokens: response.data.usage!.total_tokens,
  };
}

//Driver function
(async () => {
  // Concatenate the documents content
  let allDocsContent = "";
  allDocsContent += await readDocument("./assets/doc1.txt");
  //allDocsContent += ' ' + await readDocument('./doc2.txt');

  const prompt =
    "The documents contain the following information: " +
    allDocsContent +
    "\n\n";
  const response = await queryAI(prompt);

  console.log(response.message);
  console.log(response.total_tokens);
})();
