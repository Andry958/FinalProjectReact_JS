import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './LastNews/LastNews.reduce'

const store = configureStore({
    reducer: {
      account: accountReducer,
    },
  });
  
  export default store;