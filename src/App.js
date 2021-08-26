import { useState } from 'react';
import OpenAI from 'openai-api';
import './index.css';

const engines = {
  "curie": "Good at: Language translation, complex classification, text sentiment, summarization, Cost: $$$", 
  "davinci": "(Best Overall) Good at: Complex intent, cause and effect, summarization for audience, Cost: $$$$",
  "babbage": "Good at: Moderate classification, semantic search classification, Cost: $$", 
  "ada": "Good at: Parsing text, simple classification, address correction, keywords, Cost: $"
}
const openai = new OpenAI(process.env.REACT_APP_OPENAI);

function App() {
  const [input, setInput] = useState("");
  const [inputEngine, setInputEngine] = useState("curie");
  const [output, setOutput] = useState("");
  const [outputEngine, setOutputEngine] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    document.getElementById("input").value = "";
    setOutput("loading...")

    try {
      const gptRes = await openai.complete({
        engine: inputEngine,
        prompt: `This is a tweet sentiment classifier\n\n\nTweet: "I loved the new Batman movie!"\nSentiment: Positive\n###\nTweet: "I hate it when my phone battery dies."\nSentiment: Negative\n###\nTweet: "My day has been 👍"\nSentiment: Positive\n###\nTweet: "This is the link to the article"\nSentiment: Neutral\n###\nTweet: "${input}"\nSentiment:`,
        temperature: 0.3,
        maxTokens: 60,
        topP: 1.0,
        frequencyPenalty: 0.5,
        presencePenalty: 0.0,
        stop: ["###"]
      })
      setOutput(gptRes.data.choices[0].text);
      setOutputEngine(gptRes.data.model);
    } catch (err) {
      delete err.config
      delete err.stack
      setError(err)
    }
  }

  function handleChange(e) {
    setInput(e.target.value)
    if (output !== "") {
      setOutput("");
    }
    if (outputEngine !== "") {
      setOutputEngine("");
    }
  }

  return (
    <div className="container">
      <h2 style={{padding: "0px 5px"}}>sentiment analysis using GPT-3</h2>
      <form className='form' onSubmit={handleSubmit}>
        <h3>enter a sentence:</h3>
        <input 
          id="input" 
          onChange={(e) => handleChange(e)}
          className="input">
        </input>
        <div style={{display: "flex", flexWrap: "wrap", alignItems: "baseline"}}>
          <select 
            style={{marginBottom: "10px", padding: "5px 10px"}}
            defaultValue="curie"
            onChange={(e) => setInputEngine(e.target.value)}>
            <option value="curie">curie</option>
            <option value="davinci">davinci</option>
            <option value="babbage">babbage</option>
            <option value="ada">ada</option>
          </select>
          <span style={{margin: "0px 0px 10px 10px", fontSize: '11px'}}>{engines[inputEngine]}</span>
        </div>
        <button 
          className="button" 
          type="submit">
          <strong>analyze</strong>
        </button>
      </form>
      { 
        !error ?  // if no error
        <div style={{alignSelf: "flex-start"}}>
          <div><strong>results:</strong></div>
          <ul>
            <li className="results"><strong>sentence:</strong> {input}</li>
            <li className="results"><strong>sentiment:</strong> {output}</li>
            <li className="results"><strong>model used:</strong> {outputEngine}</li>
          </ul>
        </div>
        : // catch error
        <pre 
          style={{width: "90%", whiteSpace: "pre-wrap", alignSelf: "flex-start"}}>
          {JSON.stringify(error, null, 2)}
        </pre>
      }
    </div>
  );
}

export default App;
