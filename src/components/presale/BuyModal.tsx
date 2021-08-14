import { JsonRpcSigner } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "semantic-ui-react";
import useAsyncEffect from "use-async-effect";
import useAsync from "../../hooks/useAsync";
import {
  buyDATPresale,
  getBuyLimit,
  IBuyDATPresale as IBuyDATPresaleRes,
} from "../../interactions/presale";
import { selectPresale, selectUser } from "../../state";
import * as presaleActions from "../../state/presale/actions";
import { initialState } from "../../state/presale/reducers";
import * as userActions from "../../state/user/actions";
import { fromWei } from "../../utils";

const BuyModal: React.FC = () => {
  const { signer, txHash, address } = useSelector(selectUser);
  const { buyLimit } = useSelector(selectPresale);

  const { setTxHash, updateUserBalance, updateRemaining, updateBuyLimit } =
    bindActionCreators({ ...userActions, ...presaleActions }, useDispatch());

  const [input, setInput] = useState(0);
  const [toReceive, setToReceive] = useState(0);

  interface IBuyDatPresaleParam {
    signer: JsonRpcSigner;
    bnbAmount: number;
  }

  const { pending, call } = useAsync<IBuyDatPresaleParam, IBuyDATPresaleRes>(
    async ({ signer, bnbAmount }) =>
      await buyDATPresale(signer, bnbAmount)
  );

  const onSubmitBuy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bnbAmount = input;
    const { error, data } = await call({ signer, bnbAmount });

    if (error) {
      alert(error);
    }
    if (data) {
      const { txHash, bnbBalance, datBalance, remaining, buyLimit } = data;
      setTxHash(txHash);
      updateUserBalance({ bnbBalance, datBalance });
      updateRemaining(remaining);
      updateBuyLimit(buyLimit);
    }
  };

  useEffect(() => {
    const BNBToDAT = 56000000000;
    const datToReceive = input * BNBToDAT;
    setToReceive(datToReceive);
  }, [input]);

  useAsyncEffect(async () => {
    if(address){
      const buyLimit = fromWei(await getBuyLimit(signer));
      updateBuyLimit(buyLimit);
    }else{
      updateBuyLimit(initialState.buyLimit);
    }
  }, [address])

  return (
    <>
      <h1>Buy here</h1>
      <form onSubmit={onSubmitBuy}>
        <input
          type="number"
          placeholder="0.00"
          min="0.01"
          max="20"
          step="0.00000001"
          onChange={(e) => setInput(Number(e.target.value))}
          required
        />
        <Button color="green" disabled={pending} loading={pending}>
          Buy
        </Button>
      </form>
      <div>To Receive: {toReceive} DAT</div>
      <div>Buy Limit: {buyLimit} BNB</div>
      <div>TX Hash: {txHash}</div>
    </>
  );
};

export default BuyModal;
