import PageTransition from '../components/PageTransition';
import PaletteSelector from '../components/PaletteSelector';
import HeroSection from '../sections/HeroSection';
import StrengthSection from '../sections/StrengthSection';
import ServiceSection from '../sections/ServiceSection';
import NetworkSection from '../sections/NetworkSection';
import CTASection from '../sections/CTASection';

export default function MainPage() {
  return (
    <PageTransition>
      <PaletteSelector />
      <HeroSection />
      <StrengthSection />
      <ServiceSection />
      <NetworkSection />
      <CTASection />
    </PageTransition>
  );
}
