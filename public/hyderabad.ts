
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
    result: Place
}

type Place = {
  name: String;
  location: String;
  url: String;
  image: String;
  description: String;
  rating: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response:Place =   {
    "name":"Charminar",
    "location":"Hyderabad, Telangana",
    "url":"http://192.168.0.180:3000/api/hyderabad",
    "image":"https://i.stack.imgur.com/w4H1q.jpg",
    "description": "The Charminar is a mosque and monument located in Hyderabad, Telangana, India. Constructed in 1591, the landmark is a symbol of Hyderabad and officially incorporated in the emblem of Telangana The Charminar's long history includes the existence of a mosque on its top floor for more than 425 years.",
    "rating":3
  }
  res.status(200).json({ result: response });
}
