import React from "react";

export function Vote({ vote, tokenSymbol, codinomes = [] }) {
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
          <label>Codinome do aluno</label>
          <select
            className="form-control"
            name="codinome"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecione um codinome...
            </option>
            {codinomes.map((cod) => (
              <option key={cod} value={cod}>
                {cod}
              </option>
            ))}
          </select>
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

