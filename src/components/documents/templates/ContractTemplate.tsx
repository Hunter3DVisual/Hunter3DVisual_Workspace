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
  bank: "Ngân hàng TMCP Á Châu (ACB) / Asia Commercial Bank (ACB)",
  accountNo: "41163457",
  accountName: "CÔNG TY TNHH HUNTER 3DVISUAL",
  swiftCode: "ASCBVNVX",
};

interface ContractTemplateProps {
  contractNumber: string;
  signDate: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  clientInfo: ClientInfo;
  scopeItems: ScopeItem[];
  totalAmount: number;
}

export function ContractTemplate({
  contractNumber,
  signDate,
  startDate,
  endDate,
  clientInfo,
  scopeItems,
  totalAmount,
}: ContractTemplateProps) {
  const signDateObj = new Date(signDate);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const day = format(signDateObj, "dd");
  const month = format(signDateObj, "MM");
  const year = format(signDateObj, "yyyy");
  const signDateEN = format(signDateObj, "MMMM d, yyyy");
  const startDateFmt = format(startDateObj, "dd/MM/yyyy");
  const endDateFmt = format(endDateObj, "dd/MM/yyyy");

  const half = totalAmount * 0.5;

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
  const subIndent: React.CSSProperties = { marginLeft: "2.5rem" };
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
            <div style={{ ...bold, marginTop: "1rem", fontSize: "13pt" }}>HỢP ĐỒNG DỊCH VỤ THIẾT KẾ, DỰNG PHIM 3D</div>
            <div style={{ ...italic, fontSize: "12pt" }}>3D DESIGN AND RENDERING SERVICE CONTRACT</div>
            <div style={mt2}><span style={bold}>Số HĐ / Contract No.: {contractNumber}</span></div>
          </div>

          <div style={mt4}>
            <div>Hôm nay, ngày <span style={bold}>{day}</span> tháng <span style={bold}>{month}</span> năm <span style={bold}>{year}</span>, tại Thành phố Đà Nẵng, Việt Nam</div>
            <div style={italic}>Today, <strong>{signDateEN}</strong>, in Da Nang City, Vietnam</div>
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
            Hai bên thống nhất ký kết Hợp đồng dịch vụ với các điều khoản và điều kiện như sau:
            <div style={italic}>Both parties agree to enter into this Service Contract under the following terms and conditions:</div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 1: NỘI DUNG HỢP ĐỒNG / ARTICLE 1: CONTRACT SCOPE</div>

            <div style={mt2}>
              <span style={bold}>1.1.</span> Bên A đặt hàng Bên B thực hiện dịch vụ thiết kế, dựng mô hình và render hình ảnh 3D kiến trúc theo yêu cầu của Bên A.
              <div style={{ ...italic, ...indent }}>Party A commissions Party B to perform 3D architectural design, modeling and rendering services as required by Party A.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>1.2. Sản phẩm bàn giao / Deliverables:</span>
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

            <div style={mt2}>
              <span style={bold}>1.3. Phần mềm sử dụng / Software:</span> 3Ds Max, Corona Renderer, Adobe Photoshop CC
            </div>

            <div style={mt2}>
              <span style={bold}>1.4. Định dạng bàn giao / Delivery format:</span> File ảnh JPG/PNG độ phân giải tối thiểu 4K (3840×2160px). Có thể xuất file TIFF không nén theo yêu cầu.
              <div style={{ ...italic, ...indent }}>JPG/PNG images at minimum 4K resolution (3840×2160px). Uncompressed TIFF files available upon request.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 2: THỜI GIAN THỰC HIỆN / ARTICLE 2: PERFORMANCE PERIOD</div>

            <div style={mt2}>
              <span style={bold}>2.1.</span> Hợp đồng có hiệu lực từ ngày <span style={bold}>{startDateFmt}</span> đến ngày <span style={bold}>{endDateFmt}</span>.
              <div style={{ ...italic, ...indent }}>This Contract is effective from <strong>{startDateFmt}</strong> to <strong>{endDateFmt}</strong>.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>2.2.</span> Trong vòng 05 (năm) ngày làm việc kể từ khi ký Hợp đồng và nhận đầy đủ tài liệu tham khảo, Bên B sẽ gửi Bên A bản concept/phác thảo để phê duyệt.
              <div style={{ ...italic, ...indent }}>Within 05 (five) working days from contract signing and receipt of all reference materials, Party B shall submit concept/sketch to Party A for approval.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>2.3.</span> Sau khi Bên A phê duyệt concept, Bên B tiến hành render chính thức và bàn giao sản phẩm trước ngày kết thúc quy định tại Điều 2.1.
              <div style={{ ...italic, ...indent }}>After Party A approves the concept, Party B shall proceed to final rendering and deliver all products before the end date stated in Article 2.1.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>2.4.</span> Trường hợp Bên A chậm cung cấp tài liệu cần thiết, thời hạn thực hiện được điều chỉnh tương ứng với thời gian chậm trễ.
              <div style={{ ...italic, ...indent }}>If Party A delays in providing necessary materials, the performance period shall be adjusted accordingly.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 3: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN / ARTICLE 3: CONTRACT VALUE AND PAYMENT TERMS</div>

            <div style={mt2}>
              <span style={bold}>3.1. Tổng giá trị hợp đồng / Total Contract Value:</span>{" "}
              <span style={{ fontWeight: "bold", fontSize: "13pt" }}>{totalAmount.toLocaleString()} USD</span>
              <div style={indent}>(Bằng chữ tiếng Anh / In words (English): <em>{numberToWordsEN(totalAmount)}</em>)</div>
              <div style={indent}>(Bằng chữ tiếng Việt / In words (Vietnamese): <em>{numberToWordsVI(totalAmount)}</em>)</div>
            </div>

            <div style={mt2}>
              <span style={bold}>3.2. Phương thức thanh toán / Payment method:</span> Chuyển khoản ngân hàng / Bank transfer
            </div>

            <div style={mt2}>
              <span style={bold}>3.3. Tiến độ thanh toán / Payment schedule:</span>
              <div style={{ ...indent, ...mt2 }}>
                – <span style={bold}>Đợt 1:</span> 50% giá trị hợp đồng (= <span style={bold}>{half.toLocaleString()} USD</span>) thanh toán ngay sau khi ký Hợp đồng.
                <div style={{ ...italic, ...subIndent }}>Payment 1: 50% of contract value (= {half.toLocaleString()} USD) due immediately upon contract signing.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                – <span style={bold}>Đợt 2:</span> 50% giá trị hợp đồng (= <span style={bold}>{half.toLocaleString()} USD</span>) thanh toán sau khi Bên A nghiệm thu và chấp nhận toàn bộ sản phẩm bàn giao.
                <div style={{ ...italic, ...subIndent }}>Payment 2: 50% of contract value (= {half.toLocaleString()} USD) due upon Party A's acceptance of all delivered products.</div>
              </div>
            </div>

            <div style={mt2}>
              <span style={bold}>3.4. Thông tin tài khoản Bên B / Party B's bank account:</span>
              <div style={indent}>
                <div>– Ngân hàng / Bank: {PARTY_B.bank}</div>
                <div>– Số tài khoản / Account No.: <span style={bold}>{PARTY_B.accountNo}</span></div>
                <div>– Tên tài khoản / Account name: <span style={bold}>{PARTY_B.accountName}</span></div>
                <div>– Swift code: <span style={bold}>{PARTY_B.swiftCode}</span></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A / ARTICLE 4: RIGHTS AND OBLIGATIONS OF PARTY A</div>

            <div style={mt2}>
              <span style={bold}>4.1. Nghĩa vụ của Bên A / Obligations of Party A:</span>
              <div style={{ ...indent, ...mt2 }}>
                a) Cung cấp đầy đủ, kịp thời tài liệu kỹ thuật, bản vẽ thiết kế, moodboard và các yêu cầu cụ thể cần thiết để Bên B thực hiện công việc.
                <div style={italic}>Provide complete and timely technical documents, design drawings, moodboards and specific requirements necessary for Party B to perform the work.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                b) Thanh toán đúng hạn theo tiến độ quy định tại Điều 3.
                <div style={italic}>Make timely payments according to the schedule in Article 3.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                c) Phản hồi và phê duyệt các bước thiết kế trong vòng 03 (ba) ngày làm việc kể từ khi nhận được sản phẩm từ Bên B. Sau thời hạn này mà không có phản hồi, sản phẩm được coi là đã được chấp thuận.
                <div style={italic}>Provide feedback and approve design stages within 03 (three) working days of receiving products from Party B. Failure to respond within this period shall be deemed acceptance.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                d) Chịu trách nhiệm về tính hợp pháp của mọi tài liệu, bản vẽ cung cấp cho Bên B.
                <div style={italic}>Be responsible for the legality of all documents and drawings provided to Party B.</div>
              </div>
            </div>

            <div style={mt2}>
              <span style={bold}>4.2. Quyền của Bên A / Rights of Party A:</span>
              <div style={{ ...indent, ...mt2 }}>
                a) Yêu cầu Bên B chỉnh sửa sản phẩm không quá 03 (ba) lần cho mỗi góc nhìn trong phạm vi thỏa thuận ban đầu. Các yêu cầu chỉnh sửa vượt quá số lần quy định có thể phát sinh chi phí phụ trội.
                <div style={italic}>Request up to 03 (three) revisions per view within the originally agreed scope. Revision requests beyond this limit may incur additional charges.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                b) Yêu cầu Bên B cập nhật tiến độ thực hiện bất kỳ lúc nào.
                <div style={italic}>Request progress updates from Party B at any time.</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B / ARTICLE 5: RIGHTS AND OBLIGATIONS OF PARTY B</div>

            <div style={mt2}>
              <span style={bold}>5.1. Nghĩa vụ của Bên B / Obligations of Party B:</span>
              <div style={{ ...indent, ...mt2 }}>
                a) Thực hiện dịch vụ theo đúng nội dung, tiêu chuẩn kỹ thuật và tiến độ đã thỏa thuận trong Hợp đồng.
                <div style={italic}>Perform services in accordance with the content, technical standards and timeline agreed in this Contract.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                b) Bảo mật toàn bộ thông tin, tài liệu của Bên A trong suốt quá trình thực hiện và sau khi kết thúc Hợp đồng.
                <div style={italic}>Maintain strict confidentiality of all Party A information and documents throughout and after the contract period.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                c) Thông báo kịp thời bằng văn bản cho Bên A về bất kỳ vấn đề phát sinh nào có thể ảnh hưởng đến tiến độ hoặc chất lượng sản phẩm.
                <div style={italic}>Promptly notify Party A in writing of any issues that may affect the schedule or product quality.</div>
              </div>
            </div>

            <div style={mt2}>
              <span style={bold}>5.2. Quyền của Bên B / Rights of Party B:</span>
              <div style={{ ...indent, ...mt2 }}>
                a) Yêu cầu Bên A cung cấp đầy đủ tài liệu cần thiết trước khi bắt đầu thực hiện công việc.
                <div style={italic}>Request Party A to provide all necessary materials before commencing work.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                b) Yêu cầu thanh toán đúng hạn và có quyền tạm dừng dịch vụ nếu Bên A chậm thanh toán quá 15 (mười lăm) ngày mà không có lý do hợp lệ.
                <div style={italic}>Demand timely payment and suspend services if Party A delays payment by more than 15 (fifteen) days without valid reason.</div>
              </div>
              <div style={{ ...indent, ...mt2 }}>
                c) Sử dụng hình ảnh sản phẩm đã bàn giao cho mục đích portfolio và quảng bá thương hiệu của Bên B, trừ khi có thỏa thuận bảo mật riêng bằng văn bản.
                <div style={italic}>Use delivered product images for portfolio and brand promotion purposes, unless a separate written confidentiality agreement exists.</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 6: SỞ HỮU TRÍ TUỆ / ARTICLE 6: INTELLECTUAL PROPERTY</div>

            <div style={mt2}>
              <span style={bold}>6.1.</span> Toàn bộ sản phẩm 3D (hình ảnh, animation, file dự án) được tạo ra theo Hợp đồng này sẽ thuộc quyền sở hữu của Bên A ngay khi Bên A hoàn tất thanh toán toàn bộ giá trị Hợp đồng.
              <div style={{ ...italic, ...indent }}>All 3D products (images, animations, project files) created under this Contract shall become the exclusive property of Party A upon full payment of the contract value.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>6.2.</span> Trước khi thanh toán đầy đủ, Bên B giữ toàn quyền sở hữu đối với tất cả sản phẩm được tạo ra theo Hợp đồng này.
              <div style={{ ...italic, ...indent }}>Prior to full payment, Party B retains full ownership of all products created under this Contract.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 7: VI PHẠM HỢP ĐỒNG / ARTICLE 7: BREACH OF CONTRACT</div>

            <div style={mt2}>
              <span style={bold}>7.1.</span> Trường hợp Bên A vi phạm nghĩa vụ thanh toán, phạt vi phạm là 0,1% (không phẩy một phần trăm) trên số tiền chậm trả cho mỗi ngày chậm.
              <div style={{ ...italic, ...indent }}>In case of Party A's payment default, a penalty of 0.1% (zero point one percent) of the overdue amount shall apply per day of delay.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>7.2.</span> Trường hợp Bên B bàn giao sản phẩm trễ hạn không có lý do chính đáng, phạt vi phạm là 0,1% (không phẩy một phần trăm) tổng giá trị Hợp đồng cho mỗi ngày trễ.
              <div style={{ ...italic, ...indent }}>In case of Party B's unjustified late delivery, a penalty of 0.1% (zero point one percent) of the total contract value shall apply per day of delay.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>7.3.</span> Mức phạt tối đa không vượt quá 8% (tám phần trăm) tổng giá trị Hợp đồng.
              <div style={{ ...italic, ...indent }}>The maximum total penalty shall not exceed 8% (eight percent) of the total contract value.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 8: GIẢI QUYẾT TRANH CHẤP / ARTICLE 8: DISPUTE RESOLUTION</div>

            <div style={mt2}>
              Mọi tranh chấp phát sinh từ hoặc liên quan đến Hợp đồng này trước tiên sẽ được giải quyết thông qua thương lượng thiện chí giữa hai Bên. Nếu không đạt được thỏa thuận trong vòng 30 (ba mươi) ngày kể từ ngày một Bên gửi thông báo tranh chấp cho Bên kia, tranh chấp sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại Thành phố Đà Nẵng, Việt Nam, theo pháp luật hiện hành của nước Cộng hòa xã hội chủ nghĩa Việt Nam.
              <div style={{ ...italic, ...mt2 }}>Any dispute arising from or in connection with this Contract shall first be resolved through good-faith negotiation between the Parties. If no resolution is reached within 30 (thirty) days from the date one Party delivers a dispute notice to the other, the dispute shall be submitted to the competent People's Court in Da Nang City, Vietnam, pursuant to the applicable laws of the Socialist Republic of Vietnam.</div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={boldUpper}>ĐIỀU 9: ĐIỀU KHOẢN CHUNG / ARTICLE 9: GENERAL PROVISIONS</div>

            <div style={mt2}>
              <span style={bold}>9.1.</span> Hợp đồng này được lập thành 02 (hai) bản gốc có giá trị pháp lý như nhau bằng tiếng Việt và tiếng Anh, mỗi bên giữ 01 (một) bản. Hợp đồng có hiệu lực kể từ ngày ký.
              <div style={{ ...italic, ...indent }}>This Contract is executed in 02 (two) originals of equal legal value in Vietnamese and English, each Party retaining 01 (one) original. The Contract takes effect from the date of signing.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>9.2.</span> Mọi sửa đổi, bổ sung Hợp đồng chỉ có giá trị khi được lập thành phụ lục hợp đồng bằng văn bản, có chữ ký của người đại diện có thẩm quyền của cả hai Bên.
              <div style={{ ...italic, ...indent }}>Any amendment to this Contract is only valid when made in a written addendum signed by the authorized representatives of both Parties.</div>
            </div>

            <div style={mt2}>
              <span style={bold}>9.3.</span> Nếu bất kỳ điều khoản nào của Hợp đồng này được xác định là vô hiệu hoặc không thể thực thi, các điều khoản còn lại vẫn có đầy đủ hiệu lực.
              <div style={{ ...italic, ...indent }}>If any provision of this Contract is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.</div>
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
