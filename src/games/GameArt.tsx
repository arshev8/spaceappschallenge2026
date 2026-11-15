import { KIND_KEY, useShell } from '../app/l10n';
import { MEDIA, type Media } from '../app/media';
import type { GameId } from '../app/navigation';
import { NasaImage } from '../components/NasaImage';

/** Each game tile shows the real mission it is modeled on. */
const GAME_MEDIA: Record<GameId, Media> = {
  lander: MEDIA.a11Eagle,
  probe: MEDIA.insightArrays,
  quiz: MEDIA.a11Aldrin,
};

/**
 * Tile photograph for a game. Tiles are whole-card links, so the credit is plain text
 * (a nested archive link would be invalid HTML).
 */
export function GameArt({ game, sizes = '(max-width: 760px) 100vw, 33vw' }: { game: GameId; sizes?: string }) {
  const { t, media: localize } = useShell();
  const media = localize(GAME_MEDIA[game]);
  return <div className="game-art">
    <NasaImage media={GAME_MEDIA[game]} decorative bare className="game-art-photo" sizes={sizes} />
    <span className="game-art-credit">{media.kind === 'photo' ? media.credit : `${t(KIND_KEY[media.kind])} · ${media.credit}`}</span>
  </div>;
}
