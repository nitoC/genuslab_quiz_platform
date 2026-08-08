import { Metadata } from "next";

export const metaData: Metadata = {
  title: "Genus Lab Admin",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex in-h-screen flex-col">{children}</div>;
};

export default Layout;
