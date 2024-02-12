import { useCollapsibleContext } from "@/context/CollapsibleContext";

const CollapsibleContent = ({ children }) => {
  const { isOpen } = useCollapsibleContext();
  return isOpen ? <div>{children}</div> : null;
};

export default CollapsibleContent;
