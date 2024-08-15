import { Editor, IAllProps } from '@tinymce/tinymce-react'

export function TinyEditor({ init, ...props }: IAllProps) {
  return (
    <Editor
      {...props}
      scriptLoading={{
        async: true,
      }}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      init={{
        min_height: 500,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        // menubar: 'file edit view insert format tools table help',
        menubar: false,
        toolbar_sticky: true,
        toolbar_sticky_offset: 60,
        content_style:
          "@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); body { font-family: font-family: 'Be Vietnam Pro', sans-serif; }",
        skin: 'oxide-dark',
        content_css: 'dark',
        ...init,
      }}
    />
  )
}
