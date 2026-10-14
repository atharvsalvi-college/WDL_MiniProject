# Heatwave Intelligence System

A static HTML, CSS, and JavaScript site for browsing heatwave and weather information.

## Forecast snapshot

`forecast.html` lists all 24 locations shown on the hotspot map. It uses the India Meteorological Department (IMD) city forecast for 13 October 2026 where a matching station report was available, links each matched location to its IMD page, and leaves a dash where a current local value could not be verified. Some municipal map zones use a nearby IMD station; the table identifies those cases. Use the linked IMD page for the latest report. This static site does not refresh forecasts automatically.

The forecast page includes a searchable, sortable table and a temperature comparison chart. `Weather-Map.html` includes a searchable region list with matching IMD links. Other pages provide heat-safety guidance and the site information.

## Subscriptions

`subscribe.html` saves only region, language, and alert-type preferences in the browser's local storage. Contact details are not sent or saved, and this demo does not send alerts.

Open `Home-Page_task1.html` in a browser to use the site. For current weather warnings, follow the [official IMD city forecast portal](https://city.imd.gov.in/) and [IMD API reference](https://api.imd.gov.in/public/api_reference.html).
