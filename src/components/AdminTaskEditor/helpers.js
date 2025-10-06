export function collectInputPaths(i18nJson) {
    const result = {};
    function traverse(obj, path = []) {
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === "object") {
          traverse(value, path.concat(key));
        } else {
          const fullPath = path.join(".");
          if (!result[fullPath]) result[fullPath] = [];
          result[fullPath].push({ key, value });
        }
      }
    }
    traverse(i18nJson);
    return result;
  }
  