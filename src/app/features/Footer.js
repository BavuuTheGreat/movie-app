const Logo = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Youtube", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="w-full bg-indigo-700 px-8 py-10 text-indigo-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col flex-wrap justify-between gap-10 sm:flex-row">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-white">
            <Logo />
            <span className="text-xl font-bold italic">
              Movie<span className="text-indigo-300">Z</span>
            </span>
          </div>
          <p className="text-sm text-indigo-200">
            &copy; 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Contact Information</h3>
          <div className="flex items-start gap-2 text-sm">
            <MailIcon />
            <span>
              Email:
              <br />
              support@movieZ.com
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <PhoneIcon />
            <span>
              Phone:
              <br />
              +976 (11) 123-4567
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Follow us</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-indigo-100 hover:text-white hover:underline"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
