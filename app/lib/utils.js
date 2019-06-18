import Promise from 'bluebird'

// Append url
export function urlAppend(url, param){
  if (url.substr(-1) !== '/'){
    url = url + '/'
  }

  return url + param
}

// Debounce promise
export function promiseDebounce(fn, delay, count) {
  var working = 0, queue = [];
  function work() {
    if ((queue.length === 0) || (working === count)) return;
    working++;
    Promise.delay(delay).tap(function () { working--; }).then(work);
    var next = queue.shift();
    next[2](fn.apply(next[0], next[1]));
  }
  return function debounced() {
    var args = arguments;
    return new Promise(function(resolve){
      queue.push([this, args, resolve]);
      if (working < count) work();
    }.bind(this));
  }
}
