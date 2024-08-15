type Examples = {
  id: number
  sentence: string
  translate: string
  wordId: number
  idiomId?: number
  definitionId?: number
}

export type FormDataType = {
  word: {
    word: string
    phonetic: string
    description: string
  }
  idioms: {
    id: number
    idiom: string
    definition: string
    description: string
    wordId: number
    examples: Examples[]
  }[]
  meanings: {
    id: number
    description: string
    partOfSpeechId: number
    wordId: number
    definitions: {
      id: number
      definition: string
      wordId: number
      meaningId?: number
      examples: Examples[]
    }[]
  }[]
}
