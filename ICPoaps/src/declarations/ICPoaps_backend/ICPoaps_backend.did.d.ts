import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface POAPmetadata {
  'title' : string,
  'code' : string,
  'minted' : bigint,
  'isOnline' : boolean,
  'description' : string,
  'isCertification' : boolean,
  'mintLimit' : bigint,
  'eventCountry' : string,
  'image' : string,
  'eventUrl' : string,
  'eventCity' : string,
  'eventDate' : string,
}
export interface UserPoapListData { 'indexList' : bigint, 'idUser' : string }
export interface metadataNewPOAP {
  'title' : string,
  'code' : string,
  'isOnline' : boolean,
  'description' : string,
  'isCertification' : boolean,
  'mintLimit' : bigint,
  'eventCountry' : string,
  'image' : string,
  'eventUrl' : string,
  'eventCity' : string,
  'eventDate' : string,
}
export interface metadataPOAPForUser {
  'title' : string,
  'minted' : bigint,
  'isOnline' : boolean,
  'description' : string,
  'isCertification' : boolean,
  'mintLimit' : bigint,
  'eventCountry' : string,
  'image' : string,
  'eventUrl' : string,
  'eventCity' : string,
  'eventDate' : string,
}
export interface mintPoapData {
  'id' : string,
  'code' : string,
  'user' : string,
}
export interface _SERVICE {
  'getPoapInfo' : ActorMethod<[string], metadataPOAPForUser>,
  'getPoapInfoForDev' : ActorMethod<[string], [] | [POAPmetadata]>,
  'getPoapMintedByUserFromTheList' : ActorMethod<
    [UserPoapListData],
    metadataPOAPForUser
  >,
  'getSizeListOfPoapMintedByUser' : ActorMethod<[string], bigint>,
  'mintPoap' : ActorMethod<[mintPoapData], bigint>,
  'newPoap' : ActorMethod<[metadataNewPOAP], bigint>,
}
