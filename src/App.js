import "./App.css";
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import {useCallback, useEffect, useState} from "react";
import {loadContract} from "./utils/loadContract";

function App() {
    const [account, setAccount] = useState(null);
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null,
    });
    const [shouldReload, reload] = useState(false);
    const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
    const [balance, setBalance] = useState(null);

    const setAccountListener = (provider) => {
        provider.on("accountsChanged",
                _ => window.location.reload());

        // provider._jsonRpcConnection.events.on("notification", (notification) => {
        //     if (notification.method === "metamask_unlockStateChanged") {
        //         setAccount(null);
        //     }
        // });
    }

    useEffect(() => {
        const loadProvider = async () => {
            let provider = await detectEthereumProvider();
            const contract = await loadContract("Faucet", provider);
            if(provider) {
                setAccountListener(provider);
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract,
                });
            } else {
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
            <div className={'is-flex is-align-items-center'}>
            <span>
                <strong className={'mr-2'}>Account:</strong>
            </span>
           {account ? (<div>{account}</div>) : (
                <button
                    onClick={() =>
                        web3Api.provider.request({method: 'eth_requestAccounts'})}
                    className={'button is-small'}>Connect Wallet</button>
            )}</div>
            <div className={'balance-view is-size-2 my-4'}>
                Current balance: <strong>{balance}</strong> ETH
            </div>
            <button
                disabled={!account}
                onClick={addFunds} className={'button is-link mr-2'}>Donate 1eth</button>
            <button
                disabled={!account}
                onClick={withDrawFunds}
                className={'button is-primary'}>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
