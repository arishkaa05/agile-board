import { flow, types } from 'mobx-state-tree';
import apiCall from '../api';

export const User = types.model('User', {
  id: types.identifier,
  createdAt: types.string,
  name: types.string,
  avatar: types.string,
});

export const ActiveUser = User.named('ActiveUser');

const UsersStore = types.model('UsersStore', {
  users: types.array(User),
  me: types.maybe(ActiveUser),
}).views(self => {
  return {
    get list() {
      if (self.users && self.users.length > 0)
        return self.users.map(({ id, name }) => ({ id, name }))
      return []
    }
  }
}).actions(self => {
  return {
    load: flow(function* () {
      const usersResponse = yield apiCall.get('users');
      usersResponse.pop()
      self.users = usersResponse

      self.me = yield apiCall.get('me');
    }),
    afterCreate() {
      self.load();
    }
  }
});

export default UsersStore;
