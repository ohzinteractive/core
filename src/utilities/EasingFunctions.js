export default class EasingFunctions
{
	constructor(){}

	static ease_out_sine(x) {
		return Math.sin(x * 3.14 / 2);
	}

	static ease_in_out_cubic(x) {
		return x < 0.5 ?
			4 * x * x * x :
			1 - Math.pow(-2 * x + 2, 3) / 2;
	}

	static ease_out_cubic (x) {
		return 1 - Math.pow(1 - x, 3);
	}

	static ease_in_out_quint (x) {
		return x < 0.5 ?
			16 * x * x * x * x * x :
			1 - Math.pow(-2 * x + 2, 5) / 2;
	}

	static ease_out_quint (x) {
		return 1 - Math.pow(1 - x, 5);
	}

	static ease_in_out_circ (x) {
		return x < 0.5 ?
			(1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
			(Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
	}

	static ease_out_quad (x) {
		return 1 - (1 - x) * (1 - x);
	}

}