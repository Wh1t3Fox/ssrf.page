import NextHead from 'next/head'

export default function Head({
  title = 'Complete SSRF Guide - Server-Side Request Forgery Security',
  description = 'Comprehensive guide to SSRF vulnerabilities: detection, exploitation, and prevention techniques for security professionals. Learn about Server-Side Request Forgery attacks and defenses.',
  url = 'https://ssrf.page',
  image = '/og-image.png',
}) {
  const fullTitle = title
  const fullUrl = url
  const fullImage = `${url}${image}`

  return (
    <NextHead>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content="SSRF, Server-Side Request Forgery, web security, penetration testing, bug bounty, security vulnerabilities, cloud metadata, OWASP, cybersecurity" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: fullTitle,
            description: description,
            url: fullUrl,
            image: fullImage,
            author: {
              '@type': 'Organization',
              name: 'SSRF.page',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SSRF.page',
            },
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
          }),
        }}
      />
    </NextHead>
  )
}
