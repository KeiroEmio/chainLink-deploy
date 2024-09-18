const { network } = require("hardhat")
// const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers")
const { networkConfig,deployContractAddress, developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const {ethers} = require("ethers");
const AutomationCounterAddressABI = require("../../ABI/AutomationCounterAddressABI.json");
require("dotenv").config()
console.log("network.name:",developmentChains.includes(network.name))
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Automation Counter Unit Tests",  function () {
        // We define a fixture to reuse the same setup in every test.
        // We use loadFixture to run this setup once, snapshot that state,
        // and reset Hardhat Network to that snapshot in every test.
        // async function deployAutomationCounterFixture() {
        const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

        const privateKey = process.env.PRIVATE_KEY;
        const wallet = new ethers.Wallet(privateKey, provider);

        async function deployAutomationCounter() {

            const AutomationCounterAddressABI = [
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "name": "performUpkeep",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "updateInterval",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "name": "checkUpkeep",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "upkeepNeeded",
                            "type": "bool"
                        },
                        {
                            "internalType": "bytes",
                            "name": "",
                            "type": "bytes"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "counter",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "interval",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "lastTimeStamp",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]

            console.log(hre.config.deployContractAddress.AutomationCounterAddress, AutomationCounterAddressABI, provider)
            const counter = new ethers.Contract(hre.config.deployContractAddress.AutomationCounterAddress, AutomationCounterAddressABI, provider)
            return {counter}
        }

        it("Example test", function () {
            console.log("测试运行中...");
            // 测试代码
        });

        describe("Automation Counter Unit Tests", function () {
            describe("#performUpkeep", function () {
                describe("success", function () {
                    it("should be able to call performUpkeep after time passes", async function () {
                        const {counter} = await deployAutomationCounter();
                        const startingCount = await counter.counter();
                        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));
                        const interval = await counter.interval();
                        console.log("interval:", interval);

                        // 等待时间流逝
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // 使用钱包签名调用 performUpkeep
                        const tx = await counter.connect(wallet).performUpkeep(checkData);
                        await tx.wait();

                        console.log("PerformUpkeep 交易成功，Tx Hash:", tx.hash);
                        console.log("计数器更新后:", (await counter.counter()).toNumber());

                        // 断言计数器增加
                        assert.equal(startingCount.toNumber() + 1, (await counter.counter()).toNumber());
                    });
                });
            });
        });

        describe("#checkUpkeep", async function () {
            describe("success", async function () {
                it("should be able to call checkUpkeep", async function () {
                    const {counter} = await deployAutomationCounter()
                    // const {counter } = await loadFixture(deployAutomationCounterFixture)
                    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
                    const {upkeepNeeded} = await counter.callStatic.checkUpkeep(checkData)
                    console.log("upkeepNeeded:", upkeepNeeded)
                    await assert.strictEqual(upkeepNeeded, true);
                })
            })
        })
    })

