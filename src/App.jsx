import './App.css';
import Layout from './Componens/Main/Layout';
import NewsList from './Componens/Items/newsList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Componens/Main/Home';
import NoPage from './Componens/Main/NoPage';
import { useContext, useEffect } from 'react';
import { AllNewsContext } from './Componens/context/AllContext';
import AddProduct from './Componens/Main/AddProduct';
import EditNews from './Componens/Main/EditNews';
import { SourcesContext } from './Componens/context/SourcesContext';
import NewsByAuthor from './Componens/Items/NewsByAthor';
import Register from './Componens/First/Register';
import Login from './Componens/First/Login';
import Profile from './Componens/Main/Profile';
import AdminsEditor from './Componens/Main/AdminsEditor';
import EditProfile from './Componens/Main/EditProfile';
import { useDispatch, useSelector } from 'react-redux';
import { Refresh, SetAllNews } from './Componens/Redux/LastNews/LastNews.reduce';



const apiNews = "https://newsapi.org/v2/top-headlines?country=us&apiKey=f596c55597b748049467bb00fd96ecae"
const api = "https://localhost:5173/api/"
function App() {
  const { setValue } = useContext(AllNewsContext);
  const { setSources } = useContext(SourcesContext);

  const dispatch = useDispatch();

    const allNews = useSelector(state => state.account.allNews);
    const lastnews = useSelector(state => state.account.lastnews);

  useEffect(() => {
    fetchNews()
  }, []);


  async function fetchNews() {
    const res = await fetch(apiNews);
    const data = await res.json();
    setValue(data.articles);

    const uniqueSources = [];
    data.articles.forEach(news => {
      if (news.source?.name && !uniqueSources.includes(news.source.name)) {
        uniqueSources.push(news.source.name);
      }
    });
    setSources(uniqueSources);console.log("dfsdfsdf",data)
    dispatch(SetAllNews(data.articles))
    dispatch(Refresh())
    await AddNewsInDB(data.articles);
  }

  async function AddNewsInDB(newsArray) {
    const newsItems = newsArray.map(news => ({
      Author: news.author || null,
      Content: news.content || null,
      Description: news.description || null,
      PublishedAt: news.publishedAt ? new Date(news.publishedAt).toISOString() : null,
      Name: news.source?.name || null,
      Title: news.title || null,
      Url: news.url || null,
      UrlToImage: news.urlToImage || null,
    }));
    console.log(newsItems)

  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='newslist' element={<NewsList></NewsList>} />
          <Route path='home' element={<Home />} />
          <Route path='create' element={<AddProduct />} />
          <Route path='edit' element={<EditNews />}></Route>
          <Route path='newsbyauthor' element={<NewsByAuthor />} />
          <Route index element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="pr" element={<Profile />} />
          <Route path="*" element={<NoPage />} />
          <Route path="admins" element={<AdminsEditor></AdminsEditor>} />
          <Route path="editpr" element={<EditProfile></EditProfile>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App