import { HistoryAction, LinkEvent, Trigger } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

/**
 * @barba/core/utils/history
 * <br><br>
 * ## History manager.
 *
 * - Keep track of the navigation history
 *
 * @module core/utils/history
 * @preferred
 */

/**
 * State item.
 *
 * @property from
 * @property index
 */
interface IHistoryItem {
  /** origin */
  from: string;
  /** index */
  index: number;
  /** states */
  states: IStateItem[];
}

/***/
interface ICoords {
  x: number;
  y: number;
}

/**
 * History item.
 *
 * @property namespace
 * @property scroll
 * @property URL
 */
interface IStateItem {
  /** namespace */
  ns: string | undefined;
  /** Scroll position */
  scroll: ICoords;
  /** URL */
  url: string;
}

export class History {
  private _session: string;
  private _states: IStateItem[] = [];
  private _pointer = -1;

  /**
   * Init with first state.
   */
  public init(url: string, ns: string): void {
    this._session = 'barba';
    const index = 0;

    const state: IStateItem = {
      ns,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      url,
    };

    this._states.push(state);
    this._pointer = index;

    const item: IHistoryItem = {
      from: this._session,
      index,
      states: [...this._states],
    };

    window.history && window.history.replaceState(item, '', url);
  }

  public change(
    url: string,
    trigger: Trigger,
    e?: LinkEvent | PopStateEvent
  ): Trigger {
    if (e && (e as PopStateEvent).state) {
      // If popstate, move to existing state
      // and get back/forward direction.
      const { state }: { state: IHistoryItem } = e as PopStateEvent;
      const { index } = state;
      const diff = this._pointer - index;

      trigger = this._getDirection(diff);

      // Work with previous states
      this.replace(state.states);
      this._pointer = index;
    } else {
      // Add new state
      this.add(url, trigger);
    }

    return trigger;
  }

  /**
   * Add a new state.
   */
  public add(url: string, trigger: Trigger): void {
    // If no state, it will be updated later.
    const ns = 'tmp';
    const index = this.size;
    const action = this._getAction(trigger);
    const state: IStateItem = {
      ns,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      url,
    };

    this._states.push(state);
    this._pointer = index;

    const item: IHistoryItem = {
      from: this._session,
      index,
      states: [...this._states],
    };

    switch (action) {
      case 'push':
        window.history && window.history.pushState(item, '', url);
        break;
      case 'replace':
        window.history && window.history.replaceState(item, '', url);
        break;
      /* istanbul ignore next */
      default:
    }
  }

  /**
   * Update state.
   */
  public update(data: any, i?: number): void {
    const index = i || this._pointer;
    const existing = this.get(index);
    const state: IStateItem = {
      ...existing,
      ...data,
    };

    this.set(index, state);
  }

  /**
   * Remove last state.
   */
  public remove(i?: number): void {
    if (i) {
      this._states.splice(i, 1);
    } else {
      this._states.pop();
    }

    this._pointer--;
  }

  /**
   * Delete all states.
   */
  public clear(): void {
    this._states = [];
    this._pointer = -1;
  }

  /**
   * Replace all states.
   */
  public replace(newStates: IStateItem[]): void {
    this._states = newStates;
  }

  /**
   * Get state by index.
   */
  public get(index: number) {
    return this._states[index];
  }

  /**
   * Set state by index.
   */
  public set(i: number, state: IStateItem) {
    return (this._states[i] = state);
  }

  /**
   * Get the current state.
   */
  get current(): IStateItem {
    return this._states[this._pointer];
  }

  /**
   * Get the last state (top of the history stack).
   */
  get state(): IStateItem {
    return this._states[this._states.length - 1];
  }

  /**
   * Get the previous state.
   */
  get previous(): IStateItem | null {
    return this._pointer < 1 ? null : this._states[this._pointer - 1];
  }

  /**
   * Get the state size.
   */
  get size(): number {
    return this._states.length;
  }

  /**
   * Get the history action: push vs replace
   */
  private _getAction(trigger: Trigger): HistoryAction {
    let action: HistoryAction = 'push';

    // Manage `data-barba-history` attribute
    // to get the right action (push vs replace).
    const el = trigger as HTMLAnchorElement;
    const attr = `${schemaAttribute.prefix}-${schemaAttribute.history}`;

    if (el.hasAttribute && el.hasAttribute(attr)) {
      action = el.getAttribute(attr) as HistoryAction;
    }

    return action;
  }

  /**
   * Get the direction of popstate change
   */
  private _getDirection(diff: number): Trigger {
    // Check if "session switch"
    if (Math.abs(diff) > 1) {
      // Ex 6-0 > 0 -> forward, 0-6 < 0 -> back
      return diff > 0 ? 'forward' : 'back';
    } else {
      if (diff === 0) {
        return 'popstate';
      } else {
        // Ex 6-5 > 0 -> back, 5-6 < 0 -> forward
        return diff > 0 ? 'back' : 'forward';
      }
    }
  }
}

const history = new History();

export { history };
