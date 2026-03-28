import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const langLabels = { fr: "FR", en: "EN", ar: "عربي" } as const;

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-surface transition-colors flex items-center gap-1.5"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{langLabels[lang]}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 rounded-lg bg-card border border-border shadow-lg overflow-hidden min-w-[100px]">
            {(Object.keys(langLabels) as Array<keyof typeof langLabels>).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-surface transition-colors ${lang === l ? "text-primary font-semibold" : "text-foreground"}`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
