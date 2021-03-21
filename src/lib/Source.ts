import {DeepPartial, errVal} from "../util.ts";

export interface Company {
  id: string;
  title: string;
  link?: string;
  desc?: string;
}

export interface Source {
  id: string;
  companyId: string;
  title?: string;
  login?: string;
  desc?: string;
}

export const newCompany = (source?: DeepPartial<Company>, base?: Company): Company => ({
  id: source?.id || base?.id || errVal("no company-id provided"),
  title: source?.title || base?.title || `Company ${source?.id || base?.id}`,
  link: source?.link || base?.link || undefined,
  desc: source?.desc || base?.desc || undefined,
}) as Company;

export const newSource = (source?: DeepPartial<Source>, base?: Source): Company => ({
  id: source?.id || base?.id || errVal("no source-id provided"),
  companyId: source?.companyId || base?.companyId || errVal("no company-id provided"),
  title: source?.title || base?.title || `Source ${source?.id || base?.id} from company ${source?.companyId || base?.companyId}`,
  login: source?.login || base?.login || undefined,
  desc: source?.desc || base?.desc || undefined,
}) as Company;
