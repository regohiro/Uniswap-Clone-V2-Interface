import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRemaining } from "../../interactions/presale";
;
import { selectPresale, selectUser } from "../../state";
import { updateRemaining } from "../../state/presale/actions";
import { fromWei } from "../../utils/bigNumber";
import useAsyncEffect from "use-async-effect";

const PresaleInfo: React.FC = () => {
  const { remaining } = useSelector(selectPresale);
  const { provider } = useSelector(selectUser);
  const dispatch = useDispatch();

  useAsyncEffect(async () => {
    const remaining = fromWei(await getRemaining(provider), 3);
    dispatch(updateRemaining(remaining));
  }, []);

  return (
    <>
      <h1>Presale Info</h1>
      <ul>
        <li>Hard cap: 250,000,000,000,000 DAT</li>
        <li>Amount/BNB: 56,000,000,000 DAT</li>
        <li>Amount/$100: DAT</li>
        <li>Remaining: {remaining} DAT</li>
      </ul>
    </>
  );
};

export default PresaleInfo;
