import Image from "next/image";
import heroImg from "../assets/hero.jpg";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[85vh] lg:h-screen overflow-hidden">
        <Image
          src={heroImg}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          alt="hero_photo"
        />
        <div className="absolute inset-0 bg-background/50"></div>
        <div className="h-full pb-16 lg:pb-24 flex items-end">
          <div className="w-full mx-auto max-w-350 px-6 lg:px-12 ">
            <div className="max-w-xl animate-fade-in-up [animation-duration:500ms]">
              <p className="text-light-blue text-sm tracking-widest mb-3">
                NEW SEASON GEAR
              </p>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Build Your Ultimate Setup
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md text-sm lg:text-base">
                Premium components, pre-built gaming rigs, and everything you
                need to dominate. Free shipping on orders over $99.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex flex-row items-center gap-2 blue-button py-4 px-8 font-semibold text-sm text-primary-foreground uppercase tracking-wider">
                  SHOP NOW
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="py-4 px-8 font-semibold font-body text-secondary-foreground text-sm tracking-wider rounded-md bg-muted-background border border-muted-background cursor-pointer hover:bg-muted transition-colors">CUSTOM BUILDS</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
