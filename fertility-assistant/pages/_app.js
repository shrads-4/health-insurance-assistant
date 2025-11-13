import '../styles/globals.css';
import NavBar from '../components/NavBar';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NavBar />
      <main style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default MyApp;
