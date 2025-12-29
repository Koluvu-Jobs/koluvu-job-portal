// src/app/test/page.js
export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js is working!</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL}</p>
    </div>
  );
}