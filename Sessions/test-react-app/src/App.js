import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');

  const getData = () => {
    axios.get('http://127.0.0.1:8081/items/101').then(res => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  //button to show all movies having IMDB rating > 8

  const postData = async () => {
    const res = await axios.post('http://127.0.0.1:8081/items', {
      "name": "My Soap",
      "company": "ABC",
      "category": "fmcg",
      "type": "sanitary",
      "quantity": 100
    });
    if (res.data) {
      setData(res.data);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Response : {JSON.stringify(data)}
        <br />
        <br />
        <button onClick={getData}>Get Data</button>
        <br />
        <button onClick={postData}>Post Data</button>
      </header>
    </div>
  );
}

export default App;
