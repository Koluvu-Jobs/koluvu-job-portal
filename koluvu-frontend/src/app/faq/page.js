export default function FAQPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">What is Koluvu?</h2>
          <p className="text-gray-600">
            Koluvu is a comprehensive HR solutions platform that connects
            employers with talented candidates.
          </p>
        </div>
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">How do I get started?</h2>
          <p className="text-gray-600">
            Simply register as an employee or employer and complete your profile
            to get started.
          </p>
        </div>
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">Is the service free?</h2>
          <p className="text-gray-600">
            We offer both free and premium subscription plans with additional
            features.
          </p>
        </div>
      </div>
    </div>
  );
}
