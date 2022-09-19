import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import socketClient from 'socket.io-client';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import DatePicker from 'react-date-picker';
const socketUrl = 'http://localhost:8085';
const apiUrl = 'http://localhost:8081'
let socket = socketClient(socketUrl);

const App = () => (
  <Router>
    <Navigation />
    <Content />
  </Router>
)

const Navigation = () => (
  <ul>
    <li>
      <Link to="/">Homepage</Link>
    </li>
    <li>
      <Link to="/iot">Filter Packets By Date & Time</Link>
    </li>
  </ul>
)

const Content = () => (
  <Routes>
    <Route exact path="/" element={<Homepage />} />
    <Route exact path="/iot/*" element={<IOT />} />
  </Routes>
)

const Homepage = () => {
  const [data, setData] = useState([]);
  const [serverPackets, setServerPackets] = useState([]);

  useEffect(() => {
    /**
     * For IOT Assignment API endpoint
     */
    getPackets();
    socket.on('new-packets', newPackets => {
      setData(prevVal => {
        if ((newPackets.length + prevVal.length) > 20) {
          prevVal = [...newPackets, ...prevVal];
          prevVal.splice(20);
        }
        return prevVal;
      })
    })


    /** For Posts API endpoint */
    // getPosts();
    // socket.on('server_data', msg => {
    //   setServerPackets(prevVal => {
    //     prevVal = [...prevVal, msg];
    //     return prevVal;
    //   });
    // });

    // socket.on('post-deleted', postId => {
    //   setServerPackets(prevVal => {
    //     const foundIndex = prevVal.findIndex(post => post._id === postId);
    //     if (foundIndex > -1) {
    //       prevVal.splice(foundIndex, 1);
    //     }
    //     const newVal = Object.assign([], prevVal);
    //     return newVal;
    //   });
    // })
  }, [])

  // const getPosts = () => {
  //   axios.get(apiUrl + '/posts', { withCredentials: true }).then(res => {
  //     setServerPackets(res.data.result);
  //   })
  // }

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

  // "userName": "user123",
  // "password": "Bye@12345",
  const handleLogin = () => {
    axios.post(apiUrl + '/auth/login', {
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

  const createPackets = () => {
    axios.post(`${apiUrl}/practice/random-values`, { count: 20 }, { withCredentials: true });
  }

  const getPackets = () => {
    axios.get(`${apiUrl}/practice/random-values?count=20`, { withCredentials: true }).then(res => {
      if (res.data && res.data.result && res.data.result.length) {
        setData(res.data.result);
      }
    })
  }

  return (
    <>
      {/* <header className="App-header"> */}
      {/* <br />
        <br />
        <button onClick={getData}>Get Data</button>
        <br />
        <button onClick={postData}>Post Data</button>
        <br />
        <button onClick={sendToServerUsingWS}>Send Data to Server using WS</button>
        Server Packets :
        <br />*/}
      <button onClick={handleLogin}>Login</button> &nbsp;&nbsp;
      <button onClick={handleRefreshToken}>Refresh Token</button> &nbsp;&nbsp;
      <button onClick={getData}>Get Data Using API</button>
      <button onClick={createPackets}>Create Packets</button>
      <br />
      <br />
      Response : {
        data.map((packet, index) => {
          return (
            <ul>
              <li>{index + 1}</li>{JSON.stringify(packet)}
            </ul>
          )
        })
      }
      {/* {
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
      } */}
      {/* </header> */}
    </>
  );
}

const IOT = () => {

  const [startDate, handleStartDate] = useState(new Date());
  const [endDate, handleEndDate] = useState(new Date());
  const [data, setData] = useState([]);

  const handleSubmit = () => {
    if (startDate && endDate) {
      setData([]);
      axios.get(`${apiUrl}/practice/random-values?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true }).then(res => {
        if (res.data && res.data.result && res.data.result.length) {
          setData(res.data.result);
        }
      })
    }
  }

  return (
    <>
      Start Date & Time<DatePicker onChange={handleStartDate} value={startDate} />&nbsp; &nbsp;
      End Date & Time<DatePicker onChange={handleEndDate} value={endDate} />&nbsp; &nbsp;
      <button onClick={handleSubmit}>Submit</button>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Battery Level</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {
            data.length ?
              data.map(packet => {
                return (
                  <tr>
                    <td>{packet.temperature}</td>
                    <td>{packet.batteryLevel}</td>
                    <td>{new Date(packet.timeStamp).toLocaleString()}</td>
                  </tr>
                )
              }) :
              'No records found'
          }
        </tbody>
      </table>
    </>
  )
}

export default App;
