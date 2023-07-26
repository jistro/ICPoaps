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
  };

  let POAP = Map.HashMap<idPoap, POAPmetadata>(0, Text.equal, Text.hash);

  public func newPoap(metadata : POAPmetadata): async () {
      assert metadata.mintLimit > 0;
      counter += 1;
      POAP.put(Nat.toText counter, metadata);
      Debug.print("POAP created");

  };

  public func getPoap(id : Text): async ?POAPmetadata{
    POAP.get(id);
  };

  
};
