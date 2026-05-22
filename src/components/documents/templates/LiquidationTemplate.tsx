import { numberToWordsEN, numberToWordsVI } from "@/lib/numberToWords";
import { format } from "date-fns";
import type { ClientInfo, ScopeItem } from "@/types/documents";

const PARTY_B = {
  companyVI: "CÔNG TY TNHH HUNTER 3DVISUAL",
  companyEN: "HUNTER 3DVISUAL LLC",
  addressVI: "196 đường Trương Xuân Nam, Phường Ngũ Hành Sơn, Thành phố Đà Nẵng",
  addressEN: "196 Truong Xuan Nam Street, Ngu Hanh Son Ward, Da Nang City, Vietnam",
  repVI: "Phạm Thị Thanh Thùy",
  repEN: "Pham Thi Thanh Thuy",
  positionVI: "Giám đốc",
  positionEN: "Director",
  taxCode: "0401961868",
  phone: "0979592543",
};

interface LiquidationTemplateProps {
  contractNumber: string;
  signDate: Date | string;
  liquidationDate: Date | string;
  clientInfo: ClientInfo;
  scopeItems: ScopeItem[];
  totalAmount: number;
}

export function LiquidationTemplate({
  contractNumber,
  signDate,
  liquidationDate,
  clientInfo,
  scopeItems,
  totalAmount,
}: LiquidationTemplateProps) {
  const signDateObj = new Date(signDate);
  const liquidationDateObj = new Date(liquidationDate);

  const signDateFmt = format(signDateObj, "dd/MM/yyyy");
  const liqDay = format(liquidationDateObj, "dd");
  const liqMonth = format(liquidationDateObj, "MM");
  const liqYear = format(liquidationDateObj, "yyyy");
  const liqDateEN = format(liquidationDateObj, "MMMM d, yyyy");

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

  const center: React.CSSProperties = { textAlign: "center" };
  const bold: React.CSSProperties = { fontWeight: "bold" };
  const italic: React.CSSProperties = { fontStyle: "italic" };
  const boldUpper: React.CSSProperties = { fontWeight: "bold", textTransform: "uppercase", display: "block", marginTop: "0.5rem" };
  const indent: React.CSSProperties = { marginLeft: "1.5rem" };
  const mt2: React.CSSProperties = { marginTop: "0.5rem" };
  const mt4: React.CSSProperties = { marginTop: "1rem" };
  const divider: React.CSSProperties = { textAlign: "center", margin: "4px 0" };
  const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" };
  const thStyle: React.CSSProperties = { border: "1px solid #555", padding: "4px 8px", background: "#f0f0f0", fontWeight: "bold", textAlign: "center" };
  const tdStyle: React.CSSProperties = { border: "1px solid #555", padding: "4px 8px", textAlign: "center" };
  const tdLeftStyle: React.CSSProperties = { border: "1px solid #555", padding: "4px 8px", textAlign: "left" };
  const sigBlock: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginTop: "3rem" };
  const sigSide: React.CSSProperties = { width: "46%", textAlign: "center" };
  const sigLine: React.CSSProperties = { borderTop: "1px solid #1a1a1a", marginTop: "80px", paddingTop: "4px" };

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
          <div style={center}>
            <div style={bold}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style={bold}>Độc lập – Tự do – Hạnh phúc</div>
            <div style={{ ...italic, marginTop: "2px" }}>SOCIALIST REPUBLIC OF VIETNAM</div>
            <div style={italic}>Independence – Freedom – Happiness</div>
            <div style={divider}>━━━━━━━━━━━━━━</div>
            <div style={{ ...bold, marginTop: "1rem", fontSize: "13pt" }}>BIÊN BẢN THANH LÝ HỢP ĐỒNG</div>
            <div style={{ ...italic, fontSize: "12pt" }}>CONTRACT LIQUIDATION MINUTES</div>
          </div>

          <div style={mt4}>
            <div>Căn cứ vào Hợp đồng dịch vụ thiết kế 3D số <span style={bold}>{contractNumber}</span> ký ngày <span style={bold}>{signDateFmt}</span></div>
            <div style={italic}>Pursuant to 3D Design Service Contract No. <strong>{contractNumber}</strong> signed on <strong>{signDateFmt}</strong></div>
          </div>

          <div style={mt4}>
            <div>Hôm nay, ngày <span style={bold}>{liqDay}</span> tháng <span style={bold}>{liqMonth}</span> năm <span style={bold}>{liqYear}</span>, tại Thành phố Đà Nẵng, Việt Nam</div>
            <div style={italic}>Today, <strong>{liqDateEN}</strong>, in Da Nang City, Vietnam</div>
            <div style={mt2}><span style={bold}>Chúng tôi gồm: / The undersigned:</span></div>
          </div>

          <div style={mt4}>
            <div style={bold}>BÊN A / PARTY A <span style={{ fontWeight: "normal" }}>(Bên mua dịch vụ / Service Buyer):</span></div>
            <div style={indent}>
              <div>• Tên công ty / Company: <span style={bold}>{clientInfo.company}</span></div>
              <div>• Địa chỉ / Address: {clientInfo.address}</div>
              <div>• Đại diện / Representative: <span style={bold}>{clientInfo.representative}</span></div>
              <div>• Chức vụ / Position: {clientInfo.position}</div>
              <div>• Mã số thuế / Tax Code: {clientInfo.taxCode}</div>
              <div>• Điện thoại / Phone: {clientInfo.phone}</div>
            </div>
          </div>

          <div style={mt4}>
            <div style={bold}>BÊN B / PARTY B <span style={{ fontWeight: "normal" }}>(Bên cung cấp dịch vụ / Service Provider):</span></div>
            <div style={indent}>
              <div>• Tên công ty / Company: <span style={bold}>{PARTY_B.companyVI} / {PARTY_B.companyEN}</span></div>
              <div>• Địa chỉ / Address: {PARTY_B.addressVI} / {PARTY_B.addressEN}</div>
              <div>• Đại diện / Representative: <span style={bold}>{PARTY_B.repVI} / {PARTY_B.repEN}</span></div>
              <div>• Chức vụ / Position: {PARTY_B.positionVI} / {PARTY_B.positionEN}</div>
              <div>• Mã số thuế / Tax Code: {PARTY_B.taxCode}</div>
              <div>• Điện thoại / Phone: {PARTY_B.phone}</div>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            Hai bên cùng nhau lập Biên bản thanh lý Hợp đồng với nội dung như sau:
            <div style={italic}>Both parties hereby draw up the Contract Liquidation Minutes with the following content:</div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 1: XÁC NHẬN NGHIỆM THU SẢN PHẨM / ARTICLE 1: PRODUCT ACCEPTANCE CONFIRMATION</div>

            <div style={mt2}>
              <span style={bold}>1.1.</span> Hai bên xác nhận Bên B đã hoàn thành và bàn giao đầy đủ các sản phẩm theo quy định tại Điều 1 của Hợp đồng số <span style={bold}>{contractNumber}</span>.
              <div style={{ ...italic, ...indent }}>Both parties confirm that Party B has completed and fully delivered all products as stipulated in Article 1 of Contract No. {contractNumber}.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>1.2.</span> Bên A đã kiểm tra, nghiệm thu và chấp nhận toàn bộ sản phẩm do Bên B bàn giao. Sản phẩm đáp ứng đầy đủ các yêu cầu kỹ thuật và chất lượng theo thỏa thuận.
              <div style={{ ...italic, ...indent }}>Party A has inspected, accepted and approved all products delivered by Party B. The products fully meet the agreed technical requirements and quality standards.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>1.3. Danh sách sản phẩm đã bàn giao / List of delivered products:</span>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>STT / No.</th>
                    <th style={thStyle}>Nội dung / Description</th>
                    <th style={thStyle}>Số lượng / Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {scopeItems.map((item, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdLeftStyle}>{item.description}</td>
                      <td style={tdStyle}>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 2: THANH TOÁN VÀ QUYẾT TOÁN / ARTICLE 2: PAYMENT AND SETTLEMENT</div>

            <div style={mt2}>
              <span style={bold}>2.1. Tổng giá trị hợp đồng / Total contract value:</span>{" "}
              <span style={{ fontWeight: "bold", fontSize: "13pt" }}>{totalAmount.toLocaleString()} USD</span>
              <div style={indent}>(In words (English): <em>{numberToWordsEN(totalAmount)}</em>)</div>
              <div style={indent}>(Bằng chữ tiếng Việt: <em>{numberToWordsVI(totalAmount)}</em>)</div>
            </div>

            <div style={mt2}>
              <span style={bold}>2.2. Tổng số tiền đã thanh toán / Total amount paid:</span> <span style={bold}>{totalAmount.toLocaleString()} USD</span>
            </div>

            <div style={mt2}>
              <span style={bold}>2.3. Số tiền còn lại phải thanh toán / Outstanding balance:</span> <span style={bold}>0 USD (Không đồng / Zero)</span>
            </div>

            <div style={mt2}>
              <span style={bold}>2.4.</span> Hai bên xác nhận đã hoàn tất toàn bộ nghĩa vụ thanh toán theo Hợp đồng. Không còn bất kỳ tranh chấp tài chính nào giữa hai bên liên quan đến Hợp đồng này.
              <div style={{ ...italic, ...indent }}>Both parties confirm that all payment obligations under the Contract have been fully settled. There are no outstanding financial disputes between the parties relating to this Contract.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 3: ĐIỀU KHOẢN CHUNG / ARTICLE 3: GENERAL PROVISIONS</div>

            <div style={mt2}>
              <span style={bold}>3.1.</span> Kể từ ngày ký Biên bản này, Hợp đồng số <span style={bold}>{contractNumber}</span> chính thức được thanh lý, chấm dứt hiệu lực và hai bên không còn bất kỳ nghĩa vụ nào đối với nhau phát sinh từ Hợp đồng đó, ngoại trừ nghĩa vụ bảo mật thông tin.
              <div style={{ ...italic, ...indent }}>From the date of signing these Minutes, Contract No. {contractNumber} is officially liquidated and terminated, and neither party shall have any remaining obligations to the other arising from said Contract, except confidentiality obligations.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>3.2.</span> Toàn bộ quyền sở hữu trí tuệ đối với các sản phẩm đã bàn giao được chuyển giao hoàn toàn cho Bên A theo quy định tại Điều 6 của Hợp đồng.
              <div style={{ ...italic, ...indent }}>All intellectual property rights to the delivered products are fully transferred to Party A in accordance with Article 6 of the Contract.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>3.3.</span> Biên bản này được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản, có hiệu lực kể từ ngày ký.
              <div style={{ ...italic, ...indent }}>These Minutes are executed in 02 (two) originals of equal legal value, each party retaining 01 (one) original, effective from the date of signing.</div>
            </div>
          </div>

          <div style={sigBlock}>
            <div style={sigSide}>
              <div style={bold}>ĐẠI DIỆN BÊN A / PARTY A REPRESENTATIVE</div>
              <div style={italic}>(Ký, ghi rõ họ tên / Signature and full name)</div>
              <div style={sigLine}>
                <div style={bold}>{clientInfo.representative}</div>
                <div>{clientInfo.position}</div>
              </div>
            </div>
            <div style={sigSide}>
              <div style={bold}>ĐẠI DIỆN BÊN B / PARTY B REPRESENTATIVE</div>
              <div style={italic}>(Ký, ghi rõ họ tên / Signature and full name)</div>
              <div style={sigLine}>
                <div style={bold}>{PARTY_B.repVI} / {PARTY_B.repEN}</div>
                <div>{PARTY_B.positionVI} / {PARTY_B.positionEN}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
