import Head from 'next/head';
import CoverageDecoder from '../components/CoverageDecoder';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CoveragePage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Coverage Decoder</title>
        </Head>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Coverage Decoder</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
          Paste your insurance plan details and we'll translate them into plain English
        </p>
        <CoverageDecoder />
      </div>
    </ProtectedRoute>
  );
}
