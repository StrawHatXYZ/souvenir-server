// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV2Instruction,
  createCreateMasterEditionV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { bundlrStorage, keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { getMasterEditionPDA, getMetadataPDA } from "utils/helper";
import dotenv from "dotenv";
dotenv.config();


type Data = {
  tx: String;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address } = req.query;

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);


  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypairFromSecretKey))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );
  console.log("Uploading metadata to Arweave...");
  const { uri, metadata } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Agra, Uttar Pradesh",
      image: "https://arweave.net/QUq0zT7L09x05MWWlr26hVayERjSAojWwJMKvL1Kj0Y",
      description:
        "The Taj Mahal is an Islamic ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
      attributes: [
        {
          trait_type: "time",
          value: Date.now().toString(),
        },
        {
          trait_type: "location",
          value: "Agra, Uttar Pradesh",
        },
        {
          trait_type: "gps",
          value: "27.175277,78.042128",
        },
      ],
    })
    .run();


let feePayer = new PublicKey(address);

let mint = Keypair.generate();
console.log(`mint: ${mint.publicKey.toBase58()}`);

let ata = await getAssociatedTokenAddress(mint.publicKey, feePayer);

let tokenMetadataPubkey = await getMetadataPDA(mint.publicKey);

let masterEditionPubkey = await getMasterEditionPDA(mint.publicKey);

let transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: feePayer,
    newAccountPubkey: mint.publicKey,
    lamports: await getMinimumBalanceForRentExemptMint(connection),
    space: MINT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  }),
  SystemProgram.transfer({
    fromPubkey: feePayer,
    toPubkey: keypairFromSecretKey.publicKey,
    lamports: 10000,
  }),
  createInitializeMintInstruction(mint.publicKey, 0, feePayer, feePayer),
  createAssociatedTokenAccountInstruction(
    feePayer,
    ata,
    feePayer,
    mint.publicKey
  ),
  createMintToCheckedInstruction(mint.publicKey, ata, feePayer, 1, 0),
  createCreateMetadataAccountV2Instruction(
    {
      metadata: tokenMetadataPubkey,
      mint: mint.publicKey,
      mintAuthority: feePayer,
      payer: feePayer,
      updateAuthority: feePayer,
    },
    {
      createMetadataAccountArgsV2: {
        data: {
          name: "Taj Mahal, Agra, India",
          symbol: "India",
          uri: uri,
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: feePayer,
              verified: true,
              share: 100,
            },
          ],
          collection: null,
          uses: null,
        },
        isMutable: true,
      },
    }
  ),
  createCreateMasterEditionV3Instruction(
    {
      edition: masterEditionPubkey,
      mint: mint.publicKey,
      updateAuthority: feePayer,
      mintAuthority: feePayer,
      payer: feePayer,
      metadata: tokenMetadataPubkey,
    },
    {
      createMasterEditionArgs: {
        maxSupply: 0,
      },
    }
  )
);
let recentBlockhash = await connection.getLatestBlockhash();
transaction.recentBlockhash = recentBlockhash.blockhash;
transaction.feePayer = feePayer;
transaction.partialSign(mint);
  const encoded = transaction
    .serialize({ verifySignatures: false })
    .toString("base64");
  console.log(encoded);
  res.status(200).json({ tx: encoded });
}
