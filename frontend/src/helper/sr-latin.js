import { sr } from "date-fns/locale";

// Kopiramo sr locale i menjamo "localize" za month i day da koristi latinicu

const latinMonths = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

const latinMonthsShort = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "avg",
  "sep",
  "okt",
  "nov",
  "dec",
];

// Kreiramo novu lokalizaciju sa latinicom
const srLatin = {
  ...sr,
  localize: {
    ...sr.localize,
    month: (n, opts) => {
      if (opts.width === "abbreviated") {
        return latinMonthsShort[n];
      }
      return latinMonths[n];
    },
  },
};

export default srLatin;
