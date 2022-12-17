import React, { useEffect, useState } from "react";
import { Avatar, Button, Navbar } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

function Header() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [client, setclient] = useState({ isConnected: false });
  const router = useRouter();

  const checkConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setclient({
          isConnected: true,
          address: accounts[0],
        });
      } else {
        setclient({
          isConnected: false,
        });
      }
    } else {
      sethaveMetamask(false);
    }
  };

  const connectWeb3 = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setclient({
        isConnected: true,
        address: accounts[0],
      });
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);
  return (
    <div>
      <Navbar variant="static">
        <Navbar.Brand>
          <Avatar
            src="https://docs.shardeum.org/img/shardeum-logo-dark.png"
            css={{ size: "$15", mr: 12 }}
          />
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="highlight">
          <Link href="/">
            <Navbar.Link
              block
              isActive={router.pathname === "/" ? true : false}
            >
              Create
            </Navbar.Link>
          </Link>
          <Link href="/dashboard">
            <Navbar.Link
              block
              isActive={router.pathname === "/dashboard" ? true : false}
            >
              Dashboard
            </Navbar.Link>
          </Link>
        </Navbar.Content>
        <Navbar.Content>
          <Button
            onClick={connectWeb3}
            flat={client.isConnected ? true : false}
          >
            {client.isConnected ? (
              <>
                {client.address.slice(0, 6)}...
                {client.address.slice(36, 42)}
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </Button>
        </Navbar.Content>
      </Navbar>
    </div>
  );
}

export default Header;
