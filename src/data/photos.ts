export interface LensPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
  orientation?: "portrait" | "landscape";
  blur?: string;
  pinned?: boolean;
}

export const LENS_PHOTOS: LensPhoto[] = [
  {
    id: "24",
    url: "/photography/7062_1783717766914_optimized.webp",
    description: "fourth of july weirdly edited photo",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABwBACdASoUABQAPyV6slOuJ6Sit/qoAcAkiWNpzlClbqIh7/S+ElIs0roziAD+7hwfQotekKxG6zrTa2QHdmahwyj9zV8NUwcYIpLoIXcA/IRXvh4q9gAAAAA=",
    pinned: true
  },
  {
    id: "37",
    url: "/photography/PXL_20260709_0508034562_1783718361121_optimized.webp",
    description: "the setup",
    date: "Jul 9, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAwCdASoUAA0APzmGuVOvKSWisAgB4CcJYwDImApsFr3mSEAAAP4WcQowGvS+J86eQnfIDzXewtA83t0G5C3nIVdMsSzk6yOaHIfvqZoAAA==",
    pinned: true
  },
  {
    id: "36",
    url: "/photography/PXL_20260705_1526255632_1783718350483_optimized.webp",
    description: "wide shot pelican and little gull aura",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA8APzmGuVOvKSWisAgB4CcJQBOkJABXukaVuF6q6BwAAP3SA9E8ANB58wSvN/Xq48Vtap8cGcP2IsHGUo0y7ri6Jt6W8D9owiNAAAA="
  },
  {
    id: "35",
    url: "/photography/PXL_20260705_1526196952_1783718331804_optimized.webp",
    description: "pelican and little gull aura",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoPABQAPzmKulOvKaWisAgB4CcJZAC06CHEyFs1Hpv7jxgQAP5Rpga29vfubifH15t5SMKW67oqVdwRhD6wJ+TIC7SaocZMPy1wx7gDLQAAAA=="
  },
  {
    id: "34",
    url: "/photography/PXL_20260705_152634614_1783718273422_optimized.webp",
    description: "laughing gull aura",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAA="
  },
  {
    id: "33",
    url: "/photography/PXL_20260705_152646272_1783718252277_optimized.webp",
    description: "laughing gull on dock post",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x+w8UaZMAP70j1f8/T+78f+bMh2Uf9xZ/rV58Qz8a/0aR/29kM/2OAAAAA=="
  },
  {
    id: "32",
    url: "/photography/PXL_20260705_143615174_1783718237730_optimized.webp",
    description: "wildflower bloom",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwAwCdASoPABQAPzmEtVOvKCWisAgB4CcJZwAAz3r+h2l/4f+f0o7/4QAA/s8h/4f/7u/+11/+93/4f/4c/93/8b/4g/+4f/93/4f/4g/93/8b/4g/+4f/9wAA"
  },
  {
    id: "31",
    url: "/photography/PXL_20260705_141648057_1783718218171_optimized.webp",
    description: "marina horizon line",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "30",
    url: "/photography/PXL_20260705_141639017_1783718204683_optimized.webp",
    description: "coastal boardwalk perspective",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APzmGulOvKaWisAgB4CcJQBOg7oG9YAA/s//44B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x4AA="
  },
  {
    id: "29",
    url: "/photography/PXL_20260705_140925763_1783718182747_optimized.webp",
    description: "morning glare on dock waters",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APzmGulOvKaWisAgB4CcJQBOg7oG9YAA/s//44B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x4AA="
  },
  {
    id: "28",
    url: "/photography/PXL_20260705_140919973_1783718146903_optimized.webp",
    description: "boat wake texture",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APzmGulOvKaWisAgB4CcJQBOg7oG9YAA/s//44B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x4AA="
  },
  {
    id: "27",
    url: "/photography/PXL_20260705_140417743_1783718131379_optimized.webp",
    description: "sunlight bouncing off water ripples",
    date: "Jul 5, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APzmGulOvKaWisAgB4CcJQBOg7oG9YAA/s//44B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x7/d1/s/84B/f8/x4AA="
  },
  {
    id: "26",
    url: "/photography/PXL_20260705_140320490_1783718105955_optimized.webp",
    description: "harbor reflection details",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "25",
    url: "/photography/PXL_20260705_135957018_1783718090715_optimized.webp",
    description: "wooden dock planks in perspective",
    date: "Jul 5, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "23",
    url: "/photography/PXL_20260704_180422961_1783717753177_optimized.webp",
    description: "clouds moving over tree line",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "22",
    url: "/photography/PXL_20260704_180327660_1783717726581_optimized.webp",
    description: "overcast sky geometry",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "21",
    url: "/photography/PXL_20260704_180315053_1783717698656_optimized.webp",
    description: "subtle light through canopy",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "20",
    url: "/photography/PXL_20260704_180302787_1783717684729_optimized.webp",
    description: "minimalist cloud formation",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "19",
    url: "/photography/PXL_20260704_180252329_1783717658097_optimized.webp",
    description: "soft daylight atmospheric view",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "18",
    url: "/photography/PXL_20260704_180244673_1783717637841_optimized.webp",
    description: "abstract tree silhouette",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "17",
    url: "/photography/PXL_20260704_174955743_1783717618957_optimized.webp",
    description: "deep green forest depth",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "16",
    url: "/photography/PXL_20260704_174706509_1783717600868_optimized.webp",
    description: "path through park trees",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "15",
    url: "/photography/PXL_20260704_174659495_1783717584107_optimized.webp",
    description: "foliage pattern and shadows",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "14",
    url: "/photography/PXL_20260704_174640195_1783717565882_optimized.webp",
    description: "green leaves close up",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "13",
    url: "/photography/PXL_20260704_174635678_1783717551061_optimized.webp",
    description: "shadows falling on lawn grass",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "12",
    url: "/photography/PXL_20260704_174628203_1783717529803_optimized.webp",
    description: "branches against pale sky",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "11",
    url: "/photography/PXL_20260704_174618788_1783717514332_optimized.webp",
    description: "pine needles in daylight",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "10",
    url: "/photography/PXL_20260704_174613271_1783717489508_optimized.webp",
    description: "bark texture on tree trunk",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "9",
    url: "/photography/PXL_20260704_174607736_1783717468155_optimized.webp",
    description: "open grass field view",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "8",
    url: "/photography/PXL_20260704_174548811_1783717441113_optimized.webp",
    description: "moss growing on stones",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "7",
    url: "/photography/PXL_20260704_174540417_1783717415444_optimized.webp",
    description: "summer afternoon tree tops",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "6",
    url: "/photography/PXL_20260704_174534720_1783717395015_optimized.webp",
    description: "nature trail scenery",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "5",
    url: "/photography/PXL_20260704_174526553_1783717377196_optimized.webp",
    description: "outdoor path composition",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "4",
    url: "/photography/PXL_20260704_174519965_1783717357497_optimized.webp",
    description: "woodland sunlight",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "3",
    url: "/photography/PXL_20260704_174512409_1783717336113_optimized.webp",
    description: "natural green tones",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "2",
    url: "/photography/PXL_20260704_174505322_1783717316719_optimized.webp",
    description: "wild greenery study",
    date: "Jul 4, 2026",
    orientation: "portrait",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoPABQAPzmGtlOvKSWisAgB4CcJaQDOcAm7x/47jxgQAP70f4O/4xZ/wV79uM2H49wOq4i8w9Z7B8b1+7kZ0p98/1fIAAAAAAA="
  },
  {
    id: "1",
    url: "/photography/PXL_20260704_174457637_1783717296572_optimized.webp",
    description: "forest clearing lighting",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  },
  {
    id: "0",
    url: "/photography/PXL_20260704_174447000_1783717277636_optimized.webp",
    description: "tall trees low angle",
    date: "Jul 4, 2026",
    orientation: "landscape",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IFAAAADwAwCdASoUAA8APzmGtlOvKSWisAgB4CcJQBOg9GfV/7Z3f+P/28v9/x/yqP8Z/w7/wP/8T/eH/6f/3N370///h3/6f/3N370///h3/6f/3QAA"
  }
];
