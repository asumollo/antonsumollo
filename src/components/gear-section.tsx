import { gear, type GearItem } from "@/gear.config";
import { ExternalIcon } from "./icons";
import { Section, SectionLink } from "./section";

/** How many cards the home page shows before "All gear". */
const HOME_LIMIT = 3;

/** Home-page preview of /gear: the first few items as product cards. */
export function GearSection() {
  const items = gear.groups.flatMap((g) => g.items).slice(0, HOME_LIMIT);
  if (!items.length) return null;

  return (
    <Section id="gear" title="Gear" aside={<SectionLink href="/gear">All gear</SectionLink>}>
      <GearGrid items={items} />
    </Section>
  );
}

export function GearGrid({ items }: { items: GearItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.name}>
          <GearCard item={item} />
        </li>
      ))}
    </ul>
  );
}

/** Product photo on top, name and note below. The whole card links out when the item has a link. */
function GearCard({ item }: { item: GearItem }) {
  const body = (
    <>
      <div className="border-b border-line p-3">
        {item.image ? (
          // Product shots usually come on white, so the tile is white in both themes.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="aspect-square w-full rounded-[10px] bg-white object-contain p-4" />
        ) : (
          <div
            aria-hidden
            className="grid aspect-square w-full place-items-center rounded-[10px] bg-paper text-[40px] font-black text-muted/40"
          >
            {item.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-semibold leading-snug">{item.name}</p>
          {item.link && <ExternalIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />}
        </div>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{item.note}</p>
      </div>
    </>
  );

  const card = "block h-full overflow-hidden rounded-[14px] border border-line bg-surface";
  return item.link ? (
    <a href={item.link} target="_blank" rel="noreferrer" className={`${card} transition-colors hover:border-accent`}>
      {body}
    </a>
  ) : (
    <div className={card}>{body}</div>
  );
}
