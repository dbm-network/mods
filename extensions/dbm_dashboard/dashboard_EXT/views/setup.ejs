<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>DBM Dashboard Setup</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <meta name="theme-color" content="#7289DA" />
  <meta name="description" content="">
  <script src="http://code.jquery.com/jquery-3.5.0.js" integrity="sha256-r/AaFHrszJtwpe+tHyNi/XCfMxYpbsRg2Uqn0x3s2zc=" crossorigin="anonymous"></script>
</head>

<body>
  <style>
    .container1 {
      padding-left: 250px;
      margin-top: 50px;
      width: 75%;
    }
  </style>
  <div class="container1">
    <form action="/setup" method="POST">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="">Is Bot Sharded:</label>
          <select class="form-control" name="isBotSharded" id="">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="">Are you hosting on Glitch:</label>
          <select class="form-control" name="isGlitch" id="">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="">clientSecret:</label>
          <input type="text" class="form-control" name="clientSecret" value="<%= config.clientSecret %>" required>
        </div>
        <div class="form-group col-md-6">
          <label for="">callbackURL:</label>
          <input type="text" class="form-control" name="callbackURL" value="<%= config.callbackURL %>" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="">Owners:</label>
          <input type="text" class="form-control" name="owner" value="<%= config.owner %>" required>
        </div>
        <div class="form-group col-md-6">
          <label for="">Support Server Invite:</label>
          <input type="text" class="form-control" name="supportServer" value="<%= config.supportServer %>" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="">Intro Text:</label>
          <textarea class="form-control" name="introText" cols="30" rows="4"><%= config.introText %></textarea>
        </div>
        <div class="form-group col-md-6">
          <label for="">Footer Text:</label>
          <textarea class="form-control" name="footerText" cols="30" rows="4"><%= config.footerText %></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <div class="feature" id="navLinkDiv">
            <label for="">Navigation Links:</label>
          </div>
          <hr>
          <a href="#" onclick="addNavLink()">Add New Feature</a>
        </div>
        <div class="form-group col-md-6">
          <div class="feature">
            <label for="">Feature 1:</label>
            <input type="text" class="form-control" placeholder="Auto Role" required><br>
            <textarea class="form-control" name="" id="" cols="30" rows="4"></textarea>
            <hr>
          </div>
          <a href="">Add New Feature</a>
        </div>
      </div>
      <button class="btn btn-primary">Save Changes</button>
    </form>
  </div>
  <script>
    let linkL = 0;
    const features = [{
        "name": "Feature One",
        "description": "You can <b>replace</b> this text with whatever you want. After you do that this will automatically show up on your website!"
    }, {
        "name": "Feature One",
        "description": "You can replace this text with whatever you want. After you do that this will automatically show up on your website!"
    }];

    const navItems = <%= config.navItems %>

    for (let i = 0; i < navItems.length; i++) {
      const html = `
      <div class="form-row" id="navGroup-${i}">
        <div class="form-group col-md-6">
          <input type="text" class="form-control navLink" id="navLinkName-${i}" value="${navItems[i].name}" name="navLinkName-${i}" required>
          <a href="#" onclick="deleteOption('navGroup-${i}')">Delete</a>
        </div>
        <div class="form-group col-md-6">
          <input type="text" class="form-control" id="navLinkLink-${i}" value="${navItems[i].link}" name="navLinkLink-${i}" required><br>
        </div>
      </div>
      `
      linkL = linkL + 1;
      $("#navLinkDiv").append(html)
    }

    function addNavLink() {
      const html = `
      <div class="form-row" id="navGroup-${linkL + 1}">
        <div class="form-group col-md-6">
          <input type="text" class="form-control navLink" placeholder="Google" name="navLinkName-${linkL + 1}" required>
          <a href="#" onclick="deleteOption('navGroup-${linkL + 1}')">Delete</a>
        </div>
        <div class="form-group col-md-6">
          <input type="text" class="form-control" placeholder="https://google.com" name="navLinkLink-${linkL + 1}" required><br>
        </div>
      </div>
      `
      linkL = linkL + 1;
      $("#navLinkDiv").append(html)
    }

    function deleteOption(groupID) {
      $("#" + groupID).remove();
    }
  </script>
</body>

</html>