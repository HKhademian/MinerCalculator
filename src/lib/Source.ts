import {DeepPartial, errVal} from "../util.ts";
import {System} from "./System.ts";
import {Product} from "./Product.ts";

export interface Company {
  id: string;
  title: string;
  link?: string;
  desc?: string;
}

export namespace Company {
  export function findById(company: string | Company, system: System): Company | undefined {
	if (typeof (company) != 'string') return company as Company;
	return system?.companies?.find(it => it.id == company);
  }

  export const newCompany = (source?: DeepPartial<Company>, base?: Company, system?: System): Company => {
	const item = ({
	  id: source?.id || base?.id || errVal("no company-id provided"),
	  title: source?.title || base?.title || `Company ${source?.id || base?.id}`,
	  link: source?.link || base?.link || undefined,
	  desc: source?.desc || base?.desc || undefined,
	}) as Company;
	system?.companies.push(item);
	return item;
  };

}

export interface Source {
  id: string;
  company: string;
  reinvestProduct?: string;
  title?: string;
  login?: string;
  desc?: string;
}

export namespace Source {
  export function findById(source: string | Source, system: System): Source | undefined {
	if (typeof (source) != 'string') return source as Source;
	return system?.sources.find(it => it.id == source);
  }

  export const newSource = (source?: DeepPartial<Source>, base?: Source, system?: System): Source => {
	const item = ({
	  id: source?.id || base?.id || errVal("no source-id provided"),
	  company: source?.company || base?.company || errVal("no company-id provided"),
	  reinvestProduct: source?.reinvestProduct || base?.reinvestProduct || undefined,
	  title: source?.title || base?.title || `Source ${source?.id || base?.id} from company ${source?.company || base?.company}`,
	  login: source?.login || base?.login || undefined,
	  desc: source?.desc || base?.desc || undefined,
	}) as Source;
	system?.sources.push(item);
	return item;
  }
}
