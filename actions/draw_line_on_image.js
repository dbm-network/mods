module.exports = {
	name: "Draw Line on Image",
	section: "Image Editing",
  
	subtitle(data, presets) {
	  const storeTypes = presets.variables;
	  return `${storeTypes[parseInt(data.storage, 10)]} (${data.varName})`;
	},
  
	meta: { version: "2.1.7", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },
  
	fields: ["storage", "varName", "x1", "y1", "x2", "y2", "color", "thickness"],
  
	html(isEvent, data) {
	  return `
  <retrieve-from-variable dropdownLabel="Source Image" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
  
  <br><br><br>
  
  <div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
	  <span class="dbminputlabel">X1 Position</span><br>
	  <input id="x1" class="round" type="text" value="0"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
	  <span class="dbminputlabel">Y1 Position</span><br>
	  <input id="y1" class="round" type="text" value="0"><br>
	</div>
  </div>
  
  <br><br><br>
  
  <div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
	  <span class="dbminputlabel">X2 Position</span><br>
	  <input id="x2" class="round" type="text" value="0"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
	  <span class="dbminputlabel">Y2 Position</span><br>
	  <input id="y2" class="round" type="text" value="0"><br>
	</div>
  </div>
  
  <br><br><br>
  
  <div style="padding-top: 8px; width: calc(50% - 12px)">
	<span class="dbminputlabel">Line Color</span><br>
	<input id="color" class="round" type="color" value="#ffffff"><br>
  </div>
  
  <br><br><br>
  
  <div style="padding-top: 8px; width: calc(50% - 12px)">
	<span class="dbminputlabel">Line Thickness (pixels)</span><br>
	<input id="thickness" class="round" type="number" min="1" value="1"><br>
  </div>`;
	},
  
	init() {},
  
	action(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage, 10);
		const varName = this.evalMessage(data.varName, cache);
		const image = this.getVariable(storage, varName, cache);
		if (!image || !image.setPixelColor) {
		  this.callNextAction(cache);
		  return;
		}
		let x1 = parseInt(this.evalMessage(data.x1, cache), 10);
		let y1 = parseInt(this.evalMessage(data.y1, cache), 10);
		let x2 = parseInt(this.evalMessage(data.x2, cache), 10);
		let y2 = parseInt(this.evalMessage(data.y2, cache), 10);
		let color = parseInt(this.evalMessage(data.color, cache).replace('#', '0x'), 16); 
		let thickness = parseInt(this.evalMessage(data.thickness, cache), 10);
	  
		if (thickness < 1) {
		  thickness = 1; 
		}
	  
		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		const sx = (x1 < x2) ? 1 : -1;
		const sy = (y1 < y2) ? 1 : -1;
	  
		if (dx === 0 && dy === 0) {
		  image.setPixelColor(color, x1, y1);
		} else {
		  if (dx >= dy) {
			let err = dx / 2;
			for (let i = 0; i <= dx; i++) {
			  for (let j = -thickness / 2; j <= thickness / 2; j++) {
				image.setPixelColor(color, x1, y1 + j);
			  }
			  if (err > dx) {
				err -= dy;
				x1 += sx;
			  }
			  err += dy;
			  y1 += sy;
			}
		  } else {
			let err = dy / 2;
			for (let i = 0; i <= dy; i++) {
			  for (let j = -thickness / 2; j <= thickness / 2; j++) {
				image.setPixelColor(color, x1 + j, y1);
			  }
			  if (err > dy) {
				err -= dx;
				y1 += sy;
			  }
			  err += dx;
			  x1 += sx;
			}
		  }
		}
	  
		this.callNextAction(cache);
	  },
  
	mod() {}
  };
  