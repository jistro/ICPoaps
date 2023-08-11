import * as React from "react";
import { render } from "react-dom";
import { ICPoaps_backend as canister } from "../../declarations/ICPoaps_backend";
import { Actor, ActorMethod, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { ethers } from 'ethers';


const webapp_id = process.env.WHOAMI_CANISTER_ID;
const webapp_idl = ({ IDL }) => {
  return IDL.Service({
    whoami: IDL.Func([], [IDL.Principal], ["query"]),
  });
};
const local_ii_url = `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`;

class ICPoaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poapId: 0,
      poapMintedNumber: 0,
      metadataPoapFinded: {
        title: "",
        minted: 0,
        isOnline: false,
        description: "",
        isCertification: false,
        mintLimit: 0,
        eventCountry: "",
        image: "",
        eventUrl: "",
        eventCity: "",
        eventDate: "",
      },
      poapsMintedByUser: 0,
      poapsDataList: [],
    };
  }

  

  async makeNewPoap() {
    let title = document.getElementById("newPoap_title")?.value;
    let image = document.getElementById("newPoap_image")?.value;
    let description = document.querySelector("textarea[name=newPoap_description]")?.value;
    let tipoCertificado = document.getElementById("newPoap_tipoCertificado")?.value;
    let tipoEvento = document.getElementById("newPoap_tipoEvento")?.value;
    let eventUrl = document.getElementById("newPoap_eventUrl")?.value;
    let eventCity = document.getElementById("newPoap_eventCity")?.value;
    let eventCountry = document.getElementById("newPoap_eventCountry")?.value;
    let eventDate = document.getElementById("newPoap_eventDate")?.value;
    let mintLimit = document.getElementById("newPoap_mintLimit")?.value;
    let code = document.getElementById("newPoap_code")?.value;

    if (title === "" || image === "" || description === "" || mintLimit === "") {
      alert("Por favor, complete todos los campos");
      return;
    }

    
    console.log("Preparing data to send...");
    eventDate = eventDate.toString();
    let isOnline= tipoEvento === "virtual" ? true : false;
    let isCertification= tipoCertificado === "certificado" ? true : false;
    if (mintLimit && !isNaN(mintLimit) && parseInt(mintLimit) >= 0) {
      mintLimit = parseInt(mintLimit);
    } else {
      mintLimit = 0; 
    }

    canister.newPoap({
      title,
      code, 
      isOnline,
      description,
      isCertification,
      mintLimit,
      eventCountry,
      image,
      eventUrl,
      eventCity,
      eventDate
    }).then((result) => {
      console.log(result);
      const poapId = parseInt(result);
      this.setState({ poapId });
    });
    console.log("Data sent");
  }

  //llama a internet identity
  async callInternetIdentity() {
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = local_ii_url;
    } else if (process.env.DFX_NETWORK === "ic") {
      //llama a 
      iiUrl = `https://identity.ic0.app`;
    } else {
      iiUrl = local_ii_url;
    }
    const authClient = await AuthClient.create();
    console.log("Calling Internet Identity...");
    await new Promise((resolve) => {
      authClient.login({
        identityProvider: iiUrl,
        onSuccess: resolve,
        onError: () => {
          alert('Login error');
        },
      });
    });
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({identity});
    const webapp = Actor.createActor(webapp_idl, {
      agent,
      canisterId: webapp_id,
    });
    const principal = await webapp.whoami();
    console.log("Get identity");
    console.log("------------------");
    console.log("Internet Identity: ", principal.toString());
    document.getElementById("mintPoap_wallet").value = principal.toString();
  }

  //llama a metamask
  async callEVMWallet() {
    console.log('Requesting account...');
    if(window.ethereum) {
      console.log('detected');
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        console.log('Connected', accounts[0]);
        document.getElementById("mintPoap_wallet").value = accounts[0].toString();
      } catch (error) {
        console.log('Error connecting...');
      }
    } else {
      alert('Meta Mask not detected');
    }
  }

  async mintPoap() {
    console.log("checking data for minting...");
    let id = document.getElementById("mintPoap_id")?.value;
    let code = document.getElementById("mintPoap_password")?.value;
    let user = document.getElementById("mintPoap_wallet")?.value;
    console.log(id, code, user);
    
    try {
      const result = await canister.mintPoap({ code, id, user });
      console.log(result);
      const poapMintedNumber = parseInt(result);
      this.setState({ poapMintedNumber });
    } catch (error) {
      console.error(error);
      if (error.message.includes("POAP not found")) {
        alert("Error: POAP not found");
      } else {
        alert("An error occurred while minting POAP.");
      }
    }
  }
  

  async findPoapDataById() {
    let id = document.getElementById("findPoapData_id").value;
    console.log(id);
    
    try {
      const opt_metadataPOAPForUser = await canister.getPoapInfo(id);
      console.log(opt_metadataPOAPForUser);
      console.log("saved in state");
      console.log(opt_metadataPOAPForUser.title);

      this.setState({
        metadataPoapFinded: {
          title: opt_metadataPOAPForUser.title,
          minted: opt_metadataPOAPForUser.minted,
          isOnline: opt_metadataPOAPForUser.isOnline,
          description: opt_metadataPOAPForUser.description,
          isCertification: opt_metadataPOAPForUser.isCertification,
          mintLimit: opt_metadataPOAPForUser.mintLimit,
          eventCountry: opt_metadataPOAPForUser.eventCountry,
          image: opt_metadataPOAPForUser.image,
          eventUrl: opt_metadataPOAPForUser.eventUrl,
          eventCity: opt_metadataPOAPForUser.eventCity,
          eventDate: opt_metadataPOAPForUser.eventDate,
        },
      });
      console.log(this.state.metadataPoapFinded);
    } catch (error) {
      console.log(error);
      this.setState({ metadataPoapFinded: {
        title: "",
        minted: 0,
        isOnline: false,
        description: "",
        isCertification: false,
        mintLimit: 0,
        eventCountry: "",
        image: "",
        eventUrl: "",
        eventCity: "",
        eventDate: "",
      }});
      alert("No se encontró el poap");
    }
  }

  async findPoapsMintedByUserID() {
    let wallet = document.getElementById("findPoapsMintedByUserID_wallet").value;
    console.log(wallet);
    const result = await canister.getSizeListOfPoapMintedByUser(wallet);
    console.log(result);

    const poapsMintedByUser = parseInt(result);
    const poapsDataList = [];
  this.setState({ poapsMintedByUser });
    if (this.state.poapsMintedByUser === 0){
      console.log("no hay poaps");
      const poapsDataList = [];
      this.setState({ poapsDataList });
      return;
    }
    for (let i = 0; i < this.state.poapsMintedByUser; i++){
      const poapData = await canister.getPoapMintedByUserFromTheList({ idUser: wallet, indexList: i });
      poapsDataList.push(poapData);
    }
    this.setState({ poapsDataList });
  }

  render() {
    return (
      <div>
        <nav> 
          <img src="logo.png" alt="" className="logoICPoaps"/>
          <h1 className="textIcpoaps">ICPoaps</h1>
        </nav>
        <br />
        <div className="container--twoSideByside">
          <div className="container--formNewPoap">
          <h2 className="titleTextCenterContainer">Make POAP</h2>
            <label>Title:</label>
            <input type="text" id="newPoap_title" required />
            <br />
            <label>Image URL:</label>
            <input type="text"  id="newPoap_image" required />
            <br />
            <label htmlFor="description">Description:</label>
            <textarea name="newPoap_description" rows="4" ></textarea>
            <br />
            <label>Certificate Type:</label>
            <select id="newPoap_tipoCertificado" >
              <option type="text" value="certificado">Certification</option>
              <option value="poap">POAP</option>
            </select>
            <br />
            <label>Event Type:</label>
            <select id="newPoap_tipoEvento" >
              <option value="virtual">Virtual</option>
              <option value="presencial">IRL</option>
            </select>
            <br />
            <label>Event URL:</label>
            <input type="url" id="newPoap_eventUrl" required/>
            <br />
            <label>Event City:</label>
            <input type="text" id="newPoap_eventCity" required />
            <br />
            <label>Event Country:</label>
            <input type="text" id="newPoap_eventCountry" required />
            <br />
            <label>Event Date:</label>
            <input type="date" id="newPoap_eventDate" required />
            <br />
            <label>Mint limit:</label>
            <input type="number" id="newPoap_mintLimit" required />
            <br />
            <label htmlFor="code">Password or correct answer:</label>
            <input type="text" id="newPoap_code" required />
            <br />
            <input
              type="button" // Cambia el tipo de "submit" a "button"
              value="Enviar"
              className="btn--confrimSend"
              onClick={() => this.makeNewPoap()} // Manejador del evento onClick
            />
            <div>
                {this.state.poapId !== 0 && (<h2>Poap ID: {this.state.poapId}</h2>)}
            </div>
          </div>
          <div className="container--formMintPoap">
          <h2 className="titleTextCenterContainer">Mint POAP or Certification</h2>
            <br />
            <button className="btn-access-internetId" onClick={() => this.callInternetIdentity()} type="button">Use internet Identity</button>
            <button className="btn-access-metamask" onClick={() => this.callEVMWallet()} type="button">Use Metamask</button>
            <br />
            <br />
            <label htmlFor="mintPoap">POAP or certification ID:</label>
            <input type="text" id="mintPoap_id"/>
            <br />
            <label htmlFor="mintPoap">Event Code (if applicable):</label>
            <input type="text" id="mintPoap_password"/>
            <br />
            <label htmlFor="mintPoap">Internet Identity or EVM wallet address:</label>
            <input type="text" id="mintPoap_wallet"/>
            <br />
            <button onClick={() => this.mintPoap()} className="btn--mint">Mintear</button>
            <div>
                {this.state.poapMintedNumber !== 0 && (<><h2>Got it</h2> Claimed: {this.state.poapMintedNumber}</>)}
            </div>
          </div>
        </div>
        <div className="container--twoSideByside">
          <div className="container--findPoapData" >
            <h2 className="titleTextCenterContainer">View POAP or certification info</h2>
            <label>POAP/certification ID:</label>
            <input type="text" id="findPoapData_id"/>
            <button onClick={() => this.findPoapDataById()} className="btn--findPoapData">View Data</button>
            <br />
              {this.state.metadataPoapFinded.title !== "" && (<h1>{this.state.metadataPoapFinded.title}</h1>)}
              {this.state.metadataPoapFinded.image !== "" && (<img src={this.state.metadataPoapFinded.image} alt="POAP image" className="img--poapImage"/>)}
              {this.state.metadataPoapFinded.isOnline !== false && (<p>Online Event</p>)}
              {this.state.metadataPoapFinded.isCertification !== false && (<p>Certification</p>)}
              {this.state.metadataPoapFinded.minted !== 0 && (<p>Claimed: {parseInt(this.state.metadataPoapFinded.minted)}</p>)}
              {this.state.metadataPoapFinded.description !== "" && (<p>Description: {this.state.metadataPoapFinded.description}</p>)}
              {this.state.metadataPoapFinded.mintLimit !== 0 && (<p>Mint Limit: {parseInt(this.state.metadataPoapFinded.mintLimit)}</p>)}
              {this.state.metadataPoapFinded.eventCountry !== "" && (<p>Event Country: {this.state.metadataPoapFinded.eventCountry}</p>)}
              {this.state.metadataPoapFinded.eventUrl !== "" && (<p>Event URL: {this.state.metadataPoapFinded.eventUrl}</p>)}
              {this.state.metadataPoapFinded.eventCity !== "" && (<p>Event City: {this.state.metadataPoapFinded.eventCity}</p>)}
              {this.state.metadataPoapFinded.eventDate !== "" && (<p>Event Date: {this.state.metadataPoapFinded.eventDate}</p>)}
          </div>
          <div className="container--findPoapsMintedByUserID" >
            <h2 className="titleTextCenterContainer">View your POAPs</h2>
            <label >Internet Identity or EVM wallet address:</label>
            <input type="text" id="findPoapsMintedByUserID_wallet"/>
            <button onClick={() => this.findPoapsMintedByUserID()} className="btn--findPoapsMintedByUserID">Ver poaps</button>
            <br />
            <br />
            {/* Lista dinámica de datos de poaps */}
            {this.state.poapsDataList.length > 0 ? (
              <div className="container--findPoapData">
                {this.state.poapsDataList.map((poapData, index) => (
                  <>
                    <h1>Title: {poapData.title}</h1>
                    {poapData.image !== "" && (<img src={poapData.image} alt="POAP image" className="img--poapImage"/>)}
                    <p>Minted: {poapData.minted.toString()}</p>
                    {poapData.isOnline !== false && (<p>Online Event</p>)}
                    {poapData.isCertification !== false && (<p>Certification</p>)}
                  </>
                ))}
              </div>
            ) : (
              <p></p>
          )}
          </div>
        </div>
        <br className="Bigbr"/>
        <footer className="footer">
          <p className="footer--textCR">ICPoaps © 2023</p>
          <p className="footer--textWLove">Made by jistro with ❤️</p>
          <div className="imgContainer">
            <img src="motoko.png" alt="Motoko logo" className="motokoImg"/> 
            <img src="hostedOnChain.png" alt="DFINITY logo" className="onChainImg"/> 
          </div>
        </footer>
      </div>
    );
  }
}

render(<ICPoaps />, document.getElementById("app"));
