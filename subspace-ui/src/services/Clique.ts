import Web3 = require("web3");
import IdIterator = require("json-rpc-random-id");
const createRandomId = IdIterator();

export class CliqueService {
  constructor(private web3: Web3) {}

  public getSigners() {
    return this.callAsync("clique_getSigners");
  }
  public getProposals() {
    return this.callAsync("clique_getProposals");
  }

  public propose(signer: string) {
    return this.callAsync("clique_propose", [signer]);
  }

  public discard(signer: string) {
    return this.callAsync("clique_discard", [signer]);
  }

  private callAsync(method: string, params: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.web3.currentProvider.send(
          {
            method,
            jsonrpc: "2.0",
            params: [],
            id: createRandomId()
          },
          (err, resp) => {
            if (err) {
              console.error(method, err);
              reject(err);
            } else {
              resolve(resp.result);
            }
          }
        );
      } catch (err) {
        console.error(method, err);
        reject(err);
      }
    });
  }
}
