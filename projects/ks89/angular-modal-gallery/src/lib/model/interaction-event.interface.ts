import { Action } from './action.enum';

export interface InteractionEvent {
  source: string;
  action: Action;
  payload: any;
}
