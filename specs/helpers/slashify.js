import slash from 'slash';
import get from 'lodash/get';
import set from 'lodash/set';

export default function slashify(obj, propPaths) {
  propPaths.forEach(propPath => {
    set(obj, propPath, slash(get(obj, propPath)));
  });
}
