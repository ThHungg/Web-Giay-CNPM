import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    access_token: '',
    id: '',
    isAdmin: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', address = '', phone = '', id = '', isAdmin } = action.payload;
            state.name = name || email;
            state.email = email;
            state.address = address;
            state.phone = phone;
            state.id = id;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false
        }
    }
})

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
