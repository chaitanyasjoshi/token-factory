import { useState } from "react";

import {
  Button,
  Card,
  Container,
  Input,
  Loading,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Contract, ethers } from "ethers";
import { tokenFactoryAddress } from "../constants/address";
import tokenFactoryAbi from "../constants/TokenFactory.json";
import Popup from "../component/Popup";
import Header from "../component/Header";
import { parseEther } from "ethers/lib/utils";

const Index = () => {
  const [tokenName, setTokenName] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenMaxSupply, setTokenMaxSupply] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const createToken = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenFactory = new Contract(
      tokenFactoryAddress,
      tokenFactoryAbi,
      signer
    );
    try {
      const tx = await tokenFactory.createToken(
        tokenName,
        tokenSymbol,
        parseEther(tokenMaxSupply.toString()),
        {
          value: parseEther("0.1"),
        }
      );
      await tx.wait();
      setVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container xs css={{ mt: "20vh" }}>
        <Card>
          <Card.Header css={{ jc: "center" }}>
            <Text h2>Create new token</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            <Container xs display="flex" direction="column">
              <Spacer y={0.5} />
              <Input
                size="lg"
                bordered
                placeholder="Name of token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
              <Spacer y={1} />
              <Input
                size="lg"
                bordered
                placeholder="Symbol of token"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
              <Spacer y={1} />
              <Input
                type="number"
                size="lg"
                bordered
                placeholder="Token max supply"
                value={tokenMaxSupply}
                onChange={(e) => setTokenMaxSupply(e.target.valueAsNumber)}
              />
            </Container>
          </Card.Body>
          <Card.Footer>
            <Container xs display="flex" direction="column">
              <Button size="lg" onClick={createToken}>
                {loading ? <Loading size="sm" color="white" /> : "Create"}
              </Button>
            </Container>
          </Card.Footer>
          <Spacer y={1} />
        </Card>
      </Container>
      <Popup
        open={visible}
        setOpen={() => setVisible(false)}
        message="Token deployed successfully."
      />
    </>
  );
};

export default Index;
