import React from "react";
import Hero from "../../components/hero/Hero";
import AiTripPlanning from "../../components/AiTripPlanning/AiTripPlanning";
import HotelsInLandingPage from "../../components/HotelsInLandingPage/HotelsInLandingPage";
import GuideList from "../../components/GuideList/GuideList";
import Activities from "../../components/activities/Activities";
import Footer from "../../components/footer/Footer";
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";
import FeedbackSection from "../../components/FeedbackSection/FeedbackSection";
import RestaurantsInLandingPage from "../../components/RestaurantInLandingPage/RestaurantsInLandingPage";
import RestaurantCategoriesCards from "../../components/RestaurantCategoriesCards/RestaurantCategoriesCards";
import PrePlannedTripsInLandingPage from "../../components/prePlannedTripsInLandingPage/PrePlannedTripsInLandingPage";
import DestinationsInHomePage from "../../components/destinationsInHomePage/DestinationsInHomePage";
import TransportServisersInLandingPage from "../../components/transportServicersInLandingPage/TransportServisersInLandingPage";

const Home = () => {
  return (
    <>
      <Hero />
      <RestaurantCategoriesCards />
      <PrePlannedTripsInLandingPage header="Curated Journeys for You" />
      <AiTripPlanning />
      <HotelsInLandingPage />
      <RestaurantsInLandingPage />
      <TransportServisersInLandingPage />
      <GuideList />
      <Activities />
      <FeedbackSection />
      <FeedbackForm />
      <DestinationsInHomePage/>
    </>
  );
};

export default Home;
