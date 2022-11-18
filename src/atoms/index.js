import {atom} from "recoil"
export const jwtState = atom({
    key: "jwt",
    default: null
})

export const providerAtom = atom({
    key: "provider",
    default: null
})

export const signerAtom = atom({
    key: "signer",
    default: null
})