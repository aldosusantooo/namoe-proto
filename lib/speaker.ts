type SpeakerLike = { name: string; handle?: string | null; bio?: string | null };

/** "byteproject" for the small line under a speaker's name on Beranda. Falls back to the name. */
export function speakerHandle(s: SpeakerLike): string {
  return s.handle?.trim() || s.name;
}

/**
 * Role clause for the session header: the first sentence of the bio with the "<Name> adalah" opener removed,
 * for example "founder byte.project dan penyelenggara Namoe Market". Falls back to the handle.
 */
export function speakerRole(s: SpeakerLike): string {
  const first = (s.bio ?? "").split(/(?<=\.)\s+/)[0]?.replace(/\.$/, "").trim() ?? "";
  if (!first) return speakerHandle(s);
  const withoutName = first.startsWith(s.name) ? first.slice(s.name.length).trim() : first;
  const clause = withoutName.replace(/^(adalah|merupakan)\s+/i, "").trim();
  return clause || speakerHandle(s);
}

/** "byteproject, founder byte.project dan penyelenggara Namoe Market" */
export function speakerLine(s: SpeakerLike): string {
  const role = speakerRole(s);
  const handle = speakerHandle(s);
  return role === handle ? handle : `${handle}, ${role}`;
}
