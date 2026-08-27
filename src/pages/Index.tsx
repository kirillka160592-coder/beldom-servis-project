import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Emergency from '@/components/Emergency';
import Services from '@/components/Services';
import About from '@/components/About';
import News from '@/components/News';
import Disclosure from '@/components/Disclosure';
import RequestForm from '@/components/RequestForm';
import Tariffs from '@/components/Tariffs';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';
import useReveal from '@/hooks/use-reveal';

const Index = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Emergency />
        <Services />
        <About />
        <News />
        <Disclosure />
        <RequestForm />
        <Tariffs />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;