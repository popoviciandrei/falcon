/**
 * HtmlManager converts HTML elements:
 * - strips html tags/entities,
 * - truncates text
 * WARNING: Avoid importing it on client side (it will increase bundle size by about 20kb)
 */

import { AllHtmlEntities } from 'html-entities';
import stripTags from 'striptags';

const entities: AllHtmlEntities = new AllHtmlEntities();

/**
 * Strip HTML tags and HTML entities
 * @param {string} html element containing HTML tags and HTML entities
 * @returns {string} | HTML clean element
 */
export const stripHtml = (html: string): string => {
  if (html && typeof html === 'string') {
    return stripTags(entities.decode(html));
  }
  return '';
};

export const stripHtmlEntities = (html: string): string => {
  if (html && typeof html === 'string') {
    return entities.decode(html);
  }
  return '';
};

export const stripHtmlTags = (html: string): string => {
  if (html && typeof html === 'string') {
    return stripTags(html);
  }
  return '';
};

export const generateExcerpt = (text: string, length: number = 140): string => {
  if (!text) {
    return '';
  }

  const content = this.stripHtml(text);

  if (content && content.length > length) {
    return `${content.slice(0, length)}...`;
  }

  return content;
};
