// Enhanced DBM Dashboard JavaScript

class Dashboard {
  constructor() {
    this.init();
  }

  init() {
    this.loadStats();
    this.loadCommands();
    this.setupEventListeners();
  }

  async loadStats() {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (data.success) {
        this.displayStats(data.data);
      }
    } catch (error) {
      this.showError('Failed to load statistics');
    }
  }

  async loadCommands() {
    try {
      const response = await fetch('/api/commands');
      const data = await response.json();

      if (data.success) {
        this.displayCommands(data.data);
      }
    } catch (error) {
      this.showError('Failed to load commands');
    }
  }

  displayStats(stats) {
    const statsContainer = document.getElementById('stats');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Commands</h3>
                <div class="number">${stats.commands.total}</div>
            </div>
            <div class="stat-card">
                <h3>Slash Commands</h3>
                <div class="number">${stats.commands.slash}</div>
            </div>
            <div class="stat-card">
                <h3>Prefix Commands</h3>
                <div class="number">${stats.commands.prefix}</div>
            </div>
            <div class="stat-card">
                <h3>With Cooldown</h3>
                <div class="number">${stats.commands.withCooldown}</div>
            </div>
        `;
  }

  displayCommands(commands) {
    const commandsContainer = document.getElementById('commands');
    if (!commandsContainer) return;

    const commandsHTML = commands
      .map(
        (cmd) => `
            <div class="command-item">
                <div>
                    <div class="command-name">${cmd.name}</div>
                    <div style="color: #b9bbbe; font-size: 0.9em;">${cmd.description}</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    ${cmd.slashCommand ? '<span class="command-type">Slash</span>' : ''}
                    ${cmd.prefixCommand ? '<span class="command-type">Prefix</span>' : ''}
                    <div class="actions">
                        <button class="btn btn-primary" onclick="dashboard.editCommand('${cmd.name}')">Edit</button>
                        <button class="btn btn-danger" onclick="dashboard.deleteCommand('${cmd.name}')">Delete</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join('');

    commandsContainer.innerHTML = commandsHTML;
  }

  setupEventListeners() {
    // Add reload button
    const header = document.querySelector('.header');
    if (header) {
      const reloadBtn = document.createElement('button');
      reloadBtn.className = 'btn btn-success';
      reloadBtn.textContent = 'Reload Commands';
      reloadBtn.onclick = () => this.reloadCommands();
      reloadBtn.style.marginTop = '10px';
      header.appendChild(reloadBtn);
    }
  }

  async reloadCommands() {
    try {
      const response = await fetch('/api/reload', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        this.showSuccess('Commands reloaded successfully!');
        this.loadStats();
        this.loadCommands();
      } else {
        this.showError(`Failed to reload commands: ${data.error}`);
      }
    } catch (error) {
      this.showError(`Failed to reload commands: ${error.message}`);
    }
  }

  editCommand(commandName) {
    alert(`Edit command: ${commandName} (Feature coming soon)`);
  }

  async deleteCommand(commandName) {
    if (confirm(`Are you sure you want to delete command: ${commandName}?`)) {
      try {
        const response = await fetch(`/api/commands/${commandName}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          this.showSuccess('Command deleted successfully!');
          this.loadCommands();
        } else {
          this.showError(`Failed to delete command: ${data.error}`);
        }
      } catch (error) {
        this.showError(`Failed to delete command: ${error.message}`);
      }
    }
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(messageDiv, container.firstChild);
      setTimeout(() => messageDiv.remove(), 5000);
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});
