import Head from 'next/head';
import CostSimulator from '../components/CostSimulator';

export default function CostSimulationPage() {
  return (
    <div>
      <Head>
        <title>Cost Simulator</title>
      </Head>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Cost Simulator</h1>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
        Model your out-of-pocket costs and optimize your treatment timing
      </p>
      <CostSimulator />
    </div>
  );
}
