#!/usr/bin/env kotlin

class Person(
    val id : String,
    val title: String,
    val savingWallet: Double = 0.0,
    val workingWallet: Double = 0.0,
    val state_totalTopUp: Double = 0.0,
    val state_totalIncome: Double = 0.0,
    val state_totalDispose: Double = 0.0,

    /// number of all miner shares buy
    val state_totalMiners: Double = 0.0,
)

println(Person(
    id="xx",
    title="Hossain",
))
