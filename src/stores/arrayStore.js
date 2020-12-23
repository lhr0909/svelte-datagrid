import { writable } from 'svelte/store';
import { ReplaySubject } from 'rxjs';
import * as Ops from 'rxjs/operators';

export class ArrayStore {
  constructor(arr) {
    this._array = arr.map(writable);
    this._subject = new ReplaySubject(1);

    // setting initial array store value
    this._subject.next(arr.reduce((acc, item, idx) => {
      acc[idx] = item;
      return acc;
    }, {}));

    // subscribe changes for the entire array
    this.subscribe = this._subject.pipe(
      Ops.scan((aggregate, partial) => {
        Object.keys(partial).forEach(idx => {
          aggregate[idx] = partial[idx];
        });
        return aggregate;
      }, {}),
      Ops.map(Object.values),
    ).subscribe;
  }

  set(idx, val) {
    // update individual item
    this._array[idx].set(val);

    // publish changes for entire array
    this._subject.next({
      [idx]: val,
    });
  }

  get(idx) {
    return this._array[idx];
  }
}