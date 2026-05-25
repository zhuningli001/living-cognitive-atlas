import sources from "@/data/signal-sources.json";

export async function getSignalBoard() {
  const results = await Promise.all(
    sources.map(async (source) => ({
      ...source,
      items: await fetchFeed(source)
    }))
  );

  return results;
}

async function fetchFeed(source) {
  if (!source.feedUrl) {
    return [];
  }

  try {
    const response = await fetch(source.feedUrl, {
      next: { revalidate: 21600 }
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const matches = [...text.matchAll(/<item[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?(?:<pubDate>(.*?)<\/pubDate>)?/g)].slice(0, 4);
    if (!matches.length) {
      const atomMatches = [...text.matchAll(/<entry[\s\S]*?<title[^>]*>(.*?)<\/title>[\s\S]*?<link[^>]*href="(.*?)"[\s\S]*?(?:<updated>(.*?)<\/updated>)?/g)].slice(0, 4);
      return atomMatches.map((match) => ({
        title: sanitizeXml(match[1]),
        link: match[2],
        date: match[3] ?? null
      }));
    }

    return matches.map((match) => ({
      title: sanitizeXml(match[1]),
      link: match[2],
      date: match[3] ?? null
    }));
  } catch {
    return [];
  }
}

function sanitizeXml(value) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
