import { site } from "@/site.config";
import { CopyEmail } from "./copy-email";
import { ContactForm } from "./contact-form";
import { GitHubIcon, LinkedInIcon } from "./icons";

export function Contact() {
  const social =
    "grid h-10 w-10 place-items-center rounded-[10px] border border-line text-ink transition-colors hover:border-muted/50";
  return (
    <section id="contact" aria-label="Get in touch" className="scroll-mt-6">
      <div className="rounded-[18px] border border-line bg-surface p-6">
        <ContactForm>
          <CopyEmail email={site.email} />
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={social} aria-label="LinkedIn" title="LinkedIn">
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
          )}
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className={social} aria-label="GitHub" title="GitHub">
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
          )}
        </ContactForm>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-[720px] px-5 pb-32 text-center font-mono text-[12px] text-muted sm:px-6">
      <p>
        made with <span aria-label="love">❤️</span> XOXO
      </p>
      <p className="mt-1">
        © {site.copyrightYear} {site.name}
      </p>
    </footer>
  );
}
