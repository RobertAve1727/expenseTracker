import React, { useState } from "react";
import {
  Search,
  Mail,
  Share2, // Use for Facebook
  Code,
  Phone,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  LifeBuoy,
  ExternalLink,
} from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I set a monthly budget?",
      answer:
        "Navigate to the 'Budget Limits' tab in the sidebar. Click on 'Set Limit' for any category and enter your desired amount. ZeroBalance will track your spending against this target in real-time.",
    },
    {
      question: "Is my financial data secure?",
      answer:
        "Absolutely. ZeroBalance uses Supabase's enterprise-grade encryption and Row Level Security (RLS). Your data is only accessible to you.",
    },
    {
      question: "Can I export my transaction history?",
      answer:
        "Yes! Go to the Transactions page and click the 'Export' icon. You can download your data in CSV or JSON format.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10 bg-transparent min-h-full">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-[var(--text-h)] tracking-tighter italic">
            SUPPORT CENTER
          </h1>
          <p className="text-[var(--text)] text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-50">
            System assistance & developer contact
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left Side: FAQs */}
          <section className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-black text-[var(--text-h)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-flow-accent"></span>
              Frequently Asked
            </h3>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)] opacity-40" />
              <input
                type="text"
                placeholder="Search solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 text-xs text-[var(--text-h)] focus:border-flow-accent transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all hover:bg-white/5"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-xs font-bold text-[var(--text-h)] uppercase">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-[11px] leading-relaxed text-[var(--text)] opacity-70 animate-in fade-in slide-in-from-top-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Right Side: Developer Credentials */}
          <section className="lg:col-span-2">
            <div className="bg-[var(--surface)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-2xl sticky top-10 border-t-flow-accent border-t-4">
              <h3 className="text-xl font-black text-[var(--text-h)] tracking-tighter mb-1">
                GET IN TOUCH
              </h3>
              <p className="text-[10px] font-bold text-flow-accent uppercase tracking-widest mb-8">
                Developer & Support Lead
              </p>

              <div className="space-y-4">
                <ContactLink
                  icon={<Mail size={18} />}
                  label="Email"
                  value="avelinorobert1718@gmail.com"
                  href="mailto:avelinorobert1718@gmail.com"
                />
                <ContactLink
                  icon={<Share2 size={18} />}
                  label="Facebook"
                  value="Robert Avelino"
                  href="https://facebook.com" // Update with your actual profile link if needed
                />
                <ContactLink
                  icon={<Code size={18} />}
                  label="Github"
                  value="RobertAve1727"
                  href="https://github.com/RobertAve1727"
                />
                <ContactLink
                  icon={<Phone size={18} />}
                  label="Mobile"
                  value="09611339829"
                  href="tel:09611339829"
                />
              </div>

              <div className="mt-10 p-4 bg-flow-accent/5 rounded-2xl border border-flow-accent/10">
                <p className="text-[10px] text-[var(--text)] leading-relaxed font-medium">
                  If you encounter any critical bugs or have feature suggestions
                  for <strong>ZeroBalance</strong>, please reach out via any of
                  the channels above.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ContactLink = ({
  icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[var(--border)] hover:bg-white/10 transition-all group"
  >
    <div className="text-flow-accent group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black uppercase text-[var(--text)] opacity-40 tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-xs font-bold text-[var(--text-h)] truncate uppercase tracking-tight">
        {value}
      </p>
    </div>
    <ExternalLink
      size={12}
      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text)]"
    />
  </a>
);

export default Support;
