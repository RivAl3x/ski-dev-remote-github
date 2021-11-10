export class SpokenLanguagesModel {
  code?: string;
  src?: string;


  public constructor(
      code: string = '',
      src: string = '',

  ) {
      this.code = code;
      this.src = src;

  }
}
