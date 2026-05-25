export type CompanyInfo = {
  name:    string;
  line1:   string;
  line2:   string;
  phone:   string;
  email:   string;
  website: string;
  footer:  string;
};

export type InvoiceStyle = {
  // ── Brand & text colors ──────────────────────────────────────────────────
  brand:             string;
  textPrimary:       string;
  textSecondary:     string;
  textMuted:         string;

  // ── Surface / background colors ──────────────────────────────────────────
  borderColor:       string;
  rowAltBg:          string;
  tableHeaderBg:     string;
  notesBg:           string;
  bankingCardBg:     string;

  // ── Total Due box ─────────────────────────────────────────────────────────
  totalDueBg:        string;
  totalDueTextColor: string;
  totalDueAmount:    string;

  // ── Logo ─────────────────────────────────────────────────────────────────
  logoHeight:   number;
  logoPosition: "left" | "right";
  logoOffsetX:  number;   // px – positive = right, negative = left
  logoOffsetY:  number;   // px – positive = down,  negative = up

  // ── Global typography ────────────────────────────────────────────────────
  fontFamily:        string;
  fontInvoiceTitle:  number;
  fontStatusBadge:   number;
  fontFooter:        number;

  // ── Company block ─────────────────────────────────────────────────────────
  fontCompanyName:         number;
  fontWeightCompanyName:   string;  // CSS font-weight e.g. "700"
  fontStyleCompanyName:    string;  // "normal" | "italic"
  fontCompanyDetail:       number;
  fontWeightCompanyDetail: string;
  fontStyleCompanyDetail:  string;

  // ── Invoice Details (left column rows) ───────────────────────────────────
  fontSectionHeader: number;
  fontLabel:         number;
  fontWeightLabel:   string;
  fontStyleLabel:    string;
  fontValue:         number;
  fontWeightValue:   string;
  fontStyleValue:    string;
  fontInvoiceNumber: number;

  // ── Bill To (client block) ────────────────────────────────────────────────
  fontClientName:         number;
  fontWeightClientName:   string;
  fontStyleClientName:    string;
  textDecoClientName:     string;  // "none" | "underline" | "line-through"
  fontClientDetail:       number;
  fontWeightClientDetail: string;
  fontStyleClientDetail:  string;

  // ── Table ─────────────────────────────────────────────────────────────────
  fontTableHeader:     number;
  fontTableRow:        number;

  // ── Totals ────────────────────────────────────────────────────────────────
  fontTotalLabel:      number;
  fontTotalDueLabel:   number;
  fontTotalDueAmount:  number;

  // ── Notes ─────────────────────────────────────────────────────────────────
  fontNotes:           number;

  // ── Banking typography ────────────────────────────────────────────────────
  fontBankingHeader:            number;   // size of "RECEIVING BANK" / "ACCOUNT HOLDER" title
  colorBankingSectionTitle:     string;
  fontWeightBankingSectionTitle:string;

  fontBankingLabel:             number;
  colorBankingLabel:            string;
  fontWeightBankingLabel:       string;
  fontStyleBankingLabel:        string;

  fontBankingValue:             number;
  colorBankingValue:            string;
  fontWeightBankingValue:       string;
  fontStyleBankingValue:        string;

  // ── Banking spacing ────────────────────────────────────────────────────────
  bankingRowGap:   number;   // gap between label-value rows
  bankingCardPadV: number;   // vertical padding inside each card
  bankingCardPadH: number;   // horizontal padding inside each card
  bankingCardGap:  number;   // gap between Receiving Bank card and Account Holder card

  // ── Global spacing & layout ───────────────────────────────────────────────
  pagePaddingV:      number;
  pagePaddingH:      number;
  sectionGap:        number;
  lineHeight:        number;
  borderRadius:      number;
  tableRowPaddingV:  number;
  tableRowPaddingH:  number;
};

export type StudioSettings = {
  company: CompanyInfo;
  style:   InvoiceStyle;
};
