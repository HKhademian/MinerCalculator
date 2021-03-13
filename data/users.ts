import { newUser, User } from "../lib/User.ts";

export type { User };

export const users: User[] = [
  newUser({
    id: "test",
    title: "Test",
    settings: {
      invest_rate: 0.75,
      invest_start: 30 * 2,
    },
  }),

  newUser({
    id: "hossain",
    title: "Hossain",
    settings: {
      save_rate: 0.30,
      save_start: 30 * 0.75,
    },
  }),

  newUser({
    id: "mitra",
    title: "Mitra",
    agentUserId: "hossain",
    agent_share: 0.20,
    settings: {
      invest_rate: 0.75,
      invest_start: 30 * 2,
    },
  }),

  newUser({
    id: "ali",
    title: "Ali",
    agentUserId: "hossain",
    agent_share: 0.20,
    settings: {
      save_rate: 0.20,
      save_start: 30 * 1,
    },
  }),

  newUser({
    id: "zahra",
    title: "Zahra",
    agentUserId: "hossain",
    agent_share: 0.25,
    settings: {
      save_rate: 0.3,
      save_start: 30 * 0.5,
    },
  }),

  newUser({
    id: "saeed",
    title: "Saeed",
    agentUserId: "hossain",
    agent_share: 0.20,
    settings: {
      save_rate: 0.30,
      save_start: 30 * 1,
    },
  }),

  newUser({
    id: "fateme",
    title: "Fateme",
    agentUserId: "hossain",
    agent_share: 0.20,
    settings: {
      save_rate: 0.30,
      save_start: 30 * 1,
    },
  }),

  newUser({
    id: "home",
    title: "Home",
    agentUserId: "hossain",
    agent_share: 0.05,
    settings: {
      save_rate: 0.30,
      save_start: 30 * 1,
    },
  }),
];
