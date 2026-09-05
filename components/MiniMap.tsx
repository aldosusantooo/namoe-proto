import type { MapBooth } from "./MapSvg";
import { MapSvg } from "./MapSvg";

/** The whole floor at card size with one tenant's booths lit and everything else dimmed. */
export function MiniMap({ booths, codes, title }: { booths: MapBooth[]; codes: string[]; title: string }) {
  return (
    <div className="overflow-hidden rounded-md bg-surface-alt">
      <MapSvg booths={booths} emphasisCodes={codes} highlightCodes={codes} className="block w-full" title={title} />
    </div>
  );
}
