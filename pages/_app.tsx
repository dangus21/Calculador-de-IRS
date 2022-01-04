import "tailwindcss/tailwind.css"
import type { AppProps } from "next/app"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import Head from "next/head"
const colors = {};

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Head>
      <title>Calculador De IRS</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Head>
  )
}

export default MyApp
