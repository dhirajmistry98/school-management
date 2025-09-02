import './globals.css'

export const metadata = {
  title: 'School Management System',
  description: 'Find and manage schools in your area',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}