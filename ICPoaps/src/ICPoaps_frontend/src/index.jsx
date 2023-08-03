import * as React from "react";
import { render } from "react-dom";
import { ICPoaps_backend } from "../../declarations/ICPoaps_backend";

class ICPoaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async doInsert() {
    let name = document.getElementById("newEntryName").value;
    let desc = document.getElementById("newEntryDesc").value;
    let phone = document.getElementById("newEntryPhone").value;
    canister.insert(name, { desc, phone });
  }

  async lookup() {
    let name = document.getElementById("lookupName").value;
    canister.lookup(name).then((opt_entry) => {
      let entry = opt_entry.length > 0 ? opt_entry[0] : null;
      if (entry === null || entry === undefined) {
        entry = {
          desc: "",
          phone: "",
        };
      }
      document.getElementById("newEntryName").value = name;
      document.getElementById("newEntryDesc").value = entry.desc;
      document.getElementById("newEntryPhone").value = entry.phone;
    });
  }

  render() {
    return (
      <div>
        <h1>ICPoap</h1>
        <div className="container--twoSideByside">
        <div className="container--formNewPoap">
          <label>Título:</label>
          <input type="text" id="title" name="title" required />
          <br />
    
          <label>URL de la Imagen:</label>
          <input type="text" id="image" name="image" required />
          <br />
    
          <label htmlFor="description">Descripción:</label>
          <textarea id="description" name="description" rows="4" required></textarea>
          <br />
    
          <label>Tipo de Evento:</label>
          <select id="tipoEvento" name="tipoEvento" required>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </select>
          <br />
    
          <label>Tipo de Certificado:</label>
          <select id="tipoCertificado" name="tipoCertificado" required>
            <option value="certificado">Certificado</option>
            <option value="poap">POAP</option>
          </select>
          <br />
    
          <label>URL del Evento:</label>
          <input type="text" id="eventUrl" name="eventUrl" required />
          <br />
    
          <label>Ciudad del Evento:</label>
          <input type="text" id="eventCity" name="eventCity" required />
          <br />
    
          <label>País del Evento:</label>
          <input type="text" id="eventCountry" name="eventCountry" required />
          <br />
    
          <label>Fecha del Evento:</label>
          <input type="text" id="eventDate" name="eventDate" required />
          <br />
    
          <label>Límite de Emisiones:</label>
          <input type="number" id="mintLimit" name="mintLimit" required />
          <br />
    
          <label htmlFor="code">Código del Evento:</label>
          <input type="text" id="code" name="code" required />
          <br />
    
          <input type="submit" value="Enviar" className="btn--confrimSend" />
        </div>
        <div className="container--formMintPoap">
          <label htmlFor="mintPoap">Mint POAP:</label>
          <input type="text" id="mintPoap" name="mintPoap" required />
        </div>
        </div>
        <img src="logo2.svg" alt="DFINITY logo" />
      </div>
    );
  }
}

render(<ICPoaps />, document.getElementById("app"));
