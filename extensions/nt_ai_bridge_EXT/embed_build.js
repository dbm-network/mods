'use strict';

const { URL } = require('url');
const {
  NT_ASK_BRAND_URL,
  NT_ASK_COLOR,
  NT_ASK_ERR_COLOR,
  NT_ASK_WARN_COLOR,
  NT_ASK_DESC_CHUNK,
} = require('./constants');
const { sanitizeThumbnailUrl } = require('./bot_face');

/** Discord embed URL max length */
const BRAND_URL_FOR_EMBED = String(NT_ASK_BRAND_URL || '').substring(0, 2048);

function brandHostForFooter() {
  try {
    const h = new URL(NT_ASK_BRAND_URL).host;
    return h || 'ai.newstargeted.com';
  } catch (_) {
    return 'ai.newstargeted.com';
  }
}

function embedFooterElapsed(askT0) {
  const sec = Math.max(0, (Date.now() - askT0) / 1000);
  const shown = sec >= 100 ? `${sec.toFixed(0)}s` : `${sec.toFixed(1)}s`;
  return `\u23f1 ${shown} \u00b7 ${brandHostForFooter()}`;
}

function makeAskEmbeds(answerText, askT0, face) {
  face = face || {};
  const iconUrl = face.iconUrl || '';
  const authorName = (face.authorName || 'NT AI').substring(0, 256);
  const footerText = embedFooterElapsed(askT0).substring(0, 2048);
  const thumb = sanitizeThumbnailUrl(face.thumbnailUrl) || sanitizeThumbnailUrl(iconUrl) || '';
  const imageUrl = sanitizeThumbnailUrl(face.imageUrl) || '';
  const t = String(answerText);
  const out = [];
  for (let i = 0; i < t.length; i += NT_ASK_DESC_CHUNK) {
    out.push(t.slice(i, i + NT_ASK_DESC_CHUNK));
  }
  if (out.length === 0) {
    out.push('No response.');
  }
  return out.map(function (desc, idx) {
    const footer = { text: footerText };
    if (iconUrl) {
      footer.icon_url = iconUrl;
    }
    const e = {
      color: NT_ASK_COLOR,
      description: desc.length ? desc : '\u200b',
      footer,
    };
    if (iconUrl) {
      e.author = {
        name: (idx === 0 ? authorName : `${authorName} (continued)`).substring(0, 256),
        icon_url: iconUrl,
        url: BRAND_URL_FOR_EMBED,
      };
    } else {
      e.title = idx === 0 ? 'NT AI' : 'NT AI (continued)';
      e.url = BRAND_URL_FOR_EMBED;
    }
    if (thumb && idx === 0) {
      e.thumbnail = { url: thumb.substring(0, 2048) };
    }
    if (imageUrl && idx === 0) {
      e.image = { url: imageUrl.substring(0, 2048) };
    }
    return e;
  });
}

function makeErrorEmbed(description, askT0, face) {
  face = face || {};
  const iconUrl = face.iconUrl || '';
  const authorName = (face.authorName || 'NT AI').substring(0, 256);
  const thumb = sanitizeThumbnailUrl(face.thumbnailUrl) || sanitizeThumbnailUrl(iconUrl) || '';
  const footer = { text: embedFooterElapsed(askT0).substring(0, 2048) };
  if (iconUrl) {
    footer.icon_url = iconUrl;
  }
  const e = {
    color: NT_ASK_ERR_COLOR,
    title: 'Ask error',
    description: String(description).substring(0, 4096),
    footer,
  };
  if (iconUrl) {
    e.author = { name: authorName, icon_url: iconUrl, url: BRAND_URL_FOR_EMBED };
  }
  if (thumb) {
    e.thumbnail = { url: thumb.substring(0, 2048) };
  }
  return e;
}

function makeWarnEmbed(description, askT0, face) {
  face = face || {};
  const iconUrl = face.iconUrl || '';
  const authorName = (face.authorName || 'NT AI').substring(0, 256);
  const thumb = sanitizeThumbnailUrl(face.thumbnailUrl) || sanitizeThumbnailUrl(iconUrl) || '';
  const footer = { text: embedFooterElapsed(askT0).substring(0, 2048) };
  if (iconUrl) {
    footer.icon_url = iconUrl;
  }
  const e = {
    color: NT_ASK_WARN_COLOR,
    title: 'Notice',
    description: String(description).substring(0, 4096),
    footer,
  };
  if (iconUrl) {
    e.author = { name: authorName, icon_url: iconUrl, url: BRAND_URL_FOR_EMBED };
  }
  if (thumb) {
    e.thumbnail = { url: thumb.substring(0, 2048) };
  }
  return e;
}

module.exports = {
  embedFooterElapsed,
  makeAskEmbeds,
  makeErrorEmbed,
  makeWarnEmbed,
};
