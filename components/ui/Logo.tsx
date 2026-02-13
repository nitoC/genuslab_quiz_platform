import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Image src="/logo/logo.png" width={30} height={34} alt="logo" />
      <span className="font-bold text-(--primary)">Genuslab</span>
    </div>
  );
};

export default Logo;
