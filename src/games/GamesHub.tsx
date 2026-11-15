import { lazy, Suspense } from 'react';
import { useExplorerLog } from '../app/explorer';
import { useT, type MessageKey } from '../i18n';
import type { GameId } from '../app/navigation';
import { Icon } from '../components/Icon';
import { GameArt } from './GameArt';
import './games.css';

const GAME_IDS: GameId[] = ['lander', 'probe', 'quiz'];
const key = (id: GameId, field: 'title' | 'blurb' | 'skill') => `ui.g.${id}.${field}` as MessageKey;

const components = {
  lander: lazy(() => import('./Lander')),
  probe: lazy(() => import('./ProbeBuilder')),
  quiz: lazy(() => import('./Quiz')),
};

export function GamesHub() {
  const log = useExplorerLog();
  const { t } = useT();
  const best: Partial<Record<GameId, string>> = {
    lander: log.best.lander ? t('ui.g.best', { score: log.best.lander }) : undefined,
    probe: log.probes.length ? t('ui.g.built', { n: log.probes.length }) : undefined,
    quiz: log.best.quiz ? t('ui.g.best', { score: log.best.quiz }) : undefined,
  };
  return <section className="games-hub" aria-labelledby="games-title">
    <header className="page-head"><h1 id="games-title">{t('ui.title.games')}</h1><p>{t('ui.g.lede')}</p></header>
    <ul className="games-list">
      {GAME_IDS.map(id => <li key={id} className={`games-item games-${id}`}>
        <a href={`#/games/${id}`}>
          <GameArt game={id} />
          <span className="games-copy"><span className="games-skill">{t(key(id, 'skill'))}</span><strong>{t(key(id, 'title'))}</strong><span>{t(key(id, 'blurb'))}</span>
            {best[id] && <span className="games-best">{best[id]}</span>}<span className="games-cta">{t('ui.g.play')}<Icon name="arrow" size={16} /></span></span>
        </a>
      </li>)}
    </ul>
  </section>;
}

export function GamePage({ id }: { id: GameId }) {
  const Game = components[id];
  const { t } = useT();
  return <section className="game-page" aria-labelledby="game-title">
    <div className="game-topline"><a className="text-link" href="#/games"><Icon name="back" size={16} />{t('ui.play.all')}</a></div>
    <header className="page-head"><h1 id="game-title">{t(key(id, 'title'))}</h1><p>{t(key(id, 'blurb'))}</p></header>
    <Suspense fallback={<div className="host-message" role="status"><span className="loading-orbit" aria-hidden="true" /><p>{t('ui.g.loading')}</p></div>}>
      <Game />
    </Suspense>
  </section>;
}

