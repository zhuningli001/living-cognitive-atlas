export function StatCard({ label, value, detail }) {
  return (
    <article className="frost-panel rounded-atlas border border-black/5 p-5 shadow-atlas">
      <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{label}</p>
      <p className="mt-3 font-serif text-4xl text-ink">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-ink/68">{detail}</p> : null}
    </article>
  );
}
