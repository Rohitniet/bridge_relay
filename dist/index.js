import { JsonRpcProvider, parseUnits } from "ethers";
import "dotenv/config";
import { Contract } from "ethers";
import { ABI_1 } from "./lock_1_abi.js";
import { ABI_2 } from "./lock_2_abi.js";
import { Wallet } from "ethers";
import { JsonRpcApiProvider } from "ethers";
const provider = new JsonRpcProvider(process.env.RPC_url);
const relayer = new Wallet(process.env.Relayer_private, provider);
if (process.env.lock_1 == undefined || process.env.lock_2 == undefined) {
    throw new Error("contract address not defined");
}
const lock1listen = new Contract(process.env.lock_1, ABI_1, provider);
const lock1write = new Contract(process.env.lock_1, ABI_1, relayer);
const lock2listen = new Contract(process.env.lock_2, ABI_2, provider);
const lock2write = new Contract(process.env.lock_2, ABI_2, relayer);
lock1listen.on("depositevent", async (from, to, amount) => {
    console.log("deposit by user " + from + " of " + amount);
    //@ts-ignore
    const tx = await lock2write.locked_otherside(from, amount, {
        gasLimit: 300_000,
        maxFeePerGas: parseUnits("30", "gwei"),
        maxPriorityFeePerGas: parseUnits("2", "gwei"),
    });
    console.log("Wating for transaction... " + tx.hash);
    await tx.wait();
    console.log("relaying succesful");
});
lock2listen.on("burn_event", async (id, amount) => {
    console.log("amount burn on chain2 of id" + id + "and amount " + amount);
    //@ts-ignore
    const tx = await lock1write.burn_on_otherside(id, amount, {
        gasLimit: 300_000,
        maxFeePerGas: parseUnits("30", "gwei"),
        maxPriorityFeePerGas: parseUnits("2", "gwei"),
    });
    console.log("Wating for transaction... " + tx.hash);
    await tx.wait();
    console.log("relaying succesful");
});
//# sourceMappingURL=index.js.map