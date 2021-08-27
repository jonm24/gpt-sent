import { useState } from 'react';
import OpenAI from 'openai-api';
import './index.css';
import { instructSent } from './prompts/instructSent';
import { baseSent } from './prompts/baseSent';

const engines = {
  "curie": "Good at: Language translation, complex classification, text sentiment, summarization, Cost: $$$", 
  "davinci": "(Best Overall) Good at: Complex intent, cause and effect, summarization for audience, Cost: $$$$",
  "babbage": "Good at: Moderate classification, semantic search classification, Cost: $$", 
  "ada": "Good at: Parsing text, simple classification, address correction, keywords, Cost: $",
  "davinci-instruct-beta": "Base davinci but better at following instructions",
  "curie-instruct-beta": "Base curie but better at following instructions"
}

function App() {
  const [input, setInput] = useState("");
  const [inputEngine, setInputEngine] = useState("curie");
  const [output, setOutput] = useState({text: "", sent: "", model: ""});
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (input === "") {
      document.getElementById("input").style.border = "2px solid red";
      setTimeout(() => {
        document.getElementById("input").style.border = "1px solid black"; 
      }, 2000)
      return
    }
    setOutput({text: input, sent: "loading...", model: "loading..."})
    setInput("")
    try {
      const openai = new OpenAI(process.env.REACT_APP_OPENAI);
      const gptRes = await openai.complete({
        engine: inputEngine,
        prompt: inputEngine.includes("instruct") ? instructSent(input) : baseSent(input),
        temperature: 0.3,
        maxTokens: 60,
        topP: 1.0,
        frequencyPenalty: 0.5,
        presencePenalty: 0.0,
        stop: ["###"]
      })
      setOutput({text: input, sent: gptRes.data.choices[0].text, model: gptRes.data.model});
    } catch (err) {
      delete err.config
      delete err.stack
      setError(err)
    }
  }

  return (
    <div className="container">
      <h2 style={{padding: "0px 5px"}}>sentiment analysis using GPT-3</h2>
      <form className='form' onSubmit={handleSubmit}>
        <h3>enter a sentence:</h3>
        <input 
          id="input" 
          onChange={(e) => setInput(e.target.value)}
          value={input}
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
            <option value="davinci-instruct-beta">davinci-instruct-beta</option>
            <option value="curie-instruct-beta">curie-instruct-beta</option>
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
            <li className="results"><strong>sentence:</strong> {output.text}</li>
            <li className="results"><strong>sentiment:</strong> {output.sent}</li>
            <li className="results"><strong>model used:</strong> {output.model}</li>
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
