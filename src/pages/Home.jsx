import React from "react";
import { Navbar, CardHero } from "../components";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome h-screen">
        <Navbar />
        <CardHero />
      </div>
    </div>
  );
};
