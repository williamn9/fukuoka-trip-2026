const header = document.querySelector(".site-header");

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const places = {
  airport: { name: "福岡機場", lat: 33.5859, lng: 130.451, note: "FUK 國際線" },
  hotel: { name: "HOTEL Lumia HAKATA", lat: 33.5964, lng: 130.4078, note: "五晚連住基地" },
  nakasu: { name: "中洲／川端通", lat: 33.5934, lng: 130.4054, note: "屋台與夜散策" },
  canalCity: { name: "博多運河城", lat: 33.5897, lng: 130.411, note: "輕鬆採購" },
  balloonSaga: {
    name: "バルーンさが（臨時站）",
    lat: 33.2578,
    lng: 130.249,
    note: "嘉瀬川河川敷・會場旁；節慶期間才營業",
  },
  yanagawa: { name: "柳川松月碼頭", lat: 33.1635, lng: 130.4058, note: "川下り遊船" },
  dazaifu: { name: "太宰府天滿宮", lat: 33.5214, lng: 130.5348, note: "參道與梅枝餅" },
  karatsu: { name: "唐津", lat: 33.4504, lng: 129.9688, note: "曳山祭宵ヤマ" },
  ohori: { name: "大濠公園", lat: 33.586, lng: 130.3794, note: "湖畔漫步" },
  tenjin: { name: "天神", lat: 33.5902, lng: 130.4017, note: "地下街、伴手禮、レトロ遊戲店" },
  mandarake: {
    name: "Mandarake 福岡",
    lat: 33.5895,
    lng: 130.3945,
    note: "大名・1F 遊戲區",
  },
};

const shortLabels = {
  airport: "機場",
  hotel: "博多",
  nakasu: "中洲",
  canalCity: "運河",
  balloonSaga: "佐賀",
  yanagawa: "柳川",
  dazaifu: "太宰府",
  karatsu: "唐津",
  ohori: "大濠",
  tenjin: "天神",
  mandarake: "萬代",
};

const routeMeta = {
  day1: {
    caption: "Day 1：福岡機場 → 飯店 → 中洲／川端通早期夜散策。",
  },
  day2: {
    caption: "Day 2：博多 → 佐賀 → バルーンさが臨時站（嘉瀬川會場旁，步行約 1 分）→ 返回運河城。",
  },
  day3: {
    caption: "Day 3：天神／博多 → 柳川 → 太宰府 → 返回市區。",
  },
  day4: {
    caption: "Day 4：中洲川端直達唐津，夜間宵ヤマ後返回博多。",
  },
  day5: {
    caption: "Day 5：大濠公園 → 天神／大名レトロ遊戲店 → 和牛慶祝晚餐。",
  },
  day6: {
    caption: "Day 6：飯店退房，計程車直達福岡機場返港。",
  },
};

const routes = {
  day1: {
    color: "#4a6d82",
    path: ["airport", "hotel", "nakasu"],
    markers: ["airport", "hotel", "nakasu"],
  },
  day2: {
    color: "#b86a2e",
    path: ["hotel", "balloonSaga", "hotel", "canalCity"],
    markers: ["hotel", "balloonSaga", "canalCity"],
  },
  day3: {
    color: "#2f4a5c",
    path: ["tenjin", "yanagawa", "dazaifu", "hotel"],
    markers: ["tenjin", "yanagawa", "dazaifu", "hotel"],
  },
  day4: {
    color: "#8a4f2a",
    path: ["nakasu", "karatsu", "hotel"],
    markers: ["nakasu", "karatsu", "hotel"],
  },
  day5: {
    color: "#3d6b7a",
    path: ["hotel", "ohori", "tenjin", "mandarake", "hotel"],
    markers: ["hotel", "ohori", "tenjin", "mandarake"],
  },
  day6: {
    color: "#5c6f7d",
    path: ["hotel", "airport"],
    markers: ["hotel", "airport"],
  },
};

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#e8eef2" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#2c3d4f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f2f6f8" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "simplified" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f7fafc" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d0dbe3" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b7cdd9" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b7c4cf" }],
  },
];

let activeDay = "day1";
let mapRouteController = null;

function toLatLng(place) {
  return { lat: place.lat, lng: place.lng };
}

function showMapSetup() {
  const setup = document.getElementById("map-setup");
  if (setup) setup.hidden = false;
}

function hideMapSetup() {
  const setup = document.getElementById("map-setup");
  if (setup) setup.hidden = true;
}

function markerIcon(label, isHub = false) {
  const size = isHub ? 38 : 32;
  const bg = isHub ? "#b86a2e" : "#2f4a5c";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${bg}" stroke="#fafcfd" stroke-width="2"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        fill="#fafcfd" font-size="${isHub ? 10 : 11}" font-family="sans-serif" font-weight="700">${label}</text>
    </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
  };
}

function selectDay(dayKey) {
  if (!routes[dayKey]) return;
  activeDay = dayKey;

  document.querySelectorAll(".day-tab").forEach((tab) => {
    const selected = tab.dataset.day === dayKey;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", selected ? "true" : "false");
  });

  document.querySelectorAll(".day-panel").forEach((panel) => {
    const selected = panel.dataset.day === dayKey;
    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
  });

  const caption = document.getElementById("map-caption");
  if (caption && routeMeta[dayKey]) {
    caption.textContent = routeMeta[dayKey].caption;
  }

  if (mapRouteController) {
    mapRouteController(dayKey);
  }
}

function initDayTabs() {
  const tabs = document.querySelectorAll(".day-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectDay(tab.dataset.day));
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next =
        event.key === "ArrowRight"
          ? tabs[(index + 1) % tabs.length]
          : tabs[(index - 1 + tabs.length) % tabs.length];
      next.focus();
      selectDay(next.dataset.day);
    });
  });

  selectDay(activeDay);
}

window.initTripMap = function initTripMap() {
  const mapEl = document.getElementById("trip-map");
  if (!mapEl || typeof google === "undefined" || !google.maps) return;

  hideMapSetup();

  const map = new google.maps.Map(mapEl, {
    center: toLatLng(places.hotel),
    zoom: 9,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
    gestureHandling: "cooperative",
    styles: mapStyles,
  });

  const info = new google.maps.InfoWindow();
  const layers = { lines: {}, markers: {} };

  const hubMarker = new google.maps.Marker({
    position: toLatLng(places.hotel),
    map,
    title: places.hotel.name,
    icon: markerIcon("博多", true),
    zIndex: 1000,
  });

  hubMarker.addListener("click", () => {
    info.setContent(
      `<strong>${places.hotel.name}</strong><div>${places.hotel.note}</div>`
    );
    info.open({ map, anchor: hubMarker });
  });

  Object.entries(routes).forEach(([dayKey, route]) => {
    const path = route.path.map((id) => toLatLng(places[id]));
    const line = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: route.color,
      strokeOpacity: 0.95,
      strokeWeight: 4.5,
      map: null,
    });

    const dayMarkers = route.markers
      .filter((id) => id !== "hotel")
      .map((id) => {
        const place = places[id];
        const marker = new google.maps.Marker({
          position: toLatLng(place),
          map: null,
          title: place.name,
          icon: markerIcon(shortLabels[id] || place.name),
        });

        marker.addListener("click", () => {
          info.setContent(
            `<strong>${place.name}</strong><div>${dayKey.replace(
              "day",
              "Day "
            )} · ${place.note}</div>`
          );
          info.open({ map, anchor: marker });
        });

        return marker;
      });

    layers.lines[dayKey] = line;
    layers.markers[dayKey] = dayMarkers;
  });

  const fitTo = (latLngList) => {
    const bounds = new google.maps.LatLngBounds();
    latLngList.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 56);
  };

  const setRoute = (key) => {
    const focusPoints = [toLatLng(places.hotel)];

    Object.keys(routes).forEach((dayKey) => {
      const show = key === dayKey;
      const line = layers.lines[dayKey];
      const dayMarkers = layers.markers[dayKey];

      line.setMap(show ? map : null);
      dayMarkers.forEach((marker) => {
        marker.setMap(show ? map : null);
        if (show) focusPoints.push(marker.getPosition());
      });

      if (show) {
        routes[dayKey].path.forEach((id) =>
          focusPoints.push(toLatLng(places[id]))
        );
      }
    });

    fitTo(focusPoints);
    requestAnimationFrame(() => google.maps.event.trigger(map, "resize"));
  };

  mapRouteController = setRoute;

  const revealMap = () => {
    google.maps.event.trigger(map, "resize");
    setRoute(activeDay);
  };

  if ("IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealMap();
            mapObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    mapObserver.observe(mapEl);
  } else {
    revealMap();
  }

  window.addEventListener("resize", () => {
    google.maps.event.trigger(map, "resize");
  });
};

function loadGoogleMaps() {
  const key = (window.GOOGLE_MAPS_API_KEY || "").trim();
  if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY") {
    showMapSetup();
    return;
  }

  if (document.getElementById("google-maps-script")) return;

  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    key
  )}&callback=initTripMap&loading=async`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    showMapSetup();
    const setup = document.getElementById("map-setup");
    if (setup) {
      setup.querySelector("p").textContent =
        "無法載入 Google Maps，請確認 API key 與 Maps JavaScript API 已啟用。";
    }
  };
  document.head.appendChild(script);
}

initDayTabs();
loadGoogleMaps();
