import iconImg from "@/public/android-chrome-192x192.png";
import clsx from "clsx";
import Image from "next/image";
import NextLink from "next/link";

type Props = {
  variant?: "dark" | "light";
};

const Logo = ({ variant = "dark" }: Props) => (
  <NextLink className="tw-mb-1 tw-flex tw-items-center tw-gap-x-2" href="/">
    <Image className="tw-h-8 tw-w-8" src={iconImg} alt="sciwork icon" />
    <div
      className={clsx("tw-font-yk tw-text-3xl", {
        "tw-text-white": variant === "dark",
        "tw-text-neutral-950": variant === "light",
      })}
    >
      sciwork Volunteer
    </div>
  </NextLink>
);

export default Logo;
