/**
 * Cache utilities for Next.js App Router
 *
 * This file provides caching utilities for server-side data fetching.
 * Use these for data that doesn't need real-time freshness.
 */

import { unstable_cache } from "next/cache";

/**
 * Cache configuration presets
 */
export const CACHE_TAGS = {
  STATIC_CONTENT: "static-content",
  METADATA: "metadata",
  PUBLIC_DATA: "public-data",
};

export const CACHE_DURATIONS = {
  SHORT: 300, // 5 minutes - for semi-dynamic content
  MEDIUM: 1800, // 30 minutes - for homepage, frequently updated
  LONG: 3600, // 1 hour - for static pages
  VERY_LONG: 86400, // 24 hours - for rarely changing data
};

/**
 * Create a cached function with custom configuration
 *
 * @param {Function} fn - The function to cache
 * @param {Array<string>} keyParts - Cache key parts
 * @param {Object} options - Cache options
 * @returns {Function} Cached function
 *
 * @example
 * const getCachedData = createCachedFunction(
 *   async () => fetchData(),
 *   ['data-key'],
 *   { revalidate: CACHE_DURATIONS.MEDIUM, tags: [CACHE_TAGS.PUBLIC_DATA] }
 * );
 */
export function createCachedFunction(fn, keyParts, options = {}) {
  return unstable_cache(fn, keyParts, {
    revalidate: options.revalidate || CACHE_DURATIONS.MEDIUM,
    tags: options.tags || [],
  });
}

/**
 * Fetch with caching for external APIs
 * Use this for fetching data from external sources that don't change frequently
 *
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options with cache configuration
 * @returns {Promise} Fetch response
 *
 * @example
 * const data = await cachedFetch('https://api.example.com/data', {
 *   next: { revalidate: CACHE_DURATIONS.LONG }
 * });
 */
export async function cachedFetch(url, options = {}) {
  const defaultOptions = {
    next: {
      revalidate: CACHE_DURATIONS.MEDIUM,
    },
  };

  return fetch(url, { ...defaultOptions, ...options });
}

/**
 * No-cache fetch for real-time data
 * Use this for user-specific or frequently changing data
 *
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export async function noCacheFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    cache: "no-store",
  });
}

/**
 * Example: Cached metadata generator
 * Use for generating metadata that doesn't change frequently
 */
export const getCachedMetadata = createCachedFunction(
  async (pageId) => {
    // Your metadata generation logic here
    return {
      title: `Page ${pageId}`,
      description: "Description",
    };
  },
  ["metadata"],
  {
    revalidate: CACHE_DURATIONS.LONG,
    tags: [CACHE_TAGS.METADATA],
  },
);
