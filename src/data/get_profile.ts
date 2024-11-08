import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'
import instance from '../utils/axios';

const initialState = {
   data: [],
   status: 'idle',
   error: null,
   progress: 0,
};
export const getProfile = createAsyncThunk('/users/profile', async () => {
   const response = await instance.get(`users/profile`)
   return response.data
})

const userProfile = createSlice({
   name: 'userProfile',
   initialState,
   reducers: {
      resetMyProfile() {
         return {
            ...initialState
         }
      },
   },
   extraReducers(builder) {
      builder
         .addCase(getProfile.pending, (state?: any, action?: any) => {
            state.status = 'loading'
         })
         .addCase(getProfile.fulfilled, (state?: any, action?: any) => {
            state.progress = 20
            state.status = 'succeeded'
            // Add any fetched posts to the array;
            state.data = [];
            state.data = state.data.concat(action.payload)
            state.progress = 100
         })
         .addCase(getProfile.rejected, (state?: any, action?: any) => {
            state.status = 'failed'
            state.error = action.error.message
         })
   }
});

export const { resetMyProfile } = userProfile.actions;
export const reducer = userProfile.reducer;
export const selectUserProfile = (state: any) => state?.get_profile?.data[0]?.data?.user
export default userProfile