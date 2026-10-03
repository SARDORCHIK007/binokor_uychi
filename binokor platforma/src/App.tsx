import { LazyMotion, domAnimation } from "framer-motion";
import { Header } from "./components/layout/Header";
import { NetworkBackground } from "./components/layout/NetworkBackground";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { Model } from "./sections/Model";
import { Campus } from "./sections/Campus";
import { Trades } from "./sections/Trades";
import { International } from "./sections/International";
import { Results } from "./sections/Results";
import { Roadmap } from "./sections/Roadmap";
import { Partners } from "./sections/Partners";
import { Contact } from "./sections/Contact";

export default function App() {
  return (
    // Yengil animatsiya to'plami: faqat kerakli imkoniyatlar yuklanadi
    <LazyMotion features={domAnimation} strict>
      <NetworkBackground />
      <Header />
      <main className="relative z-[1]">
        <Hero />
        <Problem />
        <Model />
        <Campus />
        <Trades />
        <International />
        <Results />
        <Roadmap />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  );
}
