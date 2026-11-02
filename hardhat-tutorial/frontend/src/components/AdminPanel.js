import React from "react";

export function AdminPanel({
  issueToken,
  updateUser,
  votingOn,
  votingOff,
  tokenSymbol,
}) {
  return (
    <div className="card p-3 mb-4 bg-light">
      <h4>Painel de Controle (Owner / Roberta)</h4>
      <hr />

      <div className="mb-3">
        <h5>Controle da Votação</h5>
        <button
          className="btn btn-primary mr-2"
          type="button"
          onClick={votingOn}
        >
          Ligar Votação (votingOn)
        </button>
        <button
          className="btn btn-danger"
          type="button"
          onClick={votingOff}
        >
          Desligar Votação (votingOff)
        </button>
      </div>

      <hr />

      <div className="mb-3">
        <h5>Emitir Tokens (issueToken)</h5>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const codinome = formData.get("codinome");
            const amount = formData.get("amount");
            if (codinome && amount) {
              issueToken(codinome, amount);
            }
          }}
        >
          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Codinome</label>
              <input
                className="form-control"
                type="text"
                name="codinome"
                placeholder="Ex: nome1"
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Qtd. de {tokenSymbol}</label>
              <input
                className="form-control"
                type="number"
                step="1"
                min="1"
                name="amount"
                placeholder="10"
                required
              />
            </div>
            <div className="form-group col-md-2 d-flex align-items-end">
              <input
                className="btn btn-warning btn-block"
                type="submit"
                value="Emitir"
              />
            </div>
          </div>
        </form>
      </div>

      <hr />

      <div>
        <h5>Atualizar / Cadastrar Usuário (updateUser)</h5>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const codinome = formData.get("codinome");
            const userAddr = formData.get("userAddr");
            if (codinome && userAddr) {
              updateUser(codinome, userAddr);
            }
          }}
        >
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>Codinome</label>
              <input
                className="form-control"
                type="text"
                name="codinome"
                placeholder="Ex: nome20"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Endereço (Address)</label>
              <input
                className="form-control"
                type="text"
                name="userAddr"
                placeholder="0x..."
                required
              />
            </div>
            <div className="form-group col-md-2 d-flex align-items-end">
              <input
                className="btn btn-info btn-block"
                type="submit"
                value="Salvar"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
