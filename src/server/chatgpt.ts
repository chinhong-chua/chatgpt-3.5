import { ChatMessage } from "../types/ChatMessage";
import axios, { AxiosError } from "axios";

// const configuration = new Configuration({
//   apiKey: import.meta.env.VITE_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const url = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const model = "gpt-3.5-turbo";

export async function chat(messages: ChatMessage[]) {

  const response = await axios({
    url,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      model,
      messages,
      temperature: 0.5,
      max_tokens: 200,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    },
  });

  return response.data.choices[0].message;
  //   console.log(response.data.choices[0].message);
}

// axios.defaults.headers.post["Content-Type"] = "application/json";

// export async function chat(messageList: ChatMessage[]) {
//   try {
//     const completion = await axios({
//       url: "https://api.openai.com/v1/completions",
//       method: "post",
//       headers: {
//         "Content-Type" :"application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       data: {
//         model,
//         messages: messageList,
//       },
//     });
//     return {
//       status: "success",
//       data: completion.data.choices[0].message,
//     };
//   } catch (error: any) {
//     return {
//       status: "error",
//       message: error.response
//     };
//   }
// }
