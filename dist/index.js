import { JsonRpcProvider } from "ethers";
import "dotenv/config";
console.log(process.env.RPC_url);
const provider = new JsonRpcProvider(process.env.RPC_url);
//# sourceMappingURL=index.js.map