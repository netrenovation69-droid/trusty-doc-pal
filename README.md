# DocuSûr — Privacy-First Document Processing

<p align="center">
  <strong>🔒 Zero-Server · 100% Browser RAM · GDPR by Design</strong>
</p>

## What is DocuSûr?

DocuSûr is a **premium document management SaaS** that processes all files entirely in the user's browser. No file ever leaves the client device — everything runs in RAM, providing an unmatched level of privacy and GDPR compliance.

> **30+ functional tools** for PDF manipulation, conversion, security, and OCR — all running client-side.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser (RAM)                  │
│                                                  │
│  ┌─────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ pdf-lib │  │ pdfjs-dist│  │ Tesseract.js   │  │
│  │ Merge   │  │ Render    │  │ OCR (WASM)     │  │
│  │ Split   │  │ Extract   │  │ French+English │  │
│  │ Encrypt │  │ Convert   │  │                │  │
│  └─────────┘  └──────────┘  └────────────────┘  │
│  ┌─────────┐  ┌──────────┐  ┌────────────────┐  │
│  │mammoth.js│  │  xlsx    │  │  JSZip         │  │
│  │Word→PDF │  │Excel→PDF │  │  PPT→PDF       │  │
│  └─────────┘  └──────────┘  └────────────────┘  │
│                                                  │
│  🔐 AES-256-GCM encryption via Web Crypto API   │
│  📄 All processing in RAM — zero disk, zero net  │
└──────────────────────────────────────────────────┘
                    ↕ NOTHING
┌──────────────────────────────────────────────────┐
│               Server (None)                      │
│          No backend. No storage. No tracking.    │
└──────────────────────────────────────────────────┘
```

## 🛡️ Security Features

- **AES-256-GCM Encryption**: PDF protection using the Web Crypto API with PBKDF2 key derivation (100,000 iterations)
- **Metadata Purge**: Complete removal of author, dates, software fingerprints, and hidden data
- **Text Redaction**: Find-and-censor sensitive text with permanent black rectangles
- **Digital Signature**: Local signature stamp with name and date
- **Zero Network**: No file ever touches a server — guaranteed by architecture

## 📦 Technology Stack

| Library | Purpose | Type |
|---------|---------|------|
| **pdf-lib** | PDF creation, manipulation, merge, split, watermark | Pure JS |
| **pdfjs-dist** | PDF rendering, text extraction, page conversion | Mozilla |
| **Tesseract.js** | OCR (Optical Character Recognition) | WASM |
| **mammoth.js** | Word (.docx) → HTML → PDF conversion | Pure JS |
| **xlsx** | Excel (.xlsx/.csv) ↔ PDF conversion | Pure JS |
| **JSZip** | PowerPoint (.pptx) text extraction | Pure JS |
| **Web Crypto API** | AES-256-GCM encryption/decryption | Native |

## 🎨 Design System

- **Typography**: Inter (Google Fonts)
- **Colors**: Navy (`#002B5C`), Trust Blue (`#4A90D9`), Emerald (`#10B981`), Bright Red (`#E63946`)
- **Framework**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion with spring physics

## 🚀 Functional Tools (28/30)

### 📂 Management
Merge · Split · Compress · Rotate · Reorder · Repair

### ✏️ Editing
Page Numbers · Watermark · Text Edit · Signature · Crop · Redact

### 🔐 Security
**Encrypt (AES-256)** · **Decrypt** · Metadata Purge

### 🔄 Conversion
PDF↔JPG · PDF→Word · PDF→Excel · PDF→PPT · Word→PDF · Excel→PDF · PPT→PDF · HTML→PDF · PDF/A Archive · Scan to PDF

### 🧠 Advanced (WASM)
**OCR** (Tesseract.js — French + English) · Document Comparison

### 🔜 Coming Soon
Translation (local AI models) · Visual Workflow Editor

## 📋 GDPR Compliance

DocuSûr is **GDPR-compliant by design**:
- ✅ No personal data collection
- ✅ No file upload to any server
- ✅ No cookies for tracking
- ✅ No third-party analytics
- ✅ Processing exclusively in browser RAM
- ✅ Files are garbage-collected when the tab closes

## 🏃 Getting Started

```bash
git clone <YOUR_GIT_URL>
cd docusur
npm install
npm run dev
```

## 📄 License

Proprietary — All rights reserved.

---

<p align="center">
  <em>Built with conviction: your documents deserve privacy.</em>
</p>
