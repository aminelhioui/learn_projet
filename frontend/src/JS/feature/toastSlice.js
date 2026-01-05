import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    show: false,
    message: '',
    variant: 'info',
    delay: 4500,
  },
  reducers: {
    showToast: (state, action) => {
      const { message, variant = 'info', delay = 4500 } = action.payload;
      state.show = true;
      state.message = message;
      state.variant = variant;
      state.delay = delay;
    },
    hideToast: (state) => {
      state.show = false;
      state.message = '';
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
