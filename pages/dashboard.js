import {
  Avatar,
  Button,
  Card,
  Container,
  Grid,
  Input,
  Link,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Token from "../component/Token";
import { tokenFactoryAddress } from "../constants/address";
import tokenFactoryAbi from "../constants/TokenFactory.json";

const Index = () => {
  const [tokenList, setTokenList] = useState([]);

  const fetchTokens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenFactory = new Contract(
      tokenFactoryAddress,
      tokenFactoryAbi,
      provider
    );
    try {
      const tokens = await tokenFactory.getTokens();
      setTokenList(tokens);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <>
      <Header />

      <Container lg css={{ mt: 50, gap: 20 }} display="flex">
        {tokenList.map((token) => (
          <Token tokenAddress={token} />
        ))}
      </Container>
    </>
  );
};

export default Index;
