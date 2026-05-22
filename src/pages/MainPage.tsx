import PageTransition from '../components/PageTransition';
import HeroSection from '../sections/HeroSection';
import StrengthSection from '../sections/StrengthSection';
import ServiceSection from '../sections/ServiceSection';
import NetworkSection from '../sections/NetworkSection';
import CTASection from '../sections/CTASection';

export default function MainPage() {
  return (
    <PageTransition>
      <HeroSection />
      <StrengthSection />
      <ServiceSection />
      <NetworkSection />
      <CTASection />
    </PageTransition>
  );
}
