module.exports = {
  name: 'Control Permissions',
  section: 'Permission Control',

  subtitle (data) {
    const variables = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Control ${variables[parseInt(data.storage)]} (${data.varName})`
  },

  variableStorage (data, varType) {
    const info = parseInt(data.targetType)
    const type = parseInt(data.storage)
    if (type !== varType) return
    let dataType
    switch (info) {
      case 0:
        dataType = 'Role Permissions'
        break
      case 1:
        dataType = 'Category Channel Permissions'
        break
      case 2:
        dataType = 'Text Channel Permissions'
        break
      case 3:
        dataType = 'Voice Channel Permissions'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['storage', 'varName', 'ADMINISTRATOR', 'CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHT', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS'],

  html (isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Permissions:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select><br>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div id="checkbox" style="float: left; width: 80%;">
    </div>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    const checkbox = document.getElementById('checkbox')

    const permissionsName = {
      ADMINISTRATOR: 'Administrator', CREATE_INSTANT_INVITE: 'Create Invite', KICK_MEMBERS: 'Kick Members', BAN_MEMBERS: 'Ban Members', MANAGE_CHANNELS: 'Manage Channels', MANAGE_GUILD: 'Manage Server', ADD_REACTIONS: 'Add Reactions', VIEW_AUDIT_LOG: 'View Audit Log', PRIORITY_SPEAKER: 'Priority Speaker', STREAM: 'Video', VIEW_CHANNEL: 'View Channel', SEND_MESSAGES: 'Send Messages', SEND_TTS_MESSAGES: 'Send TTS Messages', MANAGE_MESSAGES: 'Manage Messages', EMBED_LINKS: 'Embed Links', ATTACH_FILES: 'Attach Files', READ_MESSAGE_HISTORY: 'Read Mesage History', MENTION_EVERYONE: 'Mention Everyone', USE_EXTERNAL_EMOJIS: 'Use External Emojis', CONNECT: 'Connect', SPEAK: 'Speak', MUTE_MEMBERS: 'Mute Members', DEAFEN_MEMBERS: 'Deafen Members', MOVE_MEMBERS: 'Move Members', USE_VAD: 'User Voice Activity', CHANGE_NICKNAME: 'Change Nickname', MANAGE_NICKNAMES: 'Manage Nicknames', MANAGE_ROLES: 'Manage Roles', MANAGE_WEBHOOKS: 'Manage Webhooks', MANAGE_EMOJIS: 'Manage Emojis'
    }
    const options = ['Keep', 'Inherit', 'Allow', 'Disallow']
    const options2 = ['Keep', 'Allow', 'Disallow']
    const allPermissions = ['ADMINISTRATOR', 'VIEW_AUDIT_LOG', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'KICK_MEMBERS', 'BAN_MEMBERS', 'CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_EMOJIS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER']
    const rolePermissions = ['ADMINISTRATOR', 'VIEW_AUDIT_LOG', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'KICK_MEMBERS', 'BAN_MEMBERS', 'CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_EMOJIS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER']
    const categoryPermissions = ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER']
    const textPermissions = ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS']
    const voicePermissions = ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'MANAGE_WEBHOOKS', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER']
    const permissionsList = {
      'All Permissions': allPermissions, 'Role Permissions': rolePermissions, 'Category Channel Permissions': categoryPermissions, 'Text Channel Permissions': textPermissions, 'Voice Channel Permissions': voicePermissions
    }

    const varName = document.getElementById('varName')
    const list = document.getElementById('variableList')

    varName.oninput = function () {
      if (list.children.length === 0) return
      let dataType
      for (let i = 0; i < list.children.length; i++) {
        if (varName.value && list.children[i].value === varName.value) {
          dataType = list.children[i].innerHTML
          break
        }
      }
      if (!dataType) dataType = 'All Permissions'
      checkbox.innerHTML = ''
      permissionsList[dataType].forEach((Permission) => {
        const dom = document.createElement('select')
        checkbox.innerHTML += `${permissionsName[Permission]}:<br>`
        dom.id = Permission
        dom.className = 'round'
        let option = options
        if (dataType === 'Role Permissions') option = options2
        option.forEach((option) => {
          const op = document.createElement('option')
          op.innerHTML = option
          op.value = option
          dom.add(op)
        })
        checkbox.appendChild(dom)
        checkbox.innerHTML += '<br>'
      })
    }

    let dataType
    if (list.children.length !== 0) {
      for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].value === varName.value) {
          dataType = list.children[i].innerHTML
          break
        }
      }
    }
    if (!dataType) dataType = 'All Permissions'
    checkbox.innerHTML = ''
    permissionsList[dataType].forEach((Permission) => {
      const dom = document.createElement('select')
      checkbox.innerHTML += `${permissionsName[Permission]}:<br>`
      dom.id = Permission
      dom.className = 'round'
      options.forEach((option) => {
        const op = document.createElement('option')
        op.innerHTML = option
        op.value = option
        dom.add(op)
      })
      checkbox.appendChild(dom)
      checkbox.innerHTML += '<br>'
    })

    glob.refreshVariableList(document.getElementById('storage'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const { Permissions } = this.getDBM().DiscordJS
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    let permissions = this.getVariable(storage, varName, cache)
    if (permissions.bitfield) {
      const temp = permissions
      permissions = { allow: temp }
    }
    const permsArray = ['ADMINISTRATOR', 'CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']

    permsArray.forEach((perms) => {
      if (data[perms] === 'Allow') {
        if (!permissions.allow || !permissions.allow.has(perms)) {
          if (!permissions.allow) permissions.allow = new Permissions()
          permissions.allow.add(perms)
        }
        if (permissions.disallow && permissions.disallow.has(perms)) permissions.disallow.remove(perms)
        if (permissions.inherit && permissions.inherit.includes(perms)) permissions.inherit.splice(permissions.inherit.indexOf(perms), 1)
      } else if (data[perms] === 'Disallow') {
        if (!permissions.disallow || !permissions.disallow.has(perms)) {
          if (!permissions.disallow) permissions.disallow = new Permissions()
          permissions.disallow.add(perms)
        }
        if (permissions.allow && permissions.allow.has(perms)) permissions.allow.remove(perms)
        if (permissions.inherit && permissions.inherit.includes(perms)) permissions.inherit.splice(permissions.inherit.indexOf(perms), 1)
      } else if (data[perms] === 'Inherit') {
        if (!permissions.inherit || !permissions.inherit.has(perms)) {
          if (!permissions.inherit) permissions.inherit = []
          permissions.inherit.push(perms)
        }
        if (permissions.disallow.has(perms)) permissions.disallow.remove(perms)
        if (permissions.allow.has(perms)) permissions.allow.remove(perms)
      }
    })
    this.storeValue(permissions, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}
