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
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const { address } = req.query;

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);

  let mint = Keypair.generate();

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
        name: "Goa, India",
        image: "https://arweave.net/fCIWuf0GUf6g-f_mN6tKI1txgIgbmb1T6ywYTOfw9Qk",
        description: "When life hits you with boredom, Escape to Goa!",
        attributes: [
          {
            trait_type: "time",
            value: Date.now().toString(),
          },
          {
            trait_type: "location",
            value: "Taj Mahal, India",
          },
          {
            trait_type: "gps",
            value: "27.175277,78.042128",
          },
        ],
      })
      .run();

  let feePayer = new PublicKey(address);


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
            name: "Goa, India",
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
