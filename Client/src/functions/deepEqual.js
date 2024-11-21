export function deepEqual(obj1, obj2) {
    if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      }
      
      for (let key in obj1) {
        if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    } else {
      return obj1 === obj2;
    }
  }
