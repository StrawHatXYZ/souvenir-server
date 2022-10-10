// Next, React
import { FC } from 'react';


export const HomeView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col justify-center align-middle">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Souvenir
        </h1>
        <h4 className="md:w-full text-center text-slate-300 my-2">
          <p>Wolcome to Souvenir.</p>
          <p>Travel the world and collect souvenirs. </p>
          <p>Show off your collection to your friends and family.</p>
        </h4>
      </div>
    </div>
  );
};
