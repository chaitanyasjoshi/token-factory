import {
  Avatar,
  Button,
  Card,
  Container,
  Grid,
  Input,
  Link,
  Loading,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Contract, ethers } from "ethers";
import erc20Abi from "../constants/ERC20.json";
import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "ethers/lib/utils";
import Popup from "./Popup";

function Token({ tokenAddress }) {
  const [tokenDetails, setTokenDetails] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const mintTokens = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenFactory = new Contract(tokenAddress, erc20Abi, signer);
    const address = await signer.getAddress();
    try {
      const tx = await tokenFactory.mint(
        address,
        parseEther(amount.toString())
      );
      await tx.wait();
      setVisible(true);
      fetchTokenDetails();
    } catch (error) {
      console.error("User rejected transaction request");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenDetails = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenFactory = new Contract(tokenAddress, erc20Abi, provider);
    const name = await tokenFactory.name();
    const symbol = await tokenFactory.symbol();
    const circulatingSupply = await tokenFactory.totalSupply();
    const maxSupply = await tokenFactory.maxSupply();
    setTokenDetails({ name, symbol, circulatingSupply, maxSupply });
  };

  useEffect(() => {
    fetchTokenDetails();
  }, []);

  return (
    <>
      <Card css={{ w: 350 }}>
        <Card.Body>
          <Container xs display="flex" direction="column" css={{ p: 0 }}>
            <Avatar
              src="https://docs.shardeum.org/img/shardeum-logo-dark.png"
              css={{ size: "$20", mx: "auto" }}
            />
            <Spacer y={0.5} />
            <Text b size={18} css={{ ta: "center", fontFamily: "Inter" }}>
              {tokenDetails?.name}
            </Text>
            <Text css={{ ta: "center", fontFamily: "Inter" }}>
              {tokenDetails?.symbol}
            </Text>
            <Spacer y={1.5} />
            <Container xs display="flex" wrap="nowrap">
              <Input
                type="number"
                bordered
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
              />
              <Spacer x={0.5} />
              <Button auto onClick={mintTokens}>
                {loading ? <Loading size="xs" color="white" /> : "Mint"}
              </Button>
            </Container>
          </Container>
          <Spacer y={1.5} />
          <Card.Divider />
          <Spacer y={1} />
          <Grid.Container gap={0.5} justify="center">
            <Grid xs={6}>
              <Container css={{ p: 0, ta: "center" }}>
                <Text css={{ fontFamily: "Inter" }}>Circulating Supply</Text>
                {tokenDetails && (
                  <Text css={{ fontFamily: "Inter" }}>
                    {formatEther(tokenDetails.circulatingSupply)}{" "}
                    {tokenDetails.symbol}
                  </Text>
                )}
              </Container>
            </Grid>
            <Grid xs={6}>
              <Container css={{ p: 0, ta: "center" }}>
                <Text css={{ fontFamily: "Inter" }}>Max Supply</Text>
                {tokenDetails && (
                  <Text css={{ fontFamily: "Inter" }}>
                    {formatEther(tokenDetails.maxSupply)} {tokenDetails.symbol}
                  </Text>
                )}
              </Container>
            </Grid>
          </Grid.Container>
          <Spacer y={1} />
          <Link
            target="_blank"
            block
            href={`https://explorer-liberty10.shardeum.org/account/${tokenAddress}`}
            css={{ mx: "auto" }}
          >
            View on Shardeum Explorer
          </Link>
        </Card.Body>
      </Card>

      <Popup
        open={visible}
        setOpen={() => setVisible(false)}
        message="Tokens minted successfully."
      />
    </>
  );
}

export default Token;
