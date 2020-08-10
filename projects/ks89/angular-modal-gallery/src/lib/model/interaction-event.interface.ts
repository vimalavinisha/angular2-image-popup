import { Action } from './action.enum';

export interface InteractionEvent {
  source: string;
  action: Action;
  // tslint:disable-next-line:no-any
  payload: any;
}
