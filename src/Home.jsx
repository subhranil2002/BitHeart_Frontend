import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {
  const [heartRate, setHeartRate] = useState(0);
  const [bloodPressure, setBloodPressure] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:3000');

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        console.log('Received data:', event.data);
        const parsedData = parseInt(event.data, 10);
        if (!isNaN(parsedData)) {
          document.getElementById("stepsData").innerHTML = parsedData
          setCalories(parsedData * 0.033);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed, retrying...');
        setTimeout(connectWebSocket, 1000); 
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };

      return () => {
        socket.close();
      };
    };

    const cleanupWebSocket = connectWebSocket();

    axios.get('http://localhost:3000/api/data')
      .then(response => {
        // setSteps(response.data.message);
        document.getElementById("stepsData").innerHTML = response.data.message;
        
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });

    function generateRandomValue() {
      return Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    }

    const updateBeatsPerMinute = () => {
      setHeartRate(generateRandomValue());
    };

    updateBeatsPerMinute();

    const heartRateInterval = setInterval(() => {
      updateBeatsPerMinute();
    }, 5000);

    function generateRandomValue1() {
      return Math.floor(Math.random() * (82 - 70)) + 70;
    }

    const updateBP = () => {
      setBloodPressure(generateRandomValue1());
    };

    const bloodPressureInterval = setInterval(() => {
      updateBP();
    }, 2000);

    const updateChartData = () => {
      setChartData((prevData) => {
        const newData = [...prevData, { name: new Date().toLocaleTimeString(), heartRate: generateRandomValue(), bloodPressure: generateRandomValue1(), calories, steps }];
        return newData.slice(-7); 
      });
    };

    const chartDataInterval = setInterval(updateChartData, 2000);

    // Initial update
    updateChartData();

    return () => {
      clearInterval(heartRateInterval);
      clearInterval(bloodPressureInterval);
      clearInterval(chartDataInterval);
      cleanupWebSocket();
    };
  }, []);

  return (
    <main className='main-container' style={{ backgroundImage: "url('/images/grad1.png')", backgroundSize: "cover" }}>
      <div className='main-title'>
        <h3><i className="fa-solid fa-list" style={{ color: "#2862FF" }}></i> &nbsp;Dashboard </h3>
      </div>
      <h7 style={{ color: "darkgrey" }}>Real Time data from BitHeat Wearable device.</h7>
      <div className='main-cards'>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h5 style={{ color: 'white' }}> <i className="fa-solid fa-heart-pulse"></i> &nbsp;Heart Rate</h5>
          </div>
          <h1 id='beatsPerMinuteElement'>{heartRate}</h1>
          <h7>Beats per minute</h7>
        </div>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h5 style={{ color: 'white' }}> <i className="fa-solid fa-chart-simple"></i> &nbsp;Blood Pressure</h5>
          </div>
          <h1 id='bp'>{bloodPressure}</h1>
          <h5>mm Hg</h5>
        </div>
        <div className='card' style={{ borderRadius: '10px', backgroundColor: "#8885D8" }}>
          <div className='card-inner'>
            <h5 style={{ color: 'white' }}> <i className="fa-solid fa-shoe-prints"></i> &nbsp; Steps</h5>
          </div>
          <h1 id='stepsData'></h1>
          <h7>Number of Steps</h7>
        </div>
        <div className='card' style={{ borderRadius: '10px', backgroundColor: "#FDDF8E" }}>
          <div className='card-inner'>
            <h5 style={{ color: 'white' }}> <i className="fa-solid fa-notes-medical"></i> &nbsp;Calories</h5>
          </div>
          <h1>442.2 {calories.toFixed(2)}</h1>
          <h7>kilo joules</h7>
        </div>
      </div>
      <br />
      <h3> <i className="fa-solid fa-chart-line" style={{ color: "#2862FF" }}></i> &nbsp;Your Health Data Chart </h3>
      <h7 style={{ color: "darkgrey" }}>Real Time Health data plotted in a graph for deep analysis.</h7>
      <div className='charts'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='heartRate' fill='#8884d8' />
            <Bar dataKey='bloodPressure' fill='#82ca9d' />
            <Bar dataKey='calories' fill='#ffc658' />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='heartRate' stroke='#8884d8' activeDot={{ r: 8 }} />
            <Line type='monotone' dataKey='bloodPressure' stroke='#82ca9d' />
            <Line type='monotone' dataKey='calories' stroke='#ffc658' />
          </LineChart>
        </ResponsiveContainer>

        <div className='healthStatus my-2'>
          <h3><i className="fa-solid fa-hand-holding-droplet" style={{ color: "#2862FF" }}></i>&nbsp; Check your Health Status</h3>
          <h7 style={{ color: "darkgrey" }}>Analayse your Health Status in with respect to your real time data.</h7>
          <a href='http://127.0.0.1:3000/'>
            <button type="button" className="btn my-3 mx-6" style={{ backgroundColor: "#2862FF", borderRadius: "20px", color: "white" }}>Check Health</button>
          </a>
        </div>
        <div className='heartStatus'>
          <h3><i className="fa-solid fa-hand-holding-heart" style={{ color: "#2862FF" }}></i> &nbsp; Check your Heart Status</h3>
          <h7 style={{ color: "darkgrey" }}>Predict your Heart Conditions with our trained AI ML Models.</h7>
          <a href='http://127.0.0.1:5000/'>
            <button type="button" className="btn my-3 mx-6" style={{ backgroundColor: "#2862FF", borderRadius: "20px", color: "white" }}>Check Heart Conditions</button>
          </a>
        </div>
      </div>
    </main>
  );
}

export default Home;