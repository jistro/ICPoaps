import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";

actor {
  stable var counter = 0;
  type idPoap = Text;
  type titlePoap = Text;
  type imagePoap = Text;
  type descriptionPoap = Text;
  type isOnlinePoap = Bool;
  type eventUrlPoap = Text;
  type eventCityPoap = Text;
  type eventCountryPoap = Text;
  type eventDatePoap = Text;
  type poapMintLimit = Nat;
  type poapMinted = Nat;
  type userAddress = Text;
  type codePoap = Text;

  type boolAnswer = Bool;

  type POAPmetadata = {
    title : titlePoap;
    image : imagePoap;
    description : descriptionPoap;
    isOnline : isOnlinePoap;
    eventUrl : eventUrlPoap;
    eventCity : eventCityPoap;
    eventCountry : eventCountryPoap;
    eventDate : eventDatePoap;
    mintLimit : poapMintLimit;
    minted : poapMinted;
    code : codePoap;
  };

  type metadataNewPOAP = {
    title : titlePoap;
    image : imagePoap;
    description : descriptionPoap;
    isOnline : isOnlinePoap;
    eventUrl : eventUrlPoap;
    eventCity : eventCityPoap;
    eventCountry : eventCountryPoap;
    eventDate : eventDatePoap;
    mintLimit : poapMintLimit;
    code : codePoap;
  };

  type mintPoapData = {
    id : Text; user : userAddress; code : Text;
  };

  type UserMetadata = {
    poaps : Map.HashMap<idPoap, POAPmetadata>;
    // como poder hacer una tabla para guardar los poaps que tiene cada usuario
  };

  let POAP = Map.HashMap<idPoap, POAPmetadata>(0, Text.equal, Text.hash);
  let User = Map.HashMap<userAddress, UserMetadata>(0, Text.equal, Text.hash);

  public func newPoap(metadata : metadataNewPOAP): async () {
      assert metadata.mintLimit > 0;
      var NEWpoap = {
        title = metadata.title;
        image = metadata.image;
        description = metadata.description;
        isOnline = metadata.isOnline;
        eventUrl = metadata.eventUrl;
        eventCity = metadata.eventCity;
        eventCountry = metadata.eventCountry;
        eventDate = metadata.eventDate;
        mintLimit = metadata.mintLimit;
        minted = 0;
        code = metadata.code;
      };
      counter += 1;
      POAP.put(Nat.toText counter, NEWpoap);
      Debug.print("POAP created");
      Debug.print(Nat.toText counter);

  };

  public func getPoap(id : Text): async ?POAPmetadata{
    POAP.get(id);
  };

  public func getPoapQuery(id : Text) : async POAPmetadata{
    let FoundPOAPMetadata = POAP.get(id);
    var thePoap = switch (FoundPOAPMetadata) {
      case (null) {
        {
          title = "POAP not found";
          image = "";
          description = "";
          isOnline = false;
          eventUrl = "";
          eventCity = "";
          eventCountry = "";
          eventDate = "";
          mintLimit = 0;
          minted = 0;
          code = "";
        };
      };
      case (?FoundPOAPMetadata) FoundPOAPMetadata;
    };
    return thePoap;
  };
  
  public func mintPoap(prop : mintPoapData): () {
    let FoundPOAPMetadata = POAP.get(prop.id);
    Debug.print("POAP check for mint");
    var auxPoap = switch (FoundPOAPMetadata) {
      case (null) {
        {
          title = "POAP not found";
          image = "";
          description = "";
          isOnline = false;
          eventUrl = "";
          eventCity = "";
          eventCountry = "";
          eventDate = "";
          mintLimit = 0;
          minted = 0;
          code = "";
        };
      };
      case (?FoundPOAPMetadata) FoundPOAPMetadata;
    };

    Debug.print(Nat.toText (auxPoap.mintLimit));

    assert (auxPoap.mintLimit) != 0;
    Debug.print("Pass null check");
    assert auxPoap.minted <= auxPoap.mintLimit;
    Debug.print("Pass minted check");
    var data = auxPoap.minted + 1; 
    Debug.print(Nat.toText data);

    var newPoap = {
      title = auxPoap.title;
      image = auxPoap.image;
      description = auxPoap.description;
      isOnline = auxPoap.isOnline;
      eventUrl = auxPoap.eventUrl;
      eventCity = auxPoap.eventCity;
      eventCountry = auxPoap.eventCountry;
      eventDate = auxPoap.eventDate;
      mintLimit = auxPoap.mintLimit;
      minted = data;
      code = auxPoap.code;
    };

    ignore POAP.replace(prop.id, newPoap);
  };



  
};
