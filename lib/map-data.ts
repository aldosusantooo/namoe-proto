import type { MapBooth } from "@/components/MapSvg";
import { db } from "./db";

/** All 84 booths with the tenant fields the map needs. */
export async function loadMapBooths(): Promise<MapBooth[]> {
  const rows = await db.booth.findMany({
    orderBy: { code: "asc" },
    select: { code: true, x: true, y: true, w: true, h: true, tenant: { select: { slug: true, name: true, category: true } } },
  });
  return rows;
}
