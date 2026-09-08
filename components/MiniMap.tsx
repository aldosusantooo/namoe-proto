import type { MapBooth } from "./MapSvg";
import { MapSvg } from "./MapSvg";

/** The whole floor at card size: fixtures without text, one tenant's booths lit with the marker, everything else dimmed. */
export function MiniMap({ booths, codes, title }: { booths: MapBooth[]; codes: string[]; title: string }) {
  return (
    <div className="bg-cream">
      <MapSvg booths={booths} emphasisCodes={codes} highlightCodes={codes} fixtureText={false} className="block w-full" title={title} />
    </div>
  );
}
