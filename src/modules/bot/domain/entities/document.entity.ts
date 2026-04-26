export class Document {
  id: number;
  title: string;
  content: string;
  embedding: number[];

  constructor(props: Document) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.embedding = props.embedding;
  }
}
