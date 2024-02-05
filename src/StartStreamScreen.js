import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import LiveAudioStream from 'react-native-live-audio-stream';

const apiUrl = 'https://4052-212-253-203-46.ngrok-free.app'

const StartStreamScreen = () => {
  const [number, setNumber] = useState('');

  const startCall = async () => {
    try {
      const postData = {
        "userId": "659a9b6817ca8c477b88b471",
        "from": "+18016580365",
        "to": "+9059931999222111"
      }
      const response = await axios.post(`${apiUrl}/calls/makeCall`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // call id kullanarak socket bağlantısı yap
      console.log(response.data.sid);
      // response başarılı ise socket bağlantısı başlasın
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
        console.log('Message came:', event.data);
        // Handle incoming messages as needed
        const message = JSON.parse(event.data);
        // Example: Handle 'ringing' event
        if (message.event === 'ringing') {
            console.log('Ringing event received');
            // Perform actions specific to 'ringing' event
        } else if (message.event === 'busy') {
            // TODO: play busy sound
            console.log('Busy event received');
            ws.close();
        }
        else if (message.event === 'no-answer') {
          console.log('Busy event received');
          ws.close();
      }
      };

      


      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Handle WebSocket errors
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        // Handle WebSocket closure
      };

      

    } catch (error) {
      console.error('Call socket connection error:', error);
    }


  };

  const startAudioInput = async () => {
    const options = {
      sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 4,     // android only (see below)
      bufferSize: 4096    // default is 2048
    };

    LiveAudioStream.init(options);
    LiveAudioStream.on('data', data => {
      console.log('data:', data);
    });

    LiveAudioStream.start();

    LiveAudioStream.stop();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Start Call Screen</Text>
      <Button title="Start Call" onPress={startCall} />
      <Button title="Start audio" onPress={startAudioInput} />

    </View>
  );
};

export default StartStreamScreen;
