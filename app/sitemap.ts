import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.botexcel.pro";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: base + "/login", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: base + "/register", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: base + "/upload", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: base + "/pricing", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
