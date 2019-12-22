class Color {
	/**
	 * @param {array} rgb - An rgb array
	 */
	constructor(rgb) {
		this.r = Number(rgb[0]); this.g = Number(rgb[1]); this.b = Number(rgb[2]);
		this.rgb = `rgb(${this.r}, ${this.g}, ${this.b})`;
		let hsl = Color.rgbToHsl(rgb, false);
		this.h = hsl[0]; this.s = hsl[1]; this.l = hsl[2];
		this.hsl = `hsl(${hsl.join(", ")})`;
		this.hex = Color.rgbToHex(rgb);
	}
	/**Return the hexadecimal color equivalent for the rgb value or array.
	 * @param rgb - The rgb value or array to convert to hexadecimal.
	 * @param str - An optional boolean value, true by default. If it is false, an array of hex values will be returned instead of a hex string.
	 */
	static rgbToHex(rgb, str) {
		if (typeof rgb !== "object")
			rgb = rgb.substring(4, rgb.length-1).split(", ");
		rgb = rgb.map((str) => {let result = Number(str).toString(16); return result.length == 1 ? "0"+result : result});
		return (str !== false) ? "#" + rgb.join("") : rgb;
	}
	/**Return the rgb equivalent for the hexadecimal color value or array.
	 * @param hex - The hexadecimal color value or array to convert to rgb.
	 * @param str - An optional boolean value, true by default. If it is false, an array of rgb values will be returned instead of an rgb string.
	 */
	static hexToRgb(hex, str) {
		if (typeof hex !== "object") {
			if (hex.substr(0, 1) == "#") hex = hex.substr(1);
			if (hex.length == 1) hex = (() => {
				let result = hex;
				for (let i = 0; i < 5; ++i)
					result += hex;
				return result})();
			if (hex.length == 3) hex = (() => {
				let result = "";
				for (let i = 0; i < 3; ++i)
					result += hex.charAt(i) + hex.charAt(i);
				return result})();
			hex = [hex.substr(0, 2), hex.substr(2, 2), hex.substr(4)];
		}
		hex = hex.map((x) => {
			let rgb = 0;
			for (let i = 0; i < 2; ++i) {
				let v = String(x).charAt(i).toLowerCase();
			rgb += (isNaN(v) ? 10 + "abcdef".indexOf(v) : Number(v))*16**(1-i);
			}
			return rgb;
		});
		return (str !== false) ? `rgb(${hex.join(", ")})` : hex;
	}
	/**Return the rgb equivalent for the hsl value or array.
	 * @param hsl - The hsl value or array to convert to rgb.
	 * @param str - An optional boolean value, true by default. If it is false, an array of rgb values will be returned instead of an rgb string.
	 */
	static hslToRgb(hsl, str) {
		if (typeof hsl !== "object") {
			hsl = hsl.substring(4, hsl.length-1).split(", ");
		}
		hsl = hsl.map((val) => {return Number(isNaN(val) && val.substr(val.length-1, 1) == "%" ? val.substr(0, val.length-1) : val)/100});
		let rgb = [0, 0, 0];
		if (hsl[1] == 0) {
			rgb[0] = Math.round(hsl[2]*255); rgb[1] = rgb[0]; rgb[2] = rgb[0];
		} else {
			let temp1 = (hsl[2] < 0.5) ? hsl[2]*(1+hsl[1]) : (hsl[2]+hsl[1])-(hsl[2]*hsl[1]);
			let temp2 = (2 * hsl[2]) - temp1;
			hsl[0] = (hsl[0]*100)/360;
			rgb[0] = hsl[0] + (1/3); rgb[1] = hsl[0]; rgb[2] = hsl[0] - (1/3);

			rgb = rgb.map((val) => {
				val = ((val < 0) ? val + 1 : val) % 1;
				if (6*val < 1) val = temp2 + (temp1 - temp2) * 6 * val;
				else if (2 * val < 1) val = temp1;
				else if (3 * val < 2) val = temp2 + (temp1 - temp2) * 6 * ((2/3) - val);
				else val = temp2;
				return Math.round(val*255);
			});
		}
		return (str !== false) ? `rgb(${rgb.join(", ")})` : rgb;
	}
	/**Return the hsl equivalent for the rgb value or array.
	 * @param rgb - The rgb value or array to convert to hsl.
	 * @param str - An optional boolean value, true by default. If it is false, an array of hsl values will be returned instead of an hsl string.
	 */
	static rgbToHsl(rgb, str) {
		if (typeof rgb !== "object") {
			rgb = rgb.substring(4, rgb.length-1).split(", ");
		}
		rgb = rgb.map((val) => {return val/255});
		let h, s, l;
		let min = Math.min(rgb[0], rgb[1], rgb[2]), max = Math.max(rgb[0], rgb[1], rgb[2]);
		let luminace = (min + max)/2;
		l = Math.round(luminace*100);
		if (min == max) {
			s = 0; h = 0;
		} else {
			s = Math.round(((luminace < 0.5) ? (max - min)/(max + min) : (max - min)/(2 - (max + min)))*100);
			if (rgb[0] == max) h = (rgb[1] - rgb[2])/(max - min);
			else if (rgb[1] == max) h = 2 + (rgb[2] - rgb[0])/(max - min);
			else h = 4 + (rgb[0] - rgb[1])/(max - min);
		}
		h = Math.round((h < 0) ? (h * 60) + 360 : (h * 60));
		return (str !== false) ? `hsl(${h}, ${s}%, ${l}%)` : [h, s, l];
	}
	/**Return the hexadecimal equivalent for the hsl value or array.
	 * @param hex - The hexadecimal value or array to convert to hsl.
	 * @param str - An optional boolean value, true by default. If it is false, an array of hex values will be returned instead of hex string.
	 */
	hexToHsl(hex, str) {
		return Color.rgbToHsl(Color.hexToRgb(hex), str);
	}
	/**Return the hsl equivalent for the hexadecimal color value or array.
	 * @param hsl - The hsl value or array to convert to hexadecimal.
	 * @param str - An optional boolean value, true by default. If it is false, an array of hsl values will be returned instead of an hsl string.
	 */
	hslToHex(hsl, str) {
		return Color.rgbToHex(Color.hslToRgb(hsl), str);
	}
}

// ------------------------------------------- Variables ------------------------------------------
const options = document.querySelector("#options").children;
const guessBoxEl = document.querySelector("#guess-box");
const timerEl = document.querySelector("#timer");
const counterEl = document.querySelector("#counter");
const rightEl = document.querySelector("#right"), wrongEl = document.querySelector("#wrong");
var right, wrong;
var color, guess, given, ansPos, mode, questions;
var timer, time, initialTime;
var counter = [0, 0];
/**Difficulty Range */
var difRange;
/**The highest difficulty level present in the html */
const maxDif  = (() => {
	let max, temp = document.forms.difficulty.difficulty.values();
	for (let i of temp) max = i.value;
	return Number(max);
})();

// ------------------------------------------- Functions ------------------------------------------

function onAnswer(event) {
	if (event.target.getAttribute("position") == ansPos) {
		++right;
	} else {
		++wrong;
		event.target.classList.add("wrong");
	}
	document.querySelector(`[position="${ansPos}"]`).classList.add("right");
	updateScore();
	++counter[0];
	updateCounter(counter);
	for (let i of options) {
		i.disabled = true;
		if (guess != "color")
			i.style["background"] = i.innerHTML;
		else guessBoxEl.style["background"] = guessBoxEl.innerHTML;
	}
	setTimeout(() => {
		for (let i of options) {
			if (guess != "color")
				i.removeAttribute("style");
			else guessBoxEl.removeAttribute("style");
			i.classList.remove("wrong");
			i.classList.remove("right");
			i.disabled = false;
		}
		if (counter[0] != counter[1])
			nextQuestion(guess, given);
		else {
			let alertMsg = (mode == "timed") ? `It took you ${time[0]}m ${time[1]}.${Math.floor(time[2]/10)}s to answer` : "You answered";
			alert(`GAME OVER!\n${alertMsg} ${questions} questions, out of which you got:\n${right} right\n${wrong} wrong`);
			setTimeout(resetGame, 50);
		}
	}, 300);
}

function formatS(s, char, length) {
	s = String(s); char = String(char);
	if (s.length < length) for (let i=0; i<=(length-s.length); ++i, s=char+s) {}
	return s;
}

function setTime(t) {
	timerEl.innerHTML = formatS(t[0], 0, 2) + ":" + formatS(t[1], 0, 2) + ":" + formatS(t[2], 0, 2);
}

function updateCounter(c) {
	counterEl.innerHTML = formatS(c[0]) + " / " + formatS(c[1]);
}

function updateScore() {
	rightEl.innerHTML = right;
	wrongEl.innerHTML = wrong;
}

function resetGame() {
	guess = document.forms.guesses.guess.value;
	given = document.forms.givens.given.value;
	mode = document.forms.modes.gameMode.value;
	questions = document.forms.numQuestions.questions.value;
	guessBoxEl.removeAttribute("style");
	guessBoxEl.innerHTML = "";
	timerEl.classList.add("hidden");
	timerEl.innerHTML = "";
	clearInterval(timer);
	counter[0] = 0;
	if (mode == "speed") {
		let mins = Number(document.forms.time.minutes.value), secs = Number(document.forms.time.seconds.value);
		if (mins === 0 && secs === 0) mins = 1;
		time = [mins, secs, 0];
		initialTime = [mins, secs];
		counter[1] = " ∞";
	}
	else if (mode == "timed") {
		time = [0, 0, 0];
		counter[1] = questions;
	}
	else if (mode == "zen") {
		counter[1] = questions;
	}
	else {
		counter[1] = " ∞";
	}
	updateCounter(counter);
	document.querySelector("#start").classList.remove("hidden");
	right = 0; wrong = 0;
	updateScore();
	difRange = (1 + maxDif - document.forms.difficulty.difficulty.value) * Math.round(255/maxDif);
	for (let i of options) {
		i.disabled = true;
		i.removeAttribute("style");
		i.innerHTML = "";
	}
}

function speedTimer() {
	--time[2];
	if (time[2] == -1) {
		time[2] = 99;
		--time[1];
	}
	if (time[1] == -1) {
		time[1] = 59;
		--time[0];
	}
	if (time[0] == -1) {
		alert(`GAME OVER!\nIn ${initialTime[0]}m ${initialTime[1]}s you answered ${counter[0]} questions, out of which you got:\n${right} right\n${wrong} wrong`);
		clearInterval(timer);
		setTimeout(resetGame, 50);
	}
	setTime(time);
}

function timedTimer() {
	++time[2];
	if (time[2] == 100) {
		time[2] = 0;
		++time[1];
	}
	if (time[1] == 60) {
		time[1] = 0;
		++time[0];
	}
	setTime(time);
}

function startGame() {
	document.querySelector("#start").classList.add("hidden");
	timerEl.classList.remove("hidden");
	switch (mode) {
		case "speed":
			timer = setInterval(speedTimer, 10);
			setTime(time);
			break;
		case "timed":
			timer = setInterval(timedTimer, 10);
			setTime(time);
			break;
	}
	for (let i of options) {
		i.disabled = false;
	}
	nextQuestion(guess, given);
}

/**Generate a random rgb value array */
function genVal() {
	let val = [];
	for (let i = 0; i < 3; ++i) val.push(Math.round(Math.random() * 255));
	return val;
}
/**Generate an option based on a value in a range determined by the difficulty */
function genOption(val) {
	let result, option = [];
	for (let i of val) {
		if (Math.floor(Math.random()*2) == 0) {
			result = i - Math.round(difRange/2) + Math.round(((difRange/2)*0.9)*Math.random());
		}
		else {
			result = i + Math.round((difRange/2)*0.1) + Math.round(((difRange/2)*0.9)*Math.random());
		}
		option.push((result < 0 ? result+255 : result) % 255);
	}
	return option;
}

// closure for variables?
function nextQuestion(guess, given) {
	let val = genVal();
	color = new Color(val);
	ansPos = Math.ceil(Math.random()*9);
	if (given == "hex") guessBoxEl.innerHTML = color.hex.toUpperCase();
	else if (given == "rgb") guessBoxEl.innerHTML = color.rgb;
	else if (given == "hsl") guessBoxEl.innerHTML = color.hsl;
	else if (given == "color") {
		guessBoxEl.innerHTML = "";
		guessBoxEl.style["background"] = color.rgb;
	}
	for (let i = 0; i < 9; ++i) {
		options[i].removeAttribute("style");
		options[i].innerHTML = "";
		if (guess != "color") {
			options[i].innerHTML = (i+1 != ansPos ? new Color(genOption(val))[guess] : color[guess]).toUpperCase();
		} else {
			options[i].style["background"] = i+1 != ansPos ? new Color(genOption(val)).hex : color.hex;
		}
	}
}

document.querySelector("#start").addEventListener("click", () => {
	resetGame()
	startGame();
});

for (let i of options) {
	i.addEventListener("click", onAnswer);
}

// ---------------------------------------- Settings Button ---------------------------------------
document.querySelector("#logo").addEventListener("click", () => {
	document.querySelector("#settings").setAttribute("open", !document.querySelector("#logo-check").checked);
	document.querySelector("#start").disabled = !document.querySelector("#logo-check").checked;
	resetGame();
});

resetGame()