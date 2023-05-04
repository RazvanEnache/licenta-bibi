function isValidCNP(pin) {
	if (pin.length != 13) {
		return false;
	}
	var nr = pin.split("").reverse().join("");
	var c = nr.substring(0, 1);
	var v = "0";
	var i = 1;
	var sum = 0;
	while (i <= 12) {
		var x = pin.substring(0, 1);
		if (x.charCodeAt(0) >= 48 && x.charCodeAt(0) <= 57) {
			if (v.charCodeAt(0) >= 48 && v.charCodeAt(0) <= 57) {
				v = pin.substring(0, 1);
				switch (i) {
					case 1:
						v = v * 2;
						break;
					case 2:
						v = v * 7;
						break;
					case 3:
						v = v * 9;
						break;
					case 4:
						v = v * 1;
						break;
					case 5:
						v = v * 4;
						break;
					case 6:
						v = v * 6;
						break;
					case 7:
						v = v * 3;
						break;
					case 8:
						v = v * 5;
						break;
					case 9:
						v = v * 8;
						break;
					case 10:
						v = v * 2;
						break;
					case 11:
						v = v * 7;
						break;
					case 12:
						v = v * 9;
						break;
				}
				pin = pin.substring(1, pin.length);
			} else {
				v = 999;
			}
		} else {
			return false;
		}
		i++;
		sum = sum + v;
		v = v.toString();
	}
	var p = sum % 11;
	if (p == 10) {
		p = 1;
	}
	if (p != c) {
		return false;
	} else {
		return true;
	}
}

export { isValidCNP };
