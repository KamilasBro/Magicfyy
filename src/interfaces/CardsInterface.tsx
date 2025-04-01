export interface CardlistData {
  has_more: boolean;
  total_cards: number;
  data: CardData[];
}

export interface CardData {
  layout: string;
  all_parts: [];
  card_back_id?: string;
  legalities: string;
  released_at: string;
  id: string;
  name: string;
  set: string;
  collector_number: string;
  oracle_text: string;
  type_line: string;
  mana_cost: string;
  power?: number;
  toughness?: number;
  loyalty?: number;
  set_name: string;
  rarity: string;
  image_uris?: {
    normal: string;
  };
  card_faces?: {
    mana_cost: string;
    type_line: string;
    power?: number;
    toughness?: number;
    oracle_text: string;
    flavor_text: string;
    name: string;
    loyalty?: number;
    image_uris: {
      normal: string;
    };
  }[];
  prints_search_uri: string;
  rulings_uri: string;
  length: number;
  artist: string;
  flavor_text: string;
}

export interface RulingsData {
  comment: string;
  oracle_id: string;
  published_at: string;
  length: number;
}

export interface CardSymbolData {
  appears_in_mana_costs: boolean;
  cmc: number;
  colors: string[];
  english: string;
  funny: boolean;
  gatherer_alternates: string[];
  hybrid: boolean;
  loose_variant: string | null;
  mana_value: number;
  object: string;
  phyrexian: boolean;
  represents_mana: boolean;
  svg_uri: string;
  symbol: string;
  transposable: boolean;
}
export interface Set {
  id: string;
  name: string;
  icon_svg_uri: string;
  code: string;
  uri: string;
  released_at?: string;
}
