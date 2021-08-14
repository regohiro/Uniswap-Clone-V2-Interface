import { createAction } from '@reduxjs/toolkit';

export const updateBuyLimit = createAction<number>('presale/updateBuyLimit');
export const updateRemaining = createAction<number>('presale/updateRemaining');