import { describe, expect, it } from 'vitest';
import { parseHash } from './navigation';

describe('static-host hash routing', () => {
  it.each(['', '#', '#/', '#//'])('accepts the home address %s', hash => {
    expect(parseHash(hash)).toEqual({ page: 'home' });
  });
  it.each(['atlas', 'journal'])('resolves /%s with an optional trailing slash', page => {
    expect(parseHash(`#/${page}`)).toEqual({ page });
    expect(parseHash(`#/${page}/`)).toEqual({ page });
  });
  it.each(['apollo11', 'opportunity', 'insight', 'voyager'])('deep-links to %s', id => {
    expect(parseHash(`#/chapter/${id}`)).toEqual({ page: 'chapter', id });
  });
  it.each(['#/chapter/unknown', '#/chapter/apollo11/extra', '#/secret', '#main-content', '#/chapter/__proto__'])('contains invalid address %s', hash => {
    expect(parseHash(hash)).toEqual({ page: 'not-found' });
  });
});
