import {DeepPartial, generateID} from "../util.ts";
import {System, ShareSetting, ShareSettingData} from "./System.ts";

export namespace User {
  export interface UserState {
	total_dispose: number;
	total_withdraw: number;
	total_invest: number;
	total_income: number;
	total_workers: number;
  }

  export interface SavePolicy {
	start: number;
	end: number;
	rate: number;
  }

  type UserData = {
	id: string;
	title: string;

	managerShare?: ShareSettingData;
	charityShare?: ShareSettingData;
	agentsShare: ShareSettingData | ShareSettingData[];

	states: UserState;
	savePolicy: SavePolicy | SavePolicy[];
  };

  export interface User extends UserData {
	managerShare?: ShareSetting;
	charityShare?: ShareSetting;
	agentsShare: ShareSetting | ShareSetting[];
  }

  export const findById = async (user: User | string, system: System): Promise<User | undefined> =>
	typeof (user) != 'string' ? user : system?.users.find(it => it.id == user);

  export const isSavePolicyInRange = (policy: SavePolicy, system: System, timeShift: number = 0): boolean => {
	const time = system.currentTime + timeShift;
	return (!policy.start || policy.start < 0 || policy.start < time) &&
	  (!policy.end || policy.end < 0 || policy.end > time);
  }

  const newUserState = (
	source?: DeepPartial<UserState>,
	base?: UserState,
  ): UserState => ({
	total_dispose: source?.total_dispose || base?.total_dispose || 0.0,
	total_withdraw: source?.total_withdraw || base?.total_withdraw || 0.0,
	total_invest: source?.total_invest || base?.total_invest || 0.0,
	total_income: source?.total_income || base?.total_income || 0.0,
	total_workers: source?.total_workers || base?.total_workers || 0.0,
  }) as UserState;

  const newSavePolicy = (
	source?: DeepPartial<SavePolicy | SavePolicy[]>,
	base?: SavePolicy | SavePolicy[],
  ): SavePolicy | SavePolicy[] =>
	JSON.parse(JSON.stringify(source || base || []));

  export const create = async (
	source?: DeepPartial<User>,
	base?: User,
	system?: System,
  ): Promise<User> => {
	const user = ({
	  id: source?.id || base?.id || generateID(),
	  title: source?.title || base?.title || "EMPTY",

	  charityShare: ShareSetting.create(source?.charityShare, base?.charityShare),
	  managerShare: ShareSetting.create(source?.managerShare, base?.managerShare),
	  agentsShare: ShareSetting.createList(source?.agentsShare, base?.agentsShare),

	  states: newUserState(source?.states, base?.states),
	  savePolicy: newSavePolicy(source?.savePolicy, base?.savePolicy),
	}) as User;
	system?.users.push(user);
	return user;
  }
}

export type User = User.User;
export type SavePolicy = User.SavePolicy;
