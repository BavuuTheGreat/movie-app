'use client'

import { Header } from "./features/Header";
import { Footer } from "./features/Footer";
import { HeroSection } from "./features/HeroSection";
import { Upcoming } from "./features/Upcoming";
import { Popular } from "./features/Popular";
import { TopRated } from "./features/TopRated";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
        <div className="w-full max-w-7xl flex flex-col gap-13 mt-13 shrink-8">
          <Upcoming />
          <Popular />
          <TopRated />
        </div>
      </div>
      <Footer />
    </div>
  );
}
