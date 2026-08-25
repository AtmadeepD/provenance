export type AirframeState = 'active' | 'stored' | 'withdrawn' | 'scrapped' | 'written_off' | 'preserved' | 'unknown';
export type EventType = 'delivery' | 'transfer' | 'repossession' | 'returned_to_lessor' | 'sold' | 'conversion' | 'accident' | 'storage' | 'return_to_service' | 'scrapped' | 'preserved';
export type ConfidenceLevel = 'verified' | 'partial' | 'sketchy';

export interface Confidence {
  identity: ConfidenceLevel;
  status: ConfidenceLevel;
}

export interface AirframeStatus {
  state: AirframeState;
  place?: {
    name: string;
  };
  as_of: string;
  last_physical_sighting?: string;
  note?: string;
}

export interface AirframeEvent {
  date: string;
  type: EventType;
  place?: string;
  party?: string;
  flight?: string;
  outcome?: string;
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
  status: AirframeStatus;
  events: AirframeEvent[];
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
  snapshot_fleet_size?: {
    count: string;
    as_of: string;
    sources?: string[];
  };
  obituary_md: string;
  airframes: Airframe[];
}
