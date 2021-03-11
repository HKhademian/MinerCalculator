import { newUser, User } from "../lib/User.ts";

export const users: User[] = [
  newUser({
    id: "hossain",
    title: "Hossain",
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "ali",
    title: "Ali",
    agentUserId: "hossain",
    agent_share: 0.1,
    settings: {
      invest_save_rate: 0.20,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "zahra",
    title: "Zahra",
    agentUserId: "hossain",
    agent_share: 0.1,
    settings: {
      invest_save_rate: 0.20,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "mitra",
    title: "Mitra",
    agentUserId: "hossain",
    agent_share: 0.05,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "saeed",
    title: "Saeed",
    agentUserId: "hossain",
    agent_share: 0.05,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "fateme",
    title: "Fateme",
    agentUserId: "hossain",
    agent_share: 0.05,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 1,
    },
  }),

  newUser({
    id: "home",
    title: "Home",
    agentUserId: "hossain",
    agent_share: 0.05,
    settings: {
      invest_save_rate: 0.30,
      invest_save_start: 30 * 1,
    },
  }),
];
