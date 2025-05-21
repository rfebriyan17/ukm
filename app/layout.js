import './globals.css';

export const metadata = {
  title: 'UKM Info System',
  description: 'Sistem Informasi UKM Mahasiswa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 font-sans antialiased">
        <header className="bg-indigo-700 text-white px-6 py-4 shadow-md">
          <h1 className="text-xl font-bold">UKM Info System</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="text-center text-gray-500 py-4 text-sm">
          &copy; {new Date().getFullYear()} Sistem Informasi UKM Mahasiswa
        </footer>
      </body>
    </html>
  );
}
