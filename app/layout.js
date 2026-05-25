import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getAllCopy } from "@/lib/i18n";

export const metadata = {
  title: "Ningli-Bookmark-living cognitive atlas",
  description: "Ningli-Bookmark-living cognitive atlas built from exported Chrome bookmarks."
};

export default async function RootLayout({ children }) {
  const { lang, copy } = await getAllCopy();

  return (
    <html lang={lang}>
      <body>
        <SiteShell shellCopy={copy.shell}>{children}</SiteShell>
      </body>
    </html>
  );
}
