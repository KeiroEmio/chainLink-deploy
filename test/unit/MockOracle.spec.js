const { network } = require("hardhat");
// const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const { networkConfig, deployContractAddress, developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { ethers } = require("ethers");
const { readFileSync } = require("node:fs");
const path = require("path");

require("dotenv").config();
console.log("network.name:", developmentChains.includes(network.name));

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Automation Counter Unit Tests", function () {
        it("should deploy MockOracle contract", async function () {
            const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

            const privateKey = process.env.PRIVATE_KEY;
            const wallet = new ethers.Wallet(privateKey, provider);

            // 获取脚本当前所在目录，并拼接目标文件的路径
            const abiPath = path.join(__dirname, '../../bin/verify_MockOracle_MockOracle_sol_MockOracle.abi');
            const bytecodePath = path.join(__dirname, '../../bin/verify_MockOracle_MockOracle_sol_MockOracle.bin');

            const abi = JSON.parse(readFileSync(abiPath, 'utf-8'));
            const bytecode = readFileSync(bytecodePath, 'utf-8');

            // 创建合约工厂
            const factory = new ethers.ContractFactory(abi, bytecode, wallet);

            // 部署合约并等待完成
            const mockOracle = await factory.deploy("0x779877A7B0D9E8603169DdbD7836e478b4624789");
            console.log("Deploying MockOracle contract...");

            // 等待合约部署完成
            await mockOracle.deployed();

            // 打印部署的合约地址
            console.log("MockOracle contract deployed at:", mockOracle.address);

            // 检查合约地址是否存在
            assert(mockOracle.address, "Contract was not deployed correctly.");
        });
    });
