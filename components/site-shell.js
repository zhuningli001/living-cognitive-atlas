import Link from "next/link";

export function SiteShell({ children, shellCopy }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rust/70">{shellCopy.eyebrow}</p>
            <h1 className="font-serif text-xl text-ink">{shellCopy.title}</h1>
          </div>
          <nav className="hidden gap-2 md:flex">
            {shellCopy.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-black/5 px-4 py-2 text-sm text-ink/78 transition hover:border-rust/20 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
