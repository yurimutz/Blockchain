import React from "react";

export function Ranking({ ranking = [], tokenSymbol }) {
  return (
    <div className="card p-3 mb-4">
      <h4>Ranking de Usuários ({tokenSymbol})</h4>
      <div className="table-responsive">
        <table className="table table-striped table-sm mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Codinome</th>
              <th>Endereço</th>
              <th className="text-right">Saldo ({tokenSymbol})</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((user, index) => (
              <tr key={user.codinome}>
                <td>
                  <b>{index + 1}º</b>
                </td>
                <td>{user.codinome}</td>
                <td>
                  <small className="text-muted">{user.address}</small>
                </td>
                <td className="text-right">
                  <b>{user.balance.toString()}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
