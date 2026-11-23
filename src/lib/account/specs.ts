export interface DocSpec {
  expect: string[];
  reject: string[];
  note: string;
}

const SPECS: Record<string, DocSpec> = {
  "dn-passport": {
    expect: ["passport", "pasaporte", "expiry", "caducidad", "nationality"],
    reject: ["expired"],
    note: "Complete valid passport, every page. Note the expiry date.",
  },
  "nlv-passport": {
    expect: ["passport", "pasaporte", "expiry", "caducidad"],
    reject: ["expired"],
    note: "Passport with at least one year of validity left, and a complete copy.",
  },
  "dn-insurance": {
    expect: ["insurance", "seguro", "policy", "póliza", "poliza", "insurer"],
    reject: ["travel insurance", "seguro de viaje", "waiting period", "copay", "co-payment"],
    note: "Public cover, or private sickness insurance with an insurer authorised in Spain. Travel, reimbursement-only, waiting periods and co-pays fail the UGE FAQ.",
  },
  "nlv-insurance": {
    expect: ["insurance", "seguro", "policy", "póliza", "poliza"],
    reject: ["travel insurance", "seguro de viaje"],
    note: "Sickness insurance with an insurer authorised to operate in Spain.",
  },
  "dn-fam-insurance": {
    expect: ["insurance", "seguro", "family", "familiar"],
    reject: ["travel insurance"],
    note: "Name each family member, or SNS cover through the holder’s Social Security alta.",
  },
  "nlv-fam-insurance": {
    expect: ["insurance", "seguro", "family", "familiar"],
    reject: ["travel insurance"],
    note: "The certificate should name every family member in the file.",
  },
  "dn-criminal": {
    expect: ["criminal", "penal", "antecedentes", "certificate", "declaration"],
    reject: [],
    note: "Two-year certificates from each country of residence, plus a five-year sworn declaration.",
  },
  "dn-fam-criminal": {
    expect: ["criminal", "penal", "antecedentes"],
    reject: [],
    note: "Adult family members file the same two-year certificates plus five-year declaration.",
  },
  "nlv-criminal": {
    expect: ["criminal", "penal", "antecedentes", "certificate"],
    reject: [],
    note: "Certificates covering the last five years of residence. Not the digital-nomad two-year packet.",
  },
  "nlv-fam-criminal": {
    expect: ["criminal", "penal", "antecedentes"],
    reject: [],
    note: "Each adult family member files their own five-year certificates.",
  },
  "dn-forms-visa": {
    expect: ["visa", "solicitud", "visado", "signed"],
    reject: ["ex-01", "ex01"],
    note: "National visa form, signed by the teleworker. EX-01 is the non-lucrative form.",
  },
  "dn-forms-uge": {
    expect: ["mi-t", "mit", "signed"],
    reject: ["ex-01"],
    note: "Signed MI-T. Family members use MI-F.",
  },
  "dn-fam-form": {
    expect: ["mi-f", "mif", "visa", "familiar"],
    reject: [],
    note: "MI-F at UGE, or a national visa form at the consulate, one per family member.",
  },
  "nlv-form": {
    expect: ["ex-01", "ex01", "signed"],
    reject: ["mi-t"],
    note: "EX-01, completed and signed, from the official modelos page.",
  },
  "nlv-fam-how-attached": {
    expect: ["ex-01", "ex01", "visa", "familiar"],
    reject: [],
    note: "Each family member presents their own EX-01 or the consular visa form.",
  },
  "dn-fee-visa": {
    expect: ["receipt", "recibo", "fee", "paid", "tasa"],
    reject: [],
    note: "Consular visa-fee receipt at the post’s live tariff.",
  },
  "dn-fee-uge": {
    expect: ["038", "nrc", "tasa", "paid"],
    reject: [],
    note: "Tasa 038, paid before the electronic file. Keep the NRC.",
  },
  "nlv-fee": {
    expect: ["790", "052", "recibo", "paid"],
    reject: ["038"],
    note: "Modelo 790 code 052, heading 2.1.1, plus the consular visa fee.",
  },
  "dn-company-one-year": {
    expect: ["company", "empresa", "register", "registro", "year", "año"],
    reject: [],
    note: "Companies-register certificate showing at least one year of real activity.",
  },
  "dn-three-months-labour": {
    expect: ["employer", "empleador", "remote", "remoto", "months", "meses"],
    reject: [],
    note: "Employer letter: at least three months, and permission to work remotely from Spain.",
  },
  "dn-three-months-professional": {
    expect: ["contract", "contrato", "invoice", "factura", "client", "months"],
    reject: [],
    note: "Contracts or invoices covering at least three months, plus the remote terms.",
  },
  "dn-remote-capable": {
    expect: ["remote", "remoto", "computer", "telematic", "online"],
    reject: ["on-site only", "presencial only"],
    note: "Written proof the role is exclusively remote.",
  },
  "dn-qualifications": {
    expect: ["degree", "título", "titulo", "university", "experience", "years"],
    reject: [],
    note: "A recognised degree, or at least three years of analogous experience.",
  },
  "dn-funds": {
    expect: ["salary", "salario", "income", "contract", "€", "eur"],
    reject: [],
    note: "Remote income at the 200% SMI formula. The euro figure is an illustration, not the statute.",
  },
  "dn-fam-funds": {
    expect: ["salary", "income", "family", "€", "eur"],
    reject: [],
    note: "Add 75% SMI for the first family member and 25% for each additional.",
  },
  "nlv-funds": {
    expect: ["bank", "banco", "balance", "saldo", "€", "eur"],
    reject: ["spanish salary", "empleo en españa"],
    note: "Means at 400% IPREM for the holder, times the months of validity. Not work in Spain.",
  },
  "nlv-funds-proof": {
    expect: ["bank", "banco", "account", "cuenta", "balance", "average"],
    reject: [],
    note: "Foreign accounts need name, address, account ID, opening date, 31 December balance, and last-year average.",
  },
  "nlv-fam-funds": {
    expect: ["bank", "banco", "balance", "iprem", "€"],
    reject: [],
    note: "Add 100% IPREM per family member, monthly, times the months of validity.",
  },
  "dn-ss": {
    expect: ["social security", "seguridad social", "coverage", "a1", "certificate"],
    reject: [],
    note: "Bilateral coverage certificate, or the request to register the foreign employer in Spanish Social Security.",
  },
  "dn-apostille": {
    expect: ["apostille", "apostilla", "sworn", "jurada", "translation"],
    reject: [],
    note: "Hague apostille or consular legalisation, then a sworn Spanish translation.",
  },
  "nlv-apostille": {
    expect: ["apostille", "apostilla", "sworn", "jurada", "translation"],
    reject: [],
    note: "Apostille or legalisation, then a sworn translation into Spanish.",
  },
  "nlv-medical": {
    expect: ["medical", "médico", "medico", "certificate", "health"],
    reject: [],
    note: "Medical certificate under the International Health Regulations 2005.",
  },
  "dn-fam-who": {
    expect: ["marriage", "matrimonio", "birth", "nacimiento", "partner", "certificate"],
    reject: [],
    note: "Civil-status evidence inside art. 62.4.",
  },
  "nlv-fam-who": {
    expect: ["marriage", "matrimonio", "birth", "nacimiento", "partner", "certificate"],
    reject: [],
    note: "Civil-status evidence inside art. 61.3. A stable partner needs one year of cohabitation, unless there are common children.",
  },
  "dn-fam-how-attached": {
    expect: ["family", "familiar", "passport", "annex"],
    reject: [],
    note: "A labelled family annex behind the holder’s packet.",
  },
};

export function specFor(requirementId: string): DocSpec {
  return (
    SPECS[requirementId] ?? {
      expect: [],
      reject: [],
      note: "Type the dates, names and the line this packet item asks for.",
    }
  );
}
