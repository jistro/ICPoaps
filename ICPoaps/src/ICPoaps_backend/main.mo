import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import RBTree "mo:base/RBTree";

actor {
  // contador de id de poaps
  stable var counter = 1;

  type idPoap = Text;
  type boolAnswer = Bool;
  type POAPmetadata = {
    title : Text;
    image : Text;
    description : Text;
    isCertification : Bool;
    isOnline : Bool;
    eventUrl : Text;
    eventCity : Text;
    eventCountry : Text;
    eventDate : Text;
    mintLimit : Nat;
    minted : Nat;
    code : Text;
  };
  type metadataNewPOAP = {
    title : Text;
    image : Text;
    description : Text;
    isCertification : Bool;
    isOnline : Bool;
    eventUrl : Text;
    eventCity : Text;
    eventCountry : Text;
    eventDate : Text;
    mintLimit : Nat;
    code : Text;
  };
  type userPoapsMintedMetadata ={
    title : Text;
    image : Text;
    description : Text;
    isCertification : Bool;
    isOnline : Bool;
    eventUrl : Text;
    eventCity : Text;
    eventCountry : Text;
    eventDate : Text;
    mintLimit : Nat;
    minted : Nat;
    code : Text;
  };
  
  type mintPoapData = {
    id : Text; user : Text; code : Text;
  };
  type UserPoapListData = {
    idUser : Text;
    indexList : Nat;
  };
  type metadataPOAPForUser = {
    title : Text;
    image : Text;
    description : Text;
    isCertification : Bool;
    isOnline : Bool;
    eventUrl : Text;
    eventCity : Text;
    eventCountry : Text;
    eventDate : Text;
    mintLimit : Nat;
    minted : Nat;
  };

  //tabla de hash que contiene los poaps junto con su metadata
  let POAP = Map.HashMap<idPoap, POAPmetadata>(0, Text.equal, Text.hash);
  //tabla de arbol que contiene los usuarios junto con los poaps que mintearon
  let User = RBTree.RBTree<Text, Buffer.Buffer<Text> >(Text.compare);

  /// funcion que genera un nuevo poap y devuelve el id del poap
  public func newPoap(metadata : metadataNewPOAP): async (Nat) {
    /*
    * Hace los chequeos de que los campos obligatorios esten completos
    * los cuales son:
    * - mintLimit
    * - title
    * - image
    * - description
    */
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
      * separa los casos de certificaciones y eventos/meetups...
      * si isCertification es true, es una certificacion
      * si isOnline es true, es un evento online
      * si isOnline es false, es un evento presencial y en ese caso se debe especificar la ciudad y el pais
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
      return counter - 1;
  };

  /* 
  * funcion que devuelve la metadata de un poap completa
  * si el poap no existe devuelve null
  *
  * ATENCION: esta funcion devuelve la metadata completa de un poap,
  * eso incluye el codigo de la certificacion, por lo que no se debe
  * usar para mostrar la metadata de un poap a un usuario si se desea 
  * mostrar la metadata de un poap minteado por un usuario usar la funcion
  * getPoapMintedByUserFromTheList o si se desea mostrar la metadata de un
  * poap sin usuario usar la funcion getPoapInfo
  */
  public query func getPoapInfoForDev(id : Text): async ?POAPmetadata{
    POAP.get(id);
  };

  /*
  * funcion que devuelve la metadata de un poap sin el codigo
  * si el poap no existe se devuelve un error
  */
  public query func getPoapInfo(id : Text): async metadataPOAPForUser{
    let FoundPOAPMetadata = POAP.get(id);
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

    if (auxPoap.mintLimit == 0){
      Debug.trap("Error 404: POAP not found");
    };

    return  {
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
      minted = auxPoap.minted;
    };
  };

  /*
  * funcion que devuelve la cantidad de poaps minteados por un usuario
  * si el usuario no ha minteado devuelve 0
  */

  public query func getSizeListOfPoapMintedByUser(userID : Text): async Nat{
    var userDataAux = User.get(userID);
    var foundUser = switch (userDataAux) {
      case (null) { Buffer.Buffer<Text>(0);};
      case (?userDataAux) userDataAux;
    };
    return foundUser.size();
  };

  /*
  * funcion que devuelve la metadata de un poap minteado por un usuario por lista del mas antiguo al mas nuevo
  * si el usuario no ha minteado devuelve null
  */

  public query func getPoapMintedByUserFromTheList(requestData : UserPoapListData): async metadataPOAPForUser{
    var userDataAux = User.get(requestData.idUser);
    var foundUser = switch (userDataAux) {
      case (null) {
        Buffer.Buffer<Text>(0);
      };
      case (?userDataAux) userDataAux;
    };
    var FoundPOAPMetadata = POAP.get(foundUser.get(requestData.indexList));
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
    return  {
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
      minted = auxPoap.minted;
    };
  };

  /*
  * funcion que permite el mint de un poap por un usuario
  */
  public func mintPoap(prop : mintPoapData): async (Nat) {
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

    Debug.print("Check user");
    var userDataAux = User.get(prop.user);
    var foundUser = switch (userDataAux) {
      case (null) {
        Buffer.Buffer<Text>(0);
      };
      case (?userDataAux) userDataAux;
    };
    if (Buffer.isEmpty(foundUser)){
      Debug.print("New user");
      foundUser.add(prop.id);
    } else {
      Debug.print("Old user");
      if (Buffer.contains<Text>(foundUser, prop.id, Text.equal)){
        Debug.trap("User already has this POAP");
      };
      foundUser.add(prop.id);
    };
    ignore User.replace(prop.user, foundUser);

    Debug.print("Add poap to user");
    var data = auxPoap.minted + 1; 
    Debug.print(Nat.toText data);
    var updatePoap = {
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
    ignore POAP.replace(prop.id, updatePoap);
    return data;
  };

};
