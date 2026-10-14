document.addEventListener("DOMContentLoaded", () => {
  const closeAlert = document.querySelector(".btn-close");
  if (closeAlert)
    closeAlert.addEventListener("click", () =>
      closeAlert.closest(".alert")?.remove(),
    );
  const lightbox = document.querySelector(".media-lightbox");
  if (lightbox) {
    const image = lightbox.querySelector("img"),
      caption = lightbox.querySelector("p"),
      close = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll(".media-image-button").forEach((button) =>
      button.addEventListener("click", () => {
        const source = button.querySelector("img");
        image.src = source.src;
        image.alt = source.alt;
        caption.textContent = button.dataset.caption || source.alt;
        lightbox.showModal();
      }),
    );
    close.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
      image.removeAttribute("src");
    });
  }
  const revealItems = document.querySelectorAll(
    "main > *, .page-layout .content > *, .section, .stat-card",
  );
  revealItems.forEach((item, i) => {
    if (item.matches("h1,hr,script,style")) return;
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(i % 5, 4) * 55}ms`;
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((item) => observer.observe(item));
  } else
    document
      .querySelectorAll(".reveal")
      .forEach((item) => item.classList.add("is-visible"));
  // Shared, keyboard-accessible navigation on every page.
  if (!document.querySelector(".site-nav")) {
    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Site navigation");
    nav.innerHTML =
      '<a class="site-nav-brand" href="Home-Page_task1.html">HEAT<span> / </span>WATCH</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav-links">Menu</button><div class="site-nav-links" id="site-nav-links"><a href="Home-Page_task1.html">Overview</a><a href="forecast.html">Forecast</a><a href="Weather-Map.html">Map</a><a href="Alert-Page_task2.html">Safety</a><a href="subscribe.html">Advisories</a></div>';
    document.body.prepend(nav);
    const toggle = nav.querySelector(".nav-toggle"),
      links = nav.querySelector(".site-nav-links");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    });
    const current = location.pathname.split("/").pop();
    nav.querySelectorAll(".site-nav-links a").forEach((link) => {
      if (link.getAttribute("href") === current)
        link.setAttribute("aria-current", "page");
    });
  }

  // Searchable regional explorer with a list alternative to the image map.
  const mapImage = document.querySelector("img[usemap]");
  if (mapImage) {
    const map = document.querySelector(
      'map[ name="image-map"], map[name="image-map"]',
    );
    const areas = [...(map?.querySelectorAll("area") || [])];
    const forecasts = {
      Ahmedabad: { temp: 37, outlook: "Mainly clear sky" },
      Surat: { temp: 38, outlook: "Mainly clear sky" },
      Rajkot: { temp: 39, outlook: "Mainly clear sky" },
      Jamnagar: { temp: 34, outlook: "Mainly clear sky" },
      Amreli: { temp: 38, outlook: "Mainly clear sky" },
      Daman: { temp: 35, outlook: "Mainly clear sky" },
      Mumbai: { temp: 35, outlook: "Partly cloudy sky" },
      "Pimpri Chinchwad": { temp: 35, outlook: "Mainly clear sky" },
      Pune: { temp: 35, outlook: "Mainly clear sky" },
      Satara: { temp: 34, outlook: "Clear sky" },
      Nashik: { temp: 35, outlook: "Clear sky" },
      Akola: { temp: 38, outlook: "Mainly clear sky" },
      Bhopal: { temp: 34, outlook: "Mainly clear sky" },
      Indore: { temp: 35, outlook: "Clear sky" },
    };
    const explorer = document.createElement("section");
    explorer.className = "map-explorer";
    explorer.setAttribute(
      "aria-label",
      "Interactive regional map and zone list",
    );
    const visual = document.createElement("div");
    visual.className = "map-visual";
    const side = document.createElement("aside");
    side.className = "map-side";
    mapImage.parentNode.insertBefore(explorer, mapImage);
    explorer.append(visual, side);
    visual.append(mapImage);
    if (map) visual.append(map);
    side.innerHTML =
      '<label for="zone-search">Find a region</label><input id="zone-search" type="search" placeholder="Search monitored zones…"><div class="zone-selected" aria-live="polite"><span class="eyebrow">REGION DETAILS</span><h2>Select a zone</h2><p>Choose a region from the list or map.</p></div><ul class="zone-list" aria-label="Monitored regions"></ul>';
    const list = side.querySelector(".zone-list"),
      selected = side.querySelector(".zone-selected"),
      search = side.querySelector("#zone-search");
    const officialSources = {
      Ahmedabad: {
        station: "Ahmedabad",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42647",
      },
      Surat: {
        station: "Surat",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42840",
      },
      Vadodara: { station: "IMD city lookup", url: "https://city.imd.gov.in/" },
      Rajkot: {
        station: "Rajkot",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42737",
      },
      Jamnagar: {
        station: "Jamnagar",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=99412",
      },
      Junagadh: { station: "IMD city lookup", url: "https://city.imd.gov.in/" },
      Amreli: {
        station: "Amreli",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42834",
      },
      Daman: {
        station: "Daman",
        url: "https://city.imd.gov.in/citywx/citywxnew_warnings.php?id=42916",
      },
      Mumbai: {
        station: "Mumbai Colaba",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43057",
      },
      "Vasai Virar": {
        station: "IMD city lookup",
        url: "https://city.imd.gov.in/",
      },
      "Pimpri Chinchwad": {
        station: "Pune Shivajinagar",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43063",
      },
      Kalyan: {
        station: "Thane",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=18001",
      },
      Pune: {
        station: "Pune Shivajinagar",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43063",
      },
      Satara: {
        station: "Satara",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43113",
      },
      Solapur: {
        station: "Solapur",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43117",
      },
      Ahilyanagar: {
        station: "Ahmednagar",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43009",
      },
      Nashik: {
        station: "Nashik",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42921",
      },
      Aurangabad: {
        station: "Aurangabad",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43014",
      },
      "Sambhaji Nagar": {
        station: "Aurangabad (same city)",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=43014",
      },
      Dhule: { station: "IMD city lookup", url: "https://city.imd.gov.in/" },
      Jalgaon: {
        station: "Jalgaon",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42851",
      },
      Akola: {
        station: "Akola City",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42933",
      },
      Bhopal: {
        station: "Bhopal Airport",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=99977",
      },
      Indore: {
        station: "Indore",
        url: "https://city.imd.gov.in/citywx/citywxnew.php?id=42754",
      },
    };
    const records = areas
      .map((area) => {
        const name = (area.alt || area.title || "").replace(/\s+Zone$/i, "");
        const key = decodeURIComponent(
          area.href
            .split("/")
            .pop()
            .replace(/\.html$/i, ""),
        ).toLowerCase();
        const known = forecasts[name];
        return { area, name, key, known, source: officialSources[name] };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    const renderSelected = (record) => {
      const forecast = record.known,
        source = record.source;
      const details = forecast
        ? `IMD max forecast for 13 Oct: <strong>${forecast.temp} °C</strong><br>${forecast.outlook}`
        : "No local temperature is stored here. Check the official IMD forecast for this location or its mapped nearby station.";
      const sourceLink = source
        ? `<a class="source-link" href="${source.url}" target="_blank" rel="noopener">IMD: ${source.station} ↗</a>`
        : "";
      selected.innerHTML = `<span class="eyebrow">REGION DETAILS</span><h2>${record.name}</h2><p>${details}</p>${sourceLink}<br><a class="btn btn-small" href="${record.area.getAttribute("href")}">Open zone page ↗</a>`;
      areas.forEach((a) =>
        a.classList.toggle("is-selected", a === record.area),
      );
    };
    const drawList = (query) => {
      const matches = records.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase()),
      );
      list.replaceChildren();
      matches.forEach((record) => {
        const li = document.createElement("li"),
          a = document.createElement("a");
        a.href = record.area.getAttribute("href");
        a.textContent = record.name;
        a.className = "zone-link";
        const badge = document.createElement("span");
        badge.className =
          "severity " + (record.known ? "moderate" : "unlisted");
        badge.textContent = record.known
          ? `${record.known.temp}° · 13 Oct`
          : record.source
            ? "IMD page"
            : "No IMD page";
        a.append(badge);
        a.addEventListener("focus", () => renderSelected(record));
        a.addEventListener("mouseenter", () => renderSelected(record));
        li.append(a);
        list.append(li);
      });
      if (matches.length) renderSelected(matches[0]);
      else
        selected.innerHTML =
          '<span class="eyebrow">REGION DETAILS</span><h2>No match</h2><p>Try another region name.</p>';
    };
    drawList("");
    search.addEventListener("input", () => drawList(search.value));
    records.forEach((record) => {
      record.area.addEventListener("focus", () => renderSelected(record));
      record.area.addEventListener("mouseenter", () => renderSelected(record));
    });
    const baseWidth = Number(mapImage.getAttribute("width")) || 1500;
    areas.forEach((area) => (area.dataset.baseCoords = area.coords));
    const resizeMap = () => {
      const scale = mapImage.getBoundingClientRect().width / baseWidth;
      areas.forEach(
        (area) =>
          (area.coords = area.dataset.baseCoords
            .split(",")
            .map((v) => Math.round(Number(v) * scale))
            .join(",")),
      );
    };
    if (mapImage.complete) resizeMap();
    else mapImage.addEventListener("load", resizeMap, { once: true });
    if ("ResizeObserver" in window)
      new ResizeObserver(resizeMap).observe(mapImage);
    else window.addEventListener("resize", resizeMap);
  }

  // Filter, sort, and draw the chart from the same visible table rows.
  const table = document.querySelector("#forecast-table");
  if (table) {
    const tbody = table.tBodies[0],
      search = document.querySelector("#forecast-search"),
      count = document.querySelector("#forecast-count"),
      empty = document.querySelector("#forecast-empty");
    let sortColumn = 2,
      sortDirection = -1;
    const updateRows = () => {
      const q = search.value.trim().toLowerCase();
      let rows = [...tbody.rows];
      rows.forEach(
        (row) => (row.hidden = !row.textContent.toLowerCase().includes(q)),
      );
      const visible = rows.filter((row) => !row.hidden);
      count.textContent = `${visible.length} of ${rows.length} regions`;
      empty.hidden = visible.length > 0;
      drawChart(visible);
    };
    const value = (row, col) =>
      col === 2
        ? row.cells[col].dataset.value === undefined
          ? null
          : Number(row.cells[col].dataset.value)
        : row.cells[col].textContent.trim().toLowerCase();
    table.querySelectorAll(".sort-button").forEach((button) =>
      button.addEventListener("click", () => {
        const col = Number(button.dataset.sort);
        sortDirection =
          sortColumn === col ? -sortDirection : col === 2 ? -1 : 1;
        sortColumn = col;
        [...tbody.rows]
          .sort((a, b) => {
            const av = value(a, col),
              bv = value(b, col);
            if (av === null) return bv === null ? 0 : 1;
            if (bv === null) return -1;
            return (av > bv ? 1 : av < bv ? -1 : 0) * sortDirection;
          })
          .forEach((row) => tbody.append(row));
        table
          .querySelectorAll("thead th")
          .forEach((th, i) =>
            th.setAttribute(
              "aria-sort",
              i === col
                ? sortDirection === 1
                  ? "ascending"
                  : "descending"
                : "none",
            ),
          );
        updateRows();
      }),
    );
    search.addEventListener("input", updateRows);
    updateRows();
  }

  function drawChart(rows) {
    const mount = document.querySelector("#temperature-chart");
    if (!mount) return;
    rows = rows.filter((row) =>
      Number.isFinite(Number(row.cells[2].dataset.value)),
    );
    mount.replaceChildren();
    if (!rows.length) {
      mount.textContent = "No temperature values are listed for this search.";
      return;
    }
    const ns = "http://www.w3.org/2000/svg",
      svg = document.createElementNS(ns, "svg");
    svg.setAttribute(
      "viewBox",
      `0 0 720 ${Math.max(150, rows.length * 48 + 24)}`,
    );
    svg.setAttribute("role", "presentation");
    svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
    rows.forEach((row, i) => {
      const y = 14 + i * 48,
        name = row.cells[0].textContent.trim(),
        temp = Number(row.cells[2].dataset.value),
        label = document.createElementNS(ns, "text"),
        bar = document.createElementNS(ns, "rect"),
        value = document.createElementNS(ns, "text");
      label.setAttribute("x", "0");
      label.setAttribute("y", String(y + 17));
      label.setAttribute("class", "chart-label");
      label.textContent = name;
      bar.setAttribute("x", "145");
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(4, (temp / 50) * 490)));
      bar.setAttribute("height", "27");
      bar.setAttribute("rx", "8");
      bar.setAttribute("class", "chart-bar");
      value.setAttribute("x", String(155 + (temp / 50) * 490));
      value.setAttribute("y", String(y + 18));
      value.setAttribute("class", "chart-value");
      value.textContent = `${temp}°`;
      svg.append(label, bar, value);
    });
    mount.append(svg);
  }

  // Keep only non-sensitive alert preferences on this device; never store contact details.
  const form = document.querySelector(".subscribe-form");
  if (form) {
    const key = "heatwatch-alert-preferences";
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved) {
        if (saved.region && form.querySelector("#region"))
          form.querySelector("#region").value = saved.region;
        if (
          saved.language &&
          form.querySelector(
            `[name="language"][value="${CSS.escape(saved.language)}"]`,
          )
        )
          form.querySelector(
            `[name="language"][value="${CSS.escape(saved.language)}"]`,
          ).checked = true;
        (saved.types || []).forEach((id) => {
          const input = form.querySelector(`#${CSS.escape(id)}`);
          if (input) input.checked = true;
        });
      }
    } catch {}
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const prefs = {
        region: form.querySelector("#region")?.value || "",
        language: form.querySelector('[name="language"]:checked')?.value || "",
        types: [...form.querySelectorAll(".checkbox-group input:checked")].map(
          (input) => input.id,
        ),
      };
      try {
        localStorage.setItem(key, JSON.stringify(prefs));
      } catch {}
      let toast = document.querySelector(".toast-message");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-message";
        toast.setAttribute("role", "status");
        document.body.append(toast);
      }
      toast.textContent =
        "Preferences saved on this device. This demo does not send messages or store your contact details.";
      toast.hidden = false;
      window.setTimeout(() => (toast.hidden = true), 6000);
    });
    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        try {
          localStorage.removeItem(key);
        } catch {}
      }, 0);
    });
  }
});