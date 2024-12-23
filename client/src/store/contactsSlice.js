import { createSlice } from "@reduxjs/toolkit";

const contactsSlice = createSlice({
  name: "contactsSlice",
  initialState: [],
  reducers: {
    setContacts: (state, { payload: contacts }) => contacts,
    addContact: (state, { payload: contact }) => {
      state.push(contact);
    },
    removeContact: (state, { payload }) => {
      return state.filter(
        (contact) => contact.contactDetails._id !== payload.id
      );
    },
    setContactOnlineStatus: (state, { payload }) => {
      if (state.length > 0) {
        const contactIndex = state.findIndex(
          (contact) => contact.contactDetails._id === payload.id
        );
        if (contactIndex >= 0) {
          state[contactIndex].contactDetails.status = payload.status;
        }
      }
    },
  },
});

export const contactsActions = contactsSlice.actions;

export default contactsSlice.reducer;
