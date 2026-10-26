// Pure money math for Halves. All amounts are integer cents.
(function (root) {
  // Split `total` by `weights`, rounding so the parts always sum to `total` exactly.
  function allocate(total, weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    if (sum <= 0) return weights.map(() => 0);
    const raw = weights.map((w) => (total * w) / sum);
    const out = raw.map(Math.floor);
    const rem = total - out.reduce((a, b) => a + b, 0);
    const order = raw.map((r, i) => [r - out[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    for (let k = 0; k < rem; k++) out[order[k][1]]++;
    return out;
  }

  function equalShares(total, ids) {
    const parts = allocate(total, ids.map(() => 1));
    return Object.fromEntries(ids.map((id, i) => [id, parts[i]]));
  }

  // items: [{price, who: [ids]}]; extra (tax + tip) is spread in proportion to each person's subtotal.
  function itemizedShares(items, extra) {
    const sub = {};
    for (const it of items) {
      if (!it.who.length) continue;
      allocate(it.price, it.who.map(() => 1)).forEach((c, i) => (sub[it.who[i]] = (sub[it.who[i]] || 0) + c));
    }
    const ids = Object.keys(sub);
    const ex = allocate(extra, ids.map((id) => sub[id]));
    return Object.fromEntries(ids.map((id, i) => [id, sub[id] + ex[i]]));
  }

  // Net per member: positive = gets money back, negative = owes.
  function balances(expenses, memberIds) {
    const net = Object.fromEntries(memberIds.map((id) => [id, 0]));
    for (const e of expenses) {
      net[e.paidBy] = (net[e.paidBy] || 0) + e.amount;
      for (const [id, c] of Object.entries(e.shares)) net[id] = (net[id] || 0) - c;
    }
    return net;
  }

  // Fewest-ish transfers: biggest debtor pays biggest creditor until everyone is square.
  function settle(net) {
    const cred = [], debt = [];
    for (const [id, c] of Object.entries(net)) {
      if (c > 0) cred.push([id, c]);
      else if (c < 0) debt.push([id, -c]);
    }
    cred.sort((a, b) => b[1] - a[1]);
    debt.sort((a, b) => b[1] - a[1]);
    const out = [];
    let i = 0, j = 0;
    while (i < debt.length && j < cred.length) {
      const amt = Math.min(debt[i][1], cred[j][1]);
      out.push({ from: debt[i][0], to: cred[j][0], amount: amt });
      debt[i][1] -= amt;
      cred[j][1] -= amt;
      if (!debt[i][1]) i++;
      if (!cred[j][1]) j++;
    }
    return out;
  }

  // weights: {id: number} (percentages or share counts, any scale).
  function weightedShares(total, weights) {
    const ids = Object.keys(weights).filter((id) => weights[id] > 0);
    const parts = allocate(total, ids.map((id) => weights[id]));
    return Object.fromEntries(ids.map((id, i) => [id, parts[i]]));
  }

  // Convert shares in the expense's currency into the group's currency; total and shares still match to the cent.
  function convert(shares, rate) {
    const orig = Object.values(shares).reduce((a, b) => a + b, 0);
    const total = Math.round(orig * rate);
    return { total, shares: weightedShares(total, shares) };
  }

  // Splitwise-style export: one row per expense, one column per person (paid minus owed).
  function toCSV(expenses, members, currency) {
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const head = ["Date", "Description", "Category", "Cost", "Currency", ...members.map((m) => m.name)];
    const rows = expenses.map((e) => [
      new Date(e.at).toISOString().slice(0, 10), e.kind === "payment" ? "Payment" : e.desc,
      e.kind === "payment" ? "Payment" : e.category || "General", (e.amount / 100).toFixed(2), currency,
      ...members.map((m) => (((e.paidBy === m.id ? e.amount : 0) - (e.shares[m.id] || 0)) / 100).toFixed(2)),
    ]);
    return [head, ...rows].map((r) => r.map(q).join(",")).join("\n");
  }

  const api = { allocate, equalShares, itemizedShares, weightedShares, convert, balances, settle, toCSV };
  if (typeof module !== "undefined") module.exports = api;
  else root.Splits = api;
})(this);
