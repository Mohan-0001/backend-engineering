
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <h1>My App</h1>
      <h3>Authenticate yourself</h3>
      {children}
    </main>
  );
}
