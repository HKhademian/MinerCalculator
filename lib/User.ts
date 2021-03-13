import { DeepPartial } from "./util.ts";

interface UserState {
  total_dispose: number;
  total_withdraw: number;
  total_invest: number;
  total_income: number;
  total_workers: number;
}

interface UserSetting {
  save_rate: number;
  save_start: number;
  save_end: number;
  invest_rate: number;
  invest_start: number;
  invest_end: number;
}

export interface User {
  id: string;
  title: string;
  saving_wallet: number;
  working_wallet: number;
  agentUserId?: string;
  agent_share: number;
  states: UserState;
  settings: UserSetting;
}

const newUserState = (
  source?: DeepPartial<UserState>,
): UserState =>
  ({
    total_dispose: source?.total_dispose || 0.0,
    total_withdraw: source?.total_withdraw || 0.0,
    total_invest: source?.total_invest || 0.0,
    total_income: source?.total_income || 0.0,
    total_workers: source?.total_workers || 0.0,
  }) as UserState;

const newUserSettings = (
  source?: DeepPartial<UserSetting>,
): UserSetting =>
  ({
    save_rate: source?.save_rate || -1,
    save_start: source?.save_start || -1,
    save_end: source?.save_end || -1,

    invest_rate: source?.invest_rate || -1,
    invest_start: source?.invest_start || -1,
    invest_end: source?.invest_end || -1,
  }) as UserSetting;

export const newUser = (
  source?: DeepPartial<User>,
): User =>
  ({
    id: source?.id || "empty",
    title: source?.title || "EMPTY",
    saving_wallet: source?.saving_wallet || 0.0,
    working_wallet: source?.working_wallet || 0.0,
    agentUserId: source?.agentUserId || undefined,
    agent_share: source?.agent_share || 0.0,
    states: newUserState(source?.states),
    settings: newUserSettings(source?.settings),
  }) as User;
