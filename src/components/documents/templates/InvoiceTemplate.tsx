import { numberToWordsEN, numberToWordsVI } from "@/lib/numberToWords";
import { format } from "date-fns";
import type { ClientInfo, LineItem } from "@/types/documents";

interface InvoiceTemplateProps {
  contractNumber: string;
  signDate: Date | string;
  clientInfo: ClientInfo;
  lineItems: LineItem[];
  totalAmount: number;
  currency?: string;
  notes?: string;
}

export function InvoiceTemplate({
  contractNumber,
  signDate,
  clientInfo,
  lineItems,
  totalAmount,
  currency = "USD",
  notes,
}: InvoiceTemplateProps) {
  const signDateObj = new Date(signDate);
  const signDateFmt = format(signDateObj, "dd/MM/yyyy");

  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  const paper: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "12pt",
    lineHeight: "1.6",
    color: "#1a1a1a",
    background: "#ffffff",
    padding: "20mm 25mm",
    minHeight: "297mm",
    width: "210mm",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  const accent = "#E8521A";

  const headerRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: `2px solid ${accent}`,
  };

  const logoBlock: React.CSSProperties = { maxWidth: "55%" };
  const invoiceBlock: React.CSSProperties = { textAlign: "right", maxWidth: "42%" };

  const invoiceTitle: React.CSSProperties = {
    fontSize: "28pt",
    fontWeight: "bold",
    color: accent,
    lineHeight: "1",
  };

  const sectionLabel: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "10pt",
    textTransform: "uppercase",
    color: "#666",
    marginBottom: "4px",
  };

  const billToSection: React.CSSProperties = {
    background: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    padding: "12px 16px",
    marginBottom: "20px",
  };

  const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: "16px" };

  const thStyle: React.CSSProperties = {
    background: accent,
    color: "#ffffff",
    padding: "8px 10px",
    fontWeight: "bold",
    textAlign: "center",
    border: `1px solid ${accent}`,
    fontSize: "10pt",
  };

  const thLeftStyle: React.CSSProperties = { ...thStyle, textAlign: "left" };

  const totalsRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  };

  const totalsBox: React.CSSProperties = {
    width: "55%",
  };

  const totalLineStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: "11pt",
  };

  const grandTotalStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderTop: `2px solid ${accent}`,
    fontWeight: "bold",
    fontSize: "14pt",
    color: accent,
  };

  const paymentBox: React.CSSProperties = {
    background: "#4A4A4A",
    color: "#ffffff",
    borderRadius: "4px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "11pt",
  };

  const notesBox: React.CSSProperties = {
    background: "#FFF5F0",
    border: `1px solid ${accent}`,
    borderRadius: "4px",
    padding: "10px 14px",
    marginBottom: "20px",
    fontSize: "10.5pt",
  };

  const sigRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "32px",
    alignItems: "flex-end",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body > * { display: none !important; }
            #document-template { display: block !important; }
            @page { size: A4; margin: 20mm; }
          }
        `
      }} />
      <div id="document-template">
        <div style={paper}>
          <div style={headerRow}>
            <div style={logoBlock}>
              <img src="/logo.png" alt="Hunter 3Dvisual" style={{ height: "48px", marginBottom: "8px", objectFit: "contain" }} />
              <div style={{ fontWeight: "bold", fontSize: "13pt" }}>CÔNG TY TNHH HUNTER 3DVISUAL</div>
              <div style={{ fontSize: "11pt", color: "#444" }}>HUNTER 3DVISUAL LLC</div>
              <div style={{ fontSize: "10.5pt", color: "#555", marginTop: "4px" }}>
                196 đường Trương Xuân Nam, P.Ngũ Hành Sơn, TP.Đà Nẵng
              </div>
              <div style={{ fontSize: "10.5pt", color: "#555" }}>Tax: 0401961868 | Phone: 0979592543</div>
            </div>
            <div style={invoiceBlock}>
              <div style={invoiceTitle}>INVOICE</div>
              <div style={{ fontSize: "11pt", color: "#888", marginTop: "2px" }}>HÓA ĐƠN</div>
              <div style={{ marginTop: "12px", fontSize: "11pt" }}>
                <div><span style={{ color: "#888" }}>Số HĐ / No.: </span><strong>{contractNumber}</strong></div>
                <div><span style={{ color: "#888" }}>Ngày / Date: </span><strong>{signDateFmt}</strong></div>
              </div>
            </div>
          </div>

          <div style={billToSection}>
            <div style={sectionLabel}>GỬI ĐẾN / BILL TO:</div>
            <div style={{ fontWeight: "bold", fontSize: "12pt" }}>{clientInfo.company}</div>
            <div>{clientInfo.representative} – {clientInfo.position}</div>
            <div style={{ color: "#555" }}>{clientInfo.address}</div>
            <div style={{ color: "#555" }}>Tax: {clientInfo.taxCode} | Phone: {clientInfo.phone}</div>
          </div>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "5%" }}>STT</th>
                <th style={thLeftStyle}>Hạng mục / Item</th>
                <th style={thLeftStyle}>Mô tả / Description</th>
                <th style={{ ...thStyle, width: "8%" }}>SL / Qty</th>
                <th style={{ ...thStyle, width: "18%" }}>Đơn giá / Unit Price USD</th>
                <th style={{ ...thStyle, width: "18%" }}>Thành tiền / Amount USD</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => {
                const amount = item.qty * item.unitPrice;
                const bg = i % 2 === 0 ? "#ffffff" : "#FFF5F0";
                const tdBase: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e0e0e0", background: bg };
                const tdCenter: React.CSSProperties = { ...tdBase, textAlign: "center" };
                const tdRight: React.CSSProperties = { ...tdBase, textAlign: "right" };
                return (
                  <tr key={i}>
                    <td style={tdCenter}>{i + 1}</td>
                    <td style={tdBase}>{item.item}</td>
                    <td style={tdBase}>{item.description}</td>
                    <td style={tdCenter}>{item.qty}</td>
                    <td style={tdRight}>{item.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td style={tdRight}>{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={totalsRow}>
            <div style={totalsBox}>
              <div style={totalLineStyle}>
                <span style={{ color: "#555" }}>Subtotal / Tạm tính:</span>
                <span>{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}</span>
              </div>
              <div style={grandTotalStyle}>
                <span>TOTAL / TỔNG CỘNG:</span>
                <span>{totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}</span>
              </div>
              <div style={{ fontSize: "10pt", color: "#444", marginTop: "6px", fontStyle: "italic" }}>
                ({numberToWordsEN(totalAmount)})
              </div>
              <div style={{ fontSize: "10pt", color: "#444", fontStyle: "italic" }}>
                ({numberToWordsVI(totalAmount)})
              </div>
            </div>
          </div>

          <div style={paymentBox}>
            <div style={{ fontWeight: "bold", fontSize: "11pt", marginBottom: "6px", letterSpacing: "0.05em" }}>
              THÔNG TIN THANH TOÁN / PAYMENT INFORMATION
            </div>
            <div>Ngân hàng / Bank: Ngân hàng TMCP Á Châu (ACB) / Asia Commercial Bank (ACB)</div>
            <div>Số tài khoản / Account No.: <strong>41163457</strong></div>
            <div>Tên tài khoản / Account name: <strong>CÔNG TY TNHH HUNTER 3DVISUAL</strong></div>
            <div>Swift code: <strong>ASCBVNVX</strong></div>
          </div>

          {notes && (
            <div style={notesBox}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Ghi chú / Notes:</div>
              <div>{notes}</div>
            </div>
          )}

          <div style={sigRow}>
            <div style={{ fontSize: "11pt", color: "#555" }}>
              <div style={{ fontWeight: "bold", color: "#1a1a1a" }}>Chữ ký / Signature:</div>
              <div style={{ marginTop: "48px", borderTop: "1px solid #1a1a1a", paddingTop: "4px", textAlign: "center" }}>
                <div style={{ fontWeight: "bold" }}>Hunter 3Dvisual</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "11pt", color: "#555" }}>
              <div>Date: {signDateFmt}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
