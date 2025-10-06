// helper/ipsQr.js
export function generateIpsQr({
  creditorAccount,
  creditorName,
  amount,
  currency = "RSD",
  purposeCode = "221",
  referenceNumber,
  payerName,
}) {
  return `K:PR|V:01|C:1|R:${creditorAccount}|N:${creditorName}|I:${currency}${amount}|P:${payerName}|SF:${purposeCode}|S:Uplata za Premium oglas|RO:${referenceNumber}`;
}
