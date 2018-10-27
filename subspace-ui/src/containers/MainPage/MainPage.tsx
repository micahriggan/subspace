import * as React from "react";
import { Web3Component } from "../../components/Web3/Web3";
import { Input, Header, Button, Table } from "semantic-ui-react";
import IdIterator = require("json-rpc-random-id");
import "./MainPage.css";
console.log(IdIterator);
const createRandomId = IdIterator();
console.log(createRandomId());

interface IState {
  signers: string[];
  proposals: string[];
  faucetBalance: string;
}
export class MainPage extends Web3Component<{}, IState> {
  public state: IState = {
    proposals: [],
    signers: [],
    faucetBalance: "0"
  };
  constructor(props: {}) {
    super(props);
  }
  public componentDidMount() {
    this.getWeb3().currentProvider.send(
      {
        method: "clique_getSigners",
        jsonrpc: "2.0",
        params: [],
        id: createRandomId()
      },
      (err, resp) => {
        if (!err && resp.result) {
          this.setState({ signers: resp.result });
        }
      }
    );
    this.getWeb3().currentProvider.send(
      {
        method: "clique_getProposals",
        jsonrpc: "2.0",
        params: [],
        id: createRandomId()
      },
      (err, resp) => {
        if (!err && resp.result) {
          this.setState({ proposals: resp.result });
        }
      }
    );

  }

  public propsalComponent(proposer: string) {
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">
            <Header.Content>
              {proposer}
              <Header.Subheader>Potential Subspace validator</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <div className="ui two buttons">
            <Button basic={true} color="green">
              Approve
            </Button>
            <Button basic={true} color="red">
              Decline
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  public signerComponent(signer: string) {
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">
            <Header.Content>
              {signer}
              <Header.Subheader>Subspace validator</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <div className="ui two buttons">
            <Button basic={true} color="green">
              Approve
            </Button>
            <Button basic={true} color="red">
              Decline
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  public validatorTable(tableRows: JSX.Element | JSX.Element[]) {
    return (
      <Table basic="very" celled={true} collapsing={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Validator</Table.HeaderCell>
            <Table.HeaderCell>Approval</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{tableRows}</Table.Body>
      </Table>
    );
  }

  public newValidator() {
    return (
      <Table.Row>
        <Table.Cell>
          <Header as="h4">
            <Header.Content>
              <Input placeholder="0x0000000000000000000000000000000000000000" />
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <div className="ui two buttons">
            <Button basic={true} color="green">
              Request
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  public render() {
    const { proposals, signers } = this.state;
    const propsalComponents = proposals.map(this.propsalComponent);
    const signerComponents = signers.map(this.signerComponent);
    return (
      <div className="main-page">
        <div>
          <Header> Current Validators </Header>
          {this.validatorTable(signerComponents)}
        </div>
        <div>
          <Header>Requested Validators</Header>
          {this.validatorTable(propsalComponents.concat(this.newValidator()))}
        </div>
      </div>
    );
  }
}
