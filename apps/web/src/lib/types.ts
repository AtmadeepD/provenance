export type LineStatus = 'active' | 'stored' | 'scrapped' | 'preserved' | 'written_off' | 'unknown';
export type Confidence = 'verified' | 'partial' | 'sketchy';

export interface Fate {
  status: LineStatus;
  place?: {
    name: string;
    icao: string;
  };
  date?: string;
  note?: string;
}

export interface Identity {
  reg: string;
  country: string;
  from?: string | null;
  to?: string | null;
}

export interface Era {
  operator_id: string;
  role: string;
  from?: string | null;
  to?: string | null;
}

export interface Conversion {
  kind: 'freighter' | 'vip' | 'tanker' | 'test';
  date: string;
}

export interface Source {
  ref: string;
  note?: string;
}

export interface Airframe {
  airframe_id: string;
  manufacturer: string;
  type: string;
  msn: string;
  first_flight?: string | null;
  line_status: LineStatus;
  fate: Fate;
  identities: Identity[];
  eras: Era[];
  conversions?: Conversion[];
  sources: Source[];
  confidence: Confidence;
}

export interface AirlineData {
  operator_id: string;
  name: string;
  country: string;
  founded: number | string;
  ceased?: string | null;
  livery: {
    primary: string;
    secondary: string;
  };
  obituary_md: string;
  airframes: Airframe[];
}
