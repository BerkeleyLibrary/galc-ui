import { Item } from '../../src/types/Item'
import { Availability } from '../../src/types/Availability'
import {
  abstract,
  after1999,
  blackAndWhite,
  cityscape,
  collage,
  color,
  d1910s,
  d1950s,
  d1970s,
  d1990s,
  etching,
  figurative,
  popArt,
  serigraph,
  silkscreen,
  szLarge,
  szMedium,
  szSmall,
  woodcut
} from './facets'

// --------------------------------------------------
// Alicia, Juana - "Auto Vision, No. 15"

export const aliciaVision: Item = {
  id: "798",
  title: "Auto Vision, No. 15",
  suppressed: false,
  artist: "Alicia, Juana",
  artistUrl: "https://en.wikipedia.org/wiki/Juana_Alicia",
  date: "1995",
  description: "Signed and numbered.",
  dimensions: "30 x 23.5\"",
  series: "\"15/75\"",
  mmsId: "991078647729706532",
  barcode: "C104970805",
  value: "500",
  reserveDate: "2019-09-02",
  permalinkUri: "https://search.library.berkeley.edu/permalink/01UCS_BER/iqob43/alma991078647729706532",
  terms: [color, figurative, silkscreen, d1990s, szLarge],
  image: {
    id: '13',
    thumbnail: 'Alicia(Auto15)_360px.jpg',
    basename: 'Alicia(Auto15).jpg',
    links: {
      alternate: { href: "/images/13.jpg" },
      icon: { href: "/images/13/thumbnail.jpg" },
    }
  }
}

// --------------------------------------------------
// Johnston, Ynez - "Ivory Coast"

export const johnstonCoast: Item = {
  id: "244",
  title: "Ivory Coast",
  suppressed: false,
  artist: "Johnston, Ynez",
  artistUrl: "https://en.wikipedia.org/wiki/Ynez_Johnston",
  date: "1958",
  description: "Signed and numbered. Lightstained.",
  dimensions: "27.5 x 21.5\"",
  series: "\"126/210\"",
  mmsId: "991051282579706532",
  barcode: "c093333352",
  value: "500",
  appraisalDate: "2006",
  reserveDate: "2019-08-30",
  permalinkUri: "https://search.library.berkeley.edu/permalink/01UCS_BER/iqob43/alma991051282579706532",
  terms: [color, cityscape, etching, d1950s, szMedium],
  image: {
    id: '440',
    thumbnail: 'Johnston(IvoryCoast)_360px.jpg',
    basename: 'Johnston(IvoryCoast).jpg',
    links: {
      alternate: { href: "/images/440.jpg" },
      icon: { href: "/images/440/thumbnail.jpg" },
    }
  }
}

// --------------------------------------------------
// Jones, Liza - "Candy Heart"

export const jonesHeart: Item = {
  id: "246",
  title: "Candy Heart",
  suppressed: false,
  artist: "Jones, Liza",
  artistUrl: "http://portlandartmuseum.us/mwebcgi/mweb.exe?request=record;id=8468;type=701",
  date: "1979",
  description: "Signed and numbered.",
  dimensions: "21.5 x 17.5\"",
  series: "\"23/100\"",
  mmsId: "991051082609706532",
  barcode: "c087370778",
  value: "200",
  appraisalDate: "2006",
  reserveDate: "2018-08-25",
  permalinkUri: "https://search.library.berkeley.edu/permalink/01UCS_BER/iqob43/alma991051082609706532",
  terms: [color, popArt, collage, etching, d1970s, szMedium],
  image: {
    id: '442',
    thumbnail: 'Jones (Candy Heart)_360px.jpg',
    basename: 'Jones (Candy Heart).jpg',
    links: {
      alternate: { href: "/images/442.jpg" },
      icon: { href: "/images/442/thumbnail.jpg" },
    }
  }
}

// --------------------------------------------------
// Kollwitz, Kathe - "Mother with Child in Arms"

export const kollwitzMother: Item = {
  id: "810",
  title: "Mother with Child in Arms",
  suppressed: true,
  artist: "Kollwitz, Kathe",
  artistUrl: "https://en.wikipedia.org/wiki/K%C3%A4the_Kollwitz",
  date: "1910",
  description: "Blind stamp in lower right corner: \"avd Becke Muenchen-22.\"",
  dimensions: "15.5 x 12\"",
  barcode: "C104970878",
  circulation: "NON-CIRC",
  value: "1500",
  notes: "b18372399",
  reserveDate: "",
  permalinkUri: "false",
  terms: [blackAndWhite, figurative, etching, szSmall, d1910s],
  image: {
    id: '501',
    thumbnail: 'Kollwitz (Mother)_360px.jpg',
    basename: 'Kollwitz (Mother).jpg',
    links: {
      alternate: { href: "/images/501.jpg" },
      icon: { href: "/images/501/thumbnail.jpg" },
    }
  }
}

// --------------------------------------------------
// Nakayama, Masako - "Aquifer"

export const nakayamaAquifer: Item = {
  id: "1037",
  title: "Aquifer",
  suppressed: false,
  artist: "Nakayama, Masako",
  date: "1975",
  dimensions: "15.5 x 20\"",
  series: "9/20",
  mmsId: "991047232109706532",
  barcode: "C103787105",
  notes: "Gift of Frances and Ben Burr",
  reserveDate: "2019-08-28",
  permalinkUri: "https://search.library.berkeley.edu/permalink/01UCS_BER/iqob43/alma991047232109706532",
  terms: [color, abstract, woodcut, szSmall, d1970s],
  image: {
    id: '648',
    thumbnail: 'Nakayama(Untitled)_360px.jpg',
    basename: 'Nakayama(Untitled).jpg',
    links: {
      alternate: { href: "/images/648.jpg" },
      icon: { href: "/images/648/thumbnail.jpg" },
    }
  }
}

// --------------------------------------------------
// Oparah, Nkiruka - "Untitled (It's All Here)"

export const oparahUntitled: Item = {
  id: "1101",
  title: "Untitled (It's All Here)",
  suppressed: false,
  artist: "Oparah, Nkiruka",
  artistUrl: "http://www.nkirukaoparah.com/",
  date: "2019",
  description: "Hand-signed by artist on back. Detail in colored pencil.",
  dimensions: "18 x 21.5\"",
  series: "\"3/4\"",
  mmsId: "991056573609706532",
  barcode: "C104987948",
  reserveDate: "",
  permalinkUri: "https://search.library.berkeley.edu/permalink/01UCS_BER/iqob43/alma991056573609706532",
  terms: [blackAndWhite, abstract, serigraph, szSmall, after1999],
  image: {
    id: '674',
    thumbnail: 'Oparah(Unititled)_360px.jpg',
    basename: 'Oparah(Unititled).jpg',
    links: {
      alternate: { href: "/images/674.jpg" },
      icon: { href: "/images/674/thumbnail.jpg" },
    }
  }
}

export const items = [aliciaVision, johnstonCoast, jonesHeart, kollwitzMother, nakayamaAquifer, oparahUntitled]

export const availability: Availability = {
  "991078647729706532": true,
  "991051282579706532": true,
  "991051082609706532": true,
  "991047232109706532": true,
  "991056573609706532": true,
}

export const pagination = { current: 1, records: items.length, offset: 0, limit: 30 }

export const results = {
  data: items,
  meta: { availability, pagination }
}
