import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReplyPage from './pages/reply/ReplyPage.tsx';
import TestPage from './pages/test/TestPage.tsx';
import HomePage from './pages/home/HomePage.tsx';
import Layout from './pages/layout/Layout.tsx';
import { store } from './store.ts';
import { Provider } from 'react-redux';
import GlobalStyles from "./globalStyles/globalStyles.ts";

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Layout}>
            <Route path='reply'>
              <Route path=':replyId' Component={ReplyPage}/>
            </Route>
            <Route path='test'>
              <Route path=':testId' Component={TestPage}/>
            </Route>
            <Route index Component={HomePage}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
