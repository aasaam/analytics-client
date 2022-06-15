/**
 * GeoLatitude
 * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/latitude
 */
type GeoLatitude = number;

/**
 * GeoLongitude
 * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude
 */
type GeoLongitude = number;

/**
 * GeoAccuracy
 * @see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy
 */
type GeoAccuracy = number;

/**
 * CollectorServerURL
 */
type CollectorServerURL = string;

/**
 * PublicInstanceID
 *
 * Public instance id of analytics
 * @example '0123456789aZ'
 */
type PublicInstanceID = string;

/**
 * PrivateInstanceKey
 *
 * Private instance api key; require for API usage, on client side usage will be ignored
 * @example '0123456789aZ0123456789aZ0123456789aZ12'
 */
type PrivateInstanceKey = string;

/**
 * ClientIP
 *
 * Require for API usage, on client side usage will be ignored;
 * @example '1.1.1.1'
 */
type ClientIP = string;

/**
 * ClientUserAgent
 *
 * Require for API usage, on client side usage will be ignored;
 * @example 'curl/8.0.0'
 */
type ClientUserAgent = string;

/**
 * ClientTime
 *
 * Number in unix time, must be '<= now' and '>= (now - 8h)'
 * Require for API usage, on client side usage will be ignored;
 * If value not send `now` will on collector insert
 * @example 1577836800
 */
type ClientTime = number;

/**
 * PageURL
 * @see {@link window.location.href}
 * @example 'https://sub.example.tld/path/file.ext?n1=v1#hash'
 */
type PageURL = string;

/**
 * ReferrerURL
 * @see {@link document.referrer}
 */
type ReferrerURL = string;

/**
 * IsIframe
 *
 * Is page loaded in iframe or main window
 */
type IsIframe = boolean;

/**
 * IsTouchSupport
 *
 * Client support touch
 */
type IsTouchSupport = boolean;

/**
 * Username or user identifier
 */
type UserIdOrName = string;

/**
 * CanonicalURL `<link rel="canonical" href="http://example.tld/page.html">`
 * @see https://en.wikipedia.org/wiki/Canonical_link_element
 */
type CanonicalURL = string;

/**
 * PageTitle
 * `<meta property="og:title" content="Page title">` or `<title>Page title</title>`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
 * @example 'Page Title'
 */
type PageTitle = string;

/**
 * PageLanguage
 *`<html lang="en">`
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
 * @example 'en'
 */
type PageLanguage = string;

/**
 * PageKeywords (up to 10 keywords)
 * `<meta name="keywords" content="foo,bar">`
 * @see https://en.wikipedia.org/wiki/Meta_element#The_keywords_attribute
 * @example 'foo,bar'
 */
type PageKeywords = string;

/**
 * Entity ID
 *
 * ID in RDBMS, or any Ident like data `/^[a-zA-Z0-9-_\/]{1,63}$/`
 *
 * @example '/' For home page
 * @example '1000' MySQL
 * @example '5e0bbe150000000000000000' MongoDB
 * @example 'myusers/3456789' ArangoDB
 * @example '6F9619FF-8B86-D011-B42D-00C04FC964FF' RethinkDB
 */
type MainEntityID = string;

/**
 * Entity module
 *
 * Lower case and _ separated name of module /^[a-z0-9_]{1,31}$/
 *
 * @example 'home'
 * @example 'video_gallery'
 * @example 'product'
 * @example 'newspaper'
 * @example 'blog'
 * @example 'landing'
 * @example 'news'
 */
type MainEntityModule = string;

/**
 * Entity Taxonomy ID must valid aasaam taxonomy id
 *
 * @see {@link https://github.com/aasaam/taxonomy}
 * @example `A0000`
 * @example `Gzzzz`
 */
type MainEntityTaxonomyID = string;

/**
 * ScreenSize
 * @see {@link window.screen.width}
 * @see {@link window.screen.height}
 * @example '1600x900'
 */
type ScreenSize = string;

/**
 * ViewportSize
 * @see {@link window.innerWidth}
 * @see {@link window.innerHeight}
 * @example '1400x600'
 */
type ViewportSize = string;

/**
 * ColorDepth
 * @see {@link window.screen.colorDepth}
 * @example '24'
 */
type ColorDepth = string;

/**
 * DevicePixelRatio
 *
 * @see {@link window.devicePixelRatio}
 * @example '1.5'
 */
type DevicePixelRatio = string;

/**
 * ScreenOrientationType
 *
 * @see {@link window.screen.orientation.type}
 * @example 'l-p'
 */
type ScreenOrientationType = string;

// BreadcrumbList

type BreadcrumbListItemListElementItem = {
  '@id': string;
  name: string;
};

interface BreadcrumbListItemListElement {
  position: number;
  name?: string;
  item: BreadcrumbListItemListElementItem | string;
}

interface BreadcrumbList {
  itemListElement: BreadcrumbListItemListElement[];
}

interface PageBreadcrumbItem {
  p: number;
  n: string;
  u: string;
}

interface PageBreadcrumbSend {}

type PageBreadcrumbObject = { [key: string]: string };

/**
 * PageBreadcrumbList (up to 5)
 */
type PageBreadcrumbList = PageBreadcrumbItem[];

type AnalyticsRequestMode =
  /**
   * PageView
   */
  // PageViewJavaScript
  | 'pv_js'
  // PageViewImageLegacy
  | 'pv_il'
  // PageViewImageNoScript
  | 'pv_ins'
  // PageViewAMP
  | 'pv_amp'
  // PageViewAMPImage
  | 'pv_amp_i'
  /**
   * Event
   */
  // EventJSInPageView
  | 'e_js_pv'
  // EventJSCross
  | 'e_js_c'
  // EventServiceWorker
  | 'e_sw'
  // EventAPI
  | 'e_api'
  // EventOther
  | 'e_o';

interface PerformanceData {
  /**
   * Total resources
   */
  r?: number;

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
  lat: GeoLatitude;
  lon: GeoLongitude;
}

interface EventData {
  /**
   * Category
   *
   * Valid regex: `[a-z0-9]{1,127}`
   */
  c: string;

  /**
   * Action
   *
   * Valid regex: `[a-z0-9]{1,127}`
   */
  a: string;

  /**
   * Label
   *
   * Any valid unicode string with length [1-127]
   */
  l?: string;

  /**
   * Ident
   *
   * Identification for future usage
   */
  id?: string;

  /**
   * Value
   *
   * None-negative integer number [0-18446744073709551615]
   */
  v?: number;
}

interface EventDataBuffer extends EventData {
  i: PublicInstanceID;
}

type EventDataGroup = { [key: string]: EventDataBuffer[] };

interface MainEntityProps {
  i: MainEntityID;
  m: MainEntityModule;
  t?: MainEntityTaxonomyID;
}

interface ClientIdentifier {
  i: Date;
  s: Date;
  r: string;
}

interface APIRequest {
  i_p: PrivateInstanceKey;
  c_ip: ClientIP;
  c_ua: ClientUserAgent;
  c_t?: ClientTime;
}

interface PageCommonData {
  u?: PageURL;
  r?: ReferrerURL;
  t?: PageTitle;
  l?: PageLanguage;
  ei?: MainEntityID;
  em?: MainEntityModule;
  et?: MainEntityTaxonomyID;
  cu?: CanonicalURL;
}

interface SegmentPayload {
  s1n?: string;
  s2n?: string;
  s3n?: string;
  s4n?: string;
  s5n?: string;

  s1v?: string;
  s2v?: string;
  s3v?: string;
  s4v?: string;
  s5v?: string;
}

interface PageData extends PageCommonData {
  scr?: ScreenSize;
  vps?: ViewportSize;
  cd?: ColorDepth;
  dpr?: DevicePixelRatio;
  sot?: ScreenOrientationType;
  seg?: SegmentPayload;
  k?: PageKeywords;
  bc?: PageBreadcrumbObject;

  if?: IsIframe;
  ts?: IsTouchSupport;

  rs?: ReferrerURL;
  usr?: UserIdOrName;

  geo?: GeographyData;
  prf?: PerformanceData;
}

interface AnalyticsRequestGET extends PageCommonData {
  m: AnalyticsRequestMode;
  i: PublicInstanceID;
}

interface AnalyticsRequestPOST {
  /**
   * Client identifier (Standard)
   */
  cid_std?: string;

  /**
   * Client identifier (AMP)
   */
  cid_amp?: string;

  p?: PageData;
  ev?: EventData[];
  ar?: APIRequest;
}

interface StorageItem {
  v: StorageValue;
  e?: number;
}

type StorageData = { [key: string]: any };

type StorageValue =
  | GeographyData
  | ReferrerURL
  | { [key: string]: string | number | string[] | number[] }
  | string
  | number
  | string[]
  | number[];

interface PageViewPayload extends PageCommonData {
  usr?: UserIdOrName;

  sg?: Segment[];

  k?: PageKeywords;
  geo?: GeographyData | boolean;
  bc?: string | BreadcrumbList | boolean;

  /**
   * Performance wait time in millisecond
   *
   * @default 500
   */
  pwt?: number;
}

interface InitializeDataGeo {
  /**
   * Geo location timeout in seconds [1-60]
   *
   * @default 10
   */
  to?: number;

  /**
   * Geo location lifetime in seconds [3600-7776000]
   *
   * @default 604800
   */
  lt?: number;

  /**
   * Geo location failed cache lifetime in seconds [60-86400]
   *
   * default is session duration time
   */
  fc?: number;

  /**
   * Geo location enableHighAccuracy
   *
   * @default true
   */
  ha?: boolean;
}

interface InitializeData {
  i: PublicInstanceID;
  s: CollectorServerURL;

  /**
   * Prefix for local storage and cookie
   *
   * @default 'aa_std'
   */
  p?: string;

  /**
   * Initialize instance with page view
   *
   * @default true
   */
  pv?: boolean | PageViewPayload;

  /**
   * Session duration in seconds [60-86400]
   *
   * @default 1800
   */
  sd?: number;

  /**
   * Geolocation
   */
  gl?: InitializeDataGeo;
}

declare function aasaamAnalytics(
  initializeData: InitializeData
): aasaamAnalyticsInstance;

interface PublicCIDData {
  /**
   * Initialize date
   */
  i: Date;

  /**
   * Session date
   */
  s: Date;

  /**
   * Random part
   */
  r: string;

  /**
   * Persist part
   */
  p: string;
}

type SegmentScope = 1 | 2 | 3 | 4 | 5;

interface Segment {
  /**
   * Scope
   */
  s: SegmentScope;

  /**
   * Name
   */
  n: string;

  /**
   * Value
   */
  v: string;
}

interface aasaamAnalyticsInstance {
  i?: boolean;
  ie?: EventData[];
  cid(): PublicCIDData;
  pageView(injectPayload?: PageViewPayload): aasaamAnalyticsInstance;
  event(
    eventData: EventData,
    crossProjectPublicInstanceID?: PublicInstanceID
  ): aasaamAnalyticsInstance;
}

interface Window {
  aai_lid?: InitializeData;
  aasaamAnalytics?: aasaamAnalytics;
  aai: aasaamAnalyticsInstance;
}
