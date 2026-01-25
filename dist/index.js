import { id, JsonRpcProvider, parseUnits } from "ethers";
import "dotenv/config";
import { Contract } from "ethers";
import { ABI_1 } from "./lock_1_abi.js";
import { ABI_2 } from "./lock_2_abi.js";
import { Wallet } from "ethers";
import { JsonRpcApiProvider } from "ethers";
import { WebSocketProvider } from "ethers";
console.log(process.env.WS_RPC_URL);
const wsProvider = new WebSocketProvider(process.env.WS_RPC_URL);
const httpProvider = new JsonRpcProvider(process.env.RPC_url);
const relayer = new Wallet(process.env.Relayer_private, httpProvider);
const lock1listen = new Contract(process.env.lock_1, ABI_1, wsProvider);
const lock2listen = new Contract(process.env.lock_2, ABI_2, wsProvider);
const lock1write = new Contract(process.env.lock_1, ABI_1, relayer);
const lock2write = new Contract(process.env.lock_2, ABI_2, relayer);
lock1listen.on("depositevent", async (from, to, amount) => {
    console.log("deposit by user " + from + " of " + amount);
    try {
        //@ts-ignore
        const tx = await lock2write.locked_otherside(from, amount);
        console.log("TX SENT");
        console.log({
            hash: tx.hash,
            nonce: tx.nonce,
            gasLimit: tx.gasLimit?.toString(),
            maxFeePerGas: tx.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
        });
        console.log("Relaying tx:", tx.hash);
        await tx.wait(1);
        console.log("Relay successful");
    }
    catch (e) {
        console.error(e);
    }
});
lock2listen.on("burn_event", async (id, amount) => {
    console.log("user " + id + " is buring " + amount);
    try {
        //@ts-ignore
        const tx = await lock1write.burn_on_otherside(id, amount);
        console.log("tx send");
        console.log("burning hash : " + tx.hash);
        await tx.wait(1);
        console.log("buring succesful");
    }
    catch (e) {
        console.log(e);
    }
});
// const provider = new JsonRpcProvider(process.env.RPC_url);
// const  relayer= new Wallet(process.env.Relayer_private as string,provider);
// if (process.env.lock_1 == undefined || process.env.lock_2==undefined) {
//   throw new Error("contract address not defined");
// }
//   const lock1listen = new Contract(process.env.lock_1 , ABI_1, provider); 
//   const lock1write = new Contract(process.env.lock_1 , ABI_1, relayer); 
//   const lock2listen = new Contract(process.env.lock_2 , ABI_2, provider); 
//   const lock2write = new Contract(process.env.lock_2 , ABI_2, relayer); 
// lock1listen.on("depositevent",async (from,to ,amount)=>{
//   console.log("deposit by user "+from+" of "+ amount);
//   //@ts-ignore
//   const tx = await lock2write.locked_otherside(from, amount, {
//     gasLimit: 300_000,
//     maxFeePerGas: parseUnits("30", "gwei"),
//     maxPriorityFeePerGas: parseUnits("2", "gwei"),
//   });
//   console.log("Wating for transaction... "+ tx.hash);
//   await tx.wait();
//   console.log("relaying succesful");
// })
// lock2listen.on("burn_event",async(id,amount)=>{
//   console.log("amount burn on chain2 of id"+id+"and amount "+amount);
//   //@ts-ignore
//   const tx = await lock1write.burn_on_otherside(id, amount, {
//     gasLimit: 300_000,
//     maxFeePerGas: parseUnits("30", "gwei"),
//     maxPriorityFeePerGas: parseUnits("2", "gwei"),
//   });
//     console.log("Wating for transaction... " + tx.hash);
//     await tx.wait();
//     console.log("relaying succesful");
// });
//# sourceMappingURL=index.js.map