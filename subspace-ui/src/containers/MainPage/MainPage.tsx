import * as React from "react";
import { Web3Component } from "../../components/Web3/Web3";
import { Input, Header, Button, Table } from "semantic-ui-react";
import { CliqueService } from "../../services/Clique";
import { FaucetContstants } from "../../constants/faucet";
import { FaucetService } from "../../services/Faucet";
import "./MainPage.css";

interface IState {
  signers: string[];
  proposals: string[];
  proposal: string;
  faucetBalance: string;
  faucetRequest: string;
}
export class MainPage extends Web3Component<{}, IState> {
  public state: IState = {
    proposals: [],
    signers: [],
    faucetBalance: "0",
    proposal: "",
    faucetRequest: ""
  };

  public cliqueService: CliqueService;
  public faucetService: FaucetService;
  constructor(props: {}) {
    super(props);
    this.cliqueService = new CliqueService(this.getWeb3());
    this.faucetService = new FaucetService("http://localhost:5555");
    this.propsalComponent = this.propsalComponent.bind(this);
    this.signerComponent = this.signerComponent.bind(this);
    this.handleProposalUpdate = this.handleProposalUpdate.bind(this);
    this.handleFaucetRequestUpdate= this.handleFaucetRequestUpdate.bind(this);
  }
  public async componentDidMount() {
    const signers = (await this.cliqueService.getSigners()) || [];
    const proposals = (await this.cliqueService.getProposals()) || [];
    const { address } = FaucetContstants;
    const faucetBalance = this.getWeb3()
      .utils.fromWei(await this.getWeb3().eth.getBalance(address), "ether")
      .toString();
    this.setState({ signers });
    this.setState({ proposals });
    this.setState({ faucetBalance });
  }

  public proposeValidator(address: string) {
    return () => this.cliqueService.propose(address);
  }

  public discardValidator(address: string) {
    return () => this.cliqueService.discard(address);
  }

  public handleProposalUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ proposal: event.target.value });
  }

  public handleFaucetRequestUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ faucetRequest: event.target.value });
  }

  public requestEther(address: string) {
    return () => this.faucetService.requestEther(address);
  }

  public propsalComponent(proposer: string) {
    return (
      <Table.Row key={proposer}>
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
            <Button
              basic={true}
              color="green"
              onClick={this.proposeValidator(proposer)}
            >
              Approve
            </Button>
            <Button
              basic={true}
              color="red"
              onClick={this.discardValidator(proposer)}
            >
              Decline
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  public signerComponent(signer: string) {
    return (
      <Table.Row key={signer}>
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
            <Button
              basic={true}
              color="green"
              onClick={this.proposeValidator(signer)}
            >
              Approve
            </Button>
            <Button
              basic={true}
              color="red"
              onClick={this.discardValidator(signer)}
            >
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
      <Table.Row key="new">
        <Table.Cell>
          <Header as="h4">
            <Header.Content>
              <Input
                placeholder="0x0000000000000000000000000000000000000000"
                value={this.state.proposal}
                onChange={this.handleProposalUpdate}
              />
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <div className="ui two buttons">
            <Button
              basic={true}
              color="green"
              onClick={this.proposeValidator(this.state.proposal)}
            >
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
        <div>
          <Header>Faucet Balance</Header>
          <div> {Number(this.state.faucetBalance).toExponential()} ETH </div>
          <Input
            placeholder="0x0000000000000000000000000000000000000000"
            value={this.state.faucetRequest}
            onChange={this.handleFaucetRequestUpdate}
            action={
              <Button
                basic={true}
                color="green"
                onClick={this.requestEther(this.state.faucetRequest)}
              > Request Funds </Button>
            }
          />
        </div>
      </div>
    );
  }
}
