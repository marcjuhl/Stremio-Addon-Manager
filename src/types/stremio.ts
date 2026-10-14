/**
 * Stremio Addon & API Type Definitions
 * Based on Stremio Addon Protocol v3 & Stremio API specifications.
 */

export interface StremioCatalog {
  type: string;
  id: string;
  name?: string;
  extra?: Array<{
    name: string;
    isRequired?: boolean;
    options?: string[];
  }>;
}

export interface StremioManifestBehaviorHints {
  configurable?: boolean;
  configurationRequired?: boolean;
  adult?: boolean;
  p2p?: boolean;
  [key: string]: unknown;
}

export interface StremioManifestResourceObject {
  name: string;
  types?: string[];
  idPrefixes?: string[];
}

export type StremioManifestResource = string | StremioManifestResourceObject;

export interface StremioManifest {
  id: string;
  version: string;
  name: string;
  description?: string;
  logo?: string;
  background?: string;
  types?: string[];
  resources?: StremioManifestResource[];
  catalogs?: StremioCatalog[];
  idPrefixes?: string[];
  behaviorHints?: StremioManifestBehaviorHints;
  contactEmail?: string;
  [key: string]: unknown;
}

export interface StremioAddonFlags {
  official?: boolean;
  protected?: boolean;
  [key: string]: unknown;
}

export interface StremioAddonDescriptor {
  transportUrl: string;
  transportName?: string;
  manifest: StremioManifest;
  flags?: StremioAddonFlags;
  installed?: boolean;
  [key: string]: unknown;
}

export interface StremioUser {
  id?: string;
  email?: string;
  avatar?: string;
  fbId?: string;
  fullname?: string;
  premium_expire?: string | null;
  [key: string]: unknown;
}

export interface StremioAuthResponse {
  result?: {
    authKey: string;
    user?: StremioUser;
    [key: string]: unknown;
  };
  error?: {
    code?: number;
    message?: string;
    [key: string]: unknown;
  };
}

export interface StremioAddonCollectionGetResponse {
  result?: {
    addons: StremioAddonDescriptor[];
    lastModified?: string | number;
    [key: string]: unknown;
  };
  error?: {
    code?: number;
    message?: string;
    [key: string]: unknown;
  };
}

export interface StremioAddonCollectionSetResponse {
  result?: {
    success?: boolean;
    [key: string]: unknown;
  };
  error?: {
    code?: number;
    message?: string;
    [key: string]: unknown;
  };
}

export type AuthMode = 'key' | 'credentials' | 'demo';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
