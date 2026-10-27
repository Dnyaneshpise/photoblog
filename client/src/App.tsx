/**
 * Root application component.
 * Day 1: placeholder layout so the app boots and we can verify the stack.
 * Later days replace this with real routes (Home, Gallery, About, Contact, Admin).
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 md:px-12 py-8 border-b border-[var(--color-border)]">
        <p
          className="text-2xl tracking-wide"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Photoblog
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h1
            className="text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Foundation ready
          </h1>
          <p className="text-[var(--color-ink-muted)] text-lg leading-relaxed">
            Day 1 of Photoblog is complete. The client, design tokens, and
            project structure are in place. Photographs will take center stage
            starting with the gallery and homepage.
          </p>
          <p className="text-sm text-[var(--color-ink-subtle)] tracking-widest uppercase">
            Dnyanesh Pise
          </p>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 text-center text-sm text-[var(--color-ink-subtle)] border-t border-[var(--color-border)]">
        © {new Date().getFullYear()} Photoblog
      </footer>
    </div>
  )
}

export default App
