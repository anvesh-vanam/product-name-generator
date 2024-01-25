import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
console.log(import.meta.env.VITE_SOME_KEY);
console.log(API_KEY);
function App() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loader, setLoader] = useState(false);

  async function callOpenAIAPI() {
    console.log("Calling the OpenAI API");
    setLoader(true);

    try {
      const APIBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a product description, and your task is to generate product names.",
          },
          {
            role: "user",
            content: `Product description: ${prompt}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 64,
        top_p: 1,
      };

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          body: JSON.stringify(APIBody),
        }
      );

      const data = await response.json();
      console.log(data);
      setOutput(data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    } finally {
      setLoader(false);
    }
  }

  console.log(prompt);
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="flex flex-col gap-5">
        <p className=" text-3xl font-bold">Product name generator</p>
        <textarea
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your product description and seed words here"
          cols={50}
          rows={10}
          className="border border-slate-500 p-2"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <button
          onClick={callOpenAIAPI}
          className="bg-blue-700 text-white px-3 py-2 rounded-md "
        >
          Submit
        </button>
        <p className="text-lg font-semibold mt-10">AI output:</p>

        {loader ? "Loading..." : output !== "" ? <h3> {output}</h3> : null}
      </div>
    </div>
  );
}

export default App;
