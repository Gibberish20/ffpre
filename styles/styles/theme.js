import { extendTheme } from "@chakra-ui/react";
import { globalStyles } from "./styles";

import { breakpoints } from './foundations/breakpoints';
import { buttonStyles } from './components/button'
import { badgeStyles } from "./components/badge";
import { CardComponent } from "./additions/card/Card";
import { CardBodyComponent } from "./additions/card/CardBody";
import { CardHeaderComponent } from "./additions/card/CardHeader";

// import { mode } from "@chakra-ui/theme-tools";
export default extendTheme(
  { breakpoints }, // Breakpoints 

  globalStyles, // Global styles
  buttonStyles, // Button styles
  badgeStyles, // Badge styles
  CardComponent, // Card component
  CardBodyComponent, // Card Body component
  CardHeaderComponent, // Card Header component

);
