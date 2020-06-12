import Screen from '/Screen';
import Configuration from '/Configuration';
import Time from '/Time';
import KeyboardInput from '/KeyboardInput';

class Input {
	constructor() {
		this.mouse_pos = new THREE.Vector2();
		this.last_mouse_pos = new THREE.Vector2();
		this.mouse_dir = new THREE.Vector2();


		this.__clicked_time = 0;
		this.__elapsed_time = 0;
		this.__delta_time = 0;

		this.is_mouse_down = false;
		this.is_mouse_up = false;

		this.rotation_angle = 0;

		this._normalized_mouse_pos = new THREE.Vector2(0, 0);

		this.left_mouse_button_down = false;
		this.left_mouse_button_pressed = false;
		this.left_mouse_button_released = false;
		this.middle_mouse_button_down = false;
		this.right_mouse_button_down = false;
		this.right_mouse_button_pressed = false;
		this.right_mouse_button_released = false;

		this.mousewheel = 0;

		this.previous_scale = 0;
		this.previous_rotation = 0;
		this.previous_rotation_dirty = true;

		this.mouse_str = "mouse";

		this.tmp_mouse_velocity = new THREE.Vector2();
		this.bounding_client = new THREE.Vector2();

		this.multitouch_active = false;

		this.tapped = false;
		this.initial_zoom_distance = 100;
		this.zoom_center = new THREE.Vector2();
		this.zoom_started = false;
		this.touch_zoom = 1;

		this.multi_touch_dir = new THREE.Vector2();
		this.wheel_delta = 0;

		this.mac = 'mac';
		this.pinching_with_trackpad = false;
		this.scrolling_with_trackpad = false;
		this.scrolling_with_mouse = false;

		this.double_click = false;

		this.canvas = undefined;

		// Input 2.0
		this.previous_pos_x = 0;
		this.previous_pos_y = 0;
	}

	mouse_is_within_bounds(rect) {
		rect = rect || this.canvas.getBoundingClientRect();

		return this.mouse_pos.x > rect.left &&
			this.mouse_pos.x < rect.left + rect.width &&
			this.mouse_pos.y > rect.top &&
			this.mouse_pos.y < rect.top + rect.height;
	}

	init(container, canvas) {
		this.canvas = canvas;

		let region = new ZingTouch.Region(container, false, false);
		KeyboardInput.init();

		let scope = this;

		region.bind(container, 'tap', function (e) {
			scope.tapped = true;
			scope.set_mouse_pos(e);

		});

		window.addEventListener('dblclick', this.on_double_click.bind(this));

		container.addEventListener('mouseleave', this.on_focus_lost.bind(this));

		container.addEventListener('mouseup', this.on_mouse_up.bind(this));
		container.addEventListener('mousemove', this.on_mouse_move.bind(this));

		container.addEventListener('touchmove', this.on_touch_move.bind(this), false);
		container.addEventListener('touchend', this.on_touch_end.bind(this), false);

		// region.bind(container, 'pan', function(e){
		// 	scope.on_mouse_move(e);
		// 	console.log("PAN");
		// });
		let one_finger_pan = new ZingTouch.Pan({ numInputs: 1 });
		region.register("one_finger_pan", one_finger_pan);
		region.bind(container, "one_finger_pan", (event) => {
			if (event.detail.data.length > 0) {
				// scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
				// scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
				// scope.on_mouse_move_zingtouch(event);
			}

		})
		let two_fingers_pan = new ZingTouch.Pan({ numInputs: 2 });
		region.register("two_fingers_pan", two_fingers_pan);
		region.bind(container, "two_fingers_pan", (event) => {
			if (event.detail.data.length > 0) {

				// scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
				// scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
				scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
				scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
			}
		})

		let three_fingers_pan = new ZingTouch.Pan({ numInputs: 3 });
		region.register("three_fingers_pan", three_fingers_pan);
		region.bind(container, "three_fingers_pan", (event) => {
			if (event.detail.data.length > 0) {
				scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
				scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
			}

		})

		region.bind(container, 'distance', function (e) {

			if (!scope.zoom_started) {
				scope.zoom_started = true;
				scope.touch_zoom_delta = 0;
				scope.initial_zoom_distance = e.detail.distance;
				scope.last_zoom_distance = e.detail.distance;

				scope.zoom_center.set(e.detail.center.x, e.detail.center.y);
				scope.mouse_pos.set(e.detail.center.x, e.detail.center.y);
			}
			scope.touch_zoom_delta = e.detail.distance - scope.last_zoom_distance;
			scope.last_zoom_distance = e.detail.distance;
			scope.touch_zoom = 1;
		}, false);

		let gesture = new ZingTouch.Gesture();
		gesture.end = (inputs, state, element) => { scope.on_gesture_end(inputs) }
		gesture.start = (inputs, state, element) => { scope.on_mouse_down(inputs) }
		region.register('shortTap', gesture);

		region.bind(container, 'shortTap', function (e) {
		});

		window.addEventListener('wheel', this.on_mouse_wheel.bind(this))
    container.addEventListener( 'contextmenu', (event)=>{event.preventDefault()}, false );

		container.addEventListener("mousemove", (event) => {
			this.mouse_pos.x = event.clientX;
			this.mouse_pos.y = event.clientY;
			this.scrolling_with_mouse = false;
			this.scrolling_with_trackpad = false;
			this.pinching_with_trackpad = false;
		});
	}

	set_mouse_pos(ev) {
		this.mouse_pos.x = ev.detail.events[0].clientX;
		this.mouse_pos.y = ev.detail.events[0].clientY;
	}

	get normalized_mouse_pos() {
		this._normalized_mouse_pos.x = (this.mouse_pos.x / Screen.width) * 2.0 - 1;
		this._normalized_mouse_pos.y = -1 * ((this.mouse_pos.y / Screen.height) * 2.0 - 1);
		return this._normalized_mouse_pos;
	}

	get NDC() {
		return this.normalized_mouse_pos;
	}

	is_mac() {
		return this.get_os() === this.mac;
	}

	on_double_click(event) {
		this.double_click = true;
	}

	on_mouse_wheel(event) {


		this.mouse_pos.x = event.clientX;
		this.mouse_pos.y = event.clientY;

		// User is using a mac
		if (this.is_mac()) {
			// User is pinching
			if (event.ctrlKey) {
				// Negative values means pinch in.
				// Positive values means pinch out.
				console.log("Pinching with a touchpad", event.deltaY)
				this.pinching_with_trackpad = true;
				this.scrolling_with_trackpad = false;
				this.scrolling_with_mouse = false;
				// User is scrolling
			} else {
				// User is using the touchpad
				if (this.is_int(event.deltaY)) {
					// Negative values means scroll up
					// Positive values means scroll down
					// console.log("Scrolling with a touchpad", (event.deltaY))
					// 350 is aprox the maximum value of deltaY on touchpad scroll
					this.pinching_with_trackpad = false;
					this.scrolling_with_trackpad = true;
          this.scrolling_with_mouse = false;

          this.wheel_delta = THREE.Math.clamp(event.deltaY / 350, -1, 1);
				} else {
					// Negative values means scroll up
					// Positive values means scroll down
					// console.log("Scrolling with a mouse", event.deltaY)
					this.pinching_with_trackpad = false;
					this.scrolling_with_trackpad = false;
					this.scrolling_with_mouse = true;

					this.wheel_delta = event.deltaY / Math.abs(event.deltaY);
				}
			}
		}
		else {
			//probably windows
			this.pinching_with_trackpad = false;
			this.scrolling_with_trackpad = false;
			this.scrolling_with_mouse = true;

			if (Math.abs(event.deltaY) < 0.0001)
				this.wheel_delta = 0;
			else
				this.wheel_delta = event.deltaY / Math.abs(event.deltaY);

		}
	}

	on_mouse_down(inputs) {
		this.mouse_pos.x = inputs[0].current.clientX;
		this.mouse_pos.y = inputs[0].current.clientY;

		this.multitouch_active = inputs.length > 1;

		this.mouse_dir.x = 0;
		this.mouse_dir.y = 0;


		this.__clicked_time = this.__elapsed_time;
		this.is_mouse_down = true;
		this.is_mouse_up = false;

		switch (inputs[0].current.originalEvent.which) {
			case 1:
				this.left_mouse_button_down = true;
				this.left_mouse_button_pressed = true;
				break;
			case 2: this.middle_mouse_button_down = true; break;
			case 3:
				this.right_mouse_button_down = true;
				this.right_mouse_button_pressed = true;
				break;
			default: this.left_mouse_button_down = true; this.left_mouse_button_pressed = true; break;
		}


		this.wheel_delta = 0;
		this.previous_scale = 0;
		this.previous_rotation = 0;


	}

	mouse_clicked() {
		return this.tapped;
	}

	on_touch_move(e) {
		this.on_mouse_move({ clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY})
	}

	on_touch_end(e) {
		this.on_gesture_end([{ current: { originalEvent: e } }])
	}

	on_mouse_up(e) {
		this.on_gesture_end([ { current: { originalEvent: e } } ])
	}

	on_gesture_end(inputs) {
		this.multitouch_active = inputs ? (inputs.length > 1) : false;
		this.is_mouse_up = true;
		this.zoom_started = false;
		this.touch_zoom = 1;
		this.mouse_dir.x = 0;
		this.mouse_dir.y = 0;
		this.previous_scale = 0;
		this.previous_rotation = 0;
		this.wheel_delta = 0;

		this.left_mouse_button_down = false;
		this.middle_mouse_button_down = false;
		this.right_mouse_button_down = false;

		if (inputs) {
			switch (inputs[0].current.originalEvent.which) {
				case 1:
					this.left_mouse_button_released = true;
					break;
				case 2:
					this.middle_mouse_button_released = true;
					break;
				case 3:
					this.right_mouse_button_released = true;
					break;
				default:
					this.left_mouse_button_released = true;
					break;
			}
		}

		this.is_mouse_down = false;
		this.previous_rotation_dirty = true;
		this.rotation_delta = 0;
	}


	on_focus_lost() {
		this.on_gesture_end();
		this.left_mouse_button_released = true;
		this.middle_mouse_button_released = true;
		this.right_mouse_button_released = true;
		this.left_mouse_button_released = true;

	}

	time_since_last_mouse_down() {
		return this.__elapsed_time - this.__clicked_time;
	}

	on_mouse_move(event) {
		this.mouse_pos.x = event.clientX;
		this.mouse_pos.y = event.clientY;

		this.mouse_dir.set(this.mouse_pos.x - this.previous_pos_x,
											 this.mouse_pos.x - this.previous_pos_y);

		this.mouse_dir.normalize();

		this.previous_pos_x = this.mouse_pos.x;
		this.previous_pos_y = this.mouse_pos.x;
	}

	on_mouse_move_zingtouch(event) {
		if (event.detail.data.length > 0) {
			this.set_mouse_pos(event);
			this.mouse_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
			// this.mouse_dir.x *=  Screen.height / Screen.width;

			// this.mouse_dir.multiplyScalar(this.__delta_time/window.devicePixelRatio);
		}
	}

	get_os() {
		var userAgent = window.navigator.userAgent,
			platform = window.navigator.platform,
			macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
			windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
			iosPlatforms = ['iPhone', 'iPad', 'iPod'],
			os = null;

		if (macosPlatforms.indexOf(platform) !== -1) {
			os = 'mac';
		} else if (iosPlatforms.indexOf(platform) !== -1) {
			os = 'ios';
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
			os = 'windows';
		} else if (/Android/.test(userAgent)) {
			os = 'android';
		} else if (!os && /Linux/.test(platform)) {
			os = 'linux';
		}

		return os;
	}

	is_int(n) {
		return n % 1 === 0;
	}

	clear() {

		this.__elapsed_time = Time.elapsed_time;
		this.__delta_time = Time.delta_time;
		this.is_mouse_up = false;
		this.wheel_delta = 0;
		this.rotation_delta = 0;

		this.double_click = false;


		this.tapped = false;
		this.mouse_dir.multiplyScalar(0);
		this.multi_touch_dir.multiplyScalar(0);
		this.left_mouse_button_pressed = false;
		this.left_mouse_button_released = false;

		this.right_mouse_button_pressed = false;
		this.right_mouse_button_released = false;
		KeyboardInput.clear();

	}

}

const INPUT = new Input();
module.exports = INPUT;
