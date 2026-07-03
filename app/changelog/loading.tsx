export default function ChangelogLoading() {
  return (
    <section className="mx-auto max-w-content px-4 py-10">
      <div className="animate-pulse h-10 w-48 rounded bg-cream-beige" />
      <div className="animate-pulse h-4 w-72 rounded bg-cream-beige mt-2" />
      <div className="mt-10 space-y-10">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="animate-pulse h-6 w-36 rounded bg-cream-beige" />
            <ul className="mt-4 space-y-3">
              {[1, 2, 3].map((j) => (
                <li key={j} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-cream-beige" />
                  <div className="flex-1 space-y-1">
                    <div className="animate-pulse h-4 w-3/4 rounded bg-cream-beige" />
                    <div className="animate-pulse h-3 w-24 rounded bg-cream-beige" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}