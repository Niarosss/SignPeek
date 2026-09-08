[English](./README.md) | [Українська](./README.uk.md)

# SignPeek ✅

SignPeek is a fast, privacy-focused web application for instantly previewing digitally signed documents and exploring cryptographic containers directly in your browser. It is designed to make working with signed files simple: drop a file, inspect its contents and signatures, and preview the embedded documents without uploading anything to a server.

## Demo

👉 [**View the live version**](https://signpeek.niaros.dev)

## Features

* **Digital Signature Support**: Works with CAdES binary signatures (`.p7s`, `.p7m`) and XAdES XML signatures.
* **Certificate Analysis**: Extracts signer information, organization, certificate authority, and certificate validity data from ASN.1 structures.
* **Container Inspection**: Displays signed containers and their embedded files in an interactive hierarchical tree.
* **Recursive Extraction**: Handles nested containers and archives, including signed containers stored inside ZIP archives.
* **ASiC Support**: Supports ASiC-E and ASiC-S signed containers used by European and Ukrainian electronic signature systems.
* **Smart Export**: Download individual files from a container or export the complete container contents as a ZIP archive.
* **Document Preview**: Preview PDF, Word (`.docx`), and spreadsheet files (`.xlsx`, `.xls`, `.csv`) directly in the browser.
* **Image Preview**: Supports common image formats as well as HEIC and TIFF files.
* **Interactive Viewers**: Includes zooming, panning, page rotation, and other viewer controls.
* **Drag & Drop**: Quickly open files by dropping them directly into the application.
* **Local Processing**: Files are processed entirely in the browser and are not uploaded to a backend server.
* **Responsive Interface**: Designed to work across desktop and mobile screen sizes.
* **PWA Support**: The application can be installed and used as a Progressive Web App.

## Technologies Used

* **Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Cryptography**: [PKI.js](https://pkijs.org/), [ASN1.js](https://github.com/PeculiarVentures/asn1js)
* **Archive Processing**: [JSZip](https://stuk.github.io/jszip/)
* **File Detection**: [file-type](https://github.com/sindresorhus/file-type)
* **PDF Viewer**: [React PDF](https://github.com/wojtekmaj/react-pdf)
* **Word Viewer**: [docx-preview](https://github.com/VolodymyrBaydalka/docx-preview)
* **Spreadsheet Processing**: [SheetJS](https://sheetjs.com/)
* **Image Processing**: [heic2any](https://github.com/alexcorvi/heic2any), [UTIF](https://github.com/photopea/UTIF.js)
* **Viewer Controls**: [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)
* **Icons**: [Phosphor Icons](https://phosphoricons.com/)
* **Font**: [Manrope](https://fonts.google.com/specimen/Manrope)
* **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
* **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

* Node.js installed.
* pnpm installed.
* A modern browser with JavaScript support.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Niarosss/SignPeek.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SignPeek
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

### Development

Start the local development server:

```bash
pnpm dev
```

The application will be available at the local Vite development URL shown in your terminal.

### Production Build

Create an optimized production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

### Linting

Run ESLint to check the project:

```bash
pnpm lint
```

## Supported File Types

SignPeek is designed to work with signed containers as well as the files stored inside them.

### Electronic Signatures

* CAdES — `.p7s`, `.p7m`
* XAdES — XML signatures
* ASiC-E
* ASiC-S

### Documents

* PDF
* Microsoft Word — `.docx`
* Microsoft Excel — `.xls`, `.xlsx`
* CSV

### Images

* Common web image formats
* HEIC
* TIFF

## Local Processing & Privacy

SignPeek follows a **local-first processing architecture**.

Files are read and processed directly in the browser. Container extraction, file detection, document rendering, and cryptographic parsing are performed on the user's device.

No document upload backend is required for the core application.

This means that sensitive documents can be inspected without sending their contents to a remote processing service.

## Project Structure

```text
SignPeek/
├── 📁 public/                   # Static assets and public files
├── 📁 src/                      # Application source code
│   ├── 📁 components/           # UI and application components
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 utils/                # File and cryptography utilities
│   ├── 📄 App.jsx               # Main application component
│   ├── 📄 global.css            # Global styles
│   └── 📄 main.jsx              # Application entry point
├── 📄 index.html                # HTML entry point
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 package.json              # Project dependencies and scripts
├── 📄 pnpm-lock.yaml            # Dependency lockfile
├── 📄 pnpm-workspace.yaml       # pnpm workspace configuration
└── 📄 vite.config.js            # Vite configuration
```

Inside `src`, the main application areas are organized around:

* `components` — interface and viewer components.
* `hooks` — reusable React state and behavior.
* `utils` — file processing, cryptographic parsing, and helper logic.

## Architecture

The application is intentionally built around client-side processing:

```text
User File
    │
    ▼
File Detection
    │
    ├── Signed Container ──► Container Extraction
    │                            │
    │                            ▼
    │                       Signature Parsing
    │                            │
    │                            ▼
    │                       Certificate Data
    │
    └── Regular File ─────► File Viewer
                                │
                                ▼
                         Browser Rendering
```

This architecture keeps the main document-processing pipeline inside the browser and avoids sending document contents to a remote backend.

## Deployment

SignPeek is a Vite application and can be deployed to any platform capable of serving a static frontend.

### Vercel

1. Push the project to a Git repository.

2. Import the repository into [Vercel](https://vercel.com/).

3. Use the following build command:

   ```bash
   pnpm build
   ```

4. Set the output directory to:

   ```text
   dist
   ```

5. Deploy the project.

The generated `dist` directory can also be hosted on GitHub Pages, Netlify, Cloudflare Pages, or another static hosting provider.

## Use Cases

SignPeek can be used for:

* Quickly previewing digitally signed documents.
* Inspecting CAdES and XAdES signatures.
* Exploring ASiC-E and ASiC-S containers.
* Checking certificate information.
* Extracting files from signed containers.
* Previewing documents without installing desktop software.
* Inspecting sensitive documents without uploading them to a remote service.
* Quickly viewing files contained inside nested archives.

## License

This project is licensed under the MIT License.

You are free to use, modify, and distribute the software according to the terms of the license.