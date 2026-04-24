import React from "react";
import {
  IoHomeOutline,
  IoCartOutline,
  IoGiftOutline,
  IoShareSocialOutline,
  IoHeartOutline,
} from "react-icons/io5";
import Link from "next/link";

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: <IoHomeOutline />,
    gradientFrom: "#7C3AED",
    gradientTo: "#9B87F5",
  },
  {
    title: "Shop",
    href: "/products",
    icon: <IoCartOutline />,
    gradientFrom: "#56CCF2",
    gradientTo: "#2F80ED",
  },
  {
    title: "Gifts",
    href: "/gift-finder",
    icon: <IoGiftOutline />,
    gradientFrom: "#FF9966",
    gradientTo: "#E8A87C",
  },
  {
    title: "Share",
    href: "#",
    icon: <IoShareSocialOutline />,
    gradientFrom: "#80FF72",
    gradientTo: "#7EE8FA",
  },
  {
    title: "Love",
    href: "/products?ar=true",
    icon: <IoHeartOutline />,
    gradientFrom: "#ffa9c6",
    gradientTo: "#f434e2",
  },
];

export default function GradientMenu() {
  return (
    <ul className="hidden md:flex gap-4">
      {menuItems.map(({ title, href, icon, gradientFrom, gradientTo }, idx) => (
        <Link href={href} key={idx}>
          <li
            style={
              {
                "--gradient-from": gradientFrom,
                "--gradient-to": gradientTo,
              } as React.CSSProperties
            }
            className="relative w-[48px] h-[48px] bg-[#1F2023] border border-[#2E2E38] shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[140px] hover:shadow-none group cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100" />
            <span className="absolute top-[8px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-40" />
            <span className="relative z-10 transition-all duration-500 group-hover:scale-0 text-[#9CA3AF] text-lg">
              {icon}
            </span>
            <span className="absolute text-white uppercase tracking-wider text-xs font-semibold transition-all duration-500 scale-0 group-hover:scale-100">
              {title}
            </span>
          </li>
        </Link>
      ))}
    </ul>
  );
}
