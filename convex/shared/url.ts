/**
 * RegExps. A URL must match #1 and then at least one of #2/#3. Use two levels
 * of REs to avoid REDOS.
 */

import { tlds } from '@convex/shared/tlds';

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const emailLintRE = /mailto:([^?\\]+)/;

const localhostDomainRE = /^localhost[\d:?]*(?:[^\d:?]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

/** Loosely validate a URL `string`. */
export const isValidUrl = (string: any) => {
  if (typeof string !== 'string') {
    return false;
  }

  const generalMatch = protocolAndDomainRE.exec(string);
  const emailLinkMatch = emailLintRE.exec(string);

  const match = generalMatch || emailLinkMatch;

  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];

  if (!everythingAfterProtocol) {
    return false;
  }

  try {
    new URL(string);
  } catch {
    return false;
  }

  return (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  );
};

export type FormatUrlOptions = {
  noPath?: boolean;
  noProtocol?: boolean;
};

export const hasSpecialProtocol = (url: string) => {
  return /^mailto:|tel:/.test(url);
};

export const trimProtocol = (url: string) => {
  url = url.replace(/^https?:\/\//, '');

  return url.startsWith('www.') ? url.slice(4) : url;
};

// Formats a URL to include the protocol if it doesn't already
export const formatUrl = (
  url: string,
  { noPath, noProtocol }: FormatUrlOptions = {}
) => {
  if (noPath) {
    const trimmedUrl = trimProtocol(url);
    url = trimmedUrl.split('/')[0] || trimmedUrl;
  }
  if (noProtocol) {
    url = trimProtocol(url);
  } else {
    if (!/https?:\/\//.test(url) && !hasSpecialProtocol(url)) {
      url = `https://${url}`;
    }
  }

  return url.trim();
};

export const isUrl = (url: string) => {
  url = formatUrl(url);

  if (!isValidUrl(url)) return false;
  if (hasSpecialProtocol(url)) {
    return true;
  }

  try {
    const parsedUrl = new URL(url);

    const lastDotIndex = parsedUrl.hostname.lastIndexOf('.');

    if (lastDotIndex !== -1 && lastDotIndex < parsedUrl.hostname.length - 1) {
      const firstLetter = parsedUrl.hostname[lastDotIndex + 1];

      if (tlds[firstLetter]) {
        return tlds[firstLetter].some((tld: string) =>
          parsedUrl.hostname.endsWith(tld)
        );
      }
    }

    return false;
  } catch {
    return false;
  }
};

/** Check if a url contains a valid image by sending a HEAD request. */
export const isImgUrl = async (url: string) =>
  fetch(url, { method: 'HEAD' })
    .then((res) => {
      return res.headers.get('Content-Type')?.startsWith('image');
    })
    .catch(() => false);
