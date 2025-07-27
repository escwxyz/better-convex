export type CreditBundleDetails = {
  key: '1' | '2' | '3';
  extra: number | null;
  price: string;
  value: number;
};

export const creditBundlesByKey = {
  1: {
    key: '1' as const,
    extra: null,
    price: '9',
    value: 1000,
  },
  2: {
    key: '2' as const,
    extra: 12,
    price: '23',
    value: 2800,
  },
  3: {
    key: '3' as const,
    extra: 25,
    price: '37',
    value: 5000,
  },
};

export const creditBundles = [
  creditBundlesByKey[1],
  creditBundlesByKey[2],
  creditBundlesByKey[3],
];
