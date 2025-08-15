import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AllNewsProvider } from './Componens/context/AllContext'
import { SourcesProvider } from './Componens/context/SourcesContext.jsx'
import { UserProvider } from './Componens/context/UserContext.jsx'
import { FavoriteProvider } from './Componens/context/favorite.context'
import { FavoriteUsersProvider } from './Componens/context/FavoriteUsersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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

  </StrictMode >,
)
