import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor {
  stable var counter = 1;
  type idPoap = Text;
  type titlePoap = Text;
  type imagePoap = Text;
  type descriptionPoap = Text;
  type isCertificationPoap = Bool;
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
    isCertification : isCertificationPoap;
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
    isCertification : isCertificationPoap;
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
    // como poder hacer una tabla para guardar los poaps que tiene cada usuario
  };

  let POAP = Map.HashMap<idPoap, POAPmetadata>(0, Text.equal, Text.hash);
  let User = Map.HashMap<userAddress, UserMetadata>(0, Text.equal, Text.hash);

  /// funcion que genera un nuevo poap y lo guarda en la tabla
  public func newPoap(metadata : metadataNewPOAP): async () {
      if  (metadata.mintLimit <= 0) {
        Debug.trap("You must enter a mint limit");
      };
      if (metadata.title == "") {
        Debug.trap("You must enter a title");
      };
      if (metadata.image == "") {
        Debug.trap("You must enter a image");
      };
      if (metadata.description == "") {
        Debug.trap("You must enter a description");
      };
    
      /* 
      * verifica si el poap es online o no, de ser online
      * no se guarda la ciudad y el pais y de no serlo 
      * se guarda la ciudad y el pais
      */
      if (metadata.isCertification){
        if (metadata.isOnline) {
          if (metadata.code == "") {
            Debug.trap("The online certification must have a password");
          };
          var NEWpoap = {
            title = metadata.title;
            image = metadata.image;
            description = metadata.description;
            isCertification = true;
            isOnline = true;
            eventUrl = metadata.eventUrl;
            eventCity = "";
            eventCountry = "";
            eventDate = metadata.eventDate;
            mintLimit = metadata.mintLimit;
            minted = 0;
            code = metadata.code;
          };
          POAP.put(Nat.toText counter, NEWpoap);
          Debug.print("POAP online created");
          Debug.print(Nat.toText counter);
        } else {
          if (metadata.eventCity == "") {
            Debug.trap("You irl POAP must have a city");
          };
          if (metadata.eventCountry == "") {
            Debug.trap("You irl POAP must have a country");
          };
          var NEWpoap = {
            title = metadata.title;
            image = metadata.image;
            description = metadata.description;
            isCertification = true;
            isOnline = false;
            eventUrl = metadata.eventUrl;
            eventCity = metadata.eventCity;
            eventCountry = metadata.eventCountry;
            eventDate = metadata.eventDate;
            mintLimit = metadata.mintLimit;
            minted = 0;
            code = metadata.code;
            
          };
          POAP.put(Nat.toText counter, NEWpoap);
          Debug.print("POAP offline created");
          Debug.print(Nat.toText counter);
        };
      } else {
        if (metadata.isOnline) {
          var NEWpoap = {
            title = metadata.title;
            image = metadata.image;
            description = metadata.description;
            isCertification = false;
            isOnline = true;
            eventUrl = metadata.eventUrl;
            eventCity = "";
            eventCountry = "";
            eventDate = metadata.eventDate;
            mintLimit = metadata.mintLimit;
            minted = 0;
            code = metadata.code;
          };
          POAP.put(Nat.toText counter, NEWpoap);
          Debug.print("POAP online created");
          Debug.print(Nat.toText counter);
        } else {
          if (metadata.eventCity == "") {
            Debug.trap("You irl POAP must have a city");
          };
          if (metadata.eventCountry == "") {
            Debug.trap("You irl POAP must have a country");
          };
          var NEWpoap = {
            title = metadata.title;
            image = metadata.image;
            description = metadata.description;
            isCertification = false;
            isOnline = false;
            eventUrl = metadata.eventUrl;
            eventCity = metadata.eventCity;
            eventCountry = metadata.eventCountry;
            eventDate = metadata.eventDate;
            mintLimit = metadata.mintLimit;
            minted = 0;
            code = metadata.code;
          };
          POAP.put(Nat.toText counter, NEWpoap);
          Debug.print("POAP offline created");
          Debug.print(Nat.toText counter);
        };
      };
      counter += 1;
  };

  public query func getPoap(id : Text): async ?POAPmetadata{
    POAP.get(id);
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
          isCertification = false;
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

    if (auxPoap.mintLimit == 0){
      Debug.trap("Error 404: POAP not found");
    };
    Debug.print("Pass null check");
    if (auxPoap.minted >= auxPoap.mintLimit){
      Debug.trap("POAP mint limit reached");
    };
    Debug.print("Pass minted check");
    if (auxPoap.code != ""){
      if (auxPoap.code != prop.code){
        Debug.trap("Wrong password");
      };
    };
    var data = auxPoap.minted + 1; 
    Debug.print(Nat.toText data);

    var newPoap = {
      title = auxPoap.title;
      image = auxPoap.image;
      description = auxPoap.description;
      isCertification = auxPoap.isCertification;
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
