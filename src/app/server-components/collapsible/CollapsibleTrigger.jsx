import React from "react";
import { useCollapsibleContext } from "@/context/CollapsibleContext";

const CollapsibleTrigger = ({ children }) => {
  const { toggle } = useCollapsibleContext();

  return React.cloneElement(children, {
    onClick: (...args) => {
      if (children.props.onClick) {
        children.props.onClick(...args);
      }
      toggle();
    },
  });
};

export default CollapsibleTrigger;
