# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an SSRF (Server-Side Request Forgery) testing application built with Next.js. It's designed as a security research tool for demonstrating and testing SSRF vulnerabilities in a controlled environment.

**IMPORTANT**: This is a security testing tool. Any code changes should be analyzed through a security lens, particularly for SSRF vulnerabilities. The repository includes a specialized `ssrf-security-analyst` agent for security analysis.

## Development Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Export static site
npm run export

# Build and serve static site
npm start
```

The production workflow uses static export: `npm run build` → `next export` → serve static files from `out/` directory.

## Architecture

### Framework: Next.js with Static Generation

The app uses Next.js Static Site Generation (SSG) with `getStaticPaths` and `getStaticProps`. This means:
- Pages are pre-rendered at build time
- External API calls (to jsonplaceholder.typicode.com) happen during build, not runtime
- The `out/` directory contains the static export

### Directory Structure

- `pages/` - Next.js pages (file-based routing)
  - `index.js` - Homepage (currently empty)
  - `post/[id].js` - Dynamic route for individual posts, uses SSG with external API
- `components/` - React components
  - `post.js` - Post display component

### External Dependencies

The app fetches data from `jsonplaceholder.typicode.com` during the build process:
- `getStaticPaths` in `pages/post/[id].js:4-19` fetches post list to generate static paths
- `getStaticProps` in `pages/post/[id].js:21-30` fetches individual post data

## Security Context

This repository includes an SSRF security analyst agent (`.claude/agents/ssrf-security-analyst.md`). When making changes that involve:
- Network requests or URL handling
- User input processing
- API integrations
- Any server-side request functionality

Consider invoking the ssrf-security-analyst agent to review for SSRF vulnerabilities and defense mechanisms.

## Technology Stack

- **Framework**: Next.js (latest)
- **React**: 17.0.2
- **Static Server**: serve 11.2.0
- **Build Output**: Static HTML/JS in `out/` directory
