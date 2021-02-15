import Link from "next/link";

type SidebarLinkProps = {
  path: string;
  name: string;
};

const SidebarLink = ({ path, name }: SidebarLinkProps) => {
  return (
    <li className="sm:inline-block">
      <Link href={path}>
        <a className="p-3 hover:text-white">
          <span>{name}</span>
        </a>
      </Link>
    </li>
  );
};

export default SidebarLink;
