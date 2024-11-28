import React from "react";
import LandingPage from "../helper-Landing-Components/landingPage/LandingPage";
import ServicePage from "../helper-Landing-Components/servicePage/ServicePage";
import AboutPage from "../helper-Landing-Components/aboutPage/AboutPage";
import MenuPage from "../helper-Landing-Components/menuPage/MenuPage";
import TeamPage from "../helper-Landing-Components/teamPage/TeamPage";

const HomePage = () => {
  return (
    <div className="container-xxl bg-white p-0">
      <LandingPage />
      <ServicePage/>
      <AboutPage/>
      <MenuPage/>
      <TeamPage/>
    </div>
  );
};

export default HomePage;
