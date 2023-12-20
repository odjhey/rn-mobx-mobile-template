/*
{
  "page": 1,
  "perPage": 30,
  "totalItems": 1,
  "totalPages": 1,
  "items": [
    {
      "collectionId": "chqyyzjeqwf81yl",
      "collectionName": "pokemons",
      "created": "2023-12-20 07:36:55.074Z",
      "id": "gsfmecwfmaml6p6",
      "name": "psyduck",
      "type": [
        "grass"
      ],
      "updated": "2023-12-20 07:36:55.074Z"
    }
  ]
}
*/

type Pokemon = {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  name: string;
  type: string[];
  updated: string;
};

type PokemonList = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Pokemon[];
};

type FetchFn = <T>(path: string, method: "GET" | "POST") => Promise<T>;

export const fetchPokemons = (fetchFn: FetchFn) => {
  return fetchFn<PokemonList>("api/collections/pokemons/records/", "GET").then(
    (res) => {
      return res.items.map((p) => ({
        name: p.name,
        id: p.id,
        type: p.type,
      }));
    },
  );
};
