import {Image} from "./Image";
import { Term } from "./Term"

// TODO: separate ItemPatch (w/ID optional) from Item
type Item = {
    // Required
    id?: string,
    title: string,
    suppressed: boolean,

    // Optional
    artist?: string,
    artistUrl?: string,
    date?: string,
    description?: string,
    dimensions?: string,
    series?: string,
    mmsId?: string,
    barcode?: string,
    circulation?: string,
    location?: string,
    value?: string,
    appraisalDate?: string,
    notes?: string,
    reserveDate?: string,
    createdAt?: string,
    updatedAt?: string,
    permalinkUri?: string

    // Relationships
    image?: Image
    terms: Array<Term>
}

export type { Item }
