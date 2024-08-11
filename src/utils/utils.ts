export class Utils {
  static getDataChange(data1: Object, data2: Object) {
    const keys = Object.keys(data1);
    let changes = {};
    for (const key of keys) {
      if (data1[key] !== data2[key]) {
        changes[key] = data2[key];
      }
    }
    return Object.keys(changes).length > 0 ? changes : null;
  }
}
