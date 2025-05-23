import 'leaflet/dist/leaflet.css';
import './global.css';

export const metadata = { title: 'Geo Processor', description: '' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
