import * as naj from "near-api-js";
import { Gas, NEAR } from "near-units";
import { Buffer } from "buffer";
import { call, wallet } from "../utils/near";

/**
 * The contract wrapped by this file.
 * (This is the contract used in https://github.com/near-examples/guest-book)
 *
 * We *could* use `process.env.REACT_APP_CONTRACT_NAME` in this file, since the
 * template started with that environment variable set to `guest-book.testnet`.
 *
 * BUT, the idea of files in `src/contracts` is that they each wrap a specific
 * contract. If the env var `REACT_APP_CONTRACT_NAME` changes, this file is
 * still a wrapper around the guest book contract.
 */
export const CONTRACT_NAME = "nft.crypto_overflow.testnet";

/**
 * This is a Contract object instantiated using near-api-js.
 *
 * But this does not provide any TypeScript types! Using this approach makes it
 * hard for you and your collaborators to tell what arguments you can pass to
 * `getMessages` and `addMessage`.
 *
 * See other exports for a fully-typed approach instead.
 */
export const Untyped = new naj.Contract(wallet.account(), CONTRACT_NAME, {
  viewMethods: [],
  changeMethods: ["nft_mint"],
});

/**
 * The data structure for Token Metadata
 */
export interface TokenMetadata {
  title: string;
  description: string;
  media: string;
  copies: number;
}

/**
 * Mint a NFT from the contract.
 *
 * Whoever is signed in (`wallet.account()`) will be set as the `sender`
 *
 *
 * @param args.text The text of the message
 * @param options.attachedDeposit Send at least 0.01 NEAR (`NEAR.parse('0.1')`) for the message to be considered "premium"
 * @param options.gas Max amount of gas that method call can use; default is 30 Tgas (roughly 30ms of processing time), max allowed is 300 Tgas; can include with `Gas.parse('150 Tgas')
 * @param options.walletMeta Metadata to send the NEAR Wallet if using it to sign transactions.
 * @param options.walletCallbackUrl Callback url to send the NEAR Wallet if using it to sign transactions.
 * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON. This is useful if the contract accepts Borsh (see https://borsh.io)
 */
export async function nftMint(
  args: {
    token_id: string;
    receiver_id: string;
    token_metadata: TokenMetadata;
  },
  options?: {
    attachedDeposit?: NEAR;
    gas?: Gas;
    walletMeta?: string;
    walletCallbackUrl?: string;
    stringify?: (input: any) => Buffer;
  }
): Promise<void> {
  return call(CONTRACT_NAME, "nft_mint", args, options);
}
