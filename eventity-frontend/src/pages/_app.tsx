import '../app/globals.css';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
