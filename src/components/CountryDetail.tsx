import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Heart, Plane } from "lucide-react";
import countries from "../data/countries.json";
import { AppContext } from "../context/AppContext";

export default function CountryDetail() {
  const { state, dispatch } = useContext(AppContext);
  const { countryName } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = state.currentUserId !== null;
  const currentUser = isLoggedIn ? state.users[state.currentUserId] : null;
  const singleCountry = countries.find((country) => country.name === countryName);
  const liked = currentUser?.likes?.includes(countryName) ?? false;
  const addToTrip = Object.hasOwn(currentUser?.trips ?? {}, countryName);

  useEffect(() => {
    if (!singleCountry) return;

    setLoading(true);
    setWeather(null);
    let cancelled = false;

    async function loadWeather() {
      try {
        const positionUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(singleCountry.name)}&format=jsonv2&limit=1`;
        const positionRequest = await fetch(positionUrl);
        const positions = await positionRequest.json();
        if (!positions[0]) return;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${positions[0].lat}&longitude=${positions[0].lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=auto`;
        const weatherRequest = await fetch(weatherUrl);
        const weatherResponse = await weatherRequest.json();
        if (!cancelled) setWeather(weatherResponse.daily ?? null);
      } catch (error) {
        console.error("Could not load weather:", error);
      }
    }

    loadWeather();
    return () => { cancelled = true; };
  }, [singleCountry]);

  if (!singleCountry) {
    return <p className="text-center mt-10">Country not found.</p>;
  }

  function handleLike() {
    if (!isLoggedIn) return;
    dispatch({ type: "TOGGLE_LIKE", payload: countryName });
  }

  function handleTrip() {
    if (!isLoggedIn) return;
    dispatch({ type: "TOGGLE_TRIP_COUNTRY", payload: countryName });
  }

  return (
    <>
      <p className="text-center mt-10 w-full bg-primary text-primary-content font-header text-3xl">
        {countryName}
      </p>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner text-primary" />
        </div>
      )}

      <div className={`relative flex flex-col w-full max-w-150 mx-auto ${loading ? "hidden" : "flex"}`}>
        <img
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          src={singleCountry.image}
          className="w-full max-h-80 mt-5 object-cover"
          alt={countryName}
        />

        {weather && (
          <div className="absolute max-w-150 w-full mx-auto bottom-11.5 bg-primary/70 h-10 flex justify-between items-center px-2.5">
            <p className="text-primary-content font-bold">Today</p>
            <p className="text-2xl font-semibold text-primary-content">
              {weather.temperature_2m_max[0]}°C
            </p>
            <p className="text-primary-content font-bold">
              ↓ {weather.temperature_2m_min[0]}°C
            </p>
          </div>
        )}

        <div className="w-full max-w-150 mx-auto flex mt-4 px-3 h-auto items-center gap-3">
          <Heart
            className={`text-primary transition-all duration-300 ${liked ? "fill-primary" : ""} ${isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
            onClick={isLoggedIn ? handleLike : undefined}
            aria-disabled={!isLoggedIn}
            size={30}
          />
          <Plane
            className={`text-primary transition-all duration-300 ${addToTrip ? "fill-primary" : ""} ${isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
            onClick={isLoggedIn ? handleTrip : undefined}
            aria-disabled={!isLoggedIn}
            size={30}
          />
          <h2 className="min-w-0 flex-1 px-3 font-pop font-semibold text-xl">
            {singleCountry.landmark}
          </h2>
        </div>
      </div>
    </>
  );
}
