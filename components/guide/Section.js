export default function Section({ id, title, level = 2, number, children }) {
  const HeadingTag = `h${level}`

  const headingClasses = {
    2: 'text-4xl font-bold mb-6 mt-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400',
    3: 'text-3xl font-bold mb-4 mt-8 text-gray-100',
    4: 'text-2xl font-semibold mb-3 mt-6 text-gray-200',
  }

  return (
    <section id={id} className="scroll-mt-20">
      <HeadingTag className={headingClasses[level]}>
        {number && <span className="text-gray-500 mr-3">{number}.</span>}
        {title}
      </HeadingTag>
      <div className="prose prose-lg prose-invert max-w-none">
        {children}
      </div>
    </section>
  )
}
