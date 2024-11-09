export interface MetaData {
  metadata: {
    chapter: string; // Netznutzungsthema
    ebd_code: string; // "E_0000"
    ebd_name: string; // "<ebd_code>_Prüfen, ob [...]"
    role: string; // prüfende Rolle
    section: string; // "1.1.: AD: [...]"
    remark: string; // no table provided by BDEW: "Derzeit ist für diese Entscheidung kein Entscheidungsbaum notwendig, da keine Antwort gegeben wird."
  };
}

export interface EbdNameExtended {
  ebd_code: string;
  ebd_name: string;
}