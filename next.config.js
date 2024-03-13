const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://upload-widget.cloudinary.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://res.cloudinary.com;
    media-src 'self';
    font-src 'self' data:;
    connect-src 'self' https: wss:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://upload-widget.cloudinary.com;
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
  .trim()
  .replace(/\s{2,}/g, " ");

module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dhi5tqhka/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
