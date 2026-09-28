
import './globals.css'
export const metadata = { title: 'Link Saver - Ultra Modern', description: 'Vibrant link saver with Google Sheets sync' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>
}
