import './_global.ts';
import {System} from "./System.ts";
import {DeepPartial, errVal} from "../util.ts";
import {Product} from "./Product.ts";
import {Worker} from "./Worker.ts";


export namespace Company {
  type CompanyData = {
	id: string;
	title: string;
	link?: string;
	desc?: string;
  };

  export interface Company extends CompanyData {
  }

  export const findById = async (company: string | Company, system: System): Promise<Company | undefined> =>
	typeof (company) != 'string' ? company : system?.companies?.find(it => it.id == company);


  export const create = async (data?: DeepPartial<CompanyData>, base?: Company, system?: System): Promise<Company> => {
	const company = ({
	  id: data?.id || base?.id || errVal("no company-id provided"),
	  title: data?.title || base?.title || `Company ${data?.id || base?.id}`,
	  link: data?.link || base?.link || undefined,
	  desc: data?.desc || base?.desc || undefined,
	}) as Company;
	system?.companies.push(company);
	return company;
  };
}

export type Company = Company.Company;


export namespace Source {

  type ReInvestData = {
	product?: string | Product,
	minInterval: number,
	minCount: number,
  };

  interface ReInvest extends ReInvestData {
	product?: string,
  }

  type SourceData = {
	id: string;
	company: string | Company;
	reinvest: ReInvestData,
	title?: string;
	login?: string;
	desc?: string;
  };

  export interface Source extends SourceData {
	company: string;
	reinvest: ReInvest,
  }

  export const findById = async (source: string | Source, system: System): Promise<Source | undefined> =>
	typeof (source) != 'string' ? source : system?.sources.find(it => it.id == source);

  const createReInvest = (data?: DeepPartial<ReInvestData>, base?: ReInvest): ReInvest => {
	const product = data?.product || base?.product || undefined;
	return ({
	  product: typeof product == "string" ? product : product?.id,
	  minInterval: data?.minInterval || base?.minInterval || 0,
	  minCount: data?.minCount || base?.minCount || 0,
	  // lastBuy: source?.reinvest?.lastBuy || base?.reinvest.lastBuy || -Infinity,
	}) as ReInvest;
  }

  export const create = async (data?: DeepPartial<SourceData>, base?: Source, system?: System): Promise<Source> => {
	const company = data?.company || base?.company || errVal("no company provided");
	const item = ({
	  id: data?.id || base?.id || errVal("no source-id provided"),
	  company: typeof company == "string" ? company : company.id,
	  reinvest: createReInvest(data?.reinvest, base?.reinvest),
	  title: data?.title || base?.title || `Source ${data?.id || base?.id} from company ${data?.company || base?.company}`,
	  login: data?.login || base?.login || undefined,
	  desc: data?.desc || base?.desc || undefined,
	}) as Source;
	system?.sources.push(item);
	return item;
  }

  export const getOwnerPowers = async (system: System, source: string | Source, time?: number): Promise<Worker.Owner> => {
	source = typeof source == "string" ? source : source.id;
	time = time != undefined ? time : system.currentTime;
	const workers = system.workers.filter(it => (it.startTime <= time!) && (it.endTime >= time!) && it.source == source);
	return workers.reduce((prev, w) => {
	  Object.entries(w.owners).forEach(([u, r]) => {
		prev[u] = (prev[u] || 0) + (r * w.power);
	  });
	  return prev;
	}, {} as { [_: string]: number });
  }

  export const getOwnerShares = async (system: System, source: string | Source, time?: number): Promise<Worker.Owner> => {
	const powers = await getOwnerPowers(system, source, time);
	const sumP = Object.values(powers).sumBy();
	return Object.fromEntries(
	  Object.entries(powers).map(([u, p]) => [u, p / sumP])
	);
  }

}

export type Source = Source.Source;
