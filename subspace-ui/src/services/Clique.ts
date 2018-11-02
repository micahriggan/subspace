import Web3 = require("web3");
import IdIterator = require("json-rpc-random-id");
const createRandomId = IdIterator();

export class CliqueService {
  constructor(private web3: Web3) {}

  public getSigners() {
    return this.callAsync("clique_getSigners");
  }
  public getProposals() {
    return this.callAsync("clique_proposals");
  }

  public propose(signer: string, agree: boolean = true) {
    return this.callAsync("clique_propose", [signer, agree]);
  }

  public discard(signer: string) {
    return this.callAsync("clique_discard", [signer]);
  }

  private callAsync(
    method: string,
    params: Array<string | number | boolean> = []
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.web3.currentProvider.send(
          {
            method,
            jsonrpc: "2.0",
            params: [],
            id: createRandomId()
          },
          (err, resp: any) => {
            if (err) {
              console.error(method, err);
              reject(err);
            } else {
              console.log(resp);
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
