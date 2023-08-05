import * as React from "react";
import { render } from "react-dom";
import { ICPoaps_backend as canister } from "../../declarations/ICPoaps_backend";

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
    let isOnline= tipoEvento === "virtual" ? true : false;
    let isCertification= tipoCertificado === "certificado" ? true : false;

    if (mintLimit && !isNaN(mintLimit) && parseInt(mintLimit) >= 0) {
      mintLimit = parseInt(mintLimit);
    } else {
      mintLimit = 0; 
    }
    //only for test
    console.log("accss");
    console.log(
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
    );
    
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
  }

  async mintPoap() {
    let id = document.getElementById("mintPoap_id")?.value;
    let code = document.getElementById("mintPoap_password")?.value;
    let user = document.getElementById("mintPoap_wallet")?.value;
    console.log(id, code, user);
    canister.mintPoap({code, id, user}).then((result) => {
      console.log(result);
      const poapMintedNumber = parseInt(result);
      this.setState({ poapMintedNumber });
    });
  }

  async findPoapDataById() {
    let id = document.getElementById("findPoapData_id").value;
    console.log(id);
    canister.getPoapInfo(id).then((opt_metadataPOAPForUser) => {
      console.log(opt_metadataPOAPForUser);
      // ...otros console.log para las otras variables
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
    });
  }

  async findPoapsMintedByUserID() {
    let wallet = document.getElementById("findPoapsMintedByUserID_wallet").value;
    console.log(wallet);
    canister.getSizeListOfPoapMintedByUser(wallet).then((result) => {
      console.log(result);
      const poapsMintedByUser = parseInt(result);
      this.setState({ poapsMintedByUser });
    });
    if (this.state.poapsMintedByUser === 0){
      return;
    }
    let i = 0;
    for (i = 0; i < this.state.poapsMintedByUser; i++){
      canister.getPoapMintedByUserFromTheList({idUser: wallet, indexList: i}).then((result) => {
        console.log(result);
      });
    }
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
            <label>Título:</label>
            <input type="text" id="newPoap_title" required />
            <br />
      
            <label>URL de la Imagen:</label>
            <input type="text"  id="newPoap_image" required />
            <br />
      
            <label htmlFor="description">Descripción:</label>
            <textarea name="newPoap_description" rows="4" ></textarea>
            <br />

            <label>Tipo de Certificado:</label>
            <select id="newPoap_tipoCertificado" >
              <option type="text" value="certificado">Certificado</option>
              <option value="poap">POAP</option>
            </select>
            <br />
      
            <label>Tipo de Evento:</label>
            <select id="newPoap_tipoEvento" >
              <option value="virtual">Virtual</option>
              <option value="presencial">Presencial</option>
            </select>
            <br />
      
            <label>URL del Evento:</label>
            <input type="url" id="newPoap_eventUrl" required/>
            <br />
      
            <label>Ciudad del Evento:</label>
            <input type="text" id="newPoap_eventCity" required />
            <br />
      
            <label>País del Evento:</label>
            <input type="text" id="newPoap_eventCountry" required />
            <br />
      
            <label>Fecha del Evento:</label>
            <input type="text" id="newPoap_eventDate" required />
            <br />
      
            <label>Límite de Emisiones:</label>
            <input type="number" id="newPoap_mintLimit" required />
            <br />
      
            <label htmlFor="code">Código del Evento:</label>
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
          <h2 className="titleTextCenterContainer">Mint POAP</h2>
            <br />
            <button className="btn-access-internetId" type="button">Use internet Identity</button>
            <br />
            <br />
            <label htmlFor="mintPoap">ID de poap:</label>
            <input type="text" id="mintPoap_id"/>
            <br />
            <label htmlFor="mintPoap">Código del Evento (en caso de contar con uno):</label>
            <input type="text" id="mintPoap_password"/>
            <br />
            <label htmlFor="mintPoap">Dirección de la billetera:</label>
            <input type="text" id="mintPoap_wallet"/>
            <br />
            <button onClick={() => this.mintPoap()} className="btn--mint">Mintear</button>
            <div>
                {this.state.poapMintedNumber !== 0 && (<h2>POAP minteado: {this.state.poapMintedNumber}</h2>)}
            </div>
          </div>
        </div>
        <div className="container--twoSideByside">
          <div className="container--findPoapData" >
            <h2 className="titleTextCenterContainer">Ver datos de Poap</h2>
            <label >ID de poap:</label>
            <input type="text" id="findPoapData_id"/>
            <button onClick={() => this.findPoapDataById()} className="btn--findPoapData">Ver datos</button>
            <br />
            {this.state.metadataPoapFinded.title !== "" && (<h1>{this.state.metadataPoapFinded.title}</h1>)}
            {this.state.metadataPoapFinded.isOnline !== false && (<p>Evento online</p>)}
            {this.state.metadataPoapFinded.isCertification !== false && (<p>Es un certificado</p>)}
            {this.state.metadataPoapFinded.minted !== 0 && (<p>Reclamados: {parseInt(this.state.metadataPoapFinded.minted)}</p>)}
            {this.state.metadataPoapFinded.description !== "" && (<p>Descripción: {this.state.metadataPoapFinded.description}</p>)}
            {this.state.metadataPoapFinded.mintLimit !== 0 && (<p>Límite de Emisiones: {parseInt(this.state.metadataPoapFinded.mintLimit)}</p>)}
            {this.state.metadataPoapFinded.eventCountry !== "" && (<p>País del Evento: {this.state.metadataPoapFinded.eventCountry}</p>)}
            {this.state.metadataPoapFinded.image !== "" && (<p>Imagen: {this.state.metadataPoapFinded.image}</p>)}
            {this.state.metadataPoapFinded.eventUrl !== "" && (<p>URL del Evento: {this.state.metadataPoapFinded.eventUrl}</p>)}
            {this.state.metadataPoapFinded.eventCity !== "" && (<p>Ciudad del Evento: {this.state.metadataPoapFinded.eventCity}</p>)}
            {this.state.metadataPoapFinded.eventDate !== "" && (<p>Fecha del Evento: {this.state.metadataPoapFinded.eventDate}</p>)}
          </div>
          <div className="container--findPoapsMintedByUserID" >
            <h2 className="titleTextCenterContainer">Ver tus poaps</h2>
            <label >Dirección de la billetera/internetID:</label>
            <input type="text" id="findPoapsMintedByUserID_wallet"/>
            <button onClick={() => this.findPoapsMintedByUserID()} className="btn--findPoapsMintedByUserID">Ver poaps</button>
            <br />
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
