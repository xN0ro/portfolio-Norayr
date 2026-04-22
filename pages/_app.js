import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { checkAuth } from '../store/authSlice';
import Layout from '../components/Layout';
import '../styles/globals.css';

// this runs once when the app loads to check if user has a saved token
function AuthLoader({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthLoader>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthLoader>
    </Provider>
  );
}
