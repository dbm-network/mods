module.exports = {
  name: 'Send Mail',

  section: 'Other Stuff',

  subtitle (data) {
    return `from:"${data.username}" to: "${data.mailto}"`
  },

  fields: ['username', 'password', 'mailto', 'subject', 'type', 'text', 'iffalse', 'iffalseVal', 'hostname', 'portname', 'sec'],

  html (isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <u>Helpful Information</u><br>
    - Html Useful Tutorial: <a href="https://www.w3schools.com/html/">W3schools Html Tutorial</a>.<br>
  </div><br>
  <div style="float: left; width: 50%;">
    SMTP Server:<br>
    <input id="hostname" class="round" type="text">
  </div>
  <div style="float: right; width: 50%;">
    port:<br>
    <input id="portname" class="round" type="text">
  </div>
  <div style="float: right; width: 45%;">
    SSL/TLS, STARTTLS:<br>
    <select id="sec" class="round">
      <option value="yes" selected>yes</option>
      <option value="no">no</option>
    </select>
  </div>
  <div style="float: left; width: 50%;">
    Username:<br>
    <input id="username" class="round" type="text">
  </div>
  <div style="float: left; width: 50%;">
    Password:<br>
    <input id="password" type="password" class="round" type="text">
  </div><br><br><br>
  <div style="float: right; width: 50%;">
    mailto:<br>
    <input id="mailto" class="round" type="text">
  </div><br><br><br>
  <div style="float: left; width: 50%;">
    Subject:<br>
    <input id="subject" class="round" type="text" name="is-eval"><br>
  </div><br><br><br>
  <div style="float: left; width: 60%; padding-top: 10px">
    <select id="type" class:"round">
      <option value="0" selected>Custom Text</option>
      <option value="1">Html Format</option>
    </select>
  </div>
  <div style="float: left; width: 100%;">
    <textarea id="text" rows="9" style="width: 100%;"></textarea>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If Mail Delivery Fails:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump To Anchor</option>
      </select>
    </div><br><br><br>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br>
      <input id="iffalseVal" class="round" type="text">
    </div>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.onChangeFalse = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID'
          document.getElementById('iffalseContainer').style.display = null
          break
      }
    }
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const _this = this
    const data = cache.actions[cache.index]
    const user = this.evalMessage(data.username, cache)
    const pass = this.evalMessage(data.password, cache)
    const mailto = this.evalMessage(data.mailto, cache)
    const subjectvalue = this.evalMessage(data.subject, cache)
    const textvalue = this.evalMessage(data.text, cache)
    const typevalue = parseInt(data.type)
    const host = this.evalMessage(data.hostname, cache)
    const port = this.evalMessage(data.portname, cache)
    const secure = this.evalMessage(data.sec, cache)
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })

    let mailOptions
    switch (typevalue) {
      case 0:
        mailOptions = {
          from: user,
          to: mailto,
          subject: subjectvalue,
          text: textvalue
        }
        break
      case 1:
        mailOptions = {
          from: user,
          to: mailto,
          subject: subjectvalue,
          html: textvalue
        }
        break
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        _this.executeResults(false, data, cache)
      } else {
        console.log(`Email successfully sent to: ${mailto}`)
        _this.callNextAction(cache)
      }
    })
  },

  mod () {}
}
