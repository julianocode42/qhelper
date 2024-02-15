#!/usr/bin/env node

import Websocket from "ws";
import axios from "axios";
import { spawn } from "child_process";

async function main() {
  spawn("node",["--inspect-brk" ,"examples/sum.js"])

  await new Promise((res, rej)=> {
    setTimeout(res, 10000)
  })
  
  let res = await axios.get("http://127.0.0.1:9229/json");

  let endpoint = res.data[0].webSocketDebuggerUrl;
  console.log(endpoint);

  let ws = new Websocket(endpoint, { perMessageDeflate: false });
  await new Promise((resolve) => ws.once("open", resolve));

  console.log("connected!");

  ws.on("message", (msg) => console.log(msg.toString()));

  console.log("Sending Debugger.resume");
  ws.send(JSON.stringify({
    id: 1,
    method: 'Debugger.enable'
  }));
}

main();
