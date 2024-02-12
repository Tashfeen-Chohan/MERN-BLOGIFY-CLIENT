import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: {
    id: "",
    name: ""
  },
  publisher: {
    id: "",
    name: ""
  },
};

const dataSlice = createSlice({
  name: "data",
  initialState,

  reducers: {
    setCategory(state, action) {
      const {id, name} = action.payload
      state.category.id = id;
      state.category.name = name;
    },
    setPublisher(state, action) {
      const {id, name} = action.payload
      state.publisher.id = id;
      state.publisher.name = name;
    },
    resetCategory(state) {
      state.category.id = "";
      state.category.name = "";
    },
    resetPublisher(state) {
      state.publisher.id = "";
      state.publisher.name = "";
    },
  },
});

export const { setCategory, setPublisher, resetCategory, resetPublisher } =
  dataSlice.actions;

export default dataSlice.reducer
export const selectCategory = (state) => state.data.category;
export const selectPublisher = (state) => state.data.publisher;