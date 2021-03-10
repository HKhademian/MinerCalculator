import { DeepPartial } from "./util.ts";

interface UserState {
  total_dispose: number;
  total_withdraw: number;
  total_invest: number;
  total_income: number;
  total_workers: number;
}

interface UserSetting {
  invest_save_rate: number;
  invest_save_start: number;
  invest_save_end: number;
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
    invest_save_rate: source?.invest_save_rate || 0.3,
    invest_save_start: source?.invest_save_start || -1,
    invest_save_end: source?.invest_save_end || -1,
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
