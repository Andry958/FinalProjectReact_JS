import { createSlice } from '@reduxjs/toolkit'
export const accountSlice = createSlice({
    name: 'lastnews',
    initialState: {
        allNews: [],
        lastnews: null,
    },
    reducers: {
        Refresh: (state) => {
            if (!state.allNews.length) {
                state.lastnews = null;
                return;
            }

            const latestNews = state.allNews.reduce((acc, val) => {
                return new Date(val.PublishedAt) > new Date(acc.PublishedAt) ? val : acc;
            }, state.allNews[0]);

            state.lastnews = latestNews;
        },
        SetAllNews: (state, action) => {
            state.allNews = action.payload;

            const latestNews = state.allNews.reduce((acc, val) => {
                return new Date(val.PublishedAt) > new Date(acc.PublishedAt) ? val : acc;
            }, state.allNews[0]);

            state.lastnews = latestNews;
        }
    },
});
export const {Refresh, SetAllNews} = accountSlice.actions
export default accountSlice.reducer; 