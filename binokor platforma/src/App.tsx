import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./sections/Hero";
import { QuickLinks } from "./sections/QuickLinks";
import { About } from "./sections/About";
import { Program } from "./sections/Program";
import { Gallery } from "./sections/Gallery";
import { Trades } from "./sections/Trades";
import { International } from "./sections/International";
import { Benefits } from "./sections/Benefits";
import { Roadmap } from "./sections/Roadmap";
import { Partners } from "./sections/Partners";
import { Contact } from "./sections/Contact";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickLinks />
        <About />
        <Program />
        <Gallery />
        <Trades />
        <International />
        <Benefits />
        <Roadmap />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
