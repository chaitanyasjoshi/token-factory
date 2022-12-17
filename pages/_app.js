import { createTheme, NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const darkTheme = createTheme({
    type: "dark",
  });

  return (
    <NextUIProvider theme={darkTheme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
