import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import socketClient from 'socket.io-client';
const wsURL = 'ws://localhost:8085';

function App() {
  const [data, setData] = useState('');
  const [token, setToken] = useState('');
  const [serverPackets, setServerPackets] = useState('');
  const socket = useRef();

  // useEffect(() => {
  //   socket.current = socketClient(wsURL);
  //   socket.current.on('connect', () => {
  //     const connectionMsg = `Connected to Web socket at: ${wsURL}`;
  //     console.log(connectionMsg);
  //     setData(connectionMsg)
  //   });
  //   socket.current.on('server_data', msg => {
  //     setServerPackets(prevVal => {
  //       prevVal = [...prevVal, msg];
  //       return prevVal;
  //     });
  //   })
  // }, [])  

  // //button to show all movies having IMDB rating > 8
  // const postData = async () => {
  //   const res = await axios.post('http://127.0.0.1:8081/items', {
  //     "name": "My Soap",
  //     "company": "ABC",
  //     "category": "fmcg",
  //     "type": "sanitary",
  //     "quantity": 100
  //   });
  //   if (res.data) {
  //     setData(res.data);
  //   }
  // }

  // const sendToServerUsingWS = () => {
  //   socket.current.emit('client_evt', { interval: 2000, date: new Date(), origin: window.location.origin });
  // }

  const handleLogin = () => {
    axios.post('http://localhost:8081/auth/login', {
      "userName": "jitendra123",
      "password": "Heyy@123"
    }, { withCredentials: true }).then(res => {
      setData(res.data);
      // if (res.data && res.data.access_token) {
      //   indexedDB.open('access_token');
      //   indexedDB.access_token = res.data.access_token;
      // }
    })
  }

  const getData = () => {
    setData([]);
    axios.get('http://127.0.0.1:8081/items', { withCredentials: true }).then(res => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  // axios.interceptors.request.use(config => {
  //   if (config.url !== 'http://localhost:8081/auth/login') {
  //     config.headers['x-access-token'] = indexedDB.access_token;
  //   }
  //   return config;
  // })

  return (
    <div className="App">
      <header className="App-header">
        Response : {JSON.stringify(data)}
        {/* <br />
        <br />
        <button onClick={getData}>Get Data</button>
        <br />
        <button onClick={postData}>Post Data</button>
        <br />
        <button onClick={sendToServerUsingWS}>Send Data to Server using WS</button>
        Server Packets :
        <br />
        {JSON.stringify(serverPackets)} */}
        <button onClick={handleLogin}>Login</button>
        <br />
        <button onClick={getData}>Get Data</button>
      </header>
    </div>
  );
}

export default App;
