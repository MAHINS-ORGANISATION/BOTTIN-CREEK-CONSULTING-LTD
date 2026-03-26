import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

import { COMPANY, THANK_YOU_PDF_MESSAGE, WELCOME_PDF_MESSAGE } from '@/constants/company';
import type { CartLine } from '@/context/CartContext';
import type { UserProfile } from '@/context/ProfileContext';

/**
 * expo-print on web only calls window.print() and does not return a PDF file or base64.
 * We load the HTML in a hidden iframe and trigger print so the user can choose “Save as PDF”.
 */
function printOrderHtmlOnWeb(html: string, reference: string): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('PDF is only available in the browser.'));
  }

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', `Order summary ${reference}`);
    iframe.setAttribute('aria-hidden', 'true');
    Object.assign(iframe.style, {
      position: 'fixed',
      right: '0',
      bottom: '0',
      width: '0',
      height: '0',
      border: 'none',
      opacity: '0',
      pointerEvents: 'none',
    } as Partial<CSSStyleDeclaration>);

    let settled = false;
    const cleanup = () => {
      try {
        document.body.removeChild(iframe);
      } catch {
        /* already removed */
      }
    };

    const finishOk = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const finishErr = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message));
    };

    document.body.appendChild(iframe);
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) {
      finishErr('Could not open print preview.');
      return;
    }

    const runPrint = () => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        finishErr(e instanceof Error ? e.message : 'Print failed.');
        return;
      }
      setTimeout(finishOk, 400);
    };

    const schedulePrint = () => {
      requestAnimationFrame(() => requestAnimationFrame(runPrint));
    };

    doc.open();
    doc.write(html);
    doc.close();

    let loadScheduled = false;
    const failsafe = setTimeout(() => {
      if (loadScheduled) return;
      loadScheduled = true;
      schedulePrint();
    }, 900);
    const onReady = () => {
      if (loadScheduled) return;
      loadScheduled = true;
      clearTimeout(failsafe);
      schedulePrint();
    };
    if (doc.readyState === 'complete') {
      onReady();
    } else {
      iframe.onload = onReady;
    }
  });
}

export function escapeHtml(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function generateReference(prefix: string = 'BC'): string {
  const d = new Date();
  return `${prefix}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getTime()).slice(-4)}`;
}

function orderRowsHtml(lines: CartLine[]): string {
  if (!lines.length) {
    return '<tr><td colspan="3">No line items</td></tr>';
  }
  return lines
    .map(
      (l) => `
    <tr>
      <td>${escapeHtml(l.title)}</td>
      <td>${escapeHtml(l.category)}</td>
      <td style="text-align:center">${l.quantity}</td>
    </tr>`
    )
    .join('');
}

function buildOrderPdfHtml(params: {
  profile: UserProfile;
  lines: CartLine[];
  orderNotes: string;
  formattedDate: string;
  reference: string;
}): string {
  const { profile, lines, orderNotes, formattedDate, reference } = params;
  const primary = '#0a1628';
  const accent = '#c4a35a';
  const muted = '#5c6570';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order confirmation — ${escapeHtml(COMPANY.appName)}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      @page { margin: 15mm; size: A4; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #0d1117;
        background: #fdfcfa;
        line-height: 1.55;
        font-size: 11px;
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding-bottom: 14px;
        border-bottom: 2px solid ${primary};
        margin-bottom: 14px;
      }
      .brand h1 {
        font-size: 22px;
        color: ${primary};
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .brand p {
        color: ${muted};
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-top: 4px;
      }
      .meta {
        min-width: 200px;
        background: #f7f4ec;
        border: 1px solid rgba(10,22,40,0.12);
        border-radius: 8px;
        padding: 10px 12px;
      }
      .meta-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
        font-size: 10px;
      }
      .meta-row:last-child { margin-bottom: 0; }
      .meta-label {
        font-weight: 600;
        color: ${muted};
        text-transform: uppercase;
        font-size: 8px;
        letter-spacing: 0.04em;
      }
      .meta-value { font-weight: 700; color: ${primary}; text-align: right; }
      .welcome {
        background: linear-gradient(135deg, ${primary} 0%, #1c2d44 100%);
        color: #f7f4ec;
        padding: 16px 18px;
        border-radius: 10px;
        margin-bottom: 16px;
      }
      .welcome h2 {
        font-size: 14px;
        color: ${accent};
        margin-bottom: 8px;
        font-weight: 600;
      }
      .welcome p { font-size: 11px; opacity: 0.95; }
      .card {
        border: 1px solid rgba(10,22,40,0.1);
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 14px;
        background: #fff;
        page-break-inside: avoid;
      }
      .card h2 {
        font-size: 13px;
        color: ${primary};
        margin-bottom: 12px;
        font-weight: 600;
        border-bottom: 1px solid #e8e2d4;
        padding-bottom: 8px;
      }
      .company-block p { margin-bottom: 6px; color: #333; font-size: 11px; }
      .order-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10px;
      }
      .order-table th {
        text-align: left;
        padding: 8px 6px;
        background: #f7f4ec;
        color: ${primary};
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        border-bottom: 1px solid #e8e2d4;
      }
      .order-table td {
        padding: 10px 6px;
        border-bottom: 1px solid #f0ebe3;
        vertical-align: top;
      }
      .notes {
        background: #fff9e6;
        border-left: 3px solid ${accent};
        padding: 12px;
        font-size: 10px;
        color: #333;
      }
      .profile-table { width: 100%; border-collapse: collapse; }
      .profile-table td {
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 10px;
      }
      .profile-table td:first-child {
        width: 32%;
        font-weight: 600;
        color: ${muted};
        text-transform: uppercase;
        font-size: 8px;
        letter-spacing: 0.04em;
      }
      .thankyou {
        text-align: center;
        padding: 18px 12px;
        margin-top: 8px;
        border: 1px dashed rgba(196,163,90,0.5);
        border-radius: 10px;
        background: #fffefb;
      }
      .thankyou p { font-size: 11px; color: ${primary}; font-weight: 500; }
      .footer {
        margin-top: 18px;
        padding-top: 12px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
        font-size: 9px;
        color: ${muted};
      }
    </style>
  </head>
  <body>
    <div class="header-top">
      <div class="brand">
        <h1>${escapeHtml(COMPANY.legalName)}</h1>
        <p>${escapeHtml(COMPANY.tagline)}</p>
      </div>
      <div class="meta">
        <div class="meta-row">
          <span class="meta-label">Reference</span>
          <span class="meta-value">${escapeHtml(reference)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Prepared for</span>
          <span class="meta-value">${escapeHtml(profile.fullName)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Prepared on</span>
          <span class="meta-value">${formattedDate}</span>
        </div>
      </div>
    </div>

    <div class="welcome">
      <h2>Welcome</h2>
      <p>${escapeHtml(WELCOME_PDF_MESSAGE)}</p>
    </div>

    <div class="card">
      <h2>Company information</h2>
      <div class="company-block">
        <p><strong>${escapeHtml(COMPANY.legalName)}</strong></p>
        <p>${escapeHtml(COMPANY.shortAbout)}</p>
        <p>Email: ${escapeHtml(COMPANY.email)} · Phone: ${escapeHtml(COMPANY.phone)}</p>
        <p>${escapeHtml(COMPANY.address)}</p>
        <p>${escapeHtml(COMPANY.hours)}</p>
      </div>
    </div>

    <div class="card">
      <h2>Order summary</h2>
      <table class="order-table">
        <thead>
          <tr>
            <th>Service / product</th>
            <th>Category</th>
            <th style="text-align:center">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${orderRowsHtml(lines)}
        </tbody>
      </table>
      ${
        orderNotes.trim()
          ? `<div style="margin-top:12px"><h3 style="font-size:10px;color:${primary};margin-bottom:6px">Your notes</h3><div class="notes">${escapeHtml(orderNotes).replace(/\n/g, '<br/>')}</div></div>`
          : ''
      }
    </div>

    <div class="card">
      <h2>Your profile (on file)</h2>
      <table class="profile-table">
        <tr><td>Display</td><td>${escapeHtml(profile.emoji)} ${escapeHtml(profile.fullName)}</td></tr>
        <tr><td>Email</td><td>${escapeHtml(profile.email)}</td></tr>
        <tr><td>Phone</td><td>${escapeHtml(profile.phone)}</td></tr>
        ${
          profile.organization
            ? `<tr><td>Organization</td><td>${escapeHtml(profile.organization)}</td></tr>`
            : ''
        }
        ${
          profile.notes
            ? `<tr><td>Profile notes</td><td>${escapeHtml(profile.notes)}</td></tr>`
            : ''
        }
      </table>
    </div>

    <div class="thankyou">
      <p>${escapeHtml(THANK_YOU_PDF_MESSAGE)}</p>
    </div>

    <div class="footer">
      <p>Generated by ${escapeHtml(COMPANY.appName)} · ${escapeHtml(COMPANY.website)}</p>
      <p>This document is for your records only and does not constitute legal advice.</p>
    </div>
  </body>
</html>
`;
}

export async function generateAndShareOrderPdf(params: {
  profile: UserProfile;
  lines: CartLine[];
  orderNotes: string;
}): Promise<void> {
  const generatedAt = new Date();
  const formattedDate = escapeHtml(
    generatedAt.toLocaleString('en-CA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  );
  const reference = generateReference('BC');
  const html = buildOrderPdfHtml({
    ...params,
    formattedDate,
    reference,
  });

  if (Platform.OS === 'web') {
    await printOrderHtmlOnWeb(html, reference);
    return;
  }

  const result = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
  });

  if (!result?.uri) {
    throw new Error('Could not create the PDF file.');
  }

  const sharingAvailable = await Sharing.isAvailableAsync();
  if (sharingAvailable) {
    await Sharing.shareAsync(result.uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Save or share your order summary',
      UTI: 'com.adobe.pdf',
    });
  } else {
    Alert.alert(
      'PDF ready',
      'Your order summary was created on this device. Open the Files app (or your file manager) to locate the PDF if you need it.'
    );
  }
}
