'use strict';

const { NT_ASK_MENTIONS, NT_EMBEDS_PER_MESSAGE } = require('./constants');

/**
 * @param {import('discord.js').Interaction} interaction
 * @param {object[]} embeds
 * @param {{ ephemeral?: boolean }} [opts] - ephemeral follow-ups; initial reply uses ephemeral when not yet deferred
 */
function ntAiReplySlash(interaction, embeds, opts) {
  const batch = (embeds || []).slice(0, NT_EMBEDS_PER_MESSAGE);
  if (!batch.length) {
    return Promise.resolve();
  }
  if (!interaction || typeof interaction.reply !== 'function') {
    return Promise.resolve();
  }
  const ephemeral = Boolean(opts && opts.ephemeral);
  const payload = { embeds: batch, allowedMentions: NT_ASK_MENTIONS, content: null };
  if (ephemeral) {
    payload.ephemeral = true;
  }
  if (!interaction.deferred && !interaction.replied) {
    return interaction.reply(payload).catch(function () {});
  }
  if (interaction.deferred && !interaction.replied) {
    const editPayload = { embeds: batch, allowedMentions: NT_ASK_MENTIONS, content: null };
    return interaction.editReply(editPayload).catch(function () {
      const fu = { embeds: batch, allowedMentions: NT_ASK_MENTIONS };
      if (ephemeral) {
        fu.ephemeral = true;
      }
      return interaction.followUp(fu).catch(function () {});
    });
  }
  const fu2 = { embeds: batch, allowedMentions: NT_ASK_MENTIONS };
  if (ephemeral) {
    fu2.ephemeral = true;
  }
  return interaction.followUp(fu2).catch(function () {});
}

function ntAiFollowUpSlash(interaction, embeds, opts) {
  const batch = (embeds || []).slice(0, NT_EMBEDS_PER_MESSAGE);
  if (!batch.length) {
    return Promise.resolve();
  }
  const ephemeral = Boolean(opts && opts.ephemeral);
  const fu = { embeds: batch, allowedMentions: NT_ASK_MENTIONS };
  if (ephemeral) {
    fu.ephemeral = true;
  }
  return interaction.followUp(fu).catch(function () {});
}

function sendInteractionEmbedsChained(interaction, allEmbeds, resolve, opts) {
  const list = allEmbeds || [];
  if (!list.length) {
    resolve();
    return;
  }
  ntAiReplySlash(interaction, list.slice(0, NT_EMBEDS_PER_MESSAGE), opts).then(function () {
    let rest = list.slice(NT_EMBEDS_PER_MESSAGE);
    let p = Promise.resolve();
    while (rest.length) {
      const chunk = rest.slice(0, NT_EMBEDS_PER_MESSAGE);
      rest = rest.slice(NT_EMBEDS_PER_MESSAGE);
      p = p.then(
        (function (batch) {
          return function () {
            return ntAiFollowUpSlash(interaction, batch, opts);
          };
        })(chunk),
      );
    }
    p.then(function () {
      resolve();
    });
  });
}

module.exports = {
  ntAiReplySlash,
  ntAiFollowUpSlash,
  sendInteractionEmbedsChained,
};
