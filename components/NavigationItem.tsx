import Link from "next/link";

type SidebarLinkProps = {
  path: string;
  name: string;
};

const SidebarLink = ({ path, name }: SidebarLinkProps) => {
  return (
    <li>
      <Link href={path}>
        <a>
          <span>{name}</span>
        </a>
      </Link>
    </li>
  );
};

export default SidebarLink;
