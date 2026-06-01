# Giveaway System Setup Guide

## Overview

The Giveaway System is a comprehensive giveaway management system for Discord bots using DBM (Discord Bot Maker). It provides both a web dashboard interface and Discord slash commands for managing giveaways.

## Features

- ✅ Web dashboard for creating and managing giveaways
- ✅ Discord slash commands (`/giveaway start`, `/giveaway end`, etc.)
- ✅ Automatic reaction-based entry system
- ✅ Auto-end giveaways when time expires
- ✅ Winner selection and announcement
- ✅ Giveaway templates for quick setup
- ✅ Per-server settings and customization
- ✅ Requirements system (roles, messages, etc.)
- ✅ Extra entries for specific roles
- ✅ Fully backward compatible (dashboard works without giveaway files)

## File Structure

```
nt2/
├── extensions/
│   └── dashboard_EXT/
│       ├── data/
│       │   └── giveaways/              # Created automatically on first use
│       │       ├── giveaways.json      # Active and completed giveaways
│       │       ├── templates.json      # Saved templates
│       │       └── settings.json      # Per-server settings
│       ├── tools/
│       │   ├── giveaway_utils.js        # Core utilities
│       │   ├── giveaway_commands.js    # Slash command handlers
│       │   ├── giveaway_events.js      # Event handlers
│       │   ├── add_giveaway_commands.js # Helper to add commands
│       │   └── add_giveaway_event.js    # Helper to add event
│       └── actions/
│           └── routes/
│               └── giveaways/           # Dashboard routes
└── actions/
    ├── giveaway_create_embed_MOD.js    # DBM action
    ├── giveaway_end_embed_MOD.js       # DBM action
    └── giveaway_slash_command_MOD.js   # DBM action
```

## Setup Instructions

### 1. Automatic Setup (Recommended)

The giveaway system initializes automatically when you:
- Access the `/giveaways` page in the dashboard
- Create your first giveaway via the dashboard
- Use the giveaway slash commands

No manual file creation is required!

### 2. Adding Discord Slash Commands

To enable `/giveaway` slash commands in Discord:

**Option A: Using the helper script**
```bash
cd /home/newstargeted.com/dashboard.newstargeted.com/nt2/extensions/dashboard_EXT/tools
node add_giveaway_commands.js
```

**Option B: Manual addition**
Add the giveaway command structure to `data/commands.json`. The structure is available in `giveaway_commands.js` via `getGiveawaySlashCommand()`.

### 3. Adding Event Handlers

The giveaway event handlers are automatically initialized when the dashboard starts. However, if you want to add a DBM event for custom handling:

**Option A: Using the helper script**
```bash
cd /home/newstargeted.com/dashboard.newstargeted.com/nt2/extensions/dashboard_EXT/tools
node add_giveaway_event.js
```

**Option B: Manual addition**
Add a "Giveaway Handler" event to `data/events.json`. The event will automatically handle reactions and auto-ending.

### 4. Using DBM Actions

The following DBM actions are available in the "Giveaway" section:

- **Giveaway Create Embed MOD**: Creates and posts a giveaway embed message
- **Giveaway End Embed MOD**: Ends a giveaway and selects winners
- **Giveaway Slash Command MOD**: Handles slash command interactions

## Usage

### Dashboard Interface

1. Navigate to `/giveaways` in the dashboard
2. Click "Create Giveaway" to set up a new giveaway
3. Fill in the form (prize, duration, winners, etc.)
4. The giveaway will be posted to Discord automatically
5. Users react with 🎉 to enter

### Discord Commands

- `/giveaway start` - Start a new giveaway
- `/giveaway end <message>` - End a giveaway early
- `/giveaway reroll <message>` - Reroll winners
- `/giveaway list` - List active giveaways
- `/giveaway info <message>` - Get giveaway information

### Templates

1. Go to `/giveaways/templates`
2. Create a template with your preferred settings
3. Use the template when creating new giveaways

### Settings

1. Go to `/giveaways/settings`
2. Configure default values for your server
3. Settings apply to all new giveaways

## Backward Compatibility

**The dashboard will function normally even if:**
- The `extensions/dashboard_EXT/data/giveaways/` folder doesn't exist
- Giveaway files are missing or corrupted
- Giveaway routes fail to load

The system uses lazy initialization and graceful error handling throughout.

## Troubleshooting

### Giveaway system not showing in navigation
- Check if `extensions/dashboard_EXT/data/giveaways/` folder exists (it's created automatically)
- Verify route files are in place
- Check console for errors

### Commands not working
- Ensure commands are added to `commands.json`
- Verify bot has necessary permissions
- Check that event handlers are initialized

### Reactions not registering entries
- Verify event handlers are initialized
- Check bot has permission to read reactions
- Ensure giveaway message ID is stored correctly

## Support

For issues or questions, contact support through the dashboard contact page or Discord support server.

