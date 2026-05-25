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
  // Colors
  brand:          string;  // primary orange
  textPrimary:    string;
  textSecondary:  string;
  textMuted:      string;
  totalDueBg:     string;
  totalDueAmount: string;
  // Sizes
  logoHeight:          number;
  fontInvoiceTitle:    number;
  fontSectionHeader:   number;
  fontCompanyName:     number;
  fontCompanyDetail:   number;
  fontLabel:           number;
  fontValue:           number;
  fontTableRow:        number;
  fontTotalDueLabel:   number;
  fontTotalDueAmount:  number;
};

export type StudioSettings = {
  company: CompanyInfo;
  style:   InvoiceStyle;
};
