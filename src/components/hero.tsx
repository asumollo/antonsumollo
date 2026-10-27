import { site } from "@/site.config";
import { Typewriter } from "./typewriter";
import { LightSwitch } from "./light-switch";
import { RichText } from "./rich-text";
import { Modal } from "./modal";
import { CheckIcon, DownloadIcon, ExternalIcon, FileIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon, UptimeIcon } from "./icons";
import { monthYear, yearsSince } from "@/lib/uptime";

const social =
  "grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink";

export async function Hero() {
  const [lead, ...rest] = site.bio;
  const years = await yearsSince(site.careerStart);

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="absolute right-0 top-0">
        <LightSwitch />
      </div>

      <Avatar />

      <h1 id="hero-title" className="mt-8 text-[36px] font-black leading-[1.05] tracking-[-0.04em] sm:text-[48px]">
        Hi, I&apos;m {site.shortName.split(" ")[0]}
      </h1>
      <p className="mt-3 min-h-[1.4em] font-mono text-[18px] font-medium text-accent sm:text-[20px]">
        <Typewriter words={site.roles} />
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-[14px]">
        {site.availability.open && (
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            {site.availability.label}
          </span>
        )}
        {site.availability.open && site.availability.start && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-medium">
            <CheckIcon className="h-4 w-4 text-ok" />
            {site.availability.start}
          </span>
        )}
        {/* Uptime lives in the stats row under the graph; it only shows here if that section is off. */}
        {!site.github.show && (
          <span
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-medium"
            title={`In engineering since ${monthYear(site.careerStart)}`}
          >
            <UptimeIcon className="text-ok" />
            Uptime {years}+ years
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[13px] text-muted">
          <PinIcon className="h-4 w-4" />
          {site.location}
        </span>
      </div>

      <div className="mt-7 flex max-w-[62ch] flex-col gap-4">
        {lead && (
          <p className="text-[19px] leading-[1.6] text-ink sm:text-[21px]">
            <RichText text={lead} />
          </p>
        )}
        {rest.map((p, i) => (
          <p key={i} className="text-[17px] leading-[1.7] text-muted">
            <RichText text={p} />
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Modal
          id="resume"
          label="Resume"
          size="wide"
          trigger={
            <>
              <FileIcon className="h-[18px] w-[18px]" />
              View resume
            </>
          }
          triggerClassName="inline-flex h-11 items-center gap-2 rounded-[12px] bg-accent px-5 text-[15px] font-semibold text-accent-ink shadow-[0_6px_16px_-8px_var(--accent)] transition-transform hover:-translate-y-px"
        >
          <ResumeViewer />
        </Modal>
        <a
          href="#contact"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-line bg-surface px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
        >
          <MailIcon className="h-[18px] w-[18px]" />
          Email me
        </a>
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />
        <div className="flex gap-2">
          {site.links.github && (
            <a href={site.links.github} target="_blank" rel="noreferrer" className={social} aria-label="GitHub">
              <GitHubIcon />
            </a>
          )}
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={social} aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Avatar() {
  if (site.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={site.photo}
        alt={site.name}
        width={112}
        height={112}
        className="h-28 w-28 rounded-full border-4 border-surface object-cover shadow-[0_8px_24px_-12px_rgba(20,23,28,0.5)]"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={site.name}
      className="grid h-28 w-28 place-items-center rounded-full border-4 border-surface bg-ink text-[34px] font-extrabold tracking-[-0.03em] text-paper shadow-[0_8px_24px_-12px_rgba(20,23,28,0.5)]"
    >
      {site.initials}
    </div>
  );
}

/** The resume PDF inside the popup, with download and new-tab fallbacks for browsers that can't show PDFs inline. */
function ResumeViewer() {
  const btn =
    "inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-line bg-surface px-3 text-[13px] font-semibold text-ink hover:border-ink";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line py-3 pl-5 pr-14">
        <h2 className="mr-auto text-[15px] font-bold">Resume</h2>
        <a href={site.resume} download className={btn}>
          <DownloadIcon className="h-4 w-4" />
          Download
        </a>
        <a href={site.resume} target="_blank" rel="noreferrer" className={btn} aria-label="Open in a new tab">
          <ExternalIcon className="h-4 w-4" />
        </a>
      </div>
      <iframe src={`${site.resume}#toolbar=0&navpanes=0&view=FitH`} title="Resume" className="w-full flex-1 bg-paper" />
    </div>
  );
}
