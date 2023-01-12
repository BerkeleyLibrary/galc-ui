import { Facet } from "../../src/types/Facet"
import { Term } from "../../src/types/Term"

// --------------------------------------------------------------------------------
// Facet definitions

// ----------------------------------------
// Size

// facet
const size: Facet = { id: '2', name: 'Size', allowMultiple: false, ord: 0, terms: [] }

// terms
const szSmall: Term = { facet: size, id: '3', value: 'Small', ord: 0 }
const szMedium: Term = { facet: size, id: '4', value: 'Medium', ord: 1 }
const szLarge: Term = { facet: size, id: '5', value: 'Large', ord: 2 }
const szOversized: Term = { facet: size, id: '6', value: 'Oversized', ord: 3 }

size.terms = [szSmall, szMedium, szLarge, szOversized]

// ----------------------------------------
// Decade

// facet
const decade: Facet = { id: '3', name: 'Decade', allowMultiple: false, ord: 1, terms: [] }

// terms
const before1900: Term = { facet: decade, id: '7', value: 'Before 1900', ord: 0 }
const d1900s: Term = { facet: decade, id: '8', value: '1900-1909', ord: 1 }
const d1910s: Term = { facet: decade, id: '9', value: '1910-1919', ord: 2 }
const d1920s: Term = { facet: decade, id: '10', value: '1920-1929', ord: 3 }
const d1930s: Term = { facet: decade, id: '11', value: '1930-1939', ord: 4 }
const d1940s: Term = { facet: decade, id: '12', value: '1940-1949', ord: 5 }
const d1950s: Term = { facet: decade, id: '13', value: '1950-1959', ord: 6 }
const d1960s: Term = { facet: decade, id: '14', value: '1960-1969', ord: 7 }
const d1970s: Term = { facet: decade, id: '15', value: '1970-1979', ord: 8 }
const d1980s: Term = { facet: decade, id: '16', value: '1980-1989', ord: 9 }
const d1990s: Term = { facet: decade, id: '17', value: '1990-1999', ord: 10 }
const after1999: Term = { facet: decade, id: '18', value: 'After 1999', ord: 11 }
const noDate: Term = { facet: decade, id: '19', value: 'No Date', ord: 12 }

decade.terms = [before1900, d1900s, d1910s, d1920s, d1930s, d1940s, d1950s, d1960s, d1970s, d1980s, d1990s, after1999, noDate]

// ----------------------------------------
// Genre

// facet
const genre: Facet = { id: '4', name: 'Genre', allowMultiple: true, ord: 2, terms: [] }

// terms
const abstract: Term = { facet: genre, id: '20', value: 'Abstract' }
const animals: Term = { facet: genre, id: '21', value: 'Animals' }
const cityscape: Term = { facet: genre, id: '22', value: 'Cityscape' }
const figurative: Term = { facet: genre, id: '23', value: 'Figurative' }
const landscape: Term = { facet: genre, id: '24', value: 'Landscape' }
const popArt: Term = { facet: genre, id: '25', value: 'Pop Art' }
const religious: Term = { facet: genre, id: '26', value: 'Religious' }
const stillLife: Term = { facet: genre, id: '27', value: 'Still Life' }
const textBased: Term = { facet: genre, id: '28', value: 'Text Based' }

genre.terms = [abstract, animals, cityscape, figurative, landscape, popArt, religious, stillLife, textBased]

// ----------------------------------------
// Medium

// facet
const medium: Facet = { id: '5', name: 'Medium', allowMultiple: true, ord: 3, terms: [] }

// terms
const collage: Term = { facet: medium, id: '30', value: 'Collage' }
const giclee: Term = { facet: medium, id: '35', value: 'Giclée' }
const intaglio: Term = { facet: medium, id: '36', value: 'Intaglio' }
const mixedMedia: Term = { facet: medium, id: '40', value: 'Mixed Media' }
const monoprint: Term = { facet: medium, id: '41', value: 'Monoprint' }
const monotype: Term = { facet: medium, id: '42', value: 'Monotype' }
const painting: Term = { facet: medium, id: '43', value: 'Painting' }
const photograph: Term = { facet: medium, id: '44', value: 'Photograph' }
const planographic: Term = { facet: medium, id: '47', value: 'Planographic' }
const relief: Term = { facet: medium, id: '48', value: 'Relief' }
const stencil: Term = { facet: medium, id: '52', value: 'Stencil' }
const unidentified: Term = { facet: medium, id: '53', value: 'Unidentified' }
const risograph: Term = { facet: medium, id: '58', value: 'Risograph' }

const aquatint: Term = { facet: medium, id: '29', value: 'Aquatint', parent: intaglio }
const drypoint: Term = { facet: medium, id: '32', value: 'Drypoint', parent: intaglio }
const engraving: Term = { facet: medium, id: '33', value: 'Engraving', parent: intaglio }
const etching: Term = { facet: medium, id: '34', value: 'Etching', parent: intaglio }
const mezzotint: Term = { facet: medium, id: '39', value: 'Mezzotint', parent: intaglio }
const photoprint: Term = { facet: medium, id: '46', value: 'Photoprint', parent: intaglio }
const reliefEtching: Term = { facet: medium, id: '49', value: 'Relief Etching', parent: intaglio }
intaglio.children = [aquatint, drypoint, engraving, etching, mezzotint, photoprint, reliefEtching]

const lithograph: Term = { facet: medium, id: '38', value: 'Lithograph', parent: planographic }
const photolithograph: Term = { facet: medium, id: '45', value: 'Photolithograph', parent: planographic }
const zincograph: Term = { facet: medium, id: '56', value: 'Zincograph', parent: planographic }
planographic.children = [lithograph, photolithograph, zincograph]

const collagraph: Term = { facet: medium, id: '31', value: 'Collagraph', parent: relief }
const linocut: Term = { facet: medium, id: '37', value: 'Linocut', parent: relief }
const woodEngraving: Term = { facet: medium, id: '54', value: 'Wood Engraving', parent: relief }
const woodcut: Term = { facet: medium, id: '55', value: 'Woodcut', parent: relief }
relief.children = [collagraph, linocut, woodEngraving, woodcut]

const serigraph: Term = { facet: medium, id: '50', value: 'Serigraph', parent: stencil }
const silkscreen: Term = { facet: medium, id: '51', value: 'Silkscreen', parent: stencil }
stencil.children = [serigraph, silkscreen]

medium.terms = [collage, giclee, intaglio, mixedMedia, monoprint, monotype, painting, photograph, planographic, relief, stencil, unidentified, risograph, aquatint, drypoint, engraving, etching, mezzotint, photoprint, reliefEtching, lithograph, photolithograph, zincograph, collagraph, linocut, woodEngraving, woodcut, serigraph, silkscreen]

// ----------------------------------------
// Appearance

// facet
const appearance: Facet = { id: '1', name: 'Appearance', allowMultiple: false, ord: 4, terms: [] }

// terms
const color: Term = { facet: appearance, id: '1', value: 'Color' }
const blackAndWhite: Term = { facet: appearance, id: '2', value: 'Black and White' }

appearance.terms = [color, blackAndWhite]

// --------------------------------------------------------------------------------
// Exports

const facets = [size, decade, genre, medium, appearance]

export { facets }
