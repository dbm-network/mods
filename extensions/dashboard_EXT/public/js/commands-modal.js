(function () {
  'use strict';

  const commands = Array.isArray(window.DashboardCommands) ? window.DashboardCommands : [];
  const events = Array.isArray(window.DashboardEvents) ? window.DashboardEvents : [];
  const guildOptions = Array.isArray(window.DashboardGuildOptions) ? window.DashboardGuildOptions : [];
  const csrfToken = window.DashboardCsrfToken || '';

  const searchInput = document.getElementById('commandSearch');
  const typeFilter = document.getElementById('commandTypeFilter');
  const categoryFilter = document.getElementById('commandCategoryFilter');
  const commandRows = Array.from(document.querySelectorAll('.command-row'));
  const commandsEmptyState = document.getElementById('commandsEmptyState');
  const pagination = document.getElementById('commandsPagination');

  const eventSearchInput = document.getElementById('eventSearch');
  const eventCards = Array.from(document.querySelectorAll('.event-card'));
  const eventsEmptyState = document.getElementById('eventsEmptyState');

  const modal = document.getElementById('commandModal');
  const modalTitle = document.getElementById('commandModalTitle');
  const modalSubtitle = document.getElementById('commandModalSubtitle');
  const modalTypeBadge = document.getElementById('commandModalType');
  const modalMeta = document.getElementById('commandModalMeta');
  const modalSteps = document.getElementById('commandModalSteps');
  const modalParameters = document.getElementById('commandModalParameters');
  const modalFootnote = document.getElementById('commandModalFootnote');
  const modalMessages = document.getElementById('commandModalMessages');
  const modalForm = document.getElementById('commandExecuteForm');
  const modalCommandId = document.getElementById('commandModalCommandId');
  const modalCommandKey = document.getElementById('commandModalCommandKey');
  const modalTargetType = document.getElementById('commandModalTargetType');
  const modalGuildGroup = document.getElementById('commandModalGuildGroup');
  const modalGuildSelect = document.getElementById('commandModalGuild');
  const modalChannelGroup = document.getElementById('commandModalChannelGroup');
  const modalUserGroup = document.getElementById('commandModalUserGroup');
  const modalExecuteButton = document.getElementById('commandModalExecute');

  let globalQuery = '';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 15;

  function normalise(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function toggle(element, shouldShow) {
    if (!element) return;
    element.classList.toggle('is-hidden', !shouldShow);
  }

  function updateGuildSelect() {
    if (!modalGuildSelect) return;
    modalGuildSelect.innerHTML = '';
    if (!guildOptions.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No servers available';
      modalGuildSelect.appendChild(option);
      modalGuildSelect.disabled = true;
      modalExecuteButton.disabled = true;
      modalFootnote.textContent =
        'Log in with a Discord account that manages at least one shared server to enable execution.';
    } else {
      guildOptions.forEach(({ id, name }) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        modalGuildSelect.appendChild(option);
      });
      modalGuildSelect.disabled = false;
      modalExecuteButton.disabled = false;
      modalFootnote.textContent = '';
    }
  }

  function showModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function hideModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (modalForm) {
      modalForm.reset();
    }
    modalMessages.textContent = '';
    modalMessages.className = 'command-modal__messages';
  }

  function renderMeta(metaEntries) {
    modalMeta.innerHTML = '';
    metaEntries.forEach(([label, value]) => {
      if (!value && value !== 0) return;
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      modalMeta.appendChild(dt);
      modalMeta.appendChild(dd);
    });
  }

  function renderList(container, items) {
    container.innerHTML = '';
    if (!items || !items.length) {
      toggle(container.closest('.command-modal__section'), false);
      return;
    }
    toggle(container.closest('.command-modal__section'), true);
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function populateCommandModal(command) {
    if (!command) return;
    modalTitle.textContent = command.name;
    modalSubtitle.textContent = command.description || 'No description provided.';
    modalTypeBadge.textContent = command.typeLabel;
    modalTypeBadge.dataset.type = command.typeKey;

    modalCommandId.value = command.id || '';
    modalCommandKey.value = command.key || command.slug || command.name;

    renderMeta([
      ['Command Type', command.typeLabel],
      ['Category', command.category || 'General'],
      ['Restriction', command.restriction],
      ['Permissions', command.permissions || 'None'],
      ['Aliases', (command.aliases || []).join(', ') || 'None'],
    ]);

    renderList(modalSteps, command.actionNames || []);
    renderList(
      modalParameters,
      (command.parameters || []).map(
        (param) =>
          `${param.name || 'Parameter'}${param.required ? ' (required)' : ''} – ${
            param.description || 'No description provided.'
          }`,
      ),
    );

    modalFootnote.textContent = guildOptions.length
      ? 'Command executes using the News Targeted dashboard runner with your selected target.'
      : '';
    updateGuildSelect();
    updateTargetVisibility();
    showModal();
  }

  function populateEventModal(eventData) {
    if (!eventData) return;
    modalTitle.textContent = eventData.name;
    modalSubtitle.textContent = eventData.description || 'Event handler configured in DBM.';
    modalTypeBadge.textContent = 'Event';
    modalTypeBadge.dataset.type = 'event';

    renderMeta([
      ['Trigger', eventData.trigger],
      ['Actions', String(eventData.actions)],
    ]);

    renderList(modalSteps, []);
    renderList(modalParameters, []);

    modalFootnote.textContent =
      'Events cannot be executed manually, but their configuration is visible here for review.';
    modalForm.reset();
    modalExecuteButton.disabled = true;
    modalExecuteButton.classList.add('btn-disabled');
    showModal();
  }

  function updateTargetVisibility() {
    const type = modalTargetType ? modalTargetType.value : 'guild';
    toggle(modalGuildGroup, type !== 'user');
    toggle(modalChannelGroup, type === 'channel');
    toggle(modalUserGroup, type === 'user');
    if (type === 'channel') {
      modalChannelGroup.querySelector('input[name="channelId"]').setAttribute('required', 'required');
      modalUserGroup.querySelector('input[name="userId"]').removeAttribute('required');
    } else if (type === 'user') {
      modalUserGroup.querySelector('input[name="userId"]').setAttribute('required', 'required');
      modalChannelGroup.querySelector('input[name="channelId"]').removeAttribute('required');
    } else {
      modalChannelGroup.querySelector('input[name="channelId"]').removeAttribute('required');
      modalUserGroup.querySelector('input[name="userId"]').removeAttribute('required');
    }
    modalExecuteButton.disabled = modalTypeBadge.dataset.type === 'event' || (!guildOptions.length && type !== 'user');
    modalExecuteButton.classList.toggle('btn-disabled', modalExecuteButton.disabled);
  }

  function createPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    const createButton = (label, page, disabled = false, active = false) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pagination__button';
      if (active) button.classList.add('active');
      if (disabled) {
        button.classList.add('disabled');
        button.disabled = true;
      }
      button.textContent = label;
      button.addEventListener('click', () => {
        if (disabled) return;
        currentPage = page;
        applyCommandFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return button;
    };

    pagination.appendChild(createButton('Prev', Math.max(1, currentPage - 1), currentPage === 1));
    for (let page = 1; page <= totalPages; page += 1) {
      if (totalPages > 7 && page > 5 && page < totalPages) {
        if (!pagination.querySelector('.pagination__ellipsis')) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination__ellipsis';
          ellipsis.textContent = '…';
          pagination.appendChild(ellipsis);
        }
        continue;
      }
      pagination.appendChild(createButton(String(page), page, false, currentPage === page));
    }
    pagination.appendChild(createButton('Next', Math.min(totalPages, currentPage + 1), currentPage === totalPages));
  }

  function applyCommandFilters() {
    const type = typeFilter ? typeFilter.value : 'all';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const filteredRows = commandRows.filter((row) => {
      const matchesType = type === 'all' || row.dataset.commandType === type;
      const matchesCategory = category === 'all' || normalise(row.dataset.commandCategory) === normalise(category);
      const tokens = normalise(row.dataset.commandSearch);
      const matchesSearch = !globalQuery || tokens.includes(globalQuery);
      return matchesType && matchesCategory && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    commandRows.forEach((row) => row.classList.add('is-hidden'));
    filteredRows
      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      .forEach((row) => row.classList.remove('is-hidden'));

    const hasResults = filteredRows.length > 0;
    toggle(commandsEmptyState, !hasResults);
    createPagination(totalPages);
  }

  function applyEventFilters() {
    if (!eventCards.length) return;
    const eventQuery = eventSearchInput ? normalise(eventSearchInput.value) : '';
    let visibleCount = 0;
    eventCards.forEach((card) => {
      const tokens = normalise(card.dataset.eventSearch);
      const matchesGlobal = !globalQuery || tokens.includes(globalQuery);
      const matchesEvent = !eventQuery || tokens.includes(eventQuery);
      const isVisible = matchesGlobal && matchesEvent;
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });
    toggle(eventsEmptyState, visibleCount === 0);
  }

  function attachRowHandlers() {
    commandRows.forEach((row) => {
      row.addEventListener('click', (event) => {
        const button = event.target.closest('.command-open');
        if (!button) return;
        const index = Number(button.dataset.commandIndex || row.dataset.commandIndex);
        const command = commands[index];
        if (!command) return;
        modalExecuteButton.disabled = false;
        modalExecuteButton.classList.remove('btn-disabled');
        populateCommandModal(command);
      });
    });
  }

  function attachEventHandlers() {
    eventCards.forEach((card) => {
      card.addEventListener('click', () => {
        const index = Number(card.dataset.eventIndex);
        const eventData = events[index];
        if (!eventData) return;
        populateEventModal(eventData);
      });
    });
  }

  function handleGlobalSearch(event) {
    globalQuery = normalise(event.target.value);
    currentPage = 1;
    applyCommandFilters();
    applyEventFilters();
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (!modalForm) return;

    const formData = new FormData(modalForm);
    const payload = {
      commandId: formData.get('commandId'),
      commandKey: formData.get('commandKey'),
      targetType: formData.get('targetType'),
      guildId: formData.get('guildId'),
      channelId: formData.get('channelId'),
      userId: formData.get('userId'),
      messageId: formData.get('messageId'),
      payload: formData.get('payload'),
    };

    modalExecuteButton.disabled = true;
    modalExecuteButton.classList.add('btn-disabled');
    modalExecuteButton.querySelector('span').textContent = 'Executing…';
    modalMessages.className = 'command-modal__messages';
    modalMessages.textContent = '';

    fetch('/api/commands/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) {
          const errorMessage = result.error || 'Failed to execute command.';
          throw new Error(errorMessage);
        }
        modalMessages.classList.add('success');
        modalMessages.textContent = result.message || 'Command executed successfully.';
      })
      .catch((error) => {
        modalMessages.classList.add('error');
        modalMessages.textContent = error.message || 'Command execution failed.';
      })
      .finally(() => {
        modalExecuteButton.disabled = false;
        modalExecuteButton.classList.remove('btn-disabled');
        modalExecuteButton.querySelector('span').textContent = 'Execute';
      });
  }

  function initialise() {
    if (!commandRows.length) return;

    updateGuildSelect();
    applyCommandFilters();
    applyEventFilters();
    attachRowHandlers();
    attachEventHandlers();

    searchInput?.addEventListener('input', handleGlobalSearch);
    typeFilter?.addEventListener('change', () => {
      currentPage = 1;
      applyCommandFilters();
    });
    categoryFilter?.addEventListener('change', () => {
      currentPage = 1;
      applyCommandFilters();
    });
    eventSearchInput?.addEventListener('input', () => {
      applyEventFilters();
    });
    modalTargetType?.addEventListener('change', updateTargetVisibility);

    document.querySelectorAll('[data-command-modal-close]').forEach((trigger) => {
      trigger.addEventListener('click', hideModal);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideModal();
    });
    modalForm?.addEventListener('submit', handleFormSubmit);
  }

  document.addEventListener('DOMContentLoaded', initialise);
})();
