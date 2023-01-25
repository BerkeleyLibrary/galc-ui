import {Image} from "./Image";
import { Term } from "./Term"

type ItemAttrs = {
    title?: string,

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

}

// TODO: separate ItemPatch (w/ID optional) from Item
type Item = ItemAttrs & {
    // Required
    id?: string,
    suppressed: boolean,

    // Relationships
    image?: Image
    terms: Term[]
}

export type { ItemAttrs, Item }

export type ItemEntry = [keyof Item, string | boolean | Image | Term[]]
