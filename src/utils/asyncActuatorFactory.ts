type fucntionsType = Function | string | number | null;

//异步执行器工厂
export default function asyncActuatorFactory() {
	return async function test(...functions: fucntionsType[]) {
		let arr = [...functions];
		//异步迭代器
		let gen = (async function* gen() {
			for (let func of arr) {
				yield func;
			}
		})();
		//
		let queue = [];
		for (let func of arr) {
			queue.push(gen.next());
		}

		for await (let func of queue) {
			console.log(func);
		}
	};
}
