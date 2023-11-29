import type { ClassSignature } from "./common.type";

export type Provider = [token: symbol, instance: {}];

export type Importer = [
  token: symbol,
  {
    constructor: ClassSignature;
    requirements: symbol[];
  },
];
