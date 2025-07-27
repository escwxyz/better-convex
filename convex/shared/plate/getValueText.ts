import { type Value, NodeApi } from 'platejs';

export const getValueText = (value: Value) => {
  return NodeApi.string({ children: value, type: '' });
};
