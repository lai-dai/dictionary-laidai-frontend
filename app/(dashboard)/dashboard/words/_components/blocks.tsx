import React, { useReducer } from 'react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormApi, ReactFormApi, Validator } from '@tanstack/react-form'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-2'
import { Spinner } from '@/components/ui/spinner'
import { ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { FormDataType } from '../_lib/type'
import {
  SortableDragTrigger,
  SortableItem,
  SortableList,
} from '@/components/ui/sortable-list'
import { TinyEditor } from '@/components/tiny-editor'

interface FormBlockProps {
  form: FormApi<FormDataType, Validator<FormDataType>> &
    ReactFormApi<FormDataType, Validator<FormDataType>>
}

export function IdiomsFormBlock({ form }: FormBlockProps) {
  return (
    <form.Field name="idioms" mode="array">
      {(fields) => (
        <Collapsible defaultOpen asChild>
          <Card className="md:col-span-2 bg-accent/40">
            <CardHeader className="p-3">
              <CollapsibleTrigger asChild>
                <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                  Idioms <ChevronDown className="size-4" />
                </CardTitle>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-6 px-3">
                {fields.state.value.length === 0 && (
                  <div className="text-muted-foreground text-sm text-center">
                    Empty
                  </div>
                )}
                <SortableList
                  items={fields.state.value}
                  onSortChange={(_, form, to) => {
                    fields.moveValue(form, to)
                  }}
                  className={'flex flex-col gap-3'}
                >
                  {(item, index) => (
                    <SortableItem id={item?.id}>
                      <Collapsible defaultOpen asChild>
                        <Card>
                          <CardHeader className="flex-row justify-between items-center gap-6 space-y-0 p-3">
                            <SortableDragTrigger
                              size={'icon'}
                              variant={'ghost'}
                            >
                              <GripVertical />
                            </SortableDragTrigger>

                            <CollapsibleTrigger asChild>
                              <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                                {item.idiom
                                  ? item.idiom
                                  : 'Item ' + (index + 1)}
                                <ChevronDown className="size-4" />
                              </CardTitle>
                            </CollapsibleTrigger>
                            <Button
                              onClick={() => {
                                fields.removeValue(index)
                              }}
                              variant={'destructive'}
                              size={'icon'}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </CardHeader>
                          <CollapsibleContent asChild>
                            <CardContent className="grid md:grid-cols-2 gap-6 px-3">
                              <form.Field name={`idioms[${index}].idiom`}>
                                {(field) => (
                                  <FormItem field={field}>
                                    <FormLabel>
                                      idiom:{' '}
                                      {field.state.meta.isValidating && (
                                        <Spinner size={'xs'} />
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              </form.Field>

                              <form.Field name={`idioms[${index}].definition`}>
                                {(field) => (
                                  <FormItem field={field}>
                                    <FormLabel>
                                      definition:{' '}
                                      {field.state.meta.isValidating && (
                                        <Spinner size={'xs'} />
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              </form.Field>

                              <form.Field name={`idioms[${index}].description`}>
                                {(field) => (
                                  <Collapsible asChild>
                                    <FormItem
                                      field={field}
                                      className="md:col-span-2"
                                    >
                                      <CollapsibleTrigger asChild>
                                        <FormLabel className="flex items-center gap-3 leading-6">
                                          Description:{' '}
                                          {field.state.meta.isValidating ? (
                                            <Spinner size={'xs'} />
                                          ) : (
                                            <ChevronDown className="size-4" />
                                          )}
                                        </FormLabel>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <FormControl>
                                          <TinyEditor
                                            textareaName={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onEditorChange={(value) =>
                                              field.handleChange(value)
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </CollapsibleContent>
                                    </FormItem>
                                  </Collapsible>
                                )}
                              </form.Field>

                              <IdiomExamplesFormBlock
                                key={item.id}
                                form={form}
                                index={index}
                              />
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    </SortableItem>
                  )}
                </SortableList>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={() =>
                    fields.pushValue({
                      id: fields.state.value.length + 1,
                      definition: '',
                      description: '',
                      examples: [],
                      idiom: '',
                      wordId: 0,
                    })
                  }
                  type="button"
                  variant={'outline'}
                >
                  <Plus className="size-4 mr-3" />
                  Add
                </Button>
              </CardFooter>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </form.Field>
  )
}

export function IdiomExamplesFormBlock({
  form,
  index,
}: FormBlockProps & { index: number }) {
  return (
    <form.Field name={`idioms[${index}].examples`} mode="array">
      {(fields) => (
        <Card className="md:col-span-2 bg-accent/60">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-3">
            {fields.state.value.length === 0 && (
              <div className="text-muted-foreground text-sm text-center">
                Empty
              </div>
            )}
            <SortableList
              items={fields.state.value}
              onSortChange={(_, form, to) => {
                fields.moveValue(form, to)
              }}
              className={'flex flex-col gap-3'}
            >
              {(item, idx) => {
                return (
                  <SortableItem id={item?.id}>
                    <Collapsible defaultOpen asChild>
                      <Card>
                        <CardHeader className="flex-row justify-between items-center gap-6 space-y-0 p-3">
                          <SortableDragTrigger size={'icon'} variant={'ghost'}>
                            <GripVertical />
                          </SortableDragTrigger>

                          <CollapsibleTrigger asChild>
                            <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                              {item.sentence
                                ? item.sentence
                                : 'Item ' + (idx + 1)}
                              <ChevronDown className="size-4" />
                            </CardTitle>
                          </CollapsibleTrigger>
                          <Button
                            onClick={() => {
                              fields.removeValue(idx)
                            }}
                            variant={'destructive'}
                            size={'icon'}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </CardHeader>
                        <CollapsibleContent asChild>
                          <CardContent className="grid md:grid-cols-2 gap-6 px-3">
                            <form.Field
                              name={`idioms[${index}].examples[${idx}].sentence`}
                            >
                              {(field) => (
                                <FormItem field={field}>
                                  <FormLabel>
                                    sentence:{' '}
                                    {field.state.meta.isValidating && (
                                      <Spinner size={'xs'} />
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            </form.Field>

                            <form.Field
                              name={`idioms[${index}].examples[${idx}].translate`}
                            >
                              {(field) => (
                                <FormItem field={field}>
                                  <FormLabel>
                                    translate:{' '}
                                    {field.state.meta.isValidating && (
                                      <Spinner size={'xs'} />
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            </form.Field>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </SortableItem>
                )
              }}
            </SortableList>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              onClick={() =>
                fields.pushValue({
                  id: fields.state.value.length + 1,
                  sentence: '',
                  translate: '',
                  wordId: 0,
                  idiomId: 0,
                })
              }
              type="button"
              variant={'outline'}
            >
              <Plus className="size-4 mr-3" />
              Add
            </Button>
          </CardFooter>
        </Card>
      )}
    </form.Field>
  )
}

export function MeaningsFormBlock({ form }: FormBlockProps) {
  return (
    <form.Field name="idioms" mode="array">
      {(fields) => (
        <Collapsible defaultOpen asChild>
          <Card className="md:col-span-2 bg-accent/40">
            <CardHeader className="p-3">
              <CollapsibleTrigger asChild>
                <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                  Idioms <ChevronDown className="size-4" />
                </CardTitle>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-6 px-3">
                {fields.state.value.length === 0 && (
                  <div className="text-muted-foreground text-sm text-center">
                    Empty
                  </div>
                )}
                <SortableList
                  items={fields.state.value}
                  onSortChange={(_, form, to) => {
                    fields.moveValue(form, to)
                  }}
                  className={'flex flex-col gap-3'}
                >
                  {(item, index) => (
                    <SortableItem id={item?.id}>
                      <Collapsible defaultOpen asChild>
                        <Card>
                          <CardHeader className="flex-row justify-between items-center gap-6 space-y-0 p-3">
                            <SortableDragTrigger
                              size={'icon'}
                              variant={'ghost'}
                            >
                              <GripVertical />
                            </SortableDragTrigger>

                            <CollapsibleTrigger asChild>
                              <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                                {item.idiom
                                  ? item.idiom
                                  : 'Item ' + (index + 1)}
                                <ChevronDown className="size-4" />
                              </CardTitle>
                            </CollapsibleTrigger>
                            <Button
                              onClick={() => {
                                fields.removeValue(index)
                              }}
                              variant={'destructive'}
                              size={'icon'}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </CardHeader>
                          <CollapsibleContent asChild>
                            <CardContent className="grid md:grid-cols-2 gap-6 px-3">
                              <form.Field name={`idioms[${index}].idiom`}>
                                {(field) => (
                                  <FormItem field={field}>
                                    <FormLabel>
                                      idiom:{' '}
                                      {field.state.meta.isValidating && (
                                        <Spinner size={'xs'} />
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              </form.Field>

                              <form.Field name={`idioms[${index}].definition`}>
                                {(field) => (
                                  <FormItem field={field}>
                                    <FormLabel>
                                      definition:{' '}
                                      {field.state.meta.isValidating && (
                                        <Spinner size={'xs'} />
                                      )}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              </form.Field>

                              <form.Field name={`idioms[${index}].description`}>
                                {(field) => (
                                  <Collapsible asChild>
                                    <FormItem
                                      field={field}
                                      className="md:col-span-2"
                                    >
                                      <CollapsibleTrigger asChild>
                                        <FormLabel className="flex items-center gap-3 leading-6">
                                          Description:{' '}
                                          {field.state.meta.isValidating ? (
                                            <Spinner size={'xs'} />
                                          ) : (
                                            <ChevronDown className="size-4" />
                                          )}
                                        </FormLabel>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <FormControl>
                                          <TinyEditor
                                            textareaName={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onEditorChange={(value) =>
                                              field.handleChange(value)
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </CollapsibleContent>
                                    </FormItem>
                                  </Collapsible>
                                )}
                              </form.Field>

                              <IdiomExamplesFormBlock
                                key={item.id}
                                form={form}
                                index={index}
                              />
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    </SortableItem>
                  )}
                </SortableList>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={() =>
                    fields.pushValue({
                      id: fields.state.value.length + 1,
                      definition: '',
                      description: '',
                      examples: [],
                      idiom: '',
                      wordId: 0,
                    })
                  }
                  type="button"
                  variant={'outline'}
                >
                  <Plus className="size-4 mr-3" />
                  Add
                </Button>
              </CardFooter>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </form.Field>
  )
}

export function DefinitionsExamplesFormBlock({
  form,
  index,
}: FormBlockProps & { index: number }) {
  return (
    <form.Field name={`idioms[${index}].examples`} mode="array">
      {(fields) => (
        <Card className="md:col-span-2 bg-accent/60">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-3">
            {fields.state.value.length === 0 && (
              <div className="text-muted-foreground text-sm text-center">
                Empty
              </div>
            )}
            <SortableList
              items={fields.state.value}
              onSortChange={(_, form, to) => {
                fields.moveValue(form, to)
              }}
              className={'flex flex-col gap-3'}
            >
              {(item, idx) => {
                return (
                  <SortableItem id={item?.id}>
                    <Collapsible defaultOpen asChild>
                      <Card>
                        <CardHeader className="flex-row justify-between items-center gap-6 space-y-0 p-3">
                          <SortableDragTrigger size={'icon'} variant={'ghost'}>
                            <GripVertical />
                          </SortableDragTrigger>

                          <CollapsibleTrigger asChild>
                            <CardTitle className="flex-1 cursor-pointer flex gap-3 items-center text-base">
                              {item.sentence
                                ? item.sentence
                                : 'Item ' + (idx + 1)}
                              <ChevronDown className="size-4" />
                            </CardTitle>
                          </CollapsibleTrigger>
                          <Button
                            onClick={() => {
                              fields.removeValue(idx)
                            }}
                            variant={'destructive'}
                            size={'icon'}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </CardHeader>
                        <CollapsibleContent asChild>
                          <CardContent className="grid md:grid-cols-2 gap-6 px-3">
                            <form.Field
                              name={`idioms[${index}].examples[${idx}].sentence`}
                            >
                              {(field) => (
                                <FormItem field={field}>
                                  <FormLabel>
                                    sentence:{' '}
                                    {field.state.meta.isValidating && (
                                      <Spinner size={'xs'} />
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            </form.Field>

                            <form.Field
                              name={`idioms[${index}].examples[${idx}].translate`}
                            >
                              {(field) => (
                                <FormItem field={field}>
                                  <FormLabel>
                                    translate:{' '}
                                    {field.state.meta.isValidating && (
                                      <Spinner size={'xs'} />
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            </form.Field>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </SortableItem>
                )
              }}
            </SortableList>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              onClick={() =>
                fields.pushValue({
                  id: fields.state.value.length + 1,
                  sentence: '',
                  translate: '',
                  wordId: 0,
                  idiomId: 0,
                })
              }
              type="button"
              variant={'outline'}
            >
              <Plus className="size-4 mr-3" />
              Add
            </Button>
          </CardFooter>
        </Card>
      )}
    </form.Field>
  )
}
