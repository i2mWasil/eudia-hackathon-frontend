import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      {
        title: "Overview",
        href: "/overview",
      },
      {
        title: "Features",
        href: "/features",
      },
      {
        title: "Solutions",
        href: "/solutions",
      },
      {
        title: "Tutorials",
        href: "/tutorials",
      },
      {
        title: "Pricing",
        href: "/pricing",
      },
      {
        title: "Releases",
        href: "/releases",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        title: "About us",
        href: "/about",
      },
      {
        title: "Careers",
        href: "/careers",
      },
      {
        title: "Press",
        href: "/press",
      },
      {
        title: "News",
        href: "/news",
      },
      {
        title: "Media kit",
        href: "/media",
      },
      {
        title: "Contact",
        href: "/contact",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Blog",
        href: "/blog",
      },
      {
        title: "Newsletter",
        href: "/newsletter",
      },
      {
        title: "Events",
        href: "/events",
      },
      {
        title: "Help centre",
        href: "/help",
      },
      {
        title: "Tutorials",
        href: "/tutorials",
      },
      {
        title: "Support",
        href: "/support",
      },
    ],
  },
  {
    title: "Use cases",
    links: [
      {
        title: "Startups",
        href: "/startups",
      },
      {
        title: "Enterprise",
        href: "/enterprise",
      },
      {
        title: "Government",
        href: "/government",
      },
      {
        title: "SaaS",
        href: "/saas",
      },
      {
        title: "Marketplaces",
        href: "/marketplaces",
      },
      {
        title: "Ecommerce",
        href: "/ecommerce",
      },
    ],
  },
  {
    title: "Social",
    links: [
      {
        title: "Twitter",
        href: "https://twitter.com",
        external: true,
      },
      {
        title: "LinkedIn",
        href: "https://linkedin.com",
        external: true,
      },
      {
        title: "Facebook",
        href: "https://facebook.com",
        external: true,
      },
      {
        title: "GitHub",
        href: "https://github.com",
        external: true,
      },
      {
        title: "AngelList",
        href: "https://angel.co",
        external: true,
      },
      {
        title: "Dribbble",
        href: "https://dribbble.com",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        title: "Terms",
        href: "/terms",
      },
      {
        title: "Privacy",
        href: "/privacy",
      },
      {
        title: "Cookies",
        href: "/cookies",
      },
      {
        title: "Licenses",
        href: "/licenses",
      },
      {
        title: "Settings",
        href: "/settings",
      },
      {
        title: "Contact",
        href: "/contact",
      },
    ],
  },
];

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto">
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10 px-6 xl:px-0">
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-medium">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title, href, external }) => (
                  <li key={title}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </a>
                    ) : (
                      <Link
                        to={href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-x-2 gap-y-4 px-6 xl:px-0">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={theme === "dark" ? logoDark : logoLight}
              alt="ProBono Logo" 
              className="h-14 w-auto ml-14"
            />
          </Link>

          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link to="/" className="hover:text-foreground transition-colors">
              ProBono
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
