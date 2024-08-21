export interface WordAttr {
  id: number
  word: string
  description: string
  totalView: any
  createdAt: string
  updatedAt: string
  createdBy: CreatedBy
  meanings: Meaning[]
  idioms: Idiom[]
  phonetics: Phonetic[]
  favorite: {
    id: 1
  }
}

interface CreatedBy {
  id: number
  name: string
  email: string
  image: string
  role: string
}

interface Meaning {
  id: number
  partOfSpeech: PartOfSpeech
  definitions: Definition[]
  description: string
}

interface PartOfSpeech {
  id: number
  name: string
  abbreviation: string
  translate: string
}

interface Definition {
  id: number
  definition: string
  examples: Example[]
}

interface Example {
  id: number
  sentence: string
  translate: string
}

interface Idiom {
  id: number
  idiom: string
  definition: string
  description: string
  createdAt: string
  updatedAt: string
  createdById: number
  wordId: number
  examples: Example[]
}

interface Phonetic {
  id: number
  phonetic: string
  audio: string
  description: string
  createdAt: string
  updatedAt: string
  createdById: number
  wordId: number
}

export interface CommentAttr {
  id: number
  content: string
  totalLike: number
  createdAt: string
  updatedAt: string
  createdBy: CreatedBy
  children: CommentAttr[]
}
