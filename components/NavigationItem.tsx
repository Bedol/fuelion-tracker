import Link from "next/link";

type SidebarLinkProps = {
  path: string;
  name: string;
};

const SidebarLink = ({ path, name }: SidebarLinkProps) => {
  return (
    <li className="md:ml-4">
      <Link href={path}>
        <a className="block no-underline py-2 text-white hover:text-gray-200 md-border-none md:p-0">
          {name}
        </a>
      </Link>
    </li>
  );
};

export default SidebarLink;
