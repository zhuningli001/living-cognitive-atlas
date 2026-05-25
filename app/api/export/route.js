import { NextResponse } from "next/server";
import { getBookmarks, getCuratedBookmarks } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") === "curated" ? "curated" : "all";
  const format = searchParams.get("format") === "csv" ? "csv" : "json";
  const data = type === "curated" ? getCuratedBookmarks() : getBookmarks();

  if (format === "csv") {
    const body = toCsv(data);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}-bookmarks.csv"`
      }
    });
  }

  return NextResponse.json(data, {
    headers: {
      "Content-Disposition": `attachment; filename="${type}-bookmarks.json"`
    }
  });
}

function toCsv(items) {
  const headers = ["title", "url", "domain", "year", "folder_path", "content_type", "value_status", "representative_tags"];
  const rows = items.map((item) =>
    headers
      .map((header) => {
        const value = header === "representative_tags" ? (item.representative_tags ?? []).join(" | ") : item[header] ?? "";
        const text = String(value);
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
