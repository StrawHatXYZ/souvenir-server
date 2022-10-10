
import { FC } from "react";


export const AgraView: FC = ({ }) => {


  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Scan QR code to Mint your NFT
        </h1>
        <div className="text-center">
          <img
            height={300}
            width={300}
            src="http://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=%0A%7B%0A++%22endpoint%22%3A%22http%3A%2F%2F10.2.134.31%3A3000%2Fapi%2Fdata%2Fagra%22%0A%7D&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L"
            alt="qr code"
          />
        </div>
      </div>
    </div>
  );
};

