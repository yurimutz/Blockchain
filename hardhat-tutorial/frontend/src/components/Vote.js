import React from "react";

export function Vote({ vote, tokenSymbol }) {
  return (
    <div className="mb-4">
      <h4>Votar (Vote)</h4>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.target);
          const codinome = formData.get("codinome");
          const amount = formData.get("amount");

          if (codinome && amount) {
            vote(codinome, amount);
          }
        }}
      >
        <div className="form-group">
          <label>Codinome do destinatário</label>
          <input
            className="form-control"
            type="text"
            name="codinome"
            placeholder="Ex: nome1"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantidade de {tokenSymbol} (1 ou 2)</label>
          <input
            className="form-control"
            type="number"
            step="1"
            min="1"
            max="2"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-success" type="submit" value="Votar" />
        </div>
      </form>
    </div>
  );
}
