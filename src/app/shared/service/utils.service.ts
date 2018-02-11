import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()

export class UtilsService {
	public encrypt(data: any): string {
		return CryptoJS.AES.encrypt(JSON.stringify(data), "EVA-01").toString();
	}

	public decrypt(data: any): any {
		let bytes = CryptoJS.AES.decrypt(data.toString(), "EVA-01");
		return this.parseJson(bytes.toString(CryptoJS.enc.Utf8));
	}

	public parseJson(str:any) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	}

}