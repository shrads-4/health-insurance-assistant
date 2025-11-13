import Head from 'next/head';
import Timeline from '../components/Timeline';
import ProtectedRoute from '../components/ProtectedRoute';

export default function TimelinePage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Fertility Journey Timeline</title>
        </Head>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Fertility Journey</h1>
        <Timeline />
      </div>
    </ProtectedRoute>
  );
}
