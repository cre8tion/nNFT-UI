import React, { useState, useCallback } from "react";
import { Nav } from "../Nav";
import * as NftContract from "../../contracts/nft-contract";
import { NEAR } from "near-units";
import { wallet, provider, isFinalised } from "../../utils/near";
import randomInteger from 'random-int';

interface MyIType {
  title: string;
  description: string;
  media: string;
}

//Partial from typescript to make properties optional
interface MyFormType extends Partial<MyIType> { }

export function App() {
  const currentUser = wallet.getAccountId();
  const [message, setMessage] = useState<string>();
  const [inputs, setInputs] = useState<MyFormType>({});

  const onChangeForField = useCallback(({ target }) =>
    setInputs(_state => {
      return {
        ..._state,
        [target.name]: target.value,
      };
    }),
    []
  );

  const nftMint = () => {
    NftContract.nftMint(
      {
        token_id: randomInteger(10, 100).toString(),
        receiver_id: currentUser,
        token_metadata: {
          title: inputs.title ?? "Test NFT",
          description: inputs.description ?? "",
          media: inputs.media ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg",
          copies: 1
        }
      },
      {
        attachedDeposit: NEAR.parse("0.1")
      }
    );
  }

  // eslint-disable-next-line
  async function getTransactionStatus(txHash: string, accountId: string) {
    const result = await provider.txStatus(txHash, accountId);

    if (isFinalised(result.status)) {
      if (result.status.SuccessValue) {
        console.log(result.status.SuccessValue)
        setMessage("NFT is minted. Please check your wallet")
      }
      else if (result.status.Failure) {
        console.log(result.status.Failure)
        setMessage("An unexpected error has occurred. Check the logs for more info")
      }
    }
  }

  //getTransactionStatus("FmLHhk2DKti8AmnZNd484tUXjToXjM9VDXHaQ8hzyV53", currentUser);

  return (
    <>
      <Nav />
      <main className="container">
        <div className="flex space-x-2 justify-center">
          <h1 className="sm:text-xl md:text-3xl">Welcome</h1>
          {
            currentUser ? <h1 className="sm:text-xl md:text-3xl">{currentUser}!</h1>
              : <h1 className="sm:text-xl md:text-3xl">User!</h1>
          }
        </div>
        <br />
        <div className="flex space-x-2 justify-center">
          <h2 className="sm:text-lg md:text-xl">Mint your NFT via this form!</h2>
        </div>
        <br />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center max-w-md mx-auto space-x-4 w-full">
            <div className="w-full">
              <input className="w-full px-4 py-1 text-white rounded-lg focus:outline-none"
                placeholder="Title" name="title" value={inputs.title || ''} onChange={onChangeForField} />
            </div>
          </div>
          <div className="flex items-center max-w-md mx-auto space-x-4 w-full">
            <div className="w-full">
              <input className="w-full px-4 py-1 text-white rounded-lg focus:outline-none"
                placeholder="Description" name="description" value={inputs.description || ''} onChange={onChangeForField} />
            </div>
          </div>
          <div className="flex items-center max-w-md mx-auto space-x-4 w-full">
            <div className="w-full">
              <input className="w-full px-4 py-1 text-white rounded-lg focus:outline-none"
                placeholder="Media Link (Leave empty for default image)" name="media" value={inputs.media || ''} onChange={onChangeForField} />
            </div>
          </div>
          <br />
          <button type="submit" onClick={nftMint} className="h-10 px-2 font-semibold rounded-md bg-black text-white" disabled={!currentUser} >
            Submit
          </button>
        </div>
        <br />
        <div className="container flex justify-center">
          {
            message ? <p className="sm:text-lg md:text-xl">{message}</p>
              : null
          }
        </div>
        <br />
      </main>
    </>
  );
}
