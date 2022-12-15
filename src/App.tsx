import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletMultiButton
} from "@solana/wallet-adapter-react-ui";

require('@solana/wallet-adapter-react-ui/styles.css');

const Content = () => {
    const wallet = useWallet()
    const [errorObj, setErrorObj] = useState<WalletError>();
    useEffect(() => {
        if (wallet.publicKey) {
            return setErrorObj(undefined);
        }
        wallet.wallet?.adapter.on('error', (error) => {
            console.error("wallet adapter error", error);
            setErrorObj(error)});
    }, [wallet.publicKey, wallet.wallet?.adapter]);
    
    return <header className="App-header">
        <h1>Phantom wallet disconnect investigation</h1>
        <span>To reproduce the error: change the selected wallet using the phantom browser extension and (intermittently) you will see a wallet disconnect error.
                    The error appears to be more likely if the wallet address hasn't been selected recently</span>
        <br />
        <br />
        <WalletMultiButton/>
        <br />
        {wallet?.publicKey && (
            <>
                <p>Connected wallet {wallet?.publicKey?.toBase58()}</p>
                
            </>
        )}
        
        {errorObj && (<>
            <h2>Wallet adapter error</h2>
            <textarea style={{width: "80%"}} rows={20} value={JSON.stringify({ message: errorObj?.message, stack: errorObj?.stack })}/>
        </>)}
    </header>
}

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        []
    );

    return (
        <div className="App">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Content />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default App;
