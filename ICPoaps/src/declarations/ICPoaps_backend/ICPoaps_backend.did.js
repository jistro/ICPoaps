export const idlFactory = ({ IDL }) => {
  const metadataPOAPForUser = IDL.Record({
    'title' : IDL.Text,
    'minted' : IDL.Nat,
    'isOnline' : IDL.Bool,
    'description' : IDL.Text,
    'isCertification' : IDL.Bool,
    'mintLimit' : IDL.Nat,
    'eventCountry' : IDL.Text,
    'image' : IDL.Text,
    'eventUrl' : IDL.Text,
    'eventCity' : IDL.Text,
    'eventDate' : IDL.Text,
  });
  const POAPmetadata = IDL.Record({
    'title' : IDL.Text,
    'code' : IDL.Text,
    'minted' : IDL.Nat,
    'isOnline' : IDL.Bool,
    'description' : IDL.Text,
    'isCertification' : IDL.Bool,
    'mintLimit' : IDL.Nat,
    'eventCountry' : IDL.Text,
    'image' : IDL.Text,
    'eventUrl' : IDL.Text,
    'eventCity' : IDL.Text,
    'eventDate' : IDL.Text,
  });
  const UserPoapListData = IDL.Record({
    'indexList' : IDL.Nat,
    'idUser' : IDL.Text,
  });
  const mintPoapData = IDL.Record({
    'id' : IDL.Text,
    'code' : IDL.Text,
    'user' : IDL.Text,
  });
  const metadataNewPOAP = IDL.Record({
    'title' : IDL.Text,
    'code' : IDL.Text,
    'isOnline' : IDL.Bool,
    'description' : IDL.Text,
    'isCertification' : IDL.Bool,
    'mintLimit' : IDL.Nat,
    'eventCountry' : IDL.Text,
    'image' : IDL.Text,
    'eventUrl' : IDL.Text,
    'eventCity' : IDL.Text,
    'eventDate' : IDL.Text,
  });
  return IDL.Service({
    'getPoapInfo' : IDL.Func([IDL.Text], [metadataPOAPForUser], ['query']),
    'getPoapInfoForDev' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(POAPmetadata)],
        ['query'],
      ),
    'getPoapMintedByUserFromTheList' : IDL.Func(
        [UserPoapListData],
        [metadataPOAPForUser],
        ['query'],
      ),
    'getSizeListOfPoapMintedByUser' : IDL.Func(
        [IDL.Text],
        [IDL.Nat],
        ['query'],
      ),
    'mintPoap' : IDL.Func([mintPoapData], [IDL.Nat], []),
    'newPoap' : IDL.Func([metadataNewPOAP], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
