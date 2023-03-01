import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'


const WalletConnectionProvider = ({ children }) => {
  // const endpoint = useMemo(() => 'https://api.devnet.solana.com', [])
  const endpoint = useMemo(() => 'https://tiniest-aged-yard.solana-mainnet.quiknode.pro/8f5d72ec7dd3e717884879a70107ff613b304f3f/', [])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletConnectionProvider