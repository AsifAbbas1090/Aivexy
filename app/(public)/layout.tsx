import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/SessionProvider'
import BackToTop from '@/components/ui/BackToTop'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </SessionProvider>
  )
}
