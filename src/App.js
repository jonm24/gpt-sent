import { useState } from 'react';
import OpenAI from 'openai-api';
import './index.css';

const openai = new OpenAI(process.env.REACT_APP_OPENAI);

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    document.getElementById("input").value = "";
    setOutput("loading...")

    const gptRes = await openai.complete({
      engine: "davinci",
      prompt: `This is a tweet sentiment classifier\n\n\nTweet: "I loved the new Batman movie!"\nSentiment: Positive\n###\nTweet: "I hate it when my phone battery dies."\nSentiment: Negative\n###\nTweet: "My day has been 👍"\nSentiment: Positive\n###\nTweet: "This is the link to the article"\nSentiment: Neutral\n###\nTweet: "${input}"\nSentiment:`,
      temperature: 0.3,
      maxTokens: 60,
      topP: 1.0,
      frequencyPenalty: 0.5,
      presencePenalty: 0.0,
      stop: ["###"]
    })
    setOutput(gptRes.data.choices[0].text);
  }

  function handleChange(e) {
    setInput(e.target.value)
    if (output !== "") {
      setOutput("");
    }
  }

  return (
    <div className="container">
      <h2>sentiment analysis using GPT-3</h2>
      <form className='form' onSubmit={handleSubmit}>
        <h3>enter a sentence:</h3>
        <input 
          id="input" 
          onChange={(e) => handleChange(e)}
          className="input">
        </input>
        <button 
          className="button" 
          type="submit">
          <strong>analyze</strong>
        </button>
      </form>
      <div style={{marginBottom: "10px", alignSelf: "flex-start"}}><strong>sentence:</strong> {input}</div>
      <div style={{alignSelf: "flex-start"}}><strong>sentiment:</strong> {output}</div>
    </div>
  );
}

export default App;
