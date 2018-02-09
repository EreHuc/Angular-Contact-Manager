import * as CryptoJS from 'crypto-js';
import * as mySuperSecret from '../../../../key.json';

// TODO: refaire ce fichier en mode class et non export func

export function log(method: string, file: string, ...logs) {
	logs.forEach(log => {
		console.log('%c' + method + '@' + '%c' + file + '%c -> ',
			'font-weight: bold;', 'color: blue; text-decoration: underline', '', log);
	});
}

export function autoSubmit(event: any): Promise<any> {
	return new Promise((resolve, reject) => {
		let elements = event.target.elements;
		let res = {};
		let error = {};
		for (let i = 0; i < elements.length; i++) {
			let elm = elements.item(i);
			if (!elm.checkValidity()) {
				error[elm.attributes.name.value] = elm;
			} else {
				if (elm.attributes.type === 'checkbox') {
					res[elm.attributes.name.value] = elm.checked;
				} else {
					res[elm.attributes.name.value] = elm.value;
				}
			}
		}
		if (Object.keys(error).length) {
			Object.keys(error).forEach(elm => {
				if (error[elm].attributes.type.value !== 'checkbox') {
					let parentElm = error[elm].parentElement;
					if (~parentElm.classList.value.indexOf('form-line')) {
						parentElm.classList.add('focused', 'error');
					}
				}
			});
			reject(error);
		} else {
			resolve(res);
		}
	});
}

export function encrypt(data: any): string {
	return CryptoJS.AES.encrypt(JSON.stringify(data), (<any>mySuperSecret).encryptKey).toString();
}

export function decrypt(data: any): any {
	let bytes = CryptoJS.AES.decrypt(data.toString(), (<any>mySuperSecret).encryptKey);
	return parseJson(bytes.toString(CryptoJS.enc.Utf8));
}

export function parseJson(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return str;
	}
}
