import { noise as Perlin, noiseSeed } from '@chriscourses/perlin-noise';

// Class representing the terrain.
export default class Terrain {
	constructor({ seed, scrollspeed, zIndex }) {
		// Seed for consistant terrain generation across clients.
		this.seed = seed;
		noiseSeed(seed);
		// Array of all height values.
		this.heightBuffer = [];

		this.landingPadBuffer = [];
		// The Container to draw the terrain in.
		this.canvas = undefined;
		// The Rough bounding box of the terrain.
		this.bounds = {};
		// If the terrain requires a re-draw
		this.needsUpdate = true;

		this.scrollspeed = scrollspeed;
		this.zIndex = zIndex;
	}

	/**
	 * Sets a container to drae the terrain in.
	 * @param {HTMLDivElement} context The container/render layer to render the terrain in.
	 */
	setContext(context) {
		this.canvas = context;
		this.bounds = {
			top: 10e7,
			left: 0,
			right: Number(this.canvas.style.width.split('p')[0]),
			bottom: Number(this.canvas.style.height.split('p')[0]),
			lowest: -1,
		};
	}

	genNode() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		var polygon = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'polygon'
		);
		svg.style.width = '100%';
		svg.style.height = '100%';
		svg.style.filter = `drop-shadow(0px -10px 10px rgba(255, 255, 255, ${
			0.2 * this.zIndex
		}))`;
		//svg.style.transform = 'scale(1.1, 1.1)';
		svg.style.position = 'absolute';
		svg.style.zIndex = `${this.zIndex}`;

		polygon.style.zIndex = '100';
		polygon.style.stroke = `rgba(255, 255, 255, ${1 * this.zIndex + 0.5})`;
		polygon.style.strokeWidth = '1px';
		polygon.style.zIndex = '100';

		svg.appendChild(polygon);

		this.canvas.appendChild(svg);
		this.drawLandingPads();

		this.svg = svg;
		this.polygon = polygon;
	}

	/**
	 * Draws a given height buffer ot the screen using SVGSVGElement.
	 * @param {Array<number>} terrain The Height Buffer to draw.
	 */
	drawTerrain(offset) {
		const polygon = this.polygon;
		const svg = this.svg;
		polygon.points.clear();
		for (let x = 0; x < this.bounds.right; x += 4) {
			var point = svg.createSVGPoint();
			point.x = x;
			point.y =
				Perlin((x + offset * this.scrollspeed) * 0.01) *
					(100 * Math.abs(1 - this.zIndex) + 70) +
				500 +
				this.zIndex * 150 -
				100;

			polygon.points.appendItem(point);
		}
		const lPoint = svg.createSVGPoint();
		lPoint.x = this.bounds.left;
		lPoint.y = this.bounds.bottom;
		const rPoint = svg.createSVGPoint();
		rPoint.x = this.bounds.right;
		rPoint.y = this.bounds.bottom;

		polygon.points.appendItem(rPoint);
		polygon.points.insertItemBefore(lPoint, 0);
	}

	/**
	 * Draws Landing Pads
	 */
	drawLandingPads() {
		// TODO
	}

	/**
	 * Returns value of height buffer at a given index.
	 * @param {number} x The index to sample the Hegight Buffer at.
	 */
	getValue(x) {
		return this.heightBuffer[x];
	}

	_getMedian(arr) {
		const mid = Math.floor(arr.length / 2);
		const nums = [...arr].sort((a, b) => a - b);
		return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
	}
}
