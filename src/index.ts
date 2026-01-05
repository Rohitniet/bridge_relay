import { JsonRpcProvider } from "ethers";
import "dotenv/config";
import { Contract } from "ethers";
import { ABI_1 } from "./lock_1_abi.js";
import type { Addressable } from "ethers";
import { ABI_2 } from "./lock_2_abi.js";



console.log(process.env.RPC_url)

const provider = new JsonRpcProvider(process.env.RPC_url);

if (process.env.lock_1 == undefined || process.env.lock_2==undefined) {
  throw new Error("contract address not defined");
}
  const lock1 = new Contract(process.env.lock_1 , ABI_1, provider); 
  const lock2 = new Contract(process.env.lock_2 , ABI_2, provider); 

  lock1.on("depositevent",async (from,to ,amount)=>{

    console.log("deposit by user "+from+" of "+ amount);
    

  })