const { network, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect} = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Price Consumer Unit Tests", async function () {
          // We define a fixture to reuse the same setup in every test.
          // We use loadFixture to run this setup once, snapshot that state,
          // and reset Hardhat Network to that snapshot in every test.
          async function deployPriceConsumerFixture() {
              const [deployer] = await ethers.getSigners()

              // const DECIMALS = "18"
              // const INITIAL_PRICE = "200000000000000000000"

              // const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator")
              // const mockV3Aggregator = await mockV3AggregatorFactory
              //     .connect(deployer)
              //     .deploy(DECIMALS, INITIAL_PRICE)

              const MyMockV3Aggregator = "0x4b413b433589EA15C08EfEc78c14D5F57C78955f"
              // 使用已部署的合约地址而不是重新部署
              const mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", MyMockV3Aggregator);

              console.log("mockV3Aggregator.address:",mockV3Aggregator.address)
              console.log("network:",network.name)
              const priceConsumerV3Factory = await ethers.getContractFactory("PriceConsumerV3")
              const priceConsumerV3 = await priceConsumerV3Factory
                  .connect(deployer)
                  .deploy(MyMockV3Aggregator)

              return { priceConsumerV3, mockV3Aggregator }
          }

          // describe("deployment", async function () {
          //     describe("success", async function () {
          //         it("should set the aggregator addresses correctly", async () => {
          //             const { priceConsumerV3, mockV3Aggregator } = await loadFixture(
          //                 deployPriceConsumerFixture
          //             )
          //             const response = await priceConsumerV3.getPriceFeed()
          //             assert.equal(response, mockV3Aggregator.address)
          //         })
          //     })
          // })

          describe("#getLatestPrice", async function () {
              describe("success", async function () {
                  // it("should return the same value as the mock", async () => {
                  //     // const { priceConsumerV3, mockV3Aggregator } = await loadFixture(
                  //     //     deployPriceConsumerFixture
                  //     // )
                  //     // const PriceConsumerV3 = await ethers.getContractFactory("PriceConsumerV3");
                  //     const MyMockV3Aggregator = "0x4b413b433589EA15C08EfEc78c14D5F57C78955f"
                  //     const mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", MyMockV3Aggregator);
                  //
                  //     const PriceConsumerV3 = "0x00053872Abda20f7e1C69eF58C07ec1671A4A5c8"
                  //     const priceConsumerV3 = await ethers.getContractAt("PriceConsumerV3" , PriceConsumerV3);
                  //
                  //     const priceConsumerResult = await priceConsumerV3.getLatestPrice()
                  //     console.log("priceConsumerResult", priceConsumerResult)
                  //     const priceFeedResult = (await mockV3Aggregator.latestRoundData()).answer
                  //     console.log("priceFeedResult", priceFeedResult)
                  //     // assert.equal(priceConsumerResult.toString(), priceFeedResult.toString())
                  //
                  //     // Assert that the values match
                  //     expect(priceConsumerResult.toString()).to.equal(priceFeedResult.toString());
                  // })
                  it("should return the same value as the mock", async () => {
                      try {
                          const PriceConsumerV3 = "0x00053872Abda20f7e1C69eF58C07ec1671A4A5c8"
                          const MyMockV3Aggregator = "0x4b413b433589EA15C08EfEc78c14D5F57C78955f"
                          const mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", MyMockV3Aggregator);
                          const priceConsumerV3 = await ethers.getContractAt("PriceConsumerV3", PriceConsumerV3);

                          const priceConsumerResult = await priceConsumerV3.getLatestPrice();
                          console.log("priceConsumerResult", priceConsumerResult);

                          const priceFeedResult = (await mockV3Aggregator.latestRoundData()).answer;
                          console.log("priceFeedResult", priceFeedResult);

                          expect(priceConsumerResult.toString()).to.equal(priceFeedResult.toString());
                      } catch (error) {
                          console.error("Error in contract interaction:", error);
                          throw error; // Re-throw the error to fail the test and not block the thread
                      }
                  });
              })
          })
      })
