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
  totalDueTextColor: string;  // label text on dark box
  totalDueAmount:    string;  // amount text color

  // ── Logo ─────────────────────────────────────────────────────────────────
  logoHeight:        number;
  logoPosition:      "left" | "right";

  // ── Typography ───────────────────────────────────────────────────────────
  fontFamily:        string;
  fontInvoiceTitle:  number;
  fontSectionHeader: number;
  fontCompanyName:   number;
  fontCompanyDetail: number;
  fontInvoiceNumber: number;
  fontStatusBadge:   number;
  fontLabel:         number;
  fontValue:         number;
  fontClientName:    number;
  fontClientDetail:  number;
  fontTableHeader:   number;
  fontTableRow:      number;
  fontTotalLabel:    number;
  fontTotalDueLabel: number;
  fontTotalDueAmount:number;
  fontNotes:         number;
  fontBankingHeader: number;
  fontBankingLabel:  number;
  fontFooter:        number;

  // ── Spacing & Layout ─────────────────────────────────────────────────────
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
