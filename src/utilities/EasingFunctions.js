export default class EasingFunctions {
	constructor() { }
	static triangular(x) {
		return 1 - Math.abs((x * 2) % (1 * 2) - 1);
	}
	static ease_out_sine(x) {
		return Math.sin(x * 3.14 / 2);
	}

	static ease_in_out_cubic(x) {
		return x < 0.5 ?
			4 * x * x * x :
			1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	static ease_out_cubic(x) {
		return 1 - Math.pow(1 - x, 3);
	}

	static ease_in_out_quint(x) {
		return x < 0.5 ?
			16 * x * x * x * x * x :
			1 - Math.pow(-2 * x + 2, 5) / 2;
	}

	static ease_out_quint(x) {
		return 1 - Math.pow(1 - x, 5);
	}

	static ease_in_out_circ(x) {
		return x < 0.5 ?
			(1 - Math.Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
			(Math.Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
	}

	static ease_out_quad(x) {
		return 1 - (1 - x) * (1 - x);
	}
	static easeInElastic(t) {
		return (0.04 - 0.04 / t) * Math.sin(25.0 * t) + 1.0;
	}

	static heartbeat(t) {
		return 1.0 - Math.pow(Math.abs(Math.sin(t + 1.0)), 63.0) * Math.sign(Math.sin(t)) * Math.sin(t + 1.5 + 1.0) * 0.8;
	}

	static easeInQuad(x) {
		return x * x;
	}

	static easeOutQuad(x) {
		return 1 - (1 - x) * (1 - x);
	}

	static easeInOutQuad(x) {
		return x < 0.5 ?
			2 * x * x :
			1 - Math.pow(-2 * x + 2, 2) / 2;
	}

	static easeInCubic(x) {
		return x * x * x;
	}

	static easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	}

	static easeInOutCubic(x) {
		return x < 0.5 ?
			4 * x * x * x :
			1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	static easeInQuart(x) {
		return x * x * x * x;
	}

	static easeOutQuart(x) {
		return 1 - Math.pow(1 - x, 4);
	}

	static easeInOutQuart(x) {
		return x < 0.5 ?
			8 * x * x * x * x :
			1 - Math.pow(-2 * x + 2, 4) / 2;
	}

	static easeInQuint(x) {
		return x * x * x * x * x;
	}

	static easeOutQuint(x) {
		return 1 - Math.pow(1 - x, 5);
	}

	static easeInOutQuint(x) {
		return x < 0.5 ?
			16 * x * x * x * x * x :
			1 - Math.pow(-2 * x + 2, 5) / 2;
	}

	static easeInSine(x) {
		return 1 - Math.cos(x * 3.1415926 / 2);
	}

	static easeOutSine(x) {
		return Math.sin(x * 3.1415926 / 2);
	}

	static easeInOutSine(x) {
		return -(Math.cos(3.1415926 * x) - 1) / 2;
	}

	static easeInExpo(x) {
		return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
	}

	static easeOutExpo(x) {
		return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
	}

	static easeInOutExpo(x) {
		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
			pow(2, 20 * x - 10) / 2 :
			(2 - Math.pow(2, -20 * x + 10)) / 2;
	}

	static easeInCirc(x) {
		return 1 - Math.sqrt(1 - Math.pow(x, 2));
	}

	static easeOutCirc(x) {
		return Math.sqrt(1 - Math.pow(x - 1, 2));
	}

	static easeInOutCirc(x) {
		return x < 0.5 ?
			(1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
			(Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
	}

	static easeInBack(x) {
		return 2.7015 * x * x * x - 1.7015 * x * x;
	}

	static easeOutBack(x) {
		return 1 + 2.7015 * Math.pow(x - 1, 3) + 1.7015 * Math.pow(x - 1, 2);
	}

	static easeInOutBack(x) {
		return x < 0.5 ?
			(Math.pow(2 * x, 2) * ((2.5949095 + 1) * 2 * x - 2.5949095)) / 2 :
			(Math.pow(2 * x - 2, 2) * ((2.5949095 + 1) * (x * 2 - 2) + 2.5949095) + 2) / 2;
	}

	// static easeInElastic(x) {
	// 	return x === 0 ? 0 : x === 1 ? 1 :
	// 		-Math.pow( 2, 10 * x - 10 ) * Math.sin( ( x * 10 - 10.75 ) * 2.0943950 );
	// }

	static easeOutElastic(x) {
		return x === 0 ? 0 : x === 1 ? 1 :
			Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * 2.0943950) + 1;
	}

	static easeInOutElastic(x) {
		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
			-(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * 1.3962633)) / 2 :
			Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * 1.3962633) / 2 + 1;
	}

	static easeInBounce(x) {
		return 1 - bounceOut(1 - x);
	}

	static easeInOutBounce(x) {
		return x < 0.5 ?
			(1 - bounceOut(1 - 2 * x)) / 2 :
			(1 + bounceOut(2 * x - 1)) / 2;
	}


}
