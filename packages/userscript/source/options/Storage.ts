export class Storage {
  static getPreviousVersionSetting(): unknown {
    const saved = JSON.parse(localStorage["cbc.kitten-scientists"] || "null");
    return saved;
  }
}
