type ModeOfRequest = 'jse' | 'jsp' | 'il' | 'ins' | 'ia' | 'amp' | 'sw' | 'api';

interface PagePerformanceData {
  nav?: PerformanceEntry;
  res?: string;
}

interface PerformanceData {
  /**
   * PAGE_LOAD_TIME
   */
  plt?: string;

  /**
   * DOMAIN_LOOKUP_TIME
   */
  dlt?: string;

  /**
   * TCP_CONNECT_TIME
   */
  tct?: string;

  /**
   * SERVER_RESPONSE_TIME
   */
  srt?: string;

  /**
   * PAGE_DOWNLOAD_TIME
   */
  pdt?: string;

  /**
   * REDIRECT_TIME
   */
  rt?: string;

  /**
   * DOM_INTERACTIVE_TIME
   */
  dit?: string;

  /**
   * CONTENT_LOAD_TIME
   */
  clt?: string;

  /**
   * TOTAL_RESOURCES
   */
  res?: string;
}

interface GeographyData {
  /**
   * latitude of the position
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/latitude
   */
  lat: number;

  /**
   * longitude of the position
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude
   */
  lon: number;

  /**
   * accuracy
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy
   */
  acc: number;
}

interface GetParams {
  /**
   * URL
   *
   * @see {@link window.location.href}
   */
  u: string;

  /**
   * Public hash of project
   */
  i: string;

  /**
   * Request mode
   */
  m?: ModeOfRequest;

  /**
   * Referer URL
   *
   * @see {@link document.referrer}
   */
  r?: string;

  /**
   * Canonical URL `<link rel="canonical" href="http://example.tld/page.html">`
   *
   * @see https://en.wikipedia.org/wiki/Canonical_link_element
   */
  cn?: string;

  /**
   * Main identifier represent of main entity identifier of page
   *
   * `<main data-id="">`
   */
  mid?: string;
}

interface PageData {
  /**
   * Screen size
   *
   * @see {@link window.screen.width}
   * @see {@link window.screen.height}
   */
  scr: string;

  /**
   * Viewport size
   *
   * @see {@link window.innerWidth}
   * @see {@link window.innerHeight}
   */
  vps: string;

  /**
   * Page title
   *
   * `<meta property="og:title" content="Page title">` or `<title>Page title</title>`
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
   */
  t: string;

  /**
   * Keywords (up to 10 keywords)
   *
   * `<meta name="keywords" content="foo,bar">`
   * @see https://en.wikipedia.org/wiki/Meta_element#The_keywords_attribute
   */
  k?: string;

  /**
   * @see {@link window.screen.colorDepth}
   */
  cd: string;

  /**
   * User name/id
   */
  usr?: string;

  /**
   * URL
   *
   * @see {@link window.location.href}
   */
  u?: string;

  /**
   * User agent
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
   */
  ua?: string;

  /**
   * devicePixelRatio
   *
   * @see {@link window.devicePixelRatio}
   */
  dpr: string;

  /**
   * Referer URL state for each [new visit state]
   * If user came from `https://example.tld` all of `rs` is set for all records
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
   */
  rs?: string;

  /**
   * Is page load in iframe
   */
  if: boolean;

  /**
   * Screen orientation type
   *
   * @see {@link window.screen.orientation.type}
   */
  so?: string;

  /**
   * Geography location data
   */
  geo?: GeographyData;

  /**
   * Performance data
   */
  prf?: PerformanceData;
}

interface PageViewPayload {
  /**
   * User name or identifier
   */
  user?: string;

  /**
   * URL
   */
  url?: string;

  /**
   * Canonical URL
   */
  canonical?: string;

  /**
   * Page title
   */
  title?: string;

  /**
   * Keywords (up to 10 keywords)
   */
  keywords?: string[];

  /**
   * Main identifier represent of main entity identifier of page
   */
  mainID?: string;

  /**
   * Referer URL
   *
   * @see {@link document.referrer}
   */
  referrer?: string;

  /**
   * Geography location
   *
   * If boolean use ask and store on localStorage
   */
  geo?: GeographyData | boolean;
}

interface EventData {
  /**
   * Category
   */
  ec: string;

  /**
   * Action
   */
  ea: string;

  /**
   * Label
   */
  el?: string;

  /**
   * Value
   */
  ev?: number;
}

interface EventItem {
  /**
   * Category
   */
  category: string;

  /**
   * Action
   */
  action: string;

  /**
   * Label
   */
  label?: string;

  /**
   * Value
   */
  value?: number;
}

interface InitializeData {
  /**
   * Project public hash
   */
  i: string;

  /**
   * Collector server URL
   */
  s: string;

  /**
   * Prefix for local storage and cookie
   */
  p?: string = 'aai';

  /**
   * Initialize instance with page view
   *
   * @default {true}
   */
  pv?: boolean | PageViewPayload = false;

  /**
   * New visit state in minutes
   *
   * @default {3600}
   */
  nvs?: number = 3600;

  /**
   * Geo location timeout in seconds
   *
   * @default {10}
   */
  gto?: number = 10;

  /**
   * Geo location lifetime in seconds
   *
   * @default {604800}
   */
  glt?: number = 604800;
}

declare function aasaamAnalytics(
  initializeData: InitializeData
): aasaamAnalyticsInstance;

interface aasaamAnalyticsInstance {
  pageView(payload?: PageViewPayload): Promise<aasaamAnalyticsInstance>;
  event(ev?: EventItem): aasaamAnalyticsInstance;
}

interface Window {
  aasaamAnalytics?: aasaamAnalytics;
  aai?: aasaamAnalyticsInstance;
  aae?: EventItem[];
}
