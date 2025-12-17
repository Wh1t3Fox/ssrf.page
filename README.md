# SSRF.page

A comprehensive, production-ready guide to understanding, identifying, and preventing Server-Side Request Forgery (SSRF) vulnerabilities in web applications.

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌟 Features

- **20,000+ Words** - Comprehensive coverage from basics to advanced exploitation
- **40+ Code Examples** - Real-world examples in Python, Node.js, PHP, Java, and Go
- **Interactive Syntax Highlighting** - Copy-to-clipboard functionality for all code blocks
- **Responsive Design** - Mobile-first design with sticky table of contents
- **8 Major Sections**:
  1. Introduction to SSRF
  2. Understanding SSRF Mechanics
  3. Identifying SSRF Vulnerabilities
  4. SSRF Exploitation Techniques
  5. Real-World Examples & Case Studies
  6. Prevention & Mitigation
  7. Advanced Topics
  8. Tools & Resources
- **SEO Optimized** - OpenGraph meta tags, Twitter cards, JSON-LD structured data
- **Production Ready** - Static site generation, optimized performance
- **Accessibility** - WCAG AA compliant with proper ARIA labels

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.18.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Wh1t3Fox/ssrf.page.git
cd ssrf.page

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the guide.

## 📦 Build & Deploy

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm start
```

The static site will be generated in the `out/` directory.

### Deploy to Static Hosting

The built site in the `out/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel deploy out`
- **Netlify**: `netlify deploy --dir=out`
- **GitHub Pages**: Push the `out` directory to your gh-pages branch
- **Cloudflare Pages**: Connect your repo and set build output to `out`
- **AWS S3**: Upload the `out` directory to your S3 bucket

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16.0.10** - React framework with static site generation
- **React 19.2.3** - UI library with latest features
- **Tailwind CSS 3.4.19** - Utility-first CSS framework

### Components & UI
- **react-syntax-highlighter 16.1.0** - Code syntax highlighting
- **@heroicons/react 2.2.0** - Beautiful hand-crafted SVG icons

### Build Tools
- **PostCSS 8.5.6** - CSS transformations
- **Autoprefixer 10.4.23** - Automatic vendor prefixing

## 📁 Project Structure

```
ssrf.page/
├── components/
│   ├── common/           # Shared components (Head, Footer)
│   └── guide/            # Guide-specific components
│       ├── Layout.js     # Main layout with TOC
│       ├── TableOfContents.js
│       ├── Section.js
│       ├── CodeBlock.js  # Syntax-highlighted code
│       ├── InteractiveExample.js
│       ├── Callout.js
│       └── ProgressBar.js
├── content/
│   └── ssrf-guide.js     # Main guide content (~20,000 words)
├── pages/
│   ├── _app.js           # Global app wrapper
│   ├── _document.js      # Custom HTML document
│   └── index.js          # Main guide page
├── public/
│   └── diagrams/         # SVG diagrams and assets
├── styles/
│   └── globals.css       # Global styles and Tailwind config
├── utils/
│   ├── clipboard.js      # Clipboard utilities
│   └── scrollspy.js      # Scroll tracking utilities
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## 🎨 Customization

### Modifying Content

Edit the main guide content in `content/ssrf-guide.js`. Each section is a JavaScript object with JSX content.

### Styling

The design uses Tailwind CSS with custom theme colors:
- Primary: Blue shades (for headings and accents)
- Secondary: Cyan shades (for links and highlights)

Modify `tailwind.config.js` to customize the theme.

### Adding New Sections

1. Add a new section object to `content/ssrf-guide.js`
2. The section will automatically appear in the table of contents
3. Use the provided components (CodeBlock, Callout, etc.) for consistency

## 🔧 Configuration

### Node.js Version

This project requires Node.js 18.18.0 or higher. The version is specified in:
- `.nvmrc` - For NVM users
- `.node-version` - For platform compatibility
- `package.json` - `engines` field

### Next.js Configuration

Key configuration in `next.config.js`:
- `output: 'export'` - Static site generation
- `transpilePackages` - ESM module compatibility
- `images.unoptimized` - Required for static export

## 🐛 Troubleshooting

### Build Errors

**Error: "Unexpected token '?'"**
- Solution: Ensure Node.js version is >= 18.18.0

**Error: "require() of ES Module not supported"**
- Solution: This is fixed by the `transpilePackages` configuration in `next.config.js`

**Error: "Module not found"**
- Solution: Run `npm install` to ensure all dependencies are installed

### Deployment Issues

**404 on routes**
- Solution: Ensure `trailingSlash: true` is set in `next.config.js`

**Images not loading**
- Solution: Verify `images.unoptimized: true` is set for static export

## 📝 Content Guidelines

### Adding Code Examples

Use the `CodeBlock` component:

```jsx
<CodeBlock
  language="python"
  code={`your code here`}
  filename="optional-filename.py"
/>
```

### Adding Callouts

Use the `Callout` component for important notes:

```jsx
<Callout type="warning" title="Security Warning">
  Important security information here
</Callout>
```

Types: `info`, `warning`, `danger`, `success`, `tip`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally (`npm run build && npm start`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OWASP for SSRF vulnerability research and documentation
- The security research community for discovering and documenting real-world SSRF vulnerabilities
- All contributors to the referenced CVEs and bug bounty reports

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Educational Purpose**: This guide is intended for educational and authorized security testing purposes only. Always obtain proper authorization before testing for vulnerabilities.
