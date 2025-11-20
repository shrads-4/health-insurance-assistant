import Head from 'next/head';
import CoverageDecoder from '../components/CoverageDecoder';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CoveragePage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Coverage Decoder - Baby Yoda</title>
        </Head>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#4A5D2E', marginBottom: '0.5rem' }}>Coverage Decoder 🔍</h1>
          <p style={{ color: '#8FA05F', fontSize: '1.1rem' }}>
            Chat with Baby Yoda to understand your insurance and find savings
          </p>
        </div>
        <CoverageDecoder />
      </div>
    </ProtectedRoute>
  );
}
