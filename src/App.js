import "./App.css";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import {useCallback, useEffect, useState} from "react";
import {loadContract} from "./utils/loadContract";

function App() {
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        isProviderLoaded: false,
        web3: null,
        contract: null,
    });
    const [account, setAccount] = useState(null);
    const [shouldReload, reload] = useState(false);
    const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
    const [balance, setBalance] = useState(null);
    const canConnectToContract = account && web3Api.contract;


    const setAccountListener = (provider) => {
        provider.on("accountsChanged",
                _ => window.location.reload());
    }

    useEffect(() => {
        const loadProvider = async () => {
            let provider = await detectEthereumProvider();
            if(provider) {
                const contract = await loadContract("Faucet", provider);
                setAccountListener(provider);
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract,
                    isProviderLoaded: true,
                });
            } else {
                setWeb3Api(api => ({ ...api, isProviderLoaded: true}));
                console.error('Please install metamask')
            }
        };
       loadProvider();
    }, [])

    useEffect(() => {
        const loadBalance = async () => {
            const {web3, contract} = web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, 'ether'));
        }

        web3Api.contract && loadBalance();
    }, [web3Api, shouldReload])

    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3Api.web3.eth.getAccounts();
            setAccount(accounts[0]);
        };
        web3Api.web3 && getAccount();
    }, [web3Api.web3]);

    const addFunds = useCallback(async () => {
        const {contract, web3} = web3Api;
        await contract.addFunds({
            from: account,
            value: web3.utils.toWei('1', 'ether')
        })
        reloadEffect();
    }, [web3Api, account, reloadEffect])

    const withDrawFunds = async () => {
        const {contract, web3} = web3Api;
        const withdrawAmount = web3.utils.toWei('0.1', 'ether')
        await contract.withdraw(withdrawAmount, {
            from: account,
        });
        reloadEffect();
    }

  return (
    <>
      <div className={'faucet-wrapper'}>
        <div className={'faucet'}>
            { web3Api.isProviderLoaded ?
                <div className={'is-flex is-align-items-center'}>
            <span>
                <strong className={'mr-2'}>Account:</strong>
            </span>
                    {account ? (<div>{account}</div>) :
                        !web3Api.provider ? <>
                            <div className={'notification is-warning is- is-size-6 is-rounded'}>
                                Wallet is not detected. {' '}
                                <a className={'is-block'}
                                   rel={'noreferrer'}
                                   target="_blank"
                                   href="https://docs.metamask.io">Install Metamask</a>
                            </div>
                        </> : (
                            <button
                                onClick={() =>
                                    web3Api.provider.request({method: 'eth_requestAccounts'})}
                                className={'button is-small'}>Connect Wallet</button>
                        )}</div>
                :  <span>Looking for Web3....</span>
            }

            <div className={'balance-view is-size-2 my-4'}>
                Current balance: <strong>{balance}</strong> ETH
            </div>
            {!canConnectToContract && <i className={'is-block'}>Connect to Ganache</i>}
            <button
                disabled={!canConnectToContract}
                onClick={addFunds} className={'button is-link mr-2'}>Donate 1eth</button>
            <button
                disabled={!canConnectToContract}
                onClick={withDrawFunds}
                className={'button is-primary'}>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
