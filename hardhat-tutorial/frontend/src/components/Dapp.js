import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { Vote } from "./Vote";
import { AdminPanel } from "./AdminPanel";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";

// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = "31337";
const SEPOLIA_NETWORK_ID = "11155111";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address, balance and accesses count
      selectedAddress: undefined,
      balance: undefined,
      acessos: undefined,
      owner: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install a wallet.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // Ask the user to connect their wallet.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.tokenData.name} ({this.state.tokenData.symbol})
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
              <b>
                {this.state.balance.toString()} {this.state.tokenData.symbol}
              </b>
              {this.state.acessos !== undefined && (
                <span>
                  {" "}
                  | Acessos (votos realizados no ciclo):{" "}
                  <b>{this.state.acessos.toString()} / 10</b>
                </span>
              )}
              .
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Vote
              vote={(codinome, amount) => this._vote(codinome, amount)}
              tokenSymbol={this.state.tokenData.symbol}
            />
          </div>

          <div className="col-md-6">
            {this.state.balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}

            {this.state.balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount) =>
                  this._transferTokens(to, amount)
                }
                tokenSymbol={this.state.tokenData.symbol}
              />
            )}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <AdminPanel
              issueToken={(codinome, amount) =>
                this._issueToken(codinome, amount)
              }
              updateUser={(codinome, addr) => this._updateUser(codinome, addr)}
              votingOn={() => this._votingOn()}
              votingOff={() => this._votingOff()}
              tokenSymbol={this.state.tokenData.symbol}
            />
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    this._checkNetwork();

    this._initialize(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    this._initializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _initializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();
    const owner = await this._token.owner();

    this.setState({ tokenData: { name, symbol }, owner });
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    const acessos = await this._token.acessos(this.state.selectedAddress);
    this.setState({ balance, acessos });
  }

  async _sendTransaction(txPromise) {
    try {
      this._dismissTransactionError();

      const tx = await txPromise();
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _transferTokens(to, amount) {
    await this._sendTransaction(() => this._token.transfer(to, amount));
  }

  async _vote(codinome, amount) {
    await this._sendTransaction(() => this._token.vote(codinome, amount));
  }

  async _issueToken(codinome, amount) {
    await this._sendTransaction(() => this._token.issueToken(codinome, amount));
  }

  async _updateUser(codinome, userAddr) {
    await this._sendTransaction(() =>
      this._token.updateUser(codinome, userAddr)
    );
  }

  async _votingOn() {
    await this._sendTransaction(() => this._token.votingOn());
  }

  async _votingOff() {
    await this._sendTransaction(() => this._token.votingOff());
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${parseInt(HARDHAT_NETWORK_ID, 10).toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  _checkNetwork() {
    if (
      window.ethereum.networkVersion !== HARDHAT_NETWORK_ID &&
      window.ethereum.networkVersion !== SEPOLIA_NETWORK_ID
    ) {
      this._switchChain();
    }
  }
}
