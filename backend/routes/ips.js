import express from "express";
import axios from "axios";

const ipsRouter = express.Router();

/**
 * Funkcija za formiranje IPS payload-a po NBS specifikaciji.
 * Primer:
 * K:PR|V:01|C:1|R:845000000040484987|N:JP EPS BEOGRAD\r\nBALKANSKA 13|I:RSD3596,13|P:MRĐO MAČKATOVIĆ\r\nŽUPSKA 13\r\nBEOGRAD 6|SF:189|S:UPLATA PO RAČUNU ZA EL. ENERGIJU|RO:97163220000111111111000
 */
// function buildIpsText({
//   creditorAccount, // broj računa primaoca
//   creditorName, // naziv primaoca (ime firme ili osobe)
//   amount, // npr. 3596,13
//   currency = "RSD",
//   debtorName, // ime uplatilaca
//   purposeCode, // SF - šifra namene
//   paymentPurpose, // S - svrha uplate
//   referenceModel, // model poziva na broj (npr. 97)
//   referenceNumber, // poziv na broj (npr. 123456789)
// }) {
//   const parts = [
//     `K:PR`, // Oznaka da je Payment Request
//     `V:01`, // Verzija
//     `C:1`, // Kategorija
//     `R:${creditorAccount}`,
//     `N:${creditorName}`,
//     `I:${currency}${amount}`,
//     `P:${debtorName}`,
//   ];
//   if (purposeCode) parts.push(`SF:${purposeCode}`);
//   if (paymentPurpose) parts.push(`S:${paymentPurpose}`);
//   if (referenceModel && referenceNumber)
//     parts.push(`RO:${referenceModel}${referenceNumber}`);

//   // mora biti bez znaka "|" na kraju
//   return parts.join("|");
// }
function buildIpsText({
  creditorAccount, // broj računa primaoca
  creditorName, // naziv primaoca
  amount, // npr. 2000
  currency = "RSD",
  debtorName, // ime uplatioca
  purposeCode = "221", // šifra namene
  paymentPurpose = "Uplata za Premium oglas", // svrha uplate
  referenceNumber, // poziv na broj
}) {
  // OBRATI PAŽNJU: Iznos mora biti sa DVE decimale, čak i ako je .00
  const formattedAmount = parseFloat(amount).toFixed(2).replace(".", ",");

  const parts = [
    `K:PR`,
    `V:01`,
    `C:1`,
    `R:${creditorAccount}`,
    `N:${creditorName}`,
    `I:${currency}${formattedAmount}`,
    `P:${debtorName}`,
    `SF:${purposeCode}`,
    `S:${paymentPurpose}`,
  ];

  // RO polje je OPCIONO, dodaj samo ako postoji referenceNumber
  if (referenceNumber) {
    parts.push(`RO:${referenceNumber}`);
  }

  // VEOMA VAŽNO: spojiti sa | ali BEZ | na kraju!
  return parts.join("|");
}

// POST /api/ips/generate-qr
ipsRouter.post("/generate-qr", async (req, res) => {
  try {
    const {
      creditorAccount,
      creditorName,
      amount,
      currency = "RSD",
      debtorName,
      purposeCode = "221",
      paymentPurpose = "Uplata za Premium oglas",
      referenceNumber,
      size = 300,
    } = req.body;

    console.log("Primljeni podaci za QR:", req.body);

    if (!creditorAccount || !creditorName || !amount || !debtorName) {
      return res.status(400).json({
        success: false,
        message:
          "Nedostaju obavezni podaci: creditorAccount, creditorName, amount, debtorName",
      });
    }

    const text = buildIpsText({
      creditorAccount,
      creditorName,
      amount,
      currency,
      debtorName,
      purposeCode,
      paymentPurpose,
      referenceNumber,
    });

    console.log("Generisan IPS tekst:", text);

    // Poziv ka zvaničnom NBS API-ju
    const response = await axios.post(
      `https://nbs.rs/QRcode/api/qr/v1/generate/${size}`,
      text,
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      }
    );

    console.log("NBS odgovor:", response.data);

    if (response.data?.s?.code === 0 && response.data?.i) {
      return res.json({
        success: true,
        qrBase64: response.data.i,
        textSent: response.data.t,
        jsonData: response.data.n,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data?.s?.desc || "NBS QR nije validan.",
        errors: response.data?.e || [],
        nbsResponse: response.data,
      });
    }
  } catch (error) {
    console.error("NBS QR error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Greška pri generisanju QR koda.",
      details: error.response?.data || error.message,
    });
  }
});

export default ipsRouter;

//   `https://nbs.rs/QRcode/api/qr/v1/generate/${size}?lang=sr_RS_Latn`,
