import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import socketClient from 'socket.io-client';
const socketUrl = 'http://localhost:8085';
const apiUrl = 'http://localhost:8081'
let socket = socketClient(socketUrl);

function App() {
  const [data, setData] = useState('');
  const [serverPackets, setServerPackets] = useState([]);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getPosts();
    socket.on('server_data', msg => {
      setServerPackets(prevVal => {
        prevVal = [...prevVal, msg];
        return prevVal;
      });
    });

    socket.on('post-deleted', postId => {
      setServerPackets(prevVal => {
        const foundIndex = prevVal.findIndex(post => post._id === postId);
        if (foundIndex > -1) {
          prevVal.splice(foundIndex, 1);
        }
        const newVal = Object.assign([], prevVal);
        return newVal;
      });
    })
  }, [])

  const getPosts = () => {
    axios.get(apiUrl + '/posts', { withCredentials: true }).then(res => {
      setServerPackets(res.data.result);
    })
  }

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

  //"userName": "jitendra123",
  // "password": "Heyy@123"

  // "userName": "user123",
  // "password": "Bye@12345",
  const handleLogin = () => {
    axios.post(apiUrl + '/auth/login', {
      "userName": userName,
      "password": password
    }, { withCredentials: true }).then(res => {
      setData(res.data);
      setIsLoggedIn(true);
      // if (res.data && res.data.access_token) {
      //   indexedDB.open('access_token');
      //   indexedDB.access_token = res.data.access_token;
      // }
    })
  }

  const handleRefreshToken = () => {
    axios.get('http://localhost:8081/auth/refresh', { withCredentials: true }).then(res => {
      // setData(res.data);
      // if (res.data && res.data.access_token) {
      //   indexedDB.open('access_token');
      //   indexedDB.access_token = res.data.access_token;
      // }
    })
  }

  const getData = () => {
    setData([]);
    // axios.get('http://localhost:8081/items', { withCredentials: true }).then(res => {
    //   if (res.data) {
    //     setData(res.data);
    //   }
    // });
    axios.get('http://localhost:8081/practice/getBulkData', { withCredentials: true }).then(res => {
      if (res.data) {
        setData(res.data);
      }
    });
  }

  // axios.interceptors.request.use(config => {
  //   // if (config.url !== 'http://localhost:8081/auth/login') {
  //   //   config.headers['x-access-token'] = indexedDB.access_token;
  //   // }
  //   return config;
  // })

  return (
    <>
      {/* <header className="App-header"> */}
      Response : {JSON.stringify(data)}
      {/* <br />
        <br />
        <button onClick={getData}>Get Data</button>
        <br />
        <button onClick={postData}>Post Data</button>
        <br />
        <button onClick={sendToServerUsingWS}>Send Data to Server using WS</button>
        Server Packets :
        <br />*/}
      {
        isLoggedIn ? '' :
          <>
            Username<input type={'text'} onChange={(e) => {
              setUserName(e.target.value);
            }} />
            Password<input type={'password'} onChange={(e) => {
              setPassword(e.target.value);
              console.log(e.target.value);
            }} />
            <button onClick={handleLogin}>Login</button> &nbsp;&nbsp;
          </>
      }
      <button onClick={handleRefreshToken}>Refresh Token</button> &nbsp;&nbsp;
      <button onClick={getData}>Get Data Using API</button>
      <br />
      <br />
      {
        serverPackets.map(post => {
          return (
            <div id={post._id}>
              <span>
                <b>Username:</b> {post.userName}&nbsp;&nbsp;
                <b>Time:</b> {new Date(post.updated).toLocaleString()}
              </span>
              <p>{post.comment}</p>
              <hr></hr>
            </div>
          )
        })
      }
      {/* </header> */}
    </>
  );
}

export default App;
