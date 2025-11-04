export default function CTA({ title, subtitle, primaryAction, secondaryAction }) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-full max-w-4xl h-96 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500/10 to-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-green-100/90">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <a
            href={primaryAction.href}
            className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10">{primaryAction.label}</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </a>
          <a
            href={secondaryAction.href}
            className="relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10">{secondaryAction.label}</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-700 to-green-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </a>
        </div>
      </div>
    </section>
  );
}
