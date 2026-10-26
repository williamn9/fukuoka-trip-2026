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
  hakata: { name: "JR 博多駅", lat: 33.5897, lng: 130.4207, note: "JR 特急出發站" },
  nakasu: { name: "中洲川端駅", lat: 33.5935, lng: 130.4058, note: "地下鐵空港線／夜散策起點" },
  canalCity: { name: "博多運河城", lat: 33.5897, lng: 130.411, note: "輕鬆採購" },
  balloonSaga: {
    name: "バルーンさが（臨時站）",
    lat: 33.2578,
    lng: 130.249,
    note: "嘉瀬川河川敷・會場旁；節慶期間才營業",
  },
  saga: { name: "JR 佐賀駅", lat: 33.2642, lng: 130.2967, note: "轉往バルーンさが" },
  yanagawaStation: {
    name: "西鐵柳川駅",
    lat: 33.1608,
    lng: 130.4029,
    note: "轉短程計程車至松月碼頭",
  },
  yanagawa: { name: "柳川松月碼頭", lat: 33.1635, lng: 130.4058, note: "川下り遊船" },
  dazaifu: { name: "太宰府天滿宮", lat: 33.5214, lng: 130.5348, note: "參道與梅枝餅" },
  karatsu: { name: "唐津駅", lat: 33.4504, lng: 129.9688, note: "曳山祭宵ヤマ" },
  ohori: { name: "大濠公園", lat: 33.586, lng: 130.3794, note: "湖畔漫步" },
  tenjin: {
    name: "西鐵福岡（天神）駅",
    lat: 33.5902,
    lng: 130.4017,
    note: "西鐵特急／地下街",
  },
  bookoff: {
    name: "BOOKOFF ミーナ天神",
    lat: 33.5918,
    lng: 130.3998,
    note: "天神4丁目・7F・レトロ遊戲／二手",
  },
  cultureArts: {
    name: "Culture Arts",
    lat: 33.593,
    lng: 130.3992,
    note: "天神3丁目・スコーレ第二天神 306・レトロ遊戲",
  },
  mandarake: {
    name: "Mandarake 福岡",
    lat: 33.5895,
    lng: 130.3945,
    note: "大名・1F 遊戲區・レトロ遊戲",
  },
};

const shortLabels = {
  airport: "機場",
  hotel: "飯店",
  hakata: "博多",
  nakasu: "川端",
  canalCity: "運河",
  balloonSaga: "會場",
  saga: "佐賀",
  yanagawaStation: "柳川站",
  yanagawa: "碼頭",
  dazaifu: "太宰府",
  karatsu: "唐津",
  ohori: "大濠",
  tenjin: "天神",
  bookoff: "BO",
  cultureArts: "CA",
  mandarake: "萬代",
};

const dateLabels = {
  day1: "10/30",
  day2: "10/31",
  day3: "11/1",
  day4: "11/2",
  day5: "11/3",
  day6: "11/4",
};

const routeMeta = {
  day1: {
    caption: "10/30：機場計程車 → 飯店 → 步行至中洲川端夜散策。",
  },
  day2: {
    caption: "10/31：飯店 → 西鐵天神站 → 柳川 → 返回飯店用水炊き。",
  },
  day3: {
    caption: "11/1：飯店 → 天神轉乘 → 太宰府 → 大濠 → レトロ遊戲三店（BO／CA／萬代）。",
  },
  day4: {
    caption: "11/2：飯店 → 中洲川端駅 → 唐津宵ヤマ → 返回飯店。",
  },
  day5: {
    caption: "11/3：飯店 → 博多駅 → 佐賀／バルーンさが → 返回飯店。",
  },
  day6: {
    caption: "11/4：飯店計程車直達福岡機場返港。",
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
    path: ["hotel", "tenjin", "yanagawaStation", "yanagawa", "yanagawaStation", "tenjin", "hotel"],
    markers: ["hotel", "tenjin", "yanagawaStation", "yanagawa"],
  },
  day3: {
    color: "#2f4a5c",
    path: [
      "hotel",
      "tenjin",
      "dazaifu",
      "ohori",
      "tenjin",
      "bookoff",
      "cultureArts",
      "mandarake",
      "hotel",
    ],
    markers: ["hotel", "tenjin", "dazaifu", "ohori", "bookoff", "cultureArts", "mandarake"],
  },
  day4: {
    color: "#8a4f2a",
    path: ["hotel", "nakasu", "karatsu", "nakasu", "hotel"],
    markers: ["hotel", "nakasu", "karatsu"],
  },
  day5: {
    color: "#3d6b7a",
    path: ["hotel", "hakata", "saga", "balloonSaga", "saga", "hakata", "hotel", "canalCity"],
    markers: ["hotel", "hakata", "saga", "balloonSaga", "canalCity"],
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

const tabCopy = {
  info: {
    title: "行程資訊",
    lede: "總覽、航班住宿、出發準備與實用貼士。",
  },
  day: {
    title: "每日行程",
    lede: "頂部選日期，只顯示當日行程、路線與預約連結。",
  },
};

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

function selectDay(dayKey, { scroll = false } = {}) {
  const isInfo = dayKey === "info";
  if (!isInfo && !routes[dayKey]) return;
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

  const title = document.getElementById("days-title");
  const lede = document.getElementById("days-lede");
  const copy = isInfo ? tabCopy.info : tabCopy.day;
  if (title) title.textContent = copy.title;
  if (lede) lede.textContent = copy.lede;

  const mapBlock = document.querySelector(".day-map-block");
  if (mapBlock) mapBlock.hidden = isInfo;

  if (!isInfo) {
    const caption = document.getElementById("map-caption");
    if (caption && routeMeta[dayKey]) {
      caption.textContent = routeMeta[dayKey].caption;
    }
    if (mapRouteController) {
      mapRouteController(dayKey);
    }
  }

  if (scroll) {
    const daysSection = document.getElementById("days");
    if (daysSection) {
      daysSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function initDayTabs() {
  const tabs = Array.from(document.querySelectorAll(".day-tab"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectDay(tab.dataset.day, { scroll: true });
      history.replaceState(null, "", `#${tab.dataset.day}`);
    });
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
      selectDay(next.dataset.day, { scroll: true });
      history.replaceState(null, "", `#${next.dataset.day}`);
    });
  });

  document.querySelectorAll("[data-select-day]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const key = link.getAttribute("data-select-day");
      if (!key) return;
      event.preventDefault();
      selectDay(key, { scroll: true });
      history.replaceState(null, "", `#${key}`);
    });
  });

  const hashDay = (location.hash || "").replace(/^#/, "");
  if (hashDay === "info" || routes[hashDay]) {
    activeDay = hashDay;
  }

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
    icon: markerIcon("飯店", true),
    zIndex: 1000,
  });

  hubMarker.addListener("click", () => {
    info.setContent(
      `<strong>${places.hotel.name}</strong><div>住宿飯店 · ${places.hotel.note}</div>`
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
            `<strong>${place.name}</strong><div>${dateLabels[dayKey] || dayKey} · ${place.note}</div>`
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
    setRoute(activeDay === "info" ? "day1" : activeDay);
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
