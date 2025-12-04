import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://botexcel.pro";
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/upload`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/kurumsal-teklif`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/docs/api`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/docs/security`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/guides/barcode-stock-tracking`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/login`, lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/register`, lastModified, changeFrequency: "weekly", priority: 0.4 },
  ];
}
