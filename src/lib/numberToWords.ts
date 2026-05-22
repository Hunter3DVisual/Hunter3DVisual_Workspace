const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function belowThousand(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = tens[Math.floor(n / 10)];
    const o = ones[n % 10];
    return o ? `${t}-${o}` : t;
  }
  const h = ones[Math.floor(n / 100)];
  const rem = n % 100;
  return rem ? `${h} hundred ${belowThousand(rem)}` : `${h} hundred`;
}

export function numberToWordsEN(n: number): string {
  if (n === 0) return "Zero US dollars only";
  const int = Math.floor(n);
  let result = "";
  if (int >= 1000) {
    const thousands = Math.floor(int / 1000);
    const rem = int % 1000;
    result = `${belowThousand(thousands)} thousand`;
    if (rem) result += ` ${belowThousand(rem)}`;
  } else {
    result = belowThousand(int);
  }
  const words = result.trim();
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} US dollars only`;
}

const onesVI = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín",
  "mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm",
  "mười sáu", "mười bảy", "mười tám", "mười chín"];
const tensVI = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi",
  "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];

function belowHundredVI(n: number): string {
  if (n === 0) return "";
  if (n < 20) return onesVI[n];
  const t = tensVI[Math.floor(n / 10)];
  const o = n % 10;
  if (o === 0) return t;
  if (o === 5) return `${t} lăm`;
  if (o === 1) return `${t} mốt`;
  return `${t} ${onesVI[o]}`;
}

function belowThousandVI(n: number): string {
  if (n === 0) return "";
  if (n < 100) return belowHundredVI(n);
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const hStr = `${onesVI[h]} trăm`;
  if (rem === 0) return hStr;
  if (rem < 10) return `${hStr} linh ${onesVI[rem]}`;
  return `${hStr} ${belowHundredVI(rem)}`;
}

export function numberToWordsVI(n: number): string {
  if (n === 0) return "Không đô la Mỹ";
  const int = Math.floor(n);
  let result = "";
  if (int >= 1000) {
    const thousands = Math.floor(int / 1000);
    const rem = int % 1000;
    result = `${belowThousandVI(thousands)} nghìn`;
    if (rem) result += ` ${belowThousandVI(rem)}`;
  } else {
    result = belowThousandVI(int);
  }
  const words = result.trim();
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} đô la Mỹ`;
}
