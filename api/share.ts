import { VercelRequest, VercelResponse } from "@vercel/node";

interface ShareMetadata {
  type: "ping" | "wave" | "comment" | "feed";
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  canonicalUrl: string;
  surgeCount?: number;
  waveCount?: number;
  commentCount?: number;
  category?: string;
  orgName?: string;
  orgLogoUrl?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { entity, id } = req.query;

    // Validate inputs
    if (!entity || !id) {
      return res.status(400).json({ error: "Missing entity or id" });
    }

    const entityStr = Array.isArray(entity) ? entity[0] : entity;
    const idStr = Array.isArray(id) ? id[0] : id;

    // Validate entity type
    const validEntities = ["feed", "ping", "wave", "comment"];
    if (!validEntities.includes(entityStr)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    // Get API base URL from environment or use default
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE_URL ||
      "http://localhost:3000/api";

    // Fetch metadata from backend
    const metadataUrl = `${apiBase}/public/share/${entityStr}/${idStr}`;

    const metadataResponse = await fetch(metadataUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!metadataResponse.ok) {
      // If metadata not found, show 404
      if (metadataResponse.status === 404) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(404).send(getNotFoundPage());
      }
      throw new Error(`Failed to fetch metadata: ${metadataResponse.status}`);
    }

    const data = (await metadataResponse.json()) as ShareMetadata;

    // Dynamically detect tunnel/localhost hosts to support local testing, fallback to env/production base
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "localhost:3000";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes(".lhr.life") || host.includes(".loca.lt") || host.includes(".ngrok");
    const webBase = isLocal 
      ? `${protocol}://${host}`
      : (process.env.NEXT_PUBLIC_APP_URL || "https://app.echo-ng.com");

    const absoluteCanonical = data.canonicalUrl.startsWith("http")
      ? data.canonicalUrl
      : `${webBase}${data.canonicalUrl}`;
    const shareUrl = `${webBase}/share/${entityStr}/${idStr}`;

    // Generate and return HTML with OG tags
    const html = generateOGPage(data, absoluteCanonical, shareUrl, webBase);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    return res.status(200).send(html);
  } catch (error: any) {
    console.error("Share preview error:", error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(getErrorPage());
  }
}

function generateOGPage(
  data: ShareMetadata,
  absoluteCanonical: string,
  shareUrl: string,
  webBase: string,
): string {
  let title = escapeHtml(data.title);
  let descriptionText = escapeHtml(data.description || "");

  // Trim the final description to 200 characters so it fits social previews cleanly
  const maxDescLength = 200;
  const finalDescription = descriptionText.length > maxDescLength
    ? `${descriptionText.slice(0, maxDescLength - 1).trimEnd()}…`
    : descriptionText;

  let image = "";
  if (data.imageUrl) {
    image = data.imageUrl.startsWith("http") ? data.imageUrl : `${webBase}${data.imageUrl}`;
  } else {
    // Fallback to Echo Brand Banner
    image = `${webBase}/assets/images/echo_og_fallback.png`;
  }
  image = escapeHtml(image);

  // Always use summary_large_image for rich media display
  const twitterCard = "summary_large_image";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${finalDescription}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta property="og:site_name" content="${data.orgName ? escapeHtml(data.orgName) : 'Echo'}" />
  ${image ? `<meta property="og:image" content="${image}" />` : ""}
  ${image ? `<meta property="og:image:width" content="1200" />` : ""}
  ${image ? `<meta property="og:image:height" content="630" />` : ""}
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="${twitterCard}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${finalDescription}" />
  ${image ? `<meta name="twitter:image" content="${image}" />` : ""}
  
  <!-- Native App Rich Data -->
  ${data.surgeCount !== undefined ? `<meta name="twitter:label1" content="Surges" />` : ""}
  ${data.surgeCount !== undefined ? `<meta name="twitter:data1" content="${data.surgeCount}" />` : ""}
  ${data.waveCount !== undefined ? `<meta name="twitter:label2" content="Waves" />` : ""}
  ${data.waveCount !== undefined ? `<meta name="twitter:data2" content="${data.waveCount}" />` : ""}
  
  <!-- Additional Meta Tags -->
  <meta name="description" content="${finalDescription}" />
  <link rel="canonical" href="${escapeHtml(shareUrl)}" />
  
  <!-- Redirect to app -->
  <script>
    window.location.replace("${absoluteCanonical}");
  </script>
  
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 { color: #333; margin: 0 0 16px; }
    p { color: #666; line-height: 1.6; margin: 0 0 24px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Loading...</h1>
    <p>Redirecting to Echo app...</p>
    <p><a href="${escapeHtml(absoluteCanonical)}">Click here if not redirected automatically</a></p>
  </div>
</body>
</html>`;
}

function getNotFoundPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Not Found - Echo</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 { color: #d32f2f; margin: 0 0 16px; }
    p { color: #666; line-height: 1.6; }
    a { color: #0066cc; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Not Found</h1>
    <p>This content is no longer available.</p>
    <p><a href="/">Return to home</a></p>
  </div>
</body>
</html>`;
}

function getErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Error - Echo</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 { color: #d32f2f; margin: 0 0 16px; }
    p { color: #666; line-height: 1.6; }
    a { color: #0066cc; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Something went wrong</h1>
    <p>We encountered an error while processing your request.</p>
    <p><a href="/">Return to home</a></p>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
