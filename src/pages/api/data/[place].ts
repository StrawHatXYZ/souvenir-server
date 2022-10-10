import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  result: Place;
};

type Place = {
  name: String;
  location: String;
  url: String;
  image: String;
  description: String;
  rating: Number;
};

const hyderabadData: Place = {
  name: "Charminar",
  location: "Hyderabad, Telangana",
  url: "http://10.2.134.31:3000/api/hyderabad",
  image: "https://i.stack.imgur.com/w4H1q.jpg",
  description:
    "The Charminar is a mosque and monument located in Hyderabad, Telangana, India. Constructed in 1591, the landmark is a symbol of Hyderabad and officially incorporated in the emblem of Telangana The Charminar's long history includes the existence of a mosque on its top floor for more than 425 years.",
  rating: 4,
};

const agraData: Place = {
  name: "Taj Mahal",
  location: "Agra, Uttar Pradesh",
  url: "http://10.2.134.31:3000/api/agra",
  image: "https://i.stack.imgur.com/yIzig.jpg",
  description:
    "The Taj Mahal is an Islamic ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1631 by the Mughal emperor Shah Jahan (r. 1628–1658) to house the tomb of his favourite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.",
  rating: 5,
};

const goaData: Place = {
  name: "Goa",
  location: "Goa, India",
  url: "http://10.2.134.31:3000/api/goa",
  image: "https://i.stack.imgur.com/pIEID.jpg",
  description:
    "The history of Goa dates back to prehistoric times, though the present-day state of Goa was only established as recently as 1987. In spite of being India's smallest state by area, Goa's history is both long and diverse. It shares a lot of similarities with Indian history, especially with regard to colonial influences and a multi-cultural aesthetic.",
  rating: 5,
};

const keralaData: Place = {
  name: "Kerala",
  location: "Kerala, India",
  url: "http://10.2.134.31:3000/api/kerala",
  image: "https://i.stack.imgur.com/KWrhK.jpg",
  description:
    "Kerala God's Own Country is the perfect introduction to travel in India. Kerala has lots of fascinating and romantic destinations in this beautiful Indian state which appeal tourists, and couples from all over the world. Ayurveda is a perfect ancient science of life; and Kerala is the home of Ayurveda, one of the oldest forms of traditional medicine in the world, which focuses on a holistic approach to wellbeing.",
  rating: 5,
};

const mumbaiData: Place = {
  name: "Mumbai",
  location: "Maharastra, India",
  url: "http://10.2.134.31:3000/api/mumbai",
  image: "https://i.stack.imgur.com/qj9CQ.jpg",
  description:
    "Mumbai is the centre of the Mumbai Metropolitan Region, the sixth most populous metropolitan area in the world with a population of over 2.3 crore (23 million).Mumbai is built on what was once an archipelago of seven islands: Isle of Bombay, Parel, Mazagaon, Mahim, Colaba, Worli, and Old Woman's Island (also known as Little Colaba)  ",
  rating: 4,
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { place } = req.query;
  if (place === "hyderabad") {
    res.status(200).json({ result: hyderabadData });
  } else if (place === "agra") {
    res.status(200).json({ result: agraData });
  } else if (place === "goa") {

    res.status(200).json({ result: goaData });
  } else if (place === "kerala") {
    res.status(200).json({ result: keralaData });
  } else if (place === "mumbai") {
    res.status(200).json({ result: mumbaiData });
  }
  else {
    res.status(404).json({ result: null });
  }

}

