import Head from "next/head";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Fuelion Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4">
        <h1>Welcome to Fuelion Tracker</h1>
        <p>Track your money speded to the fuel</p>
      </main>
    </Layout>
  );
}
