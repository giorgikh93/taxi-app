import io from 'socket.io-client';


export const socket = ()=>{
    const socketConnection = io('http://192.168.0.103:3000')
    return socketConnection

  }