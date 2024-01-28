import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';

const apiUrl = 'https://53a1-78-186-247-130.ngrok-free.app'

const StartStreamScreen = () => {
  const [number, setNumber] = useState('');

  const startCall = async () => {
    try {
      const postData = {
        "userId": "659a9b6817ca8c477b88b471",
        "from": "+18016580365",
        "to": "+905075458465"
      }
      const response = await axios.post(`${apiUrl}/calls/makeCall`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // call id kullanarak socket bağlantısı yap
      console.log(response.data.sid);
      connectToCallSocket(response.data.sid);
    } catch (error) {
      if (error.response.data.error?.code) {
        console.error('API Error:', error.response.data);
      }
      else {
        console.error('API Error:', error);
      }
    }

  };

  const connectToCallSocket = async (callId) => {
    try {
      const wssUrl = 'wss' + apiUrl.split('https')[1] + '/callSocket?callId=' + callId;
      console.log('wssUrl: ', wssUrl);
      // Connect to the WebSocket server
      const ws = new WebSocket(wssUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        console.log('message came')
      };

    } catch (error) {
      console.error('Call socket connection error:', error);
    }

  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Start Call Screen</Text>
      <Button title="Start Call" onPress={startCall} />
    </View>
  );
};

export default StartStreamScreen;
