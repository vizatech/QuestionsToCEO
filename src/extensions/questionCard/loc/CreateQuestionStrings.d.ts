declare interface ICreateQuestionStrings {
  ListName: string;
  PageName: string;
}

declare module 'CreateQuestionStrings' {
  const dictionary: ICreateQuestionStrings;
  export = dictionary;
}
