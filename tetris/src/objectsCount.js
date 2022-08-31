export default class ObjectsCount {
	constructor() {
		const div = document.createElement('div');
		div.className = 'count'
		document.body.appendChild(div);
		this.div = div;
		this.current = 0;
	}

	updateCount() {
		this.div.innerText = `Currently on the screen: ${this.current}`;
	}

	increment() {
		this.current++;
		this.updateCount();
	}
}