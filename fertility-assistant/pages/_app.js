import '../styles/globals.css';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <main style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
