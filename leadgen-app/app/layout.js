import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SignalScout — AI Lead Generation Pipeline",
  description:
    "Build an ICP, find lookalike accounts, catch buying signals, and hand sales a ready-to-work list — one 15-step AI pipeline.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-600 text-sm text-white">
                  S
                </span>
                SignalScout
              </Link>
              <nav className="flex items-center gap-4 text-sm text-slate-600">
                <Link href="/" className="hover:text-slate-900">
                  Campaigns
                </Link>
                <Link href="/settings" className="hover:text-slate-900">
                  Settings
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
