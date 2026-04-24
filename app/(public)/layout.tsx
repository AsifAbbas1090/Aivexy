import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/SessionProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  )
}
