import express = require("express");
import Web3 = require("web3");
const app = express();

function getWeb3() {
  return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
app.use("/request-ether/:address", async (req, res) => {
  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();
  console.log('Sending ether to', req.params.address);
  await web3.eth.sendTransaction({
    value: web3.utils.toWei("1", "ether"),
    to: req.params.address,
    from: accounts[0]
  });
});

app.listen(5555, () => {
  console.log('Subspace api listening on port 5555');
});
