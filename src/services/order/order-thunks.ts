import { createOrder } from '@/utils/api/orders';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createOrderThunk = createAsyncThunk('order/createOrder', createOrder);
