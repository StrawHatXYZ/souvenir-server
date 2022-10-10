import type { NextPage } from "next";
import Head from "next/head";
import { HydView } from "views/hyderabad";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <HydView />
    </div>
  );
};

export default Basics;
