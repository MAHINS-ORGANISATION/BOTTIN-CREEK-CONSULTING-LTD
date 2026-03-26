# PDF Generation Implementation Guide

This guide contains all the code needed to implement PDF generation functionality in your Expo/React Native project.

## 📦 Dependencies

Add these packages to your `package.json`:

```json
{
  "dependencies": {
    "expo-print": "~15.0.7",
    "expo-sharing": "~14.0.7"
  }
}
```

Install with:
```bash
npm install expo-print expo-sharing
# or
yarn add expo-print expo-sharing
```

## 📝 Required Imports

```typescript
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
```

## 🔧 Helper Functions

### HTML Escape Function

This function prevents XSS attacks and ensures proper HTML rendering:

```typescript
const escapeHtml = (text: string): string => {
  if (!text) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
```

### Reference Number Generator (Optional)

Generate unique reference numbers for documents:

```typescript
const generateReference = (prefix: string = 'NR'): string => {
  const generatedAt = new Date();
  return `${prefix}-${generatedAt.getFullYear()}${String(generatedAt.getMonth() + 1).padStart(2, '0')}${String(generatedAt.getDate()).padStart(2, '0')}-${String(generatedAt.getTime()).slice(-4)}`;
};
```

## 🎯 Main PDF Generation Function

### Complete Implementation

```typescript
const handleDownloadPdf = async (data: YourDataType) => {
  // Optional: Validate required fields
  if (!data.name || !data.email) {
    Alert.alert('Required Field', 'Please fill in all required fields');
    return;
  }

  // Set loading state
  setIsGeneratingPdf(true);

  try {
    // Format date
    const generatedAt = new Date();
    const formattedDate = escapeHtml(generatedAt.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));

    // Generate reference number (optional)
    const reference = generateReference('NR');

    // Process array data (if needed)
    const servicesList = Array.isArray(data.services) 
      ? data.services.map(s => escapeHtml(s)).join(', ')
      : escapeHtml(String(data.services || 'Not specified'));

    // Generate HTML template
    const html = generateHtmlTemplate(data, formattedDate, reference, servicesList);

    // PDF generation options
    const printOptions = {
      html,
      base64: Platform.OS === 'web', // Required for web downloads
      width: 595,  // A4 width in points (210mm)
      height: 842, // A4 height in points (297mm)
    };

    // Generate PDF
    const result = await Print.printToFileAsync(printOptions);

    // Handle platform-specific download/sharing
    if (Platform.OS === 'web') {
      // Web: Direct download
      if (result.base64 && typeof document !== 'undefined') {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${result.base64}`;
        link.download = `Document_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Success', 'PDF downloaded successfully!');
      } else {
        Alert.alert('Download Error', 'Unable to generate PDF in this browser.');
      }
    } else {
      // Mobile: Native sharing
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (sharingAvailable) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Generated', `PDF saved to: ${result.uri}`);
      }
    }
  } catch (error: any) {
    console.error('PDF generation error:', error);
    Alert.alert(
      'Error', 
      `Failed to generate PDF: ${error?.message || 'Unknown error'}. Please try again.`
    );
  } finally {
    setIsGeneratingPdf(false);
  }
};
```

## 🎨 HTML Template

### Complete Styled Template

```typescript
const generateHtmlTemplate = (
  data: YourDataType,
  formattedDate: string,
  reference: string,
  servicesList: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Title</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          @page { 
            margin: 15mm;
            size: A4;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            padding: 0; 
            color: #1b1b1f; 
            background: #ffffff;
            line-height: 1.5;
            font-size: 11px;
            max-width: 100%;
          }
          
          .header {
            margin-bottom: 20px;
          }
          
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid #0f5132;
            margin-bottom: 12px;
          }
          
          .header-brand h1 {
            font-size: 22px;
            color: #0f5132;
            margin-bottom: 4px;
            font-weight: 700;
            line-height: 1.2;
          }
          
          .header-brand p {
            color: #4d7a63;
            font-size: 9px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          
          .header-meta {
            min-width: 180px;
            background: #f1f6f3;
            border: 1px solid #d0e3d9;
            border-radius: 6px;
            padding: 10px 12px;
          }
          
          .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }
          
          .meta-row:last-child {
            margin-bottom: 0;
          }
          
          .meta-label {
            font-size: 8px;
            font-weight: 600;
            color: #355742;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .meta-value {
            font-size: 10px;
            font-weight: 700;
            color: #0f5132;
            text-align: right;
          }
          
          .header-bottom h2 {
            font-size: 16px;
            font-weight: 600;
            color: #1b1b1f;
            margin-bottom: 6px;
            line-height: 1.3;
          }
          
          .header-bottom p {
            color: #666;
            font-size: 10px;
            line-height: 1.4;
          }
          
          .card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            background: #fafafa;
            page-break-inside: avoid;
          }
          
          .card h2 {
            font-size: 14px;
            color: #0f5132;
            margin-bottom: 12px;
            font-weight: 600;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 8px;
            line-height: 1.3;
          }
          
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .info-table tr {
            border-bottom: 1px solid #f0f0f0;
          }
          
          .info-table tr:last-child {
            border-bottom: none;
          }
          
          .info-table td {
            padding: 8px 0;
            vertical-align: top;
            line-height: 1.5;
          }
          
          .info-table td:first-child {
            width: 35%;
            font-weight: 600;
            color: #333;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
          }
          
          .info-table td:last-child {
            color: #1b1b1f;
            font-size: 11px;
            font-weight: 400;
            word-wrap: break-word;
          }
          
          .footer {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 9px;
            line-height: 1.4;
          }
          
          .notes {
            background: #fff9e6;
            border-left: 3px solid #ff9800;
            padding: 12px;
            margin-top: 8px;
            font-size: 10px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-top">
            <div class="header-brand">
              <h1>Your Company Name</h1>
              <p>Your Tagline</p>
            </div>
            <div class="header-meta">
              <div class="meta-row">
                <span class="meta-label">Reference</span>
                <span class="meta-value">${reference}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Prepared For</span>
                <span class="meta-value">${escapeHtml(data.name || 'Client')}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Prepared On</span>
                <span class="meta-value">${formattedDate}</span>
              </div>
            </div>
          </div>
          <div class="header-bottom">
            <h2>Document Title</h2>
            <p>Your description text here.</p>
          </div>
        </div>

        <div class="card">
          <h2>Section Title</h2>
          <table class="info-table">
            <tr>
              <td>Field Label</td>
              <td>${escapeHtml(data.fieldValue || 'Not specified')}</td>
            </tr>
            <tr>
              <td>Services</td>
              <td>${servicesList}</td>
            </tr>
            <!-- Add more rows as needed -->
          </table>
        </div>

        <div class="card">
          <h2>Contact Information</h2>
          <table class="info-table">
            <tr>
              <td>Full Name</td>
              <td>${escapeHtml(data.name || 'Not specified')}</td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td>${escapeHtml(data.email || 'Not specified')}</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>${escapeHtml(data.phone || 'Not specified')}</td>
            </tr>
          </table>
        </div>

        ${data.notes ? `
        <div class="card">
          <h2>Additional Notes</h2>
          <div class="notes">
            ${escapeHtml(data.notes).replace(/\n/g, '<br>')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Footer text or disclaimer here.</p>
        </div>
      </body>
    </html>
  `;
};
```

## 🚀 Usage Example

### React Component Integration

```typescript
import React, { useState } from 'react';
import { Button, View } from 'react-native';

const MyComponent = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      // ... other fields
    };

    setIsGeneratingPdf(true);
    try {
      // ... PDF generation code from above
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <View>
      <Button
        title={isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        onPress={handleDownloadPdf}
        disabled={isGeneratingPdf}
      />
    </View>
  );
};
```

## 📱 Platform-Specific Behavior

### Web
- Downloads PDF directly to user's download folder
- Uses base64 encoding for file data
- File name: `Document_YYYY-MM-DD.pdf`

### iOS/Android
- Opens native share dialog
- Allows saving to Files, sharing via email, etc.
- Uses file URI from `expo-print`

## 🎨 Customization Tips

### Change Colors
Update the CSS variables in the `<style>` section:
- Primary color: `#0f5132` (dark green)
- Secondary color: `#4d7a63` (medium green)
- Background: `#f1f6f3` (light green)
- Accent: `#ff9800` (orange for notes)

### Change Font Sizes
- Body: `11px`
- Headings: `14px` - `22px`
- Labels: `8px` - `9px`

### Add Logo
```html
<div class="header-brand">
  <img src="data:image/png;base64,YOUR_BASE64_LOGO" alt="Logo" style="max-width: 150px; height: auto;" />
  <h1>Company Name</h1>
</div>
```

## ⚠️ Important Notes

1. **Always escape HTML**: Use `escapeHtml()` on all user input to prevent XSS attacks
2. **A4 Size**: Template is optimized for A4 paper (210mm × 297mm)
3. **Page Breaks**: Use `page-break-inside: avoid` on cards to prevent splitting
4. **Base64 on Web**: Always set `base64: true` for web platform
5. **Error Handling**: Always wrap in try-catch and show user-friendly errors

## 🔍 Troubleshooting

### PDF not generating
- Check console for errors
- Verify all required fields are filled
- Ensure `expo-print` is properly installed

### Web download not working
- Check browser console
- Some browsers block automatic downloads
- User may need to allow downloads

### Mobile sharing not working
- Verify `expo-sharing` is installed
- Check app permissions
- Test on physical device (not simulator)

## 📚 Additional Resources

- [Expo Print Documentation](https://docs.expo.dev/versions/latest/sdk/print/)
- [Expo Sharing Documentation](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [HTML to PDF Best Practices](https://www.w3.org/TR/css-print/)

---

**Note**: This implementation is based on Expo SDK 54. Adjust package versions as needed for your Expo SDK version.

