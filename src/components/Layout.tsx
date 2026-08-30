import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useReveal from '@/hooks/use-reveal';

const Layout = ({ children }: { children: ReactNode }) => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header />
      <main className="pt-[68px]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
