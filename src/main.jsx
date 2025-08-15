import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AllNewsProvider } from './Componens/context/AllContext'
import { SourcesProvider } from './Componens/context/SourcesContext.jsx'
import { UserProvider } from './Componens/context/UserContext.jsx'
import { FavoriteProvider } from './Componens/context/favorite.context'
import { FavoriteUsersProvider } from './Componens/context/FavoriteUsersContext.jsx'
import { Provider } from 'react-redux';
import store from './Componens/Redux/store';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <FavoriteUsersProvider>
        <FavoriteProvider>
          <UserProvider>
            <SourcesProvider>
              <AllNewsProvider>
                <App />
              </AllNewsProvider>
            </SourcesProvider>
          </UserProvider>
        </FavoriteProvider>
      </FavoriteUsersProvider>
    </Provider>

  </StrictMode >,
)
