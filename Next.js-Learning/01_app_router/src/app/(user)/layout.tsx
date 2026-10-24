
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <aside>Sidebar</aside>
      {children}
    </main>
  );
}
