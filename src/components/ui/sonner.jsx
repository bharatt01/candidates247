import { useTheme } from "next-themes";
import { Toaster as SonnerUI, toast } from "sonner";
import React from "react";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return <SonnerUI theme={theme} {...props} />;
};

export { Toaster, toast };





