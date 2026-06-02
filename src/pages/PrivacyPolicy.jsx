import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/getjob/ThemeToggle";

const LOGO_LIGHT = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png";
const LOGO_DARK = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/8a276674d_e9868ad2-36e2-46c9-921c-b693ef439451.png";

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

const SECTIONS = [
  {
    num: "1",
    title: "Kdo je správce údajů",
    content: (
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        <p>Správcem osobních údajů jsou:</p>
        <ul className="space-y-1 ml-4">
          <li><strong className="text-foreground">Tomáš Svoboda a Tomáš Becher</strong></li>
          <li>Volutová 2524/12, 158 00 Praha 13 – Stodůlky</li>
          <li>E-mail: <a href="mailto:getjobcz1@gmail.com" className="text-primary hover:underline font-semibold">getjobcz1@gmail.com</a></li>
        </ul>
        <p>V případě jakýchkoli dotazů ohledně zpracování svých údajů nás kontaktujte na uvedeném e-mailu.</p>
      </div>
    )
  },
  {
    num: "2",
    title: "Jaké údaje zpracováváme",
    content: (
      <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-2">Při přihlášení na waitlist:</p>
          <ul className="ml-4 list-disc space-y-1"><li>Vaše <strong className="text-foreground">e-mailová adresa</strong></li></ul>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Pokud dobrovolně vyplníte dotazník (nepovinné):</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Obor, ve kterém hledáte práci</li>
            <li>Fáze, ve které se nacházíte (student, absolvent atd.)</li>
            <li>Vaše odpovědi na otevřené otázky (co vám na hledání práce vadí, co od služby očekáváte)</li>
          </ul>
        </div>
        <p>Nesbíráme žádné citlivé osobní údaje, neukládáme vaše CV a nepožadujeme registraci ani heslo.</p>
      </div>
    )
  },
  {
    num: "3",
    title: "Proč údaje zpracováváme (účel)",
    content: (
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        <p>Vaše údaje používáme výhradně k těmto účelům:</p>
        <ol className="ml-4 list-decimal space-y-2">
          <li><strong className="text-foreground">Informování o spuštění služby</strong> — abychom vám mohli dát vědět, až GetJob.cz spustíme.</li>
          <li><strong className="text-foreground">Zasílání novinek a souvisejících informací</strong> o vývoji služby.</li>
          <li><strong className="text-foreground">Zlepšování produktu</strong> — odpovědi z dotazníku nám pomáhají vytvořit službu, která lidem skutečně pomůže.</li>
        </ol>
        <p>Vaše údaje <strong className="text-foreground">nikdy neprodáváme</strong> třetím stranám ani je nepoužíváme k cílené reklamě mimo naši službu.</p>
      </div>
    )
  },
  {
    num: "4",
    title: "Právní základ zpracování",
    content: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Údaje zpracováváme na základě vašeho <strong className="text-foreground">souhlasu</strong>, který udělujete přihlášením na waitlist (čl. 6 odst. 1 písm. a) GDPR). Souhlas můžete kdykoli odvolat (viz bod 7).
      </p>
    )
  },
  {
    num: "5",
    title: "Jak dlouho údaje uchováváme",
    content: (
      <div className="space-y-2 text-muted-foreground text-sm leading-relaxed">
        <p>Vaše údaje uchováváme po dobu, než:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>se přihlásíte k odběru a poté po dobu fungování waitlistu, nejdéle však <strong className="text-foreground">12 měsíců</strong> od posledního kontaktu, nebo</li>
          <li>odvoláte souhlas / požádáte o výmaz (podle toho, co nastane dříve).</li>
        </ul>
        <p>Po uplynutí této doby nebo na vaši žádost údaje bezpečně smažeme.</p>
      </div>
    )
  },
  {
    num: "6",
    title: "Komu údaje předáváme (zpracovatelé)",
    content: (
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        <p>K poskytování služby využíváme prověřené externí nástroje, které mohou vaše údaje zpracovávat naším jménem:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><strong className="text-foreground">Resend</strong> — pro odesílání e-mailů</li>
          <li><strong className="text-foreground">Base44</strong> — pro provoz služby a ukládání dat</li>
          <li><strong className="text-foreground">Český hosting</strong> — pro provoz domény a webu</li>
        </ul>
        <p>Tito zpracovatelé jsou vázáni zpracovatelskými smlouvami a zpracovávají údaje pouze podle našich pokynů. Pokud jsou údaje předávány mimo EU, děje se tak při dodržení záruk dle GDPR.</p>
      </div>
    )
  },
  {
    num: "7",
    title: "Vaše práva",
    content: (
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        <p>V souvislosti se zpracováním osobních údajů máte podle GDPR právo:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><strong className="text-foreground">na přístup</strong> ke svým údajům,</li>
          <li><strong className="text-foreground">na opravu</strong> nepřesných údajů,</li>
          <li><strong className="text-foreground">na výmaz</strong> („právo být zapomenut"),</li>
          <li><strong className="text-foreground">na omezení zpracování</strong>,</li>
          <li><strong className="text-foreground">na přenositelnost</strong> údajů,</li>
          <li><strong className="text-foreground">vznést námitku</strong> proti zpracování,</li>
          <li><strong className="text-foreground">odvolat souhlas</strong> — kdykoli, bez udání důvodu (odvoláním není dotčena zákonnost zpracování před odvoláním).</li>
        </ul>
        <p>Svá práva uplatníte e-mailem na <a href="mailto:getjobcz1@gmail.com" className="text-primary hover:underline font-semibold">getjobcz1@gmail.com</a>. Odhlásit se z odběru můžete také kliknutím na odkaz „Odhlásit z odběru" v každém e-mailu.</p>
      </div>
    )
  },
  {
    num: "8",
    title: "Právo podat stížnost",
    content: (
      <div className="space-y-2 text-muted-foreground text-sm leading-relaxed">
        <p>Pokud se domníváte, že zpracováním vašich údajů porušujeme GDPR, máte právo podat stížnost u dozorového úřadu:</p>
        <div className="rounded-xl border border-border bg-muted p-4 mt-3">
          <p className="font-semibold text-foreground">Úřad pro ochranu osobních údajů (ÚOOÚ)</p>
          <p>Pplk. Sochora 27, 170 00 Praha 7</p>
          <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.uoou.cz</a>
        </div>
      </div>
    )
  },
  {
    num: "9",
    title: "Cookies",
    content: (
      <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>Cookies jsou malé textové soubory, které se ukládají do vašeho prohlížeče při návštěvě webu. Na našich stránkách používáme následující typy:</p>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted p-4">
            <p className="font-semibold text-foreground mb-1">Nezbytné (technické) cookies</p>
            <p>Tyto cookies jsou nutné pro správné fungování webu — zajišťují například bezpečné načtení stránky, udržení relace a základní provoz aplikace. Bez nich web nefunguje správně, a proto je nelze vypnout. Nevyžadují váš souhlas.</p>
          </div>
          <div className="rounded-xl border border-border bg-muted p-4">
            <p className="font-semibold text-foreground mb-1">Analytické cookies</p>
            <p>Pro měření návštěvnosti a zlepšování webu můžeme používat anonymizované analytické cookies. Tyto cookies nám pomáhají pochopit, jak návštěvníci web používají, a sbírají údaje v souhrnné, neidentifikovatelné podobě. Tyto cookies používáme pouze s vaším souhlasem.</p>
          </div>
          <p><strong className="text-foreground">Marketingové cookies nepoužíváme</strong> — nesledujeme vás napříč jinými weby a nezobrazujeme cílenou reklamu.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Správa cookies</p>
          <p>Souhlas s nepovinnými cookies můžete kdykoli udělit nebo odvolat. Cookies můžete také kdykoli smazat nebo zablokovat v nastavení svého prohlížeče. Vypnutí nezbytných cookies může omezit funkčnost webu.</p>
        </div>
      </div>
    )
  },
  {
    num: "10",
    title: "Změny těchto zásad",
    content: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Tyto zásady můžeme čas od času aktualizovat. Aktuální verze je vždy dostupná na této stránce a datum poslední aktualizace najdete v jejím záhlaví.
      </p>
    )
  }
];

export default function PrivacyPolicy() {
  const dark = useDark();
  return (
    <div className="min-h-screen font-poppins bg-background text-foreground">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/90 border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img
              src={dark ? LOGO_DARK : LOGO_LIGHT}
              alt="GetJob.cz" className="h-9 w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <Link to="/home" className="hover:text-primary transition-colors">Domů</Link>
            <Link to="/o-nas" className="hover:text-primary transition-colors">O nás</Link>
            <Link to="/kontakt" className="hover:text-primary transition-colors">Kontakt</Link>
            <Link to="/ochrana-udaju" className="text-primary font-semibold">Ochrana údajů</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#fff" }} />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ background: "rgba(255,255,255,0.18)" }}>
            🔒 Právní dokumenty
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Zásady ochrany osobních údajů</h1>
          <p style={{ color: "rgba(255,255,255,0.80)" }} className="text-sm">Poslední aktualizace: 1. 6. 2026</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-2">
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground leading-relaxed">
          Tyto zásady popisují, jak služba <strong className="text-foreground">GetJob.cz</strong> nakládá s osobními údaji, které nám poskytnete při přihlášení na náš waitlist (seznam zájemců) a při vyplnění dobrovolného dotazníku.
        </div>
      </section>

      {/* SECTIONS */}
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.num} className="rounded-2xl border border-border bg-card p-7 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg grid place-items-center text-sm font-extrabold text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)" }}
              >
                {s.num}
              </div>
              <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
            </div>
            {s.content}
          </div>
        ))}

        {/* Disclaimer */}
        <div className="rounded-2xl border border-border bg-muted p-5 text-xs text-muted-foreground italic">
          Tento dokument je vzorová šablona a nenahrazuje právní poradenství. Doporučujeme nechat jej před zveřejněním zkontrolovat odborníkem.
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 GetJob.cz</span>
          <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
        </div>
      </footer>
    </div>
  );
}