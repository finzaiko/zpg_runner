const checkJSONKey = (data, key) => {
  if (data.hasOwnProperty(key)) {
    return true;
  }
  return false;
};

const isJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const deepCompare = (arg1, arg2) => {
  if (
    Object.prototype.toString.call(arg1) ===
    Object.prototype.toString.call(arg2)
  ) {
    if (
      Object.prototype.toString.call(arg1) === "[object Object]" ||
      Object.prototype.toString.call(arg1) === "[object Array]"
    ) {
      if (Object.keys(arg1).length !== Object.keys(arg2).length) {
        return false;
      }
      return Object.keys(arg1).every(function (key) {
        return deepCompare(arg1[key], arg2[key]);
      });
    }
    return arg1 === arg2;
  }
  return false;
};

function structureIsEqual(obj1, obj2) {
  let tree1 = getKeys(obj1).sort();
  let tree2 = getKeys(obj2).sort();

  if (tree1.length !== tree2.length) return false;

  let mismatch = tree1.find((x, idx) => tree2[idx] !== x);
  return !mismatch;
}

function getKeys(obj) {
  return recursiveKeys(obj, [], []);
}

function recursiveKeys(obj, result, todo, root = "") {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") {
      result.push(root + key);
      todo.push({ obj: obj[key], root: root + key + "." });
    } else {
      result.push(root + key);
    }
  });

  if (todo.length > 0) {
    let todoItem = todo.pop();
    return recursiveKeys(todoItem.obj, result, todo, todoItem.root);
  } else {
    return result;
  }
}

module.exports = {
  structureIsEqual,
  checkJSONKey,
  isJSON,
};
