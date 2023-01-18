import {Links} from "./Link";

// TODO: Separate ImagePatch (w/optional fields, no Links) from Item
type Image = {
    id?: string,
    thumbnail?: string,
    basename?: string
    links?: Links
}
export type {Image};
