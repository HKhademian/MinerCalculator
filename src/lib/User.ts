import {DeepPartial} from "../util.ts";
import {ShareSetting, newShareSetting, System, newShareListSetting} from "./System.ts";

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

export interface User {
  id: string;
  title: string;
  wallet: {
	saving: number;
	working: number;
  }

  managerShare?: ShareSetting | undefined;
  charityShare?: ShareSetting | undefined;
  agentsShare: ShareSetting | ShareSetting[];

  states: UserState;
  savePolicy: SavePolicy | SavePolicy[];
}

export const isSavePolicyInRange = (policy: SavePolicy, system: System, timeShift: number = 0): boolean => {
  const time = system.currentTime + timeShift;
  return (!policy.start || policy.start < 0 || policy.start < time) &&
	(!policy.end || policy.end < 0 || policy.end > time);
}

const newUserState = (
  source?: DeepPartial<UserState>,
  base?: UserState | undefined,
): UserState =>
  ({
	total_dispose: source?.total_dispose || base?.total_dispose || 0.0,
	total_withdraw: source?.total_withdraw || base?.total_withdraw || 0.0,
	total_invest: source?.total_invest || base?.total_invest || 0.0,
	total_income: source?.total_income || base?.total_income || 0.0,
	total_workers: source?.total_workers || base?.total_workers || 0.0,
  }) as UserState;

const newSavePolicy = (
  source?: DeepPartial<SavePolicy | SavePolicy[]>,
  base?: SavePolicy | SavePolicy[] | undefined,
): SavePolicy | SavePolicy[] =>
  JSON.parse(JSON.stringify(source || base));

export const newUser = (
  source?: DeepPartial<User>,
  base: User | undefined = undefined,
): User =>
  ({
	id: source?.id || base?.id || "empty",
	title: source?.title || base?.title || "EMPTY",
	wallet: {
	  saving: source?.wallet?.saving || base?.wallet?.saving || 0.0,
	  working: source?.wallet?.working || base?.wallet?.working || 0.0,
	},

	charityShare: newShareSetting(source?.charityShare, base?.charityShare),
	managerShare: newShareSetting(source?.managerShare, base?.managerShare),
	agentsShare: newShareListSetting(source?.agentsShare, base?.agentsShare),

	states: newUserState(source?.states, base?.states),
	savePolicy: newSavePolicy(source?.savePolicy, base?.savePolicy),
  }) as User;

