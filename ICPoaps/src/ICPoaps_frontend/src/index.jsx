import * as React from "react";
import { render } from "react-dom";
import { ICPoaps_backend as canister } from "../../declarations/ICPoaps_backend";

class ICPoaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  async makeNewPoap() {
    let title = document.getElementById("newPoap_title")?.value;
    let image = document.getElementById("newPoap_image")?.value;
    let description = document.getElementById("newPoap_description")?.value;
    let tipoCertificado = document.getElementById("newPoap_tipoCertificado")?.value;
    let tipoEvento = document.getElementById("newPoap_tipoEvento")?.value;
    let eventUrl = document.getElementById("newPoap_eventUrl")?.value;
    let eventCity = document.getElementById("newPoap_eventCity")?.value;
    let eventCountry = document.getElementById("newPoap_eventCountry")?.value;
    let eventDate = document.getElementById("newPoap_eventDate")?.value;
    let mintLimit = document.getElementById("newPoap_mintLimit")?.value;
    let code = document.getElementById("newPoap_code")?.value;

    let isOnline= tipoEvento === "Virtual" ? true : false;
    let isCertification= tipoCertificado === "Certificado" ? true : false;

    if (mintLimit && !isNaN(mintLimit) && parseInt(mintLimit) >= 0) {
      mintLimit = parseInt(mintLimit);
    } else {
      mintLimit = 0; // Si no es un número válido, establecemos mintLimit en cero
    }
    
    console.log("accss");
    //console.log(title, image, description, tipoCertificado, tipoEvento, eventUrl, eventCity, eventCountry, eventDate, mintLimit, code, isVirtual, isCertification);
    //{title:text; code:text; isOnline:bool; description:text; isCertification:bool; mintLimit:nat; eventCountry:text; image:text; eventUrl:text; eventCity:text; eventDate:text}
    canister.newPoap(
      code, 
      description, 
      eventCity, 
      eventCountry, 
      eventDate, 
      eventUrl, 
      image, 
      isCertification, 
      isOnline, 
      mintLimit, 
      title
    );
  }
  async doInsert() {
    let name = document.getElementById("newEntryName")?.value;
    let desc = document.getElementById("newEntryDesc")?.value;
    let phone = document.getElementById("newEntryPhone")?.value;
    canister.newPoap(name, { desc, phone });
  }

  render() {
    return (
      <div>
        <nav> ICPoaps </nav>
        <br />
        <div className="container--twoSideByside">
          <div className="container--formNewPoap">
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
          </div>
          <div className="container--formMintPoap">
            <button className="btn-access-internetId" type="button">Use internet Identity</button>
            <br />
            <br />
            
            <label htmlFor="mintPoap">Mint POAP:</label>
            <br />
            
            <label htmlFor="mintPoap">Código del Evento (en caso de contar con uno):</label>
            <input type="text" id="mintPoap" name="mintPoap"/>
            <br />

            <button onClick={() => this.makeNewPoap()} className="btn--mint">Mintear</button>
          </div>
        </div>
        <div className="container--findPoapData" >
          <h2>Ver datos de Poap</h2>
          <label htmlFor="findPoapData">ID de poap:</label>
          <input type="text" id="findPoapData" name="findPoapData"/>
          <button onClick={() => this.findPoapDataById()}>Ver datos</button>
          <br />

          <div>
            <h1 id="poapDataTitle"></h1>
          </div>

        </div>
        <img src="logo2.svg" alt="DFINITY logo" />
      </div>
    );
  }
}

render(<ICPoaps />, document.getElementById("app"));
