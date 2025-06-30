
export class generateBillHtmlHelper {
  

static staticBoilerPlat(title?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Ganesh Medical Store'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      margin: 0;
      padding: 20px;
      background: #fff;
    }
    .invoice-box {
      max-width: 900px;
      margin: auto;
      border: 1px solid #000;
      padding: 0;
    }
    .header, .footer, .section, .table {
      border-bottom: 1px solid #000;
    }
    .header {
      text-align: center;
      padding: 10px;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
    }
    .header p {
      margin: 2px 0;
    }
    .section {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 8px 10px;
      font-weight: bold;
      border-bottom: 1px solid #000;
    }
    .section div {
      margin: 2px 0;
    }
    .section span {
      font-weight: normal;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px 6px;
      vertical-align: top;
      text-align: center;
    }
    td.left {
      text-align: left;
    }
    .totals {
      padding: 20px 10px;
      font-size: 15px;
    }
    .totals div {
      display: flex;
      justify-content: flex-end;
      margin: 4px 0;
    }
    .totals div span:first-child {
      width: 150px;
      text-align: right;
      margin-right: 10px;
    }
    .totals .net {
      font-weight: bold;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      border-top: 1px solid #000;
    }

    /* PRINT STYLES */
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .invoice-box {
        margin: 0;
        border: none;
        width: 100%;
        max-width: 100%;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>`;
}

static staticFooter(): string {
  return `</body>
</html>`;
}

static generateBody(
  patientName: string,
  doctorName: string,
  billNo: string,
  billDate: string,
  itemsList: BillItemDto[],
  netAmount: number
): string {
  let rows = itemsList.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td class="left">${item.itemName}</td>
      <td>${item.itemMfg || ''}</td>
      <td>${item.itemPack || ''}</td>
      <td>${item.itemBatch || ''}</td>
      <td>${item.itemExpDate ? new Date(item.itemExpDate).toLocaleDateString('en-GB') : ''}</td>
      <td>${item.itemQuantity || 0}</td>
      <td>${item.itemPrice || 0}</td>
      <td>${(item.itemQuantity || 0) * (item.itemPrice || 0)}</td>
    </tr>`).join('');

  return `
  <div class="invoice-box">
    <div class="header">
      <h2>GANESH MEDICAL STORE</h2>
    </div>

    <div class="section" style="border-bottom: none;">
      <table style="width: 100%; border-collapse: collapse; font-weight: bold; border: none;">
        <tr>
          <td style="width: 33.33%; padding: 5px; border: none;">
            Patient Details: <span style="font-weight: normal;">${patientName}</span>
          </td>
          <td style="width: 33.33%; text-align: center; border: none;">CASH RECEIPT</td>
          <td style="width: 33.33%; text-align: right; padding: 5px; border: none;">
            Bill No.: <span style="font-weight: normal;">${billNo}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px; border: none;">
            Doctor: <span style="font-weight: normal;">${doctorName}</span>
          </td>
          <td style="border: none;"></td>
          <td style="text-align: right; padding: 5px; border: none;">
            Bill Dt.: <span style="font-weight: normal;">${billDate}</span>
          </td>
        </tr>
      </table>
    </div>

    <table>
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Description</th>
          <th>Mfg</th>
          <th>Pack</th>
          <th>Batch</th>
          <th>Exp Dt</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <div class="net">
        <span>Net Amount :</span> ${netAmount}
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your purchase!</p>
    </div>
  </div>`;
}

}


export interface BillItemDto {
  orderNumber: number;
  itemName: string;
  itemQuantity: number;
  itemPrice: number;
  itemTotal?: number;
  itemMfg?: string;
  itemPack?: string;
  itemBatch?: string;
  itemExpDate?: string; 
}
