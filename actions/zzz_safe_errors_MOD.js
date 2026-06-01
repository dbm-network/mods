// Patches DBM error handling to avoid noisy, non-actionable errors
// that commonly happen with DMs and member chunk fetching.

const customaction = {};

customaction.name = 'zzz_safe_errors';
customaction.section = 'System';
customaction.author = 'master3395';
customaction.version = '1.0.0';
customaction.short_description = 'Ignores common DM and member fetch timeouts safely.';

customaction.html = function () {
  return `
<div style="width: 520px;">
  <p>
    Safe Errors Mod is active.
  </p>
  <p>
    It suppresses a few common Discord errors that are usually expected:
  </p>
  <ul>
    <li>DM failures when the user cannot be messaged</li>
    <li>Member list fetch timeouts (large guilds, missing intents)</li>
  </ul>
</div>`;
};

customaction.mod = function (DBM) {
  const Actions = DBM?.Actions;
  if (!Actions?.displayError || !Actions?.callNextAction) return;

  const oldDisplayError = Actions.displayError.bind(Actions);

  Actions.displayError = function (data, cache, err) {
    const actionName = data?.name ?? cache?.actions?.[cache?.index]?.name ?? null;
    const errCode = err?.code ?? null;

    const isActionsCache =
      cache &&
      typeof cache.index === 'number' &&
      Array.isArray(cache.actions) &&
      cache.index >= 0 &&
      cache.index < cache.actions.length;

    const isIgnorableDmSend = actionName === 'Send Message' && (errCode === 50007 || errCode === 50278);

    const isGuildMembersTimeout =
      errCode === 'GuildMembersTimeout' ||
      errCode === 'GuildMembersTimeoutError' ||
      errCode === 'GUILD_MEMBERS_TIMEOUT';

    if (isActionsCache && (isIgnorableDmSend || isGuildMembersTimeout)) {
      if (isIgnorableDmSend) {
        console.warn(`[Send Message] Skipped send due to DM restriction (code: ${String(errCode)}).`);
      } else {
        console.warn(`[${actionName ?? 'Action'}] Member fetch timed out, continuing (code: ${String(errCode)}).`);
      }
      Actions.callNextAction(cache);
      return;
    }

    return oldDisplayError(data, cache, err);
  };
};

module.exports = customaction;
