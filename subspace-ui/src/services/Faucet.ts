import * as Request from "request-promise";
export class FaucetService {
  constructor(private baseUrl: string, private request = Request) {}
  public requestEther(address: string) {
    return this.request.get(`${this.baseUrl}/request-ether/${address}`);
  }
}
