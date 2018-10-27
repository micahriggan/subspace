import * as React from "react";
import Web3 = require("web3");
import { TransactionObject } from "web3/eth/types";

declare global {
  interface Window {
    web3: Web3;
  }
}
export class Web3Component<P = {}, S = {}, SS = any> extends React.Component<
  P,
  S,
  SS
> {
  private web3: Web3;
  private wss: Web3;

  public getWeb3() {
    if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    }
    if (!this.web3) {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
    }
    return this.web3;
  }

  public getWss() {
    if (!this.wss) {
      this.wss = new Web3(
        new Web3.providers.WebsocketProvider("ws://localhost:8545")
      );
    }
    return this.wss;
  }

  public getAccounts() {
    return this.getWeb3().eth.getAccounts();
  }

  public async *web3Iterable<X>(
    fn: (...args: any[]) => TransactionObject<X>,
    stop: any
  ) {
    let itr = 0;
    let value = await fn(itr).call();
    while (value !== stop) {
      yield value;
      itr++;
      value = await fn(itr).call();
    }
  }
}
