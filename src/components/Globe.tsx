import { useEffect, useRef } from "react";
import { Map, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router";

setWorkerUrl(workerUrl);

export default function Globe() {
  const containerRef = useRef<HTMLDivElement | null >(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current === null) {
      return
    }
    const map = new Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/globe.json",
      center: [0, 20],
      zoom: 1.5,
    });

    let frameId: number | undefined;
    let previousTime : undefined | number;
    let paused : boolean = false;

    function spin(time:number) {
      if (!paused && previousTime !== undefined) {
        const delta = time - previousTime;
        const center = map.getCenter();

        map.setCenter([
          center.lng + delta * 0.0015,
          center.lat,
        ]);
      }

      previousTime = time;
      frameId = requestAnimationFrame(spin);
    }

    const canvas = map.getCanvas();
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };

    canvas.addEventListener("pointerenter", pause);
    canvas.addEventListener("pointerleave", resume);

    map.on("load", () => {
      // رنگ‌های نقشه
      map.setPaintProperty("background", "background-color", "#DCEBE7");
      map.setPaintProperty("countries-fill", "fill-color", "#3D716D");
      map.setPaintProperty("coastline", "line-color", "#B99A61");

      // نام‌های پیش‌فرض نقشه را مخفی کن
      map.setLayoutProperty("countries-label", "visibility", "none");

      // نقطهٔ هر کشور
      map.addLayer({
        id: "country-pin",
        type: "circle",
        source: "maplibre",
        "source-layer": "centroids",
        paint: {
          "circle-radius": 5,
          "circle-color": "#B99A61",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
        },
      });

      // نام کشور کنار نقطه
      map.addLayer({
        id: "country-pin-label",
        type: "symbol",
        source: "maplibre",
        "source-layer": "centroids",
        layout: {
          "text-field": ["get", "NAME"],
          "text-font": ["Open Sans Semibold"],
          "text-size": 12,
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": 1.5,
        },
        paint: {
          "text-color": "#173D46",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 2,
        },
      });

      frameId = requestAnimationFrame(spin);
    });

    // کلیک روی نام، نقطه یا محدودهٔ کشور
    map.on("click", (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["country-pin-label", "country-pin", "countries-fill"],
      });

      const name = features.find((feature) => feature.properties?.NAME)
        ?.properties.NAME;

    if (name) {
      paused = true; // چرخش خودکار با حرکت دوربین تداخل نکند

      map.once("moveend", () => {
        navigate(`/country/${encodeURIComponent(name)}`);
      });

      map.flyTo({
        center: event.lngLat,
        zoom: 4,
        duration: 1600,
        essential: true,
      });
    }
    });

    return () => {
      if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      }
      canvas.removeEventListener("pointerenter", pause);
      canvas.removeEventListener("pointerleave", resume);
      map.remove();
    };
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className="h-100 md:w-[50%] w-full overflow-hidden  mx-auto bg-base-100"
    />
  );
}