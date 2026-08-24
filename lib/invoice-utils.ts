import type { Invoice, InvoiceItem } from "./mock-data";

export type PrintableInvoice = {
  id?: string;
  number: string;
  customerName: string;
  employeeName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string | Date;
};

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderInvoiceHtml(inv: PrintableInvoice): string {
  const rows = inv.items.map((i) =>
    `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(i.name)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${i.qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">$${i.lineTotal.toFixed(2)}</td></tr>`
  ).join("");
  return `
  <div style="font-family:system-ui,sans-serif;color:#111;padding:20px;border:1px solid #eee;border-radius:8px">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px">
      <div>
        <h2 style="margin:0;font-size:20px">IntelliPOS</h2>
        <p style="margin:2px 0;color:#666;font-size:12px">1 Cloud Plaza, San Francisco</p>
      </div>
      <div style="text-align:right">
        <p style="margin:0;font-size:14px;font-weight:600">Invoice ${esc(inv.number)}</p>
        <p style="margin:2px 0;color:#666;font-size:12px">${new Date(inv.createdAt).toLocaleString()}</p>
      </div>
    </div>
    <div style="display:flex;gap:24px;margin-bottom:12px;font-size:13px">
      <div><b>Bill to</b><br/>${esc(inv.customerName)}</div>
      <div><b>Sold by</b><br/>${esc(inv.employeeName)}</div>
      <div><b>Payment</b><br/>${esc(inv.paymentMethod)} · ${esc(inv.paymentStatus)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f7f7f8"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:right">Qty</th><th style="padding:8px;text-align:right">Price</th><th style="padding:8px;text-align:right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:12px;text-align:right;font-size:13px">
      <div>Subtotal: $${inv.subtotal.toFixed(2)}</div>
      <div>Discount: -$${inv.discount.toFixed(2)}</div>
      <div>Tax: $${inv.tax.toFixed(2)}</div>
      <div style="font-size:16px;font-weight:700;margin-top:6px">Grand total: $${inv.grandTotal.toFixed(2)}</div>
    </div>
    ${inv.notes ? `<p style="margin-top:12px;font-size:12px;color:#666">Notes: ${esc(inv.notes)}</p>` : ""}
  </div>`;
}

export function printInvoice(inv: PrintableInvoice) {
  const w = window.open("", "_blank", "width=700,height=800");
  if (!w) return;
  w.document.write(`<html><head><title>${esc(inv.number)}</title></head><body>${renderInvoiceHtml(inv)}<script>window.onload=()=>{window.print();}</script></body></html>`);
  w.document.close();
}

export function downloadInvoice(inv: PrintableInvoice) {
  const blob = new Blob([`<html><body>${renderInvoiceHtml(inv)}</body></html>`], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${inv.number.replace(/[^a-zA-Z0-9._-]/g, "_")}.html`; a.click();
  URL.revokeObjectURL(url);
}
