import '../styles/globals.css';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <AuthProvider>
      <NavBar />
      <main style={{ padding: '2rem' }} key={router.asPath}>
        <Component {...pageProps} key={router.asPath} />
      </main>
    </AuthProvider>
  );
}

export default MyApp;
