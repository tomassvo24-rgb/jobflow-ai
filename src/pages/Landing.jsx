import React from "react";
import LandingPage from "../components/getjob/LandingPage";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onStart={() => navigate("/?home=0")}
      onContinue={() => navigate("/")}
    />
  );
}